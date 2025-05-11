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
  const [placingIdx, setPlacingIdx] = useState(null);      // 🔁 for pop animation
  const [scoreBubbleIdx, setScoreBubbleIdx] = useState(null); // 🔁 for score bubble

  const handlePlace = (idx) => {
    if (selectedBuilding) {
      if (selectedBuilding.building === 'factory') {
        setFactoryIndex(idx);
        setShowModal(true);
      }
      placeBuilding(idx);
      setScoreBubbleIdx(idx);
      setTimeout(() => setScoreBubbleIdx(null), 1000);
    } else {
      const cell = grid[idx];
      if (cell.resource) {
        toggleCell(idx);
      } else {
        placeResource(idx);
        setPlacingIdx(idx);
        setTimeout(() => setPlacingIdx(null), 200);
      }
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
            className={`cell${cell?.selected ? ' selected' : ''}${placingIdx === idx ? ' pop' : ''}`}
            onClick={() => handlePlace(idx)}
          >
            {scoreBubbleIdx === idx && (
              <div className="score-bubble">🏡 +3</div>
            )}

            {cell.resource && !cell.topLeft && ['wheat', 'brick', 'glass', 'stone', 'wood'].includes(cell.resource) && (
              <div className="flex items-center justify-center w-full h-full">
                <div
                  className="resource-square-card"
                  style={{ backgroundColor: getColorForResource(cell.resource) }}
                />
              </div>
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

function getColorForResource(resource) {
  switch (resource) {
    case 'wheat': return '#FFD05A';
    case 'brick': return '#FE2133';
    case 'glass': return '#4D9A8A';
    case 'stone': return '#808080';
    case 'wood': return '#5e2c04';
    default: return '#000000';
  }
}
