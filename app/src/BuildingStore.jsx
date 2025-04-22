import React from 'react';
import { useTownStore, buildingTemplates } from './store';

const resourceColors = {
  wheat: '#FFD05A',
  brick: '#FE2133',
  glass: '#4D9A8A',
  stone: 'gray',
  wood: '#5e2c04',
};

function matchTemplate(selectedGrid, grid, template) {
  if (selectedGrid.length === 0) return false;

  const positions = selectedGrid.map(index => ({
    row: Math.floor(index / 4),
    col: index % 4
  }));

  const minRow = Math.min(...positions.map(p => p.row));
  const minCol = Math.min(...positions.map(p => p.col));

  const templateSelected = [];
  for (let i = 0; i < template.length; i++) {
    for (let j = 0; j < template[0].length; j++) {
      if (template[i][j] !== "") {
        const index = (minRow + i) * 4 + (minCol + j);
        if (grid[index]?.resource !== template[i][j]) return false;
        templateSelected.push(index);
      }
    }
  }

  const sortedSel = selectedGrid.slice().sort();
  const sortedTemp = templateSelected.slice().sort();
  return JSON.stringify(sortedSel) === JSON.stringify(sortedTemp);
}

function ResourceGrid({ pattern }) {
  return (
    <div className="inline-block bg-transparent p-1">
      {pattern.map((row, i) => (
        <div key={i} className="flex justify-center h-4">
          {row.map((cell, j) => (
            <div
              key={j}
              className="w-4 h-4 mx-0.5 my-0.5 rounded-sm"
              style={{
                backgroundColor: resourceColors[cell] || 'transparent'
              }}
            ></div>
          ))}
        </div>
      ))}
    </div>
  );
}


export function BuildingStore() {
  const {
    selectedGrid,
    grid,
    selectBuilding,
    selectedBuilding,
    clearSelections
  } = useTownStore(state => ({
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

  const uniqueEligible = [];
  eligibleBuildings.forEach(b => {
    if (!uniqueEligible.find(u => u.building === b.building)) {
      uniqueEligible.push(b);
    }
  });

  return (
    <div className="flex flex-wrap justify-center gap-3">
      {Object.keys(buildingTemplates).map(buildingName => {
        const isEligible = uniqueEligible.find(b => b.building === buildingName);
        const isSelected = selectedBuilding?.building === buildingName;
        return (
          <div
            key={buildingName}
            onClick={() => {
              if (isEligible) {
                selectBuilding(buildingName, isEligible.orientation);
              }
            }}
            className={`cursor-pointer border-2 rounded-md p-2 w-28 bg-[#D2B48C] text-center relative ${isEligible ? 'border-green-500' : 'border-gray-400'} ${isSelected ? 'ring-2 ring-red-500' : ''}`}
          >
            <div className="text-white font-bold capitalize mb-1">{buildingName}</div>
            <ResourceGrid pattern={buildingTemplates[buildingName][0]} />
          </div>
        );
      })}

      {selectedBuilding && (
        <div
          onClick={clearSelections}
          className="cursor-pointer bg-red-200 text-black font-semibold px-3 py-2 rounded-md ml-4"
        >
          Cancel
        </div>
      )}
    </div>
  );
}