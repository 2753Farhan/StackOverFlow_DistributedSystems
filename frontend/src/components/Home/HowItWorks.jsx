const HowItWorks = () => {
  return (
    <div className="container mx-auto py-10">
      <h2 className="text-3xl font-semibold text-gray-800 text-center mb-6">How It Works</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-bold">Ask a Question</h3>
          <p className="text-gray-600">Get answers from experts in the community.</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-bold">Share Knowledge</h3>
          <p className="text-gray-600">Help others by sharing your expertise.</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-bold">Learn & Grow</h3>
          <p className="text-gray-600">Enhance your skills and knowledge continuously.</p>
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;
