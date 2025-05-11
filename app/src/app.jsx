import React, { useEffect } from 'react';
import './tinytowns.css';
import { BuildingStore } from './BuildingStore';
import { TownGrid } from './TownGrid';
import { ResourceSelector } from './ResourceSelector';
import { useTownStore } from './store';
import { calculateScore } from './scoring';
import { detectAchievements } from './achievements';

export function App() {
  const grid = useTownStore(state => state.grid);
  const startTime = useTownStore(state => state.startTime);
  const setEndTime = useTownStore(state => state.setEndTime);

  useEffect(() => {
    const user = window.firebaseAuth?.currentUser;
    if (user) {
      const usernameSpan = document.getElementById("user-name");
      if (usernameSpan) {
        usernameSpan.textContent = user.displayName || user.email;
      }
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#6b4b3e] text-[#fdf4e3] flex flex-col items-center py-6 px-4 font-sans">
      
      {/* Logo */}
      <div className="flex flex-col items-center gap-4 mb-4">
        <img src="/textures/logo.png" alt="Tiny Towns Logo" className="w-36 md:w-48" />
      </div>

      {/* Greeting and Logout */}
      <div className="w-full max-w-7xl flex justify-between items-center text-2xl font-bold mb-4 px-2">
  <div>
    Hi, <span id="user-name" className="text-[#fcd997]"></span>
  </div>
  <div className="flex gap-2">
    <button
      onClick={() => window.location.href = '/profile.html'}
      className="bg-[#5c4430] hover:bg-[#3e2d22] text-[#fdf4e3] py-2 px-4 rounded-md font-semibold"
    >
      Profile
    </button>
    <button
      onClick={() => {
        window.firebaseAuth.signOut().then(() => {
          document.getElementById("app").style.display = "none";
          document.getElementById("login-form").style.display = "block";
        });
      }}
      className="bg-[#5c4430] hover:bg-[#3e2d22] text-[#fdf4e3] py-2 px-4 rounded-md font-semibold"
    >
      Logout
    </button>
  </div>
</div>


      {/* Game Layout */}
      <div className="w-full max-w-7xl flex flex-col gap-6">
        
        {/* Building Cards */}
        <section className="p-2 rounded-xl flex flex-wrap justify-center gap-4 bg-transparent">
          <BuildingStore />
        </section>

        {/* Game Area (centered row) */}
        <div className="flex justify-center">
          <div className="flex flex-col lg:flex-row gap-6 items-start">
            
            {/* Grid */}
            <div className="board-wrapper inline-block">
              <TownGrid />
            </div>

            {/* Sidebar */}
            <div className="w-full lg:w-auto flex flex-col gap-4">
              <div className="bg-[#d2b48c] text-[#3b2f2f] rounded-xl p-4">
                <h2 className="text-lg font-bold mb-2">Resources</h2>
                <ResourceSelector />
              </div>

              <div className="flex justify-between gap-4 mt-4">
                <button
                  onClick={() => window.location.reload()}
                  className="flex-1 bg-[#5c4430] text-[#fdf4e3] py-2 rounded-md font-semibold"
                >
                  Restart Game
                </button>

                <button
                  onClick={() => {
                    const originalGrid = useTownStore.getState().grid;

                    // Remove leftover resources (preserve only buildings)
                    const cleanedGrid = originalGrid.map(cell => {
                      const isBuilding = !['wheat', 'brick', 'glass', 'stone', 'wood'].includes(cell.resource);
                      return isBuilding ? cell : { ...cell, resource: null };
                    });

                    useTownStore.setState({ grid: cleanedGrid });

                    const score = calculateScore(cleanedGrid);
                    //const startTime = useTownStore(state => state.startTime);
                    const currentEnd = new Date().toISOString();
                    const achievements = detectAchievements(cleanedGrid, startTime, currentEnd, score);

                    localStorage.setItem('finalGrid', JSON.stringify(cleanedGrid));
                    localStorage.setItem('startTime', startTime);
                    localStorage.setItem('endTime', currentEnd);
                    localStorage.setItem('score', score);
                    localStorage.setItem('achievements', JSON.stringify(achievements));

                    useTownStore.getState().setEndTime();
                    window.location.href = '/end.html';
                  }}
                  className="flex-1 bg-[#a83232] text-[#fdf4e3] py-2 rounded-md font-semibold"
                >
                  End Game
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
