import React from 'react';
import { useTownStore, resourceColors } from './store';

export function ResourceSelector() {
  const { deck, selectedResource, setSelectedResource } = useTownStore((state) => ({
    deck: state.deck,
    selectedResource: state.selectedResource,
    setSelectedResource: state.setSelectedResource,
  }));

  // Only show the top three cards.
  const visibleCards = deck.slice(0, 3);

  return (
    <div className="flex justify-center mb-4">
      {visibleCards.map((resource, index) => (
        <button
          key={index}
          onClick={() => setSelectedResource(resource, index)}
          className={`px-3 py-2 m-1 ${selectedResource && selectedResource.deckIndex === index ? 'border-4' : 'border-2'}`}
          style={{ backgroundColor: "lightgray", border: `2px solid ${resourceColors[resource]}` }}
        >
          {resource}
        </button>
      ))}
    </div>
  );
}
