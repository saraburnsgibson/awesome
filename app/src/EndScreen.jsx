import { getSkillLevel } from './scoring';

export default function EndScreen() {
  const storedGrid = localStorage.getItem('finalGrid');
  const grid = storedGrid ? JSON.parse(storedGrid) : Array(16).fill({ resource: null });
  const startTime = localStorage.getItem('startTime');
  const endTime = localStorage.getItem('endTime');
  const score = Number(localStorage.getItem('score')) || 0;
  const skillLevel = getSkillLevel(score);
  const achievements = JSON.parse(localStorage.getItem('achievements') || "[]");

  return (
    <div className="min-h-screen bg-[#fef9f3] text-[#3b2f2f] flex flex-col items-center py-10 px-4 font-sans">
      <h1 className="text-3xl font-bold mb-6">Game Summary</h1>

      <div className="mb-6 text-lg">
        <p><strong>Start Time:</strong> {startTime ? new Date(startTime).toLocaleString() : 'N/A'}</p>
        <p><strong>End Time:</strong> {endTime ? new Date(endTime).toLocaleString() : 'N/A'}</p>
        <p><strong>Score:</strong> {score}</p>
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

      <button
        onClick={() => {
          localStorage.removeItem('finalGrid');
          localStorage.removeItem('startTime');
          localStorage.removeItem('endTime');
          localStorage.removeItem('score');
          localStorage.removeItem('achievements');
          window.location.href = '/';
        }}
        className="mt-8 bg-[#5c4430] hover:bg-[#3e2d22] text-white py-2 px-6 rounded-md font-semibold"
      >
        Back to Game
      </button>
    </div>
  );
}
