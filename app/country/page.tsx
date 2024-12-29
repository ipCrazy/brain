'use client';

import React, { useState } from 'react';

const CountryPage: React.FC = () => {
  const [country, setCountry] = useState('');
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setResult(null);

    try {
      const response = await fetch('/api/country', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ country }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Unknown error occurred');
      }

      const data = await response.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Find Country Information</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter country name"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          style={{ padding: '10px', marginRight: '10px' }}
        />
        <button type="submit" style={{ padding: '10px' }}>
          Search
        </button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {result && (
        <div style={{ marginTop: '20px', padding: '10px', border: '1px solid #ccc' }}>
          <h2>Country Information:</h2>
          <p><strong>Name:</strong> {result.name}</p>
          <p><strong>Capital:</strong> {result.capital}</p>
          <p><strong>Population:</strong> {result.population}</p>
          <p><strong>Flag Colors:</strong> {result.flagColor}</p>
        </div>
      )}
    </div>
  );
};

export default CountryPage;
