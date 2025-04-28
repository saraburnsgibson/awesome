import React, { useEffect } from 'react';
import './tinytowns.css';
import { BuildingStore } from './BuildingStore';
import { TownGrid } from './TownGrid';
import { ResourceSelector } from './ResourceSelector';
import { useTownStore } from './store';
import { calculateScore } from './scoring';

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
      {/* Greeting and Logout */}
      <div className="w-full max-w-7xl flex justify-between items-center text-2xl font-bold mb-4 px-2">
        <div>
          Hi, <span id="user-name" className="text-[#fcd997]"></span>
        </div>
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

      {/* Game Layout */}
      <div className="w-full max-w-7xl flex flex-col gap-6">
        {/* Building Cards */}
        <section className="p-2 rounded-xl flex flex-wrap justify-center gap-4 bg-transparent">
          <BuildingStore />
        </section>

        {/* Game Area */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Grid */}
          <div className="bg-[#79a85c] px-4 py-2 rounded-xl shadow-inner inline-block">
            <TownGrid />
          </div>

          {/* Sidebar */}
          <div className="w-full lg:w-1/3 flex flex-col gap-4">
            <div className="bg-[#d2b48c] text-[#3b2f2f] rounded-xl p-4">
              <h2 className="text-lg font-bold mb-2">Resources</h2>
              <ResourceSelector />
            </div>

            <div className="bg-[#d2b48c] text-[#3b2f2f] rounded-xl p-4 text-center">
              <h2 className="text-lg font-bold mb-2">Your Score</h2>
              <div className="text-2xl font-black">__</div>
            </div>

            <div className="bg-[#d2b48c] text-[#3b2f2f] rounded-xl p-4 text-center">
              <h2 className="text-lg font-bold mb-2">Leaderboard</h2>
              <div className="flex justify-center gap-2 mt-2">
                <div className="resource-icon brick" />
                <div className="resource-icon wheat" />
                <div className="resource-icon glass" />
              </div>
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
                  const grid = useTownStore.getState().grid;
                  const score = calculateScore(grid);
                  localStorage.setItem('finalGrid', JSON.stringify(grid));
                  localStorage.setItem('startTime', startTime);
                  localStorage.setItem('score', score);
                  const currentEnd = new Date().toISOString();
                  localStorage.setItem('endTime', currentEnd);
                  setEndTime();
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
  );
}
