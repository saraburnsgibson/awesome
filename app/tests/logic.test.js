// tests/logic.test.js
import { describe, test, expect, beforeEach } from 'vitest'
import {
  scoreEmpty,
  computeFeedingCapacity,
  scoreCottages,
  scoreChapels,
  scoreFarms,
  scoreTaverns,
  scoreWells,
  scoreTheaters,
  scoreFactories,
  scoreCathedrals,
  calculateScore,
  getSkillLevel
} from '../src/scoring.js'

// NEW imports for pattern‐matching tests
import { matchTemplate } from '../src/BuildingStore.jsx'
import { buildingTemplates, useTownStore } from '../src/store.js'

function makeGrid(resources) {
  return resources.map(r => ({ resource: r }))
}

// Helper to build the full cell objects for the store
function makeStoreGrid(resources) {
  return resources.map(r => ({
    resource: r,
    selected: false,
    topLeft: false
  }))
}

describe('scoreEmpty', () => {
  test('penalizes empties when no cathedral', () => {
    const grid = makeGrid(Array(16).fill(null))
    expect(scoreEmpty(grid)).toBe(-16)
  })

  test('no penalty when cathedral present', () => {
    const arr = Array(16).fill(null)
    arr[0] = 'cathedral'
    const grid = makeGrid(arr)
    expect(scoreEmpty(grid)).toBe(0)
  })
})

describe('computeFeedingCapacity', () => {
  test('no farms => 0', () => {
    const grid = makeGrid(Array(16).fill(null))
    expect(computeFeedingCapacity(grid)).toBe(0)
  })

  test('one farm => 4', () => {
    const arr = Array(16).fill(null)
    arr[5] = 'farm'
    expect(computeFeedingCapacity(makeGrid(arr))).toBe(4)
  })

  test('three farms => 12', () => {
    const arr = Array(16).fill(null)
    arr[1] = arr[6] = arr[11] = 'farm'
    expect(computeFeedingCapacity(makeGrid(arr))).toBe(12)
  })
})

describe('scoreCottages', () => {
  test('no capacity => 0', () => {
    const arr = Array(16).fill(null)
    arr[0] = 'cottage'
    expect(scoreCottages(makeGrid(arr))).toBe(0)
  })

  test('enough capacity => 3 per cottage', () => {
    const arr = Array(16).fill(null)
    arr[0] = 'farm'
    arr[1] = 'cottage'
    arr[2] = 'cottage'
    expect(scoreCottages(makeGrid(arr))).toBe(6)
  })

  test('limited capacity => only fed cottages count', () => {
    const arr = Array(16).fill(null)
    arr[0] = 'farm' // capacity = 4
    for (let i = 1; i <= 5; i++) arr[i] = 'cottage'
    expect(scoreCottages(makeGrid(arr))).toBe(12)
  })
})

describe('scoreChapels', () => {
  test('with fed cottages', () => {
    const arr = Array(16).fill(null)
    arr[0] = 'farm'    // capacity = 4
    arr[1] = 'cottage'
    arr[2] = 'cottage'
    arr[3] = 'chapel'
    expect(scoreChapels(makeGrid(arr))).toBe(2)
  })

  test('no feeding => chapel scores 0', () => {
    const arr = Array(16).fill(null)
    arr[3] = 'chapel'
    arr[4] = 'cottage'
    expect(scoreChapels(makeGrid(arr))).toBe(0)
  })
})

describe('scoreFarms', () => {
  test('always returns 0', () => {
    const grid = makeGrid(Array(16).fill(null))
    expect(scoreFarms(grid)).toBe(0)
  })
})

describe('scoreTaverns', () => {
  [0, 1, 2, 3, 4, 5, 6].forEach(count => {
    test(`${count} tavern(s) => correct score`, () => {
      const arr = Array(16).fill(null)
      for (let i = 0; i < count; i++) arr[i] = 'tavern'
      const expected = [0, 2, 5, 9, 14, 20, 20][count]
      expect(scoreTaverns(makeGrid(arr))).toBe(expected)
    })
  })
})

describe('scoreWells', () => {
  test('counts adjacent cottages', () => {
    const arr = Array(16).fill(null)
    // index 5 is well; neighbors 1, 4, 6, 9
    arr[5] = 'well'
    arr[1] = 'cottage'
    arr[4] = 'cottage'
    arr[9] = 'cottage'
    expect(scoreWells(makeGrid(arr))).toBe(3)
  })
})

