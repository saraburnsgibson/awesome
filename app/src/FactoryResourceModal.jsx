// FactoryResourceModal.jsx
import React, { useState } from 'react';

const resources = ['wheat', 'brick', 'glass', 'stone', 'wood'];

export default function FactoryResourceModal({ onSelect, onCancel }) {
  const [selected, setSelected] = useState(null);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-md text-black">
        <h2 className="mb-4 font-semibold">Choose a resource to store in the factory:</h2>
        <div className="flex flex-col gap-2">
          {resources.map(r => (
            <button
              key={r}
              onClick={() => setSelected(r)}
              className={`px-3 py-1 rounded ${selected === r ? 'bg-gray-400' : 'bg-gray-200'}`}
            >
              {r}
            </button>
          ))}
        </div>
        <div className="flex justify-end gap-3 mt-4">
          <button onClick={onCancel} className="bg-gray-300 px-4 py-1 rounded">Cancel</button>
          <button
            onClick={() => selected && onSelect(selected)}
            className="bg-blue-600 text-white px-4 py-1 rounded"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
}
