// App.jsx
import React from 'react';
import { TownGrid } from './TownGrid';
import { ResourceSelector } from './ResourceSelector';

export function App() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-center text-4xl font-bold mb-6">Tinytowns Game</h1>
      <ResourceSelector />
      <TownGrid />
    </div>
  );
}
