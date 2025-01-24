'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log('Form submitted');
    console.log('Email:', email);
    console.log('Password:', password);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      console.log('Fetch response received');
      const data = await res.json();

      console.log('Response status:', res.status);
      console.log('Response data:', data);

      if (res.ok) {
        console.log('Login successful');
        // Čuvanje tokena u localStorage (ili cookie, ako koristiš server-side auth)
        localStorage.setItem('token', data.token);

        // Preusmeravanje na dashboard ili neku drugu stranicu
        console.log('Redirecting to dashboard');
        router.push('/dashboard');
      } else {
        console.error('Error response:', data);
        setError(data.error || 'An error occurred.');
      }
    } catch (error) {
      console.error('Fetch error:', error);
      setError('An error occurred while logging in.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow-md w-96 space-y-4"
      >
        <h1 className="text-2xl font-bold text-center">Login</h1>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => {
            console.log('Email input changed:', e.target.value);
            setEmail(e.target.value);
          }}
          className="w-full p-2 border rounded"
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => {
            console.log('Password input changed:', e.target.value);
            setPassword(e.target.value);
          }}
          className="w-full p-2 border rounded"
          required
        />

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
        >
          Login
        </button>
      </form>
    </div>
  );
}