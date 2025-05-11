// achievements.js

export function detectAchievements(grid, startTime, endTime, score) {
    const achievements = [];
  
    const buildingTypes = new Set();
    let emptySpaces = 0;
    let farmCount = 0;
  
    grid.forEach(cell => {
      if (!cell.resource) {
        emptySpaces++;
      } else {
        buildingTypes.add(cell.resource);
        if (cell.resource === 'farm') {
          farmCount++;
        }
      }
    });
  
    // 1. Perfectionist - Fill every single cell on the board—no empty spaces left!
    if (emptySpaces === 0) {
      achievements.push("Perfect Town");
    }
  
    // 2. Architect Extraordinaire - Showcase your variety by placing at least four different building types.
    if (buildingTypes.size >= 4) {
      achievements.push("Architect Extraordinaire");
    }
  
    // 3. Speed Builder - Complete your town in under 5 minutes and score at least 5 points.
    if (startTime && endTime) {
      const elapsedSeconds = (new Date(endTime) - new Date(startTime)) / 1000;
      if (elapsedSeconds < 300 && score >= 5) {
        achievements.push("Speed Builder");
      }
    }    
  
    // 4. Farming Frenzy - Go all-in on agriculture by placing three or more farms.
    if (farmCount >= 3) {
      achievements.push("Farming Frenzy");
    }
  
    // 5. Legendary Score - Hit the high-score boards with 35 points or more.
    if (score >= 35) {
      achievements.push("Legendary Score");
    }

    // 6. Row Filler - Completely fill any one of the four rows with buildings—no gaps allowed!
    for (let row = 0; row < 4; row++) {
      let full = true;
      for (let col = 0; col < 4; col++) {
        if (!grid[row * 4 + col].topLeft) {
          full = false;
          break;
        }
      }
      if (full) {
        achievements.push("Row Filler");
        break;
      }
    }

    // 7. Cornerstone Developer - Stake your claim on every corner—each of the four corner cells must host a building.
    const corners = [0, 3, 12, 15];
    if (corners.every(i => grid[i].topLeft)) {
      achievements.push("Cornerstone Developer");
    }

    // 8. Marathon Builder - You took the scenic route—spent more than 10 minutes planning your town.
    if (startTime && endTime) {
      const elapsedSeconds = (new Date(endTime) - new Date(startTime)) / 1000;
      if (elapsedSeconds > 600) {
        achievements.push("Marathon Builder");
      }
    }


    return achievements;
  }

  export const ALL_ACHIEVEMENTS = [
    "Perfect Town",
    "Architect Extraordinaire",
    "Speed Builder",
    "Farming Frenzy",
    "Legendary Score",
    "Row Filler",
    "Cornerstone Developer",
    "Marathon Builder"
  ];
  