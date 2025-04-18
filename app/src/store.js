// store.js
import create from 'zustand';

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

const resources = ["wheat", "brick", "glass", "stone", "wood"];
let initialDeck = [];
resources.forEach(resource => {
  for (let i = 0; i < 3; i++) {
    initialDeck.push(resource);
  }
});
initialDeck = shuffle(initialDeck);

export const resourceColors = {
  wheat: "yellow",
  brick: "red",
  glass: "blue",
  stone: "grey",
  wood: "black",
};

// Building templates (for brevity, only "cottage" is shown fully)
export const buildingTemplates = {
    cottage: [
      // Orientation 1
      [
        ["", "wheat"],
        ["brick", "glass"]
      ],
      // Orientation 2
      [
        ["brick", ""],
        ["glass", "wheat"]
      ],
      // Orientation 3
      [
        ["glass", "brick"],
        ["wheat", ""]
      ],
      // Orientation 4
      [
        ["wheat", "glass"],
        ["", "brick"]
      ],
      // Orientation 5
      [
        ["wheat", ""],
        ["glass", "brick"]
      ],
      // Orientation 6
      [
        ["", "brick"],
        ["wheat", "glass"]
      ],
      // Orientation 7
      [
        ["brick", "glass"],
        ["", "wheat"]
      ],
      // Orientation 8
      [
        ["glass", "wheat"],
        ["brick", ""]
      ]
    ],
  
    chapel: [
      // Orientation 1
      [
        ["", "", "glass"],
        ["stone", "glass", "stone"]
      ],
      // Orientation 2
      [
        ["glass", "stone"],
        ["", "glass"],
        ["", "stone"]
      ],
      // Orientation 3
      [
        ["stone", "glass", "stone"],
        ["glass", "", ""]
      ],
      // Orientation 4
      [
        ["stone", ""],
        ["glass", ""],
        ["stone", "glass"]
      ],
      // Orientation 5
      [
        ["glass", "", ""],
        ["stone", "glass", "stone"]
      ],
      // Orientation 6
      [
        ["stone", "glass"],
        ["glass", ""],
        ["stone", ""]
      ],
      // Orientation 7
      [
        ["stone", "glass", "stone"],
        ["", "", "glass"]
      ],
      // Orientation 8
      [
        ["", "stone"],
        ["", "glass"],
        ["glass", "stone"]
      ]
    ],
  
    farm: [
      // Orientation 1
      [
        ["wheat", "wheat"],
        ["wood", "wood"]
      ],
      // Orientation 2
      [
        ["wood", "wheat"],
        ["wood", "wheat"]
      ],
      // Orientation 3
      [
        ["wood", "wood"],
        ["wheat", "wheat"]
      ],
      // Orientation 4
      [
        ["wheat", "wood"],
        ["wheat", "wood"]
      ]
    ],
  
    tavern: [
      // Orientation 1
      [
        ["brick", "brick", "glass"]
      ],
      // Orientation 2
      [
        ["brick"],
        ["brick"],
        ["glass"]
      ],
      // Orientation 3
      [
        ["glass", "brick", "brick"],
      ],
      // Orientation 4
      [
        ["glass"],
        ["brick"],
        ["brick"]
      ]
    ],
  
    well: [
      // Orientation 1
      [
        ["wood", "stone"]
      ],
      // Orientation 2
      [
        ["wood"],
        ["stone"]
      ],
      // Orientation 3
      [
        ["stone", "wood"],
      ],
      // Orientation 4
      [
        ["stone"],
        ["wood"]
      ]
    ],
  
    theater: [
      // Orientation 1 (Original)
      [
        ["", "stone", ""],
        ["wood", "glass", "wood"]
      ],
      // Orientation 2 (90° Clockwise Rotation)
      [
        ["wood", ""],
        ["glass", "stone"],
        ["wood", ""]
      ],
      // Orientation 3 (180° Rotation)
      [
        ["wood", "glass", "wood"],
        ["", "stone", ""]
      ],
      // Orientation 4 (270° Clockwise Rotation)
      [
        ["", "wood"],
        ["stone", "glass"],
        ["", "wood"]
      ]
    ],
  
    factory: [
      // Orientation 1 (Original)
      [
        ["wood", "", "", ""],
        ["brick", "stone", "stone", "brick"]
      ],
      // Orientation 2 (90° Clockwise Rotation)
      [
        ["brick", "wood"],
        ["stone", ""],
        ["stone", ""],
        ["brick", ""]
      ],
      // Orientation 3 (180° Rotation)
      [
        ["brick", "stone", "stone", "brick"],
        ["", "", "", "wood"]
      ],
      // Orientation 4 (270° Clockwise Rotation)
      [
        ["", "brick"],
        ["", "stone"],
        ["", "stone"],
        ["wood", "brick"]
      ],
      // Orientation 5
      [
        ["", "", "", "wood"],
        ["brick", "stone", "stone", "brick"]
      ],
      // Orientation 6
      [
        ["wood", "brick"],
        ["", "stone"],
        ["", "stone"],
        ["", "brick"]
      ],
      // Orientation 7
      [
        ["brick", "stone", "stone", "brick"],
        ["wood", "", "", ""]
      ],
      // Orientation 8
      [
        ["brick", ""],
        ["stone", ""],
        ["stone", ""],
        ["brick", "wood"]
      ]
    ],
  
    cathedral: [
      // Orientation 1 (Original)
      [
        ["", "wheat"],
        ["stone", "glass"]
      ],
      // Orientation 2 (90° Clockwise Rotation)
      [
        ["stone", ""],
        ["glass", "wheat"]
      ],
      // Orientation 3 (180° Rotation)
      [
        ["glass", "stone"],
        ["wheat", ""]
      ],
      // Orientation 4 (270° Clockwise Rotation)
      [
        ["wheat", "glass"],
        ["", "stone"]
      ],
      // Orientation 5
      [
        ["wheat", ""],
        ["glass", "stone"]
      ],
      // Orientation 6
      [
        ["", "stone"],
        ["wheat", "glass"]
      ],
      // Orientation 7
      [
        ["stone", "glass"],
        ["", "wheat"]
      ],
      // Orientation 8
      [
        ["glass", "wheat"],
        ["stone", ""]
      ]
    ]
  };

