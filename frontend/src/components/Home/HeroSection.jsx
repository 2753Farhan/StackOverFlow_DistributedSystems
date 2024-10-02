const HeroSection = () => {
  return (
    <div className="bg-white border-b py-10">
      <div className="container mx-auto text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Welcome to Our Community</h1>
        <p className="text-lg text-gray-600 mb-8">
          Ask questions, share knowledge, and learn from others.
        </p>
        <input
          type="text"
          placeholder="Search for questions or topics..."
          className="border rounded-md px-4 py-2 w-1/2"
        />
      </div>
    </div>
  );
};

export default HeroSection;
