import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import './tinytowns.css';

function getMedal(index) {
  if (index === 0) return '🥇';
  if (index === 1) return '🥈';
  if (index === 2) return '🥉';
  return `${index + 1}.`;
}

function Leaderboard() {
  const [topScores, setTopScores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUserUID, setCurrentUserUID] = useState(null);
  const [showBanner, setShowBanner] = useState(false);

  //I hardcoded this in so we can show for demo 
  useEffect(() => {
    setShowBanner(true);
    setTimeout(() => setShowBanner(false), 2000);
  }, []);
  

  useEffect(() => {
    const initAndFetch = async () => {
      try {
        if (!firebase.apps?.length) {
          const res = await fetch('/firebaseConfig.json');
          const config = await res.json();
          firebase.initializeApp(config);
        }

        const user = firebase.auth().currentUser;
        setCurrentUserUID(user?.uid || '');

        const snapshot = await firebase.firestore()
          .collection('games')
          .orderBy('score', 'desc')
          .limit(10)
          .get();

        const scores = snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            name: data.name || 'Anonymous',
            score: data.score || 0,
            uid: data.uid || ''
          };
        });

        setTopScores(scores);

        // Show banner if top score belongs to current user
        if (scores.length > 0 && scores[0].uid === user?.uid) {
          setShowBanner(true);
          setTimeout(() => setShowBanner(false), 2000);
        }

      } catch (err) {
        console.error("Error loading leaderboard:", err);
      } finally {
        setLoading(false);
      }
    };

    initAndFetch();
  }, []);

  return (
    <div className="min-h-screen bg-[#fef9f3] text-[#3b2f2f] font-sans flex justify-center items-center px-4">
      <div className="w-full max-w-xl bg-[#f9e4c8] p-8 rounded-xl shadow-lg flex flex-col items-center gap-6 relative">

        {showBanner && (
          <div className="highscore-banner animate-fade-slide">
            🎉 New High Score! 🎉
          </div>
        )}

        <h1 className="text-3xl font-bold text-center">🏆 Leaderboard</h1>

        {loading ? (
          <p className="text-lg italic">Loading top scores...</p>
        ) : (
          <ul className="w-full space-y-2">
            {topScores.map((entry, idx) => (
              <li
                key={idx}
                className={`px-4 py-2 rounded text-lg flex justify-between items-center 
                  ${entry.uid === currentUserUID ? 'bg-green-100 font-bold text-green-900' : 'bg-white'}`}
              >
                <span>{getMedal(idx)} {entry.name}</span>
                <span>— {entry.score}</span>
              </li>
            ))}
          </ul>
        )}

        <div className="flex flex-wrap justify-center gap-4 pt-4">
          <button
            onClick={() => window.location.href = '/'}
            className="button-primary"
          >
            Back to Game
          </button>
          <button
            onClick={() => window.location.href = '/profile.html'}
            className="button-primary"
          >
            Back to Profile
          </button>
          <button
            onClick={() => window.location.href = '/end.html'}
            className="button-primary"
          >
            Back to Summary
          </button>
        </div>
      </div>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('app'));
root.render(<Leaderboard />);
