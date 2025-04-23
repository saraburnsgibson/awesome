import React from 'react';
import { useTownStore } from './store';

export function TownGrid() {
  const {
    grid,
    placeResource,
    toggleCell,
    selectedBuilding,
    placeBuilding
  } = useTownStore(state => ({
    grid: state.grid,
    placeResource: state.placeResource,
    toggleCell: state.toggleCell,
    selectedBuilding: state.selectedBuilding,
    placeBuilding: state.placeBuilding,
  }));

  return (
    <div className="grid">
      {grid.map((cell, idx) => (
        <div
          key={idx}
          className={`cell${cell?.selected ? ' selected' : ''}`}
          onClick={() => {
            if (selectedBuilding) {
              placeBuilding(idx);
            } else {
              cell.resource ? toggleCell(idx) : placeResource(idx);
            }
          }}
        >
          {cell.resource && !cell.topLeft && ['wheat', 'brick', 'glass', 'stone', 'wood'].includes(cell.resource) && (
            <div className={`resource-square-card ${cell.resource}`} />
          )}
          {cell.topLeft && (
            <div className={`circle ${cell.resource}-circle`} />
          )}
        </div>
      ))}
    </div>
  );
}
