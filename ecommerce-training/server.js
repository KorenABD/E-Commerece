import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { z } from 'zod';

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 4000;
const JWT_SECRET = process.env.JWT_SECRET;

app.use(cors({ origin: ['http://localhost:5173','http://localhost:5173'], credentials: true }));
app.use(express.json());

app.get('/health', (req, res) => res.json({ ok: true }));

// --- Auth ---
const credSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(1).optional()
});

app.post('/auth/register', async (req, res) => {
  const parse = credSchema.safeParse(req.body);
  if (!parse.success) return res.status(400).json({ error: parse.error.errors });
  const { email, password, name = 'Customer' } = parse.data;

  try {
    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists) return res.status(409).json({ error: 'Email already registered' });

    const hash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({ data: { email, password: hash, name } });
    const token = jwt.sign({ sub: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user.id, email: user.email, name: user.name, role: user.role } });
  } catch (e) { res.status(500).json({ error: 'Server error' }); }
});

app.post('/auth/login', async (req, res) => {
  const parse = credSchema.pick({ email: true, password: true }).safeParse(req.body);
  if (!parse.success) return res.status(400).json({ error: parse.error.errors });
  const { email, password } = parse.data;

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' });
    const token = jwt.sign({ sub: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user.id, email: user.email, name: user.name, role: user.role } });
  } catch (e) { res.status(500).json({ error: 'Server error' }); }
});

// JWT middleware
function auth(req, res, next) {
  const hdr = req.headers.authorization || '';
  const token = hdr.startsWith('Bearer ') ? hdr.slice(7) : null;
  if (!token) return res.status(401).json({ error: 'Missing token' });
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch { return res.status(401).json({ error: 'Invalid token' }); }
}

// --- Catalog ---
app.get('/products', async (_req, res) => {
  const products = await prisma.product.findMany({
    include: { category: true },
    orderBy: { id: 'asc' }
  });
  res.json(products);
});

// --- Cart (per-user) ---
app.get('/me/cart', auth, async (req, res) => {
  const items = await prisma.cartItem.findMany({
    where: { userId: req.user.sub },
    include: { product: true }
  });
  res.json(items);
});

app.post('/me/cart', auth, async (req, res) => {
  const schema = z.object({ productId: z.number().int(), quantity: z.number().int().min(1) });
  const parse = schema.safeParse(req.body);
  if (!parse.success) return res.status(400).json({ error: parse.error.errors });
  const { productId, quantity } = parse.data;

  try {
    const upserted = await prisma.cartItem.upsert({
      where: { userId_productId: { userId: req.user.sub, productId } },
      update: { quantity: { increment: quantity } },
      create: { userId: req.user.sub, productId, quantity }
    });
    res.json(upserted);
  } catch (e) { res.status(500).json({ error: 'Server error' }); }
});

app.delete('/me/cart/:productId', auth, async (req, res) => {
  const productId = Number(req.params.productId);
  await prisma.cartItem.delete({ where: { userId_productId: { userId: req.user.sub, productId } } }).catch(() => {});
  res.json({ ok: true });
});

// --- Simple checkout: move cart to order ---
app.post('/me/checkout', auth, async (req, res) => {
  const items = await prisma.cartItem.findMany({
    where: { userId: req.user.sub },
    include: { product: true }
  });
  if (items.length === 0) return res.status(400).json({ error: 'Cart is empty' });

  const total = items.reduce((sum, it) => sum + Number(it.product.price) * it.quantity, 0);

  const order = await prisma.$transaction(async (tx) => {
    const created = await tx.order.create({
      data: { userId: req.user.sub, total, status: 'PENDING' }
    });
    await tx.orderItem.createMany({
      data: items.map(it => ({
        orderId: created.id,
        productId: it.productId,
        quantity: it.quantity,
        unitPrice: it.product.price
      }))
    });
    await tx.cartItem.deleteMany({ where: { userId: req.user.sub } });
    return created;
  });

  res.json(order);
});

// --- Orders ---
app.get('/me/orders', auth, async (req, res) => {
  const orders = await prisma.order.findMany({
    where: { userId: req.user.sub },
    include: {
      items: { include: { product: true } }
    },
    orderBy: { createdAt: 'desc' }
  });
  res.json(orders);
});


app.listen(PORT, () => {
  console.log(`API running on http://127.0.0.1:${PORT}`);
});
