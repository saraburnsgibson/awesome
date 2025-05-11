import React, { useState } from 'react';
import { useTownStore } from './store';
import FactoryResourceModal from './FactoryResourceModal';

export function TownGrid() {
  const {
    grid,
    placeResource,
    toggleCell,
    selectedBuilding,
    placeBuilding,
    setFactoryResource,
  } = useTownStore(state => ({
    grid: state.grid,
    placeResource: state.placeResource,
    toggleCell: state.toggleCell,
    selectedBuilding: state.selectedBuilding,
    placeBuilding: state.placeBuilding,
    setFactoryResource: state.setFactoryResource,
  }));

  const [showModal, setShowModal] = useState(false);
  const [factoryIndex, setFactoryIndex] = useState(null);

  const handlePlace = (idx) => {
    if (selectedBuilding) {
      if (selectedBuilding.building === 'factory') {
        setFactoryIndex(idx);
        setShowModal(true);
      }
      placeBuilding(idx);
    } else {
      const cell = grid[idx];
      cell.resource ? toggleCell(idx) : placeResource(idx);
    }
  };

  const handleSelectResource = (resource) => {
    if (factoryIndex !== null) {
      setFactoryResource(factoryIndex, resource);
    }
    setShowModal(false);
    setFactoryIndex(null);
  };

  return (
    <>
      <div className="grid">
        {grid.map((cell, idx) => (
          <div
            key={idx}
            className={`cell${cell?.selected ? ' selected' : ''}`}
            onClick={() => handlePlace(idx)}
          >
            {cell.resource && !cell.topLeft && ['wheat', 'brick', 'glass', 'stone', 'wood'].includes(cell.resource) && (
              <div className={`resource-square-card ${cell.resource}`} />
            )}
            {cell.topLeft && (
              <div className={`circle ${cell.resource}-circle flex items-center justify-center`}>
                {cell.building === 'factory' && cell.storedResource && (
                  <span className="text-xs text-white">{cell.storedResource}</span>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
      {showModal && (
        <FactoryResourceModal
          onClose={() => setShowModal(false)}
          onSelect={handleSelectResource}
        />
      )}
    </>
  );
}
