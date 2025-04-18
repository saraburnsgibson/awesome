// TownGrid.jsx
import React from 'react';
import { useTownStore, resourceColors } from './store';

export function TownGrid() {
  const { grid, placeResource, resetGrid } = useTownStore((state) => ({
    grid: state.grid,
    placeResource: state.placeResource,
    resetGrid: state.resetGrid,
  }));

  const handleTileClick = (index) => {
    placeResource(index);
  };

  return (
    <div className="text-center">
      <h1 className="text-3xl font-bold mb-4">Tinytowns Board</h1>
      <div className="grid grid-cols-4 gap-2">
        {grid.map((tile, index) => (
          <button
            key={index}
            onClick={() => handleTileClick(index)}
            className="w-16 h-16"
            style={ tile ? { backgroundColor: resourceColors[tile] } : { backgroundColor: "lightgray" } }
          >
            {tile ? "" : ""}
          </button>
        ))}
      </div>
      <button onClick={resetGrid} className="mt-4 bg-red-500 px-4 py-2 rounded">
        Reset Grid
      </button>
    </div>
  );
}
