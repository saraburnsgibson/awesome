import create from 'zustand'

// -- Helpers ---------------------------------------------------------------
function shuffle(array) {
  const a = array.slice()
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

// -- Resources & Deck ------------------------------------------------------
const resources = ['wheat', 'brick', 'glass', 'stone', 'wood']

let initialDeck = []
resources.forEach(r => {
  for (let i = 0; i < 3; i++) initialDeck.push(r)
})
initialDeck = shuffle(initialDeck)

// -- Color Map -------------------------------------------------------------
export const resourceColors = {
  wheat: 'yellow',
  brick: 'red',
  glass: 'blue',
  stone: 'grey',
  wood: 'black',
}

// -- Building Templates ----------------------------------------------------
export const buildingTemplates = {
  cottage: [
    [['', 'wheat'], ['brick', 'glass']],
    [['brick', ''], ['glass', 'wheat']],
    [['glass', 'brick'], ['wheat', '']],
    [['wheat', 'glass'], ['', 'brick']],
    [['wheat', ''], ['glass', 'brick']],
    [['', 'brick'], ['wheat', 'glass']],
    [['brick', 'glass'], ['', 'wheat']],
    [['glass', 'wheat'], ['brick', '']],
  ],
  chapel: [
    [['', '', 'glass'], ['stone', 'glass', 'stone']],
    [['glass', 'stone'], ['', 'glass'], ['', 'stone']],
    [['stone', 'glass', 'stone'], ['glass', '', '']],
    [['stone', ''], ['glass', ''], ['stone', 'glass']],
    [['glass', '', ''], ['stone', 'glass', 'stone']],
    [['stone', 'glass'], ['glass', ''], ['stone', '']],
    [['stone', 'glass', 'stone'], ['', '', 'glass']],
    [['', 'stone'], ['', 'glass'], ['glass', 'stone']],
  ],
  farm: [
    [['wheat', 'wheat'], ['wood', 'wood']],
    [['wood', 'wheat'], ['wood', 'wheat']],
    [['wood', 'wood'], ['wheat', 'wheat']],
    [['wheat', 'wood'], ['wheat', 'wood']],
  ],
  tavern: [
    [['brick', 'brick', 'glass']],
    [['brick'], ['brick'], ['glass']],
    [['glass', 'brick', 'brick']],
    [['glass'], ['brick'], ['brick']],
  ],
  well: [
    [['wood', 'stone']],
    [['wood'], ['stone']],
    [['stone', 'wood']],
    [['stone'], ['wood']],
  ],
  theater: [
    [['', 'stone', ''], ['wood', 'glass', 'wood']],
    [['wood', ''], ['glass', 'stone'], ['wood', '']],
    [['wood', 'glass', 'wood'], ['', 'stone', '']],
    [['', 'wood'], ['stone', 'glass'], ['', 'wood']],
  ],
  factory: [
    [['wood', '', '', ''], ['brick', 'stone', 'stone', 'brick']],
    [['brick', 'wood'], ['stone', ''], ['stone', ''], ['brick', '']],
    [['brick', 'stone', 'stone', 'brick'], ['', '', '', 'wood']],
    [['', 'brick'], ['', 'stone'], ['', 'stone'], ['wood', 'brick']],
    [['', '', '', 'wood'], ['brick', 'stone', 'stone', 'brick']],
    [['wood', 'brick'], ['', 'stone'], ['', 'stone'], ['', 'brick']],
    [['brick', 'stone', 'stone', 'brick'], ['wood', '', '', '']],
    [['brick', ''], ['stone', ''], ['stone', ''], ['brick', 'wood']],
  ],
  cathedral: [
    [['', 'wheat'], ['stone', 'glass']],
    [['stone', ''], ['glass', 'wheat']],
    [['glass', 'stone'], ['wheat', '']],
    [['wheat', 'glass'], ['', 'stone']],
    [['wheat', ''], ['glass', 'stone']],
    [['', 'stone'], ['wheat', 'glass']],
    [['stone', 'glass'], ['', 'wheat']],
    [['glass', 'wheat'], ['stone', '']],
  ],
}

// -- Zustand Store ---------------------------------------------------------
export const useTownStore = create((set, get) => ({
  grid: Array(16).fill(null).map(() => ({ resource: null, selected: false, topLeft: false })),
  visibleCards: initialDeck.slice(0, 3),
  deckQueue: initialDeck.slice(3),
  selectedResource: null,
  selectedGrid: [],
  selectedBuilding: null,
  factoryResource: null, 
  startTime: new Date().toISOString(),
  endTime: null,

  setSelectedResource: (resource, deckIndex) =>
    set({ selectedResource: { resource, deckIndex } }),

  setFactoryResource: (resource) => set({ factoryResource: resource }),
  placeResource: gridIndex =>
    set(state => {
      const { grid, visibleCards, deckQueue, selectedResource } = state;
      if (!selectedResource || grid[gridIndex].resource) return {};
  
      const newGrid = grid.map((cell, idx) =>
        idx === gridIndex
          ? { resource: selectedResource.resource, selected: false, topLeft: false }
          : cell
      );
  
      const newVisible = [...visibleCards];
      const newQueue = [...deckQueue];
  
      // Replace the used visible card with the next card from the queue (if available)
      if (newQueue.length > 0) {
        newVisible[selectedResource.deckIndex] = newQueue.shift();
      } else {
        // If queue is empty, just remove the card
        newVisible.splice(selectedResource.deckIndex, 1);
      }
  
      return {
        grid: newGrid,
        visibleCards: newVisible,
        deckQueue: newQueue,
        selectedResource: null,
        selectedGrid: [],
        selectedBuilding: null,
      };
    }),  

  toggleCell: index =>
    set(state => {
      const grid = [...state.grid];
      const cell = grid[index];
      if (!cell.resource) return {};
      const selectedGrid = state.selectedGrid.includes(index)
        ? state.selectedGrid.filter(i => i !== index)
        : [...state.selectedGrid, index];
      grid[index] = { ...cell, selected: !cell.selected };
      return { grid, selectedGrid, selectedBuilding: null };
    }),

  selectBuilding: (building, orientation) =>
    set({ selectedBuilding: { building, orientation } }),

  clearSelections: () =>
    set(state => {
      const newGrid = state.grid.map(cell =>
        cell.selected ? { ...cell, selected: false } : cell
      );
      return { grid: newGrid, selectedGrid: [], selectedBuilding: null };
    }),

  placeBuilding: clickedIndex => {
    const state = get();
    const { selectedBuilding, grid, selectedGrid, deck } = state;
    if (!selectedBuilding || !selectedGrid.includes(clickedIndex)) return;

    const { building, orientation } = selectedBuilding;
    const template = buildingTemplates[building][orientation];
    const templateCells = [];
    for (let i = 0; i < template.length; i++) {
      for (let j = 0; j < template[0].length; j++) {
        if (template[i][j] !== '') templateCells.push({ i, j });
      }
    }
    const clickedRow = Math.floor(clickedIndex / 4);
    const clickedCol = clickedIndex % 4;

    for (const { i: anchorI, j: anchorJ } of templateCells) {
      const startRow = clickedRow - anchorI;
      const startCol = clickedCol - anchorJ;
      if (
        startRow < 0 ||
        startCol < 0 ||
        startRow + template.length > 4 ||
        startCol + template[0].length > 4
      ) continue;

      let match = true;
      const usedResources = [];
      for (let i = 0; i < template.length && match; i++) {
        for (let j = 0; j < template[0].length && match; j++) {
          const val = template[i][j];
          const idx = (startRow + i) * 4 + (startCol + j);
          if (val !== '') {
            if (!selectedGrid.includes(idx) || grid[idx].resource !== val) {
              match = false;
            } else {
              usedResources.push(val);
            }
          }
        }
      }

      if (!match) continue;

      const newGrid = grid.map((cell, idx) => {
        if (selectedGrid.includes(idx)) {
          return { resource: null, selected: false, topLeft: false };
        }
        return { ...cell, selected: false };
      });
      
      for (let i = 0; i < template.length; i++) {
        for (let j = 0; j < template[0].length; j++) {
          const val = template[i][j];
          const idx = (startRow + i) * 4 + (startCol + j);
          if (val !== '') {
            newGrid[idx] = idx === clickedIndex
          ? { resource: building, selected: false, topLeft: true }
          : { resource: null, selected: false, topLeft: false };
          }
        }
      }
      

      set({
        grid: newGrid,
        selectedGrid: [],
        selectedBuilding: null,
        deckQueue: [...get().deckQueue, ...usedResources],
      });
      return;
    }
  },

  setEndTime: () => set({ endTime: new Date().toISOString() }),

  resetGrid: () =>
    set({
      grid: Array(16).fill(null).map(() => ({ resource: null, selected: false, topLeft: false })),
      visibleCards: initialDeck.slice(0, 3),
      deckQueue: initialDeck.slice(3),
      selectedResource: null,
      selectedGrid: [],
      selectedBuilding: null,
      startTime: new Date().toISOString(),
      endTime: null,
    }),
}))
