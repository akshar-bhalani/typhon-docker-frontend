import React from 'react';
import { useNavigate } from 'react-router';

const Unauthorized: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1 className="text-2xl">Unauthorized</h1>
      <p>You do not have permission to view this page.</p>
      <button
        className="mt-6 rounded-lg bg-gray-800 px-3 py-2 text-sm text-white shadow-md transition"
        onClick={() => navigate('/')}
      >
        Go to Home
      </button>
    </div>
  );
};

export default Unauthorized;
