function Businesses() {
  const businesses = [
    {
      name: "EcoThreads",
      description: "Sustainable fashion",
      rating: 4.8,
      image: "https://i.pravatar.cc/60",
    },
    {
      name: "PrintHub",
      description: "Printing services",
      rating: 4.6,
      image: "https://i.pravatar.cc/61",
    },
    {
      name: "Brewed Awakenings",
      description: "Campus coffee shop",
      rating: 4.9,
      image: "https://i.pravatar.cc/62",
    },
    {
      name: "StudyBuddy",
      description: "Tutoring services",
      rating: 4.7,
      image: "https://i.pravatar.cc/63",
    },
  ];

  return (
    <div className="mt-8">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">
        Featured Businesses
      </h2>

      <div className="grid grid-cols-2 gap-4">
        {businesses.map((business, index) => (
          <div
            key={index}
            className="bg-white/70 backdrop-blur-lg p-4 rounded-xl shadow flex gap-3"
          >
            <img
              src={business.image}
              alt={business.name}
              className="w-14 h-14 rounded-full"
            />

            <div>
              <h3 className="font-semibold text-sm">{business.name}</h3>
              <p className="text-xs text-gray-600">{business.description}</p>
              <span className="text-xs text-purple-600 font-medium">
                ⭐ {business.rating} Rating
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Businesses;