import { useEffect, useState } from 'react';
import { getSkillLevel } from './scoring';
import { saveGame } from './logic';

export default function EndScreen() {
  const storedGrid = localStorage.getItem('finalGrid');
  const grid = storedGrid ? JSON.parse(storedGrid) : Array(16).fill({ resource: null });
  const startTime = localStorage.getItem('startTime');
  const endTime = localStorage.getItem('endTime');
  const score = Number(localStorage.getItem('score')) || 0;
  const skillLevel = getSkillLevel(score);
  const achievements = JSON.parse(localStorage.getItem('achievements') || "[]");

  const [highestScore, setHighestScore] = useState(0);
  const [newHighScore, setNewHighScore] = useState(false);

  useEffect(() => {
    const waitForUserAndUpload = async () => {
      let retries = 20;
      let user = firebase.auth().currentUser;
    
      // Wait until Firebase Auth is ready
      while (!user && retries-- > 0) {
        await new Promise(res => setTimeout(res, 100));
        user = firebase.auth().currentUser;
      }
    
      console.log("current user (after wait):", user);
    
      if (!user) {
        console.warn("No Firebase user found. Not saving.");
        return;
      }
    
      try {
        const idToken = await user.getIdToken();
        await saveGame(grid, score, skillLevel, achievements, idToken);
    
        await firebase.firestore().collection('users').doc(user.uid).set(
          {
            playedGames: firebase.firestore.FieldValue.increment(1),
            achievements: firebase.firestore.FieldValue.arrayUnion(...achievements),
          },
          { merge: true }
        );
    
        // Fetch high score
        const gamesSnapshot = await firebase.firestore()
          .collection('games')
          .where('uid', '==', user.uid)
          .get();
    
        let maxScore = 0;
        gamesSnapshot.forEach(doc => {
          const game = doc.data();
          if (typeof game.score === 'number' && game.score > maxScore) {
            maxScore = game.score;
          }
        });
    
        setHighestScore(maxScore);
        if (score >= maxScore) {
          setNewHighScore(true);
        }
    
      } catch (err) {
        console.error("Failed to save game or update user stats:", err);
      }
    };    

    waitForUserAndUpload();
  }, []);

  return (
    <div className="min-h-screen bg-[#fef9f3] text-[#3b2f2f] flex flex-col items-center py-10 px-4 font-sans">
      <h1 className="text-3xl font-bold mb-6">Game Summary</h1>

      <div className="mb-6 text-lg">
        <p><strong>Start Time:</strong> {startTime ? new Date(startTime).toLocaleString() : 'N/A'}</p>
        <p><strong>End Time:</strong> {endTime ? new Date(endTime).toLocaleString() : 'N/A'}</p>
        <p><strong>Score:</strong> {score}</p>
        <p className={`font-semibold ${newHighScore ? 'text-green-600 text-xl animate-bounce' : ''}`}>
          <strong>Highest Score:</strong> {highestScore}
          {newHighScore && (
            <span className="ml-2 bg-green-200 text-green-800 px-2 py-1 rounded font-bold text-sm">
              🎉 New High Score!
            </span>
          )}
        </p>
        <p><strong>Skill Level:</strong> {skillLevel}</p>
      </div>

      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-4">Achievements Unlocked:</h2>
        {achievements.length > 0 ? (
          <ul className="list-disc list-inside">
            {achievements.map((ach, idx) => (
              <li key={idx} className="text-lg">{ach}</li>
            ))}
          </ul>
        ) : (
          <p className="text-lg">No achievements unlocked this time.</p>
        )}
      </div>

      {/* Grid Preview */}
      <div className="flex justify-center mb-6">
        <div className="grid grid-cols-4 gap-2 bg-[#79a85c] p-4 rounded-xl shadow-inner">
          {grid.map((cell, idx) => (
            <div
              key={idx}
              className="w-16 h-16 flex items-center justify-center rounded bg-[#d2b48c] text-sm font-semibold text-center"
            >
              {cell.resource || ''}
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="mt-8 flex flex-row justify-center gap-4">
  <button
    onClick={() => {
      localStorage.removeItem('finalGrid');
      localStorage.removeItem('startTime');
      localStorage.removeItem('endTime');
      localStorage.removeItem('score');
      localStorage.removeItem('achievements');
      window.location.href = '/';
    }}
    className="bg-[#5c4430] hover:bg-[#3e2d22] text-white py-2 px-6 rounded-md font-semibold"
  >
    Back to Game
  </button>

  <button
    onClick={() => window.location.href = '/profile.html'}
    className="bg-[#5c4430] hover:bg-[#3e2d22] text-white py-2 px-6 rounded-md font-semibold"
  >
    Profile
  </button>

  <button
    onClick={() => window.location.href = '/leaderboard.html'}
    className="bg-[#5c4430] hover:bg-[#3e2d22] text-white py-2 px-6 rounded-md font-semibold"
  >
    Leaderboard
  </button>
</div>

    </div>
  );
}
