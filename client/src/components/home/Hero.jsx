import { useNavigate } from 'react-router-dom';

function Hero() {
  const navigate = useNavigate();

  return (
    <div className="bg-blue-600 text-white text-center py-20 px-4">
      <h1 className="text-4xl font-bold mb-2">KIET Deemed to be University</h1>
      <p className="text-lg text-blue-100 mb-6">Connecting talent with opportunity</p>
      <button
        onClick={() => navigate('/dashboard')}
        className="bg-white text-blue-600 font-semibold px-6 py-3 rounded-lg hover:bg-blue-50 transition"
      >
        View Placement Dashboard
      </button>
    </div>
  );
}

export default Hero;