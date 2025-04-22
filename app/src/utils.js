// Utility functions for Tinytowns project

const GRID_SIZE = 4;

/**
 * Convert a selection of grid indices into a normalized string key.
 * The key captures relative positions and resource types.
 *
 * @param {number[]} selectedIndices - Array of grid indices selected.
 * @param {(string|null)[]} grid - Flat array of 16 resource or building names.
 * @returns {string} - A string key representing the pattern.
 */
export function coordsToString(selectedIndices, grid) {
  if (!selectedIndices || selectedIndices.length === 0) {
    return '';
  }

  // Compute row/col for each selected index
  const positions = selectedIndices.map(i => ({
    row: Math.floor(i / GRID_SIZE),
    col: i % GRID_SIZE,
    idx: i
  }));

  // Find bounding box
  const minRow = Math.min(...positions.map(p => p.row));
  const minCol = Math.min(...positions.map(p => p.col));

  // Build normalized array: "relPos:resource"
  const normalized = positions.map(({ row, col, idx }) => {
    const relRow = row - minRow;
    const relCol = col - minCol;
    // Flattened index within bounding box assumes same GRID_SIZE for simplicity
    const relIndex = relRow * GRID_SIZE + relCol;
    const resource = grid[idx] || '';
    return `${relIndex}:${resource}`;
  });

  // Sort for consistent ordering
  normalized.sort();

  // Join into single key
  return normalized.join(',');
}
