import React from 'react';
import './tinytowns.css';
import { BuildingStore } from './BuildingStore';
import { TownGrid } from './TownGrid';
import { ResourceSelector } from './ResourceSelector';

export function App() {
  return (
    <div className="scaling-container">
      {/* Top Row: Building Selection */}
      <div className="buildings">
        <BuildingStore />
      </div>

      {/* Main Game Area */}
      <div className="game-area">
        {/* Game Board */}
        <TownGrid />

        {/* Right Column: Resource Deck, Score, Leaderboard */}
        <div className="bottom-cards">
          <ResourceSelector />

          <div className="scoreboard">
            <div className="section-title">Your Score</div>
            <div>__</div>
          </div>

          <div className="scoreboard">
            <div className="section-title">Leaderboard</div>
            <div className="resource-icon brick" />
            <div className="resource-icon wheat" />
            <div className="resource-icon glass" />
          </div>
        </div>
      </div>
    </div>
  );
}
