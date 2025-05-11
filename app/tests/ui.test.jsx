import React from "react";
import { render, fireEvent } from "@testing-library/react";
import { App } from "../src/app.jsx";
import { useTownStore } from "../src/store";
import { act } from "react";

describe("Tiny Towns UI functionality", () => {
  beforeEach(() => {
    act(() => {
      useTownStore.getState().resetGrid();
    });
  });

  it("places a resource from the selector to an empty grid cell", () => {
    const { container } = render(<App />);
    const cards = container.querySelectorAll(".building-card");
    const firstCard = cards[0];

    fireEvent.click(firstCard); // Select a resource card
    const cells = container.querySelectorAll(".cell");
    fireEvent.click(cells[0]); // Place on first cell

    expect(useTownStore.getState().grid[0].resource).not.toBeNull();
  });

  it("places a cottage building if correct pattern is selected", () => {
    const { getByText, container } = render(<App />);
  
    // Place resources on cells 0, 4, 5
    act(() => {
      useTownStore.getState().setSelectedResource("wheat", 0);
    });
    fireEvent.click(container.querySelectorAll(".cell")[0]);
  
    act(() => {
      useTownStore.getState().setSelectedResource("glass", 1);
    });
    fireEvent.click(container.querySelectorAll(".cell")[4]);
  
    act(() => {
      useTownStore.getState().setSelectedResource("brick", 2);
    });
    fireEvent.click(container.querySelectorAll(".cell")[5]);
  
    // Select the 4-cell shape
    fireEvent.click(container.querySelectorAll(".cell")[0]); // wheat
    fireEvent.click(container.querySelectorAll(".cell")[4]); // glass
    fireEvent.click(container.querySelectorAll(".cell")[5]); // brick
  
    // Also need to select the empty corner to match the 2x2 pattern
    fireEvent.click(container.querySelectorAll(".cell")[1]); // top right empty
  
    // Click cottage from BuildingStore
    fireEvent.click(getByText(/cottage/i));
  
    // Try placing on anchor candidates
    const selectedIndices = [0, 1, 4, 5];
    for (let idx of selectedIndices) {
      fireEvent.click(container.querySelectorAll(".cell")[idx]);
      if (useTownStore.getState().grid[idx].resource === "cottage") break;
    }
  
    const grid = useTownStore.getState().grid;
    expect(grid.some(cell => cell.resource === "cottage")).toBe(true);
  });
  
});
