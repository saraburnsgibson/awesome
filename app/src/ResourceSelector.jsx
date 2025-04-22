import React from 'react';
import { useTownStore } from './store';

export function ResourceSelector() {
  const { deck, selectedResource, setSelectedResource } = useTownStore(state => ({
    deck: state.deck,
    selectedResource: state.selectedResource,
    setSelectedResource: state.setSelectedResource,
  }));

  return (
    <div className="flex gap-4 justify-center items-center">
      {deck.slice(0, 3).map((res, i) => (
        <div
          key={i}
          className={`building-card ${selectedResource?.deckIndex === i ? 'selected' : ''}`}
          onClick={() => setSelectedResource(res, i)}
        >
          <div className="resource-shape-container">
            <div className={`resource-square-card ${res}`} />
          </div>
        </div>
      ))}
    </div>
  );
}

