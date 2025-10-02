export default function Hero() {
  return (
    <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-16 px-6 rounded-lg shadow-lg mb-10">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
          Welcome to <span className="text-yellow-300">One-Store</span>
        </h1>
        <p className="text-lg md:text-xl mb-6 text-gray-100">
          Shop the latest electronics, fashion, and more. Fast checkout, secure payments, and worldwide shipping 🚀
        </p>
        <a
          href="#products"
          className="inline-block bg-yellow-400 text-black font-semibold px-6 py-3 rounded-lg shadow hover:bg-yellow-300 transition"
        >
          Start Shopping
        </a>
      </div>
    </section>
  );
}
