const PopularCategories = () => {
  const categories = ["JavaScript", "React", "Node.js", "Python", "CSS", "HTML"];
  
  return (
    <div className="container mx-auto py-10">
      <h2 className="text-3xl font-semibold text-gray-800 text-center mb-6">Popular Categories</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {categories.map((category) => (
          <div key={category} className="bg-white p-4 rounded-lg shadow-lg text-center">
            <h3 className="font-bold">{category}</h3>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PopularCategories;
