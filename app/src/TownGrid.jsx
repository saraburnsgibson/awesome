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
  const [resourceAnimKeys, setResourceAnimKeys] = useState({});
  const [justPlacedBuildingIndex, setJustPlacedBuildingIndex] = useState(null);

  const playSound = (name) => {
    if (typeof window.isSfxMuted === 'function' && window.isSfxMuted()) return;
    const audio = new Audio(`/audio/${name}.mp3`);
    audio.volume = 0.9;
    audio.play().catch(err => {
      console.warn(`⚠️ Could not play sound "${name}":`, err);
    });
  };

  const handlePlace = (idx) => {
    const cell = grid[idx];

    if (selectedBuilding) {
      if (selectedBuilding.building === 'factory') {
        setFactoryIndex(idx);
        setShowModal(true);
      }
      placeBuilding(idx);
      playSound('building');

      setTimeout(() => {
        const updatedGrid = useTownStore.getState().grid;
        const topLeftIndex = updatedGrid.findIndex(
          cell => cell.topLeft && cell.resource === selectedBuilding.building
        );
        if (topLeftIndex !== -1) {
          setJustPlacedBuildingIndex(topLeftIndex);
          setTimeout(() => setJustPlacedBuildingIndex(null), 400);
        }
      }, 0);
    } else {
      if (!cell.resource) {
        const key = `pop-${Date.now()}`;
        setResourceAnimKeys(prev => ({ ...prev, [idx]: key }));
        playSound('resource');

        setTimeout(() => {
          placeResource(idx);
        }, 0);

        setTimeout(() => {
          setResourceAnimKeys(prev => {
            const updated = { ...prev };
            delete updated[idx];
            return updated;
          });
        }, 300);
      } else {
        toggleCell(idx);
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
            key={`cell-${idx}`}
            className={`cell${cell?.selected ? ' selected' : ''}`}
            onClick={() => handlePlace(idx)}
          >
            {cell.resource && !cell.topLeft && ['wheat', 'brick', 'glass', 'stone', 'wood'].includes(cell.resource) && (
              <div
                key={resourceAnimKeys[idx] || `res-${idx}`}
                className={`resource-square-card ${cell.resource} pop`}
              />
            )}
            {cell.topLeft && (
              <div className={`circle ${cell.resource}-circle ${justPlacedBuildingIndex === idx ? 'pop' : ''} flex items-center justify-center`}>
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
