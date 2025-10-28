import React, { useState, useEffect } from 'react';
import { restaurantAPI, authAPI } from '@/lib/api';

const BackendTest = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [authResult, setAuthResult] = useState('');

  const testRestaurants = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await restaurantAPI.getAll();
      setRestaurants(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const testAuth = async () => {
    try {
      const result = await authAPI.signup({
        firstName: 'Test',
        lastName: 'User',
        email: `test${Date.now()}@example.com`,
        password: 'password123',
        phone: '+1234567890'
      });
      setAuthResult('Signup successful! Token received.');
    } catch (err) {
      setAuthResult(`Auth error: ${err.message}`);
    }
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Backend Connection Test</h1>
      
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Restaurant API Test</h2>
          <button 
            onClick={testRestaurants}
            disabled={loading}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {loading ? 'Loading...' : 'Test Restaurants API'}
          </button>
          
          {error && (
            <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
              Error: {error}
            </div>
          )}
          
          {restaurants.length > 0 && (
            <div className="mt-4">
              <h3 className="font-semibold mb-2">Restaurants ({restaurants.length}):</h3>
              <div className="space-y-2">
                {restaurants.map((restaurant: any) => (
                  <div key={restaurant.id} className="p-2 bg-gray-100 rounded">
                    <strong>{restaurant.name}</strong> - {restaurant.cuisine} ({restaurant.rating}⭐)
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Authentication API Test</h2>
          <button 
            onClick={testAuth}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Test Signup API
          </button>
          
          {authResult && (
            <div className="mt-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
              {authResult}
            </div>
          )}
        </div>

        <div className="bg-blue-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Connection Status</h2>
          <div className="space-y-2">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
              <span>Frontend: Running on http://localhost:8080</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
              <span>Backend: Running on http://localhost:8081</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
              <span>API Base URL: http://localhost:8081/api</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BackendTest;
