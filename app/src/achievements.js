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
  
    // 1. Perfectionist
    if (emptySpaces === 0) {
<<<<<<< HEAD
      achievements.push("Perfect Town");
=======
      achievements.push("Perfectionist");
>>>>>>> b40ac3d9d28fdce6d32b96a280cccbcd7caea273
    }
  
    // 2. Architect Extraordinaire
    if (buildingTypes.size >= 4) {
      achievements.push("Architect Extraordinaire");
    }
  
    // 3. Speed Builder
    if (startTime && endTime) {
      const elapsedSeconds = (new Date(endTime) - new Date(startTime)) / 1000;
<<<<<<< HEAD
      if (elapsedSeconds < 300 && score >= 20) {
        achievements.push("Speed Builder");
      }
    }    
=======
      if (elapsedSeconds < 300) { // 5 minutes = 300 seconds
        achievements.push("Speed Builder");
      }
    }
>>>>>>> b40ac3d9d28fdce6d32b96a280cccbcd7caea273
  
    // 4. Farming Frenzy
    if (farmCount >= 3) {
      achievements.push("Farming Frenzy");
    }
  
    // 5. Legendary Score
    if (score >= 35) {
      achievements.push("Legendary Score");
    }
  
    return achievements;
  }
  