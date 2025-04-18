// BuildingStore.jsx
import React from 'react';
import { useTownStore, buildingTemplates } from './store';

// Helper: check if the set of selected grid cells matches a template.
// We compute the bounding rectangle of selected cells and compare it to the template.
function matchTemplate(selectedGrid, grid, template) {
  if (selectedGrid.length === 0) return false;
  const positions = selectedGrid.map(index => ({
    row: Math.floor(index / 4),
    col: index % 4
  }));
  const minRow = Math.min(...positions.map(p => p.row));
  const maxRow = Math.max(...positions.map(p => p.row));
  const minCol = Math.min(...positions.map(p => p.col));
  const maxCol = Math.max(...positions.map(p => p.col));
  const boxRows = maxRow - minRow + 1;
  const boxCols = maxCol - minCol + 1;
  if (boxRows !== template.length || boxCols !== template[0].length) return false;
  // Build expected indices from template.
  const templateSelected = [];
  for (let i = 0; i < template.length; i++) {
    for (let j = 0; j < template[0].length; j++) {
      if (template[i][j] !== "") {
        templateSelected.push((minRow + i) * 4 + (minCol + j));
        // Also match the resource type.
        if (grid[(minRow + i) * 4 + (minCol + j)] !== template[i][j]) {
          return false;
        }
      }
    }
  }
  const selSorted = selectedGrid.slice().sort((a, b) => a - b);
  const tempSorted = templateSelected.slice().sort((a, b) => a - b);
  if (selSorted.length !== tempSorted.length) return false;
  for (let i = 0; i < selSorted.length; i++) {
    if (selSorted[i] !== tempSorted[i]) return false;
  }
  return true;
}

export function BuildingStore() {
  const { selectedGrid, grid, selectBuilding, selectedBuilding, clearSelections } =
    useTownStore(state => ({
      selectedGrid: state.selectedGrid,
      grid: state.grid,
      selectBuilding: state.selectBuilding,
      selectedBuilding: state.selectedBuilding,
      clearSelections: state.clearSelections
    }));

  const eligibleBuildings = [];
  Object.entries(buildingTemplates).forEach(([buildingName, orientations]) => {
    orientations.forEach((template, orientationIndex) => {
      if (matchTemplate(selectedGrid, grid, template)) {
        eligibleBuildings.push({ building: buildingName, orientation: orientationIndex });
      }
    });
  });
  // For each building, allow one selection if any orientation matches.
  const uniqueEligible = [];
  eligibleBuildings.forEach(b => {
    if (!uniqueEligible.find(u => u.building === b.building)) {
      uniqueEligible.push(b);
    }
  });

  return (
    <div className="flex justify-center mb-4">
      {Object.keys(buildingTemplates).map(buildingName => {
        const eligibility = uniqueEligible.find(b => b.building === buildingName);
        const isSelected = selectedBuilding && selectedBuilding.building === buildingName;
        return (
          <button
            key={buildingName}
            onClick={() => {
              if (eligibility) {
                selectBuilding(buildingName, eligibility.orientation);
              }
            }}
            className={`px-3 py-2 m-1 text-black ${isSelected ? 'border-4' : 'border-2'}`}
            style={{
              backgroundColor: "lightgray",
              border: eligibility ? "2px solid green" : "2px solid gray"
            }}
          >
            {buildingName}
          </button>
        );
      })}
      {uniqueEligible.length === 0 && (
        <div className="text-red-600 self-center">No valid building selection</div>
      )}
      {selectedBuilding && (
        <button onClick={clearSelections} className="px-3 py-2 m-1 bg-red-200">
          Cancel Building Selection
        </button>
      )}
    </div>
  );
}