describe('scoreTheaters', () => {
  test('counts unique types in row and column, cap at 6', () => {
    const arr = Array(16).fill(null)
    arr[5] = 'theater'   // row 1: idx 4–7, col 1: idx 1,5,9,13
    arr[4] = 'farm'
    arr[6] = 'chapel'
    arr[7] = 'farm'      // duplicate
    arr[1] = 'cottage'
    arr[9] = 'tavern'
    arr[13] = 'farm'     // duplicate
    expect(scoreTheaters(makeGrid(arr))).toBe(4)
  })
})

describe('scoreFactories', () => {
  test('always returns 0', () => {
    const grid = makeGrid(Array(16).fill(null))
    expect(scoreFactories(grid)).toBe(0)
  })
})

describe('scoreCathedrals', () => {
  test('always returns 0', () => {
    const grid = makeGrid(Array(16).fill(null))
    expect(scoreCathedrals(grid)).toBe(0)
  })
})

describe('calculateScore', () => {
  test('equals sum of individual scores', () => {
    const arr = Array(16).fill(null)
    arr[0] = 'farm'
    arr[1] = 'cottage'
    arr[2] = 'cottage'
    arr[3] = 'chapel'
    arr[4] = 'tavern'
    arr[5] = 'well'
    arr[6] = 'theater'
    arr[7] = 'factory'
    arr[8] = 'cathedral'
    const grid = makeGrid(arr)
    const sum =
      scoreEmpty(grid) +
      scoreCottages(grid) +
      scoreChapels(grid) +
      scoreFarms(grid) +
      scoreTaverns(grid) +
      scoreWells(grid) +
      scoreTheaters(grid) +
      scoreFactories(grid) +
      scoreCathedrals(grid)
    expect(calculateScore(grid)).toBe(sum)
  })

  test('all-null grid yields -16', () => {
    const grid = makeGrid(Array(16).fill(null))
    expect(calculateScore(grid)).toBe(-16)
  })
})

describe('getSkillLevel', () => {
  const cases = [
    [0, 'Novice'],
    [14, 'Novice'],
    [15, 'Apprentice'],
    [19, 'Apprentice'],
    [20, 'Journeyman'],
    [24, 'Journeyman'],
    [25, 'Master'],
    [29, 'Master'],
    [30, 'Legendary Master'],
    [100, 'Legendary Master']
  ]

  cases.forEach(([score, level]) => {
    test(`score ${score} => ${level}`, () => {
      expect(getSkillLevel(score)).toBe(level)
    })
  })
})

// -----------------Pattern MAtching
describe('matchTemplate (BuildingStore.jsx)', () => {
  const farmTemplate = buildingTemplates.farm[0]

  test('returns false for empty selection', () => {
    const grid = makeGrid(Array(16).fill(null))
    expect(matchTemplate([], grid, farmTemplate)).toBe(false)
  })

  test('detects matching farm pattern', () => {
    // place that 2×2 farm block at indices [0,1,4,5]
    const resources = Array(16).fill(null)
    resources[0] = 'wheat'
    resources[1] = 'wheat'
    resources[4] = 'wood'
    resources[5] = 'wood'
    const grid = makeGrid(resources)
    expect(matchTemplate([0,1,4,5], grid, farmTemplate)).toBe(true)
  })

  test('returns false for non-matching pattern', () => {
    const resources = Array(16).fill(null)
    resources[0] = 'wheat'
    resources[1] = 'wood'   // wrong
    resources[4] = 'wood'
    resources[5] = 'wood'
    const grid = makeGrid(resources)
    expect(matchTemplate([0,1,4,5], grid, farmTemplate)).toBe(false)
  })
})

describe('placeBuilding (store.js)', () => {
  beforeEach(() => {
    // reset the grid & other state
    useTownStore.getState().resetGrid()
  })

  test('places a well and moves consumed resources into deckQueue', () => {
    // 1) seed a simple wood+stone pattern at [4,5]
    const resources = Array(16).fill(null)
    resources[4] = 'wood'
    resources[5] = 'stone'
    const customGrid = makeStoreGrid(resources)

    // 2) set store state
    useTownStore.setState({
      grid: customGrid,
      selectedGrid: [4,5],
      selectedBuilding: { building: 'well', orientation: 0 },
      deckQueue: []
    })

    // 3) invoke the placement action
    useTownStore.getState().placeBuilding(4)

    // 4) inspect final state
    const s = useTownStore.getState()
    expect(s.grid[4].resource).toBe('well')
    expect(s.grid[4].topLeft).toBe(true)
    expect(s.selectedGrid).toEqual([])
    expect(s.selectedBuilding).toBeNull()
    expect(s.deckQueue).toEqual(['wood','stone'])
  })
})
