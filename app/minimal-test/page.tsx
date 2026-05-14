'use client';
import { useState } from 'react';

export default function MinimalTest() {
  const [count, setCount] = useState(0);
  if (process.env.NODE_ENV !== 'development') return null;
  console.log('MinimalTest render, count=', count);
  return (
    <div style={{ padding: 40, background: '#111', minHeight: '100vh', color: 'white' }}>
      <h1>Test minimal</h1>
      <button onClick={() => setCount(c => c + 1)} style={{ padding: 16, fontSize: 20 }}>
        Cliqué {count} fois
      </button>
    </div>
  );
}