export const useTownStore = create((set) => ({
  grid: Array(16).fill(null), // 4x4 grid; cells with resource or building name
  deck: initialDeck,
  selectedResource: null,
  selectedGrid: [], // indices of grid cells toggled (only if cell has a resource)
  selectedBuilding: null, // { building, orientation }

  // For resource selection (from deck)
  setSelectedResource: (resource, deckIndex) =>
    set({ selectedResource: { resource, deckIndex } }),

  placeResource: (gridIndex) =>
    set((state) => {
      if (state.grid[gridIndex] !== null || !state.selectedResource)
        return state;
      const newGrid = [...state.grid];
      newGrid[gridIndex] = state.selectedResource.resource;
      const newDeck = [...state.deck];
      newDeck.splice(state.selectedResource.deckIndex, 1);
      newDeck.push(state.selectedResource.resource);
      return { grid: newGrid, deck: newDeck, selectedResource: null };
    }),

  resetGrid: () => set({ grid: Array(16).fill(null), selectedGrid: [], selectedBuilding: null }),

  // Toggle selection on grid cells with a resource
  toggleGridCell: (index) =>
    set((state) => {
      const cellValue = state.grid[index];
      if (!resources.includes(cellValue)) return state;
      const selectedSet = new Set(state.selectedGrid);
      if (selectedSet.has(index)) selectedSet.delete(index);
      else selectedSet.add(index);
      return { selectedGrid: Array.from(selectedSet) };
    }),

  selectBuilding: (building, orientation) =>
    set({ selectedBuilding: { building, orientation } }),

  clearSelections: () => set({ selectedGrid: [], selectedBuilding: null }),

  // Place building onto grid at chosen top-left empty cell.
  // For each non-empty cell in the template, the corresponding grid cell must be empty.
  placeBuilding: (topLeftIndex, building, orientation) =>
    set((state) => {
      const row = Math.floor(topLeftIndex / 4);
      const col = topLeftIndex % 4;
      const template = buildingTemplates[building][orientation];
      const templateRows = template.length;
      const templateCols = template[0].length;
      if (row + templateRows > 4 || col + templateCols > 4) return state;
      const newGrid = [...state.grid];
      for (let i = 0; i < templateRows; i++) {
        for (let j = 0; j < templateCols; j++) {
          if (template[i][j] !== "") {
            const idx = (row + i) * 4 + (col + j);
            if (newGrid[idx] !== null) return state;
          }
        }
      }
      // Place building: mark each relevant cell with building name.
      for (let i = 0; i < templateRows; i++) {
        for (let j = 0; j < templateCols; j++) {
          if (template[i][j] !== "") {
            const idx = (row + i) * 4 + (col + j);
            newGrid[idx] = building;
          }
        }
      }
      return { grid: newGrid, selectedBuilding: null, selectedGrid: [] };
    })
}));
