function Deals() {
  const deals = [
    {
      name: "Custom T-Shirts",
      seller: "EcoThreads",
      price: "৳250",
      image: "https://via.placeholder.com/150",
    },
    {
      name: "Coffee Combo",
      seller: "Brewed Awakenings",
      price: "৳180",
      image: "https://via.placeholder.com/150",
    },
    {
      name: "Notebook Pack",
      seller: "PrintHub",
      price: "৳120",
      image: "https://via.placeholder.com/150",
    },
  ];

  return (
    <div className="mt-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">
        Recent Deals
      </h2>

      <div className="grid grid-cols-3 gap-4">
        {deals.map((deal, index) => (
          <div
            key={index}
            className="bg-white/70 backdrop-blur-lg p-4 rounded-xl shadow"
          >
            <img
              src={deal.image}
              alt={deal.name}
              className="w-full h-28 object-cover rounded-lg mb-3"
            />

            <h3 className="font-semibold text-sm">{deal.name}</h3>
            <p className="text-xs text-gray-600">{deal.seller}</p>
            <p className="text-purple-600 font-bold mt-1">{deal.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Deals;