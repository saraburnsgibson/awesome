// scoring.js

const WIDTH = 4;

// ── Helpers ────────────────────────────────────────────────────────────────

// Get up/down/left/right neighbors of a cell index in a 4×4 grid
function orthogonalNeighbors(idx) {
  const row = Math.floor(idx / WIDTH), col = idx % WIDTH;
  const neigh = [];
  if (row > 0)         neigh.push(idx - WIDTH);
  if (row < WIDTH - 1) neigh.push(idx + WIDTH);
  if (col > 0)         neigh.push(idx - 1);
  if (col < WIDTH - 1) neigh.push(idx + 1);
  return neigh;
}

// ── 1) Empty-square penalty ────────────────────────────────────────────────
//
//   Each empty cell is −1 VP… unless you built a Cathedral, in which
//   case empties count 0 VP instead :contentReference[oaicite:0]{index=0}:contentReference[oaicite:1]{index=1}:contentReference[oaicite:2]{index=2}:contentReference[oaicite:3]{index=3}
export function scoreEmpty(grid) {
  const emptyCount = grid.filter(c => !c.resource).length;
  const hasCathedral = grid.some(c => c.resource === 'cathedral');
  return hasCathedral ? 0 : -emptyCount;
}

// ── 2) Feeding capacity (farms only) ───────────────────────────────────────
//
//   Farms feed 4 Cottages anywhere on the board :contentReference[oaicite:4]{index=4}:contentReference[oaicite:5]{index=5}
export function computeFeedingCapacity(grid) {
  const farmCount = grid.filter(c => c.resource === 'farm').length;
  return farmCount * 4;
}

// ── 3) Cottages: 3 VP each for as many fed cottages as capacity allows :contentReference[oaicite:6]{index=6}:contentReference[oaicite:7]{index=7}
export function scoreCottages(grid) {
  const totalCottages = grid.filter(c => c.resource === 'cottage').length;
  const fed = Math.min(totalCottages, computeFeedingCapacity(grid));
  return fed * 3;
}

// ── 4) Chapels: each Chapel is worth “# fed Cottages” :contentReference[oaicite:8]{index=8}:contentReference[oaicite:9]{index=9}
export function scoreChapels(grid) {
  const chapelCount = grid.filter(c => c.resource === 'chapel').length;
  const fed = Math.min(
    grid.filter(c => c.resource === 'cottage').length,
    computeFeedingCapacity(grid)
  );
  return chapelCount * fed;
}

// ── 5) Farms score 0 VP on their own (they only feed) ─────────────────────
export function scoreFarms(/*grid*/) {
  return 0;
}

// ── 6) Taverns: group scoring [1→2, 2→5, 3→9, 4→14, 5+→20]
const TAVERN_SCORES = [0, 2, 5, 9, 14, 20];
export function scoreTaverns(grid) {
  const n = grid.filter(c => c.resource === 'tavern').length;
  return TAVERN_SCORES[Math.min(n, 5)];
}

// ── 7) Wells: 1 VP per adjacent Cottage (fed or unfed)
export function scoreWells(grid) {
  return grid.reduce((sum, cell, idx) => {
    if (cell.resource !== 'well') return sum;
    return sum + orthogonalNeighbors(idx)
      .filter(i => grid[i].resource === 'cottage').length;
  }, 0);
}

// ── 8) Theaters: per‐Theater, count unique building types in that row+col (max 6) 
export function scoreTheaters(grid) {
  let total = 0;
  grid.forEach((cell, idx) => {
    if (cell.resource !== 'theater') return;
    const row = Math.floor(idx / WIDTH), col = idx % WIDTH;
    const seen = new Set();
    // scan row
    for (let c = 0; c < WIDTH; c++) {
      const rIdx = row * WIDTH + c;
      const rRes = grid[rIdx].resource;
      if (rRes && rRes !== 'theater') seen.add(rRes);
    }
    // scan column
    for (let r = 0; r < WIDTH; r++) {
      const cIdx = r * WIDTH + col;
      const cRes = grid[cIdx].resource;
      if (cRes && cRes !== 'theater') seen.add(cRes);
    }
    total += Math.min(seen.size, 6);
  });
  return total;
}

// ── 9) Factories score 0 VP on their own ─────────────────────────────────
export function scoreFactories(/*grid*/) {
  return 0;
}

// ──10) Cathedrals score 0 VP themselves but flip empty penalty to 0 
export function scoreCathedrals(/*grid*/) {
  return 0;
}

// ── Master combine ────────────────────────────────────────────────────────
export function calculateScore(grid) {
  return (
    scoreEmpty(grid)   +
    scoreCottages(grid)+
    scoreChapels(grid) +
    scoreFarms(grid)   +
    scoreTaverns(grid) +
    scoreWells(grid)   +
    scoreTheaters(grid)+
    scoreFactories(grid)+
    scoreCathedrals(grid)
  );
}

  export function getSkillLevel(score) {
    if (score >= 30) return 'Legendary Master';
    if (score >= 25) return 'Master';
    if (score >= 20) return 'Journeyman';
    if (score >= 15) return 'Apprentice';
    return 'Novice';
  }
  