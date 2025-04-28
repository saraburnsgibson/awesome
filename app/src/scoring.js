// scoring.js
export function calculateScore(grid) {
    let score = 0;
  
    grid.forEach(cell => {
      if (!cell.resource) {
        score -= 1; // Empty space penalty
      } else {
        switch (cell.resource) {
          case 'cottage':
            score += 3; // Example: cottage gives flat 3 points
            break;
          case 'chapel':
            score += 3; // Chapel 3 points (normally more if conditions, but simple here)
            break;
          case 'farm':
            score += 2; 
            break;
          case 'tavern':
            score += 4;
            break;
          case 'well':
            score += 1;
            break;
          case 'theater':
            score += 6;
            break;
          case 'factory':
            score += 5;
            break;
          case 'cathedral':
            score += 7;
            break;
          default:
            break;
        }
      }
    });
  
    return score;
  }
  
  export function getSkillLevel(score) {
    if (score >= 30) return 'Legendary Master';
    if (score >= 25) return 'Master';
    if (score >= 20) return 'Journeyman';
    if (score >= 15) return 'Apprentice';
    return 'Novice';
  }
  