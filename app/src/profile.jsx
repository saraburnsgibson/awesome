import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import './tinytowns.css';

function Profile() {
  const [playedGames, setPlayedGames] = useState(null);
  const [userAchievements, setUserAchievements] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUserData = async (user) => {
    try {
      const uid = user?.uid;
      if (!uid) return;

      const doc = await firebase.firestore().collection('users').doc(uid).get();
      if (doc.exists) {
        const data = doc.data();
        console.log("Firestore raw achievements:", data.achievements); // ✅ Debug
        setPlayedGames(data.playedGames || 0);
        const achievements = Array.isArray(data.achievements)
          ? data.achievements
          : data.achievements
          ? [data.achievements]
          : [];
        setUserAchievements(achievements);
      }
    } catch (err) {
      console.error("Error fetching user profile:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const waitForAuth = async () => {
      let retries = 20;
      while (!window.firebaseAuth?.currentUser && retries-- > 0) {
        await new Promise(res => setTimeout(res, 100));
      }

      const user = window.firebaseAuth?.currentUser;
      if (user) {
        fetchUserData(user);
      } else {
        console.warn("No user found after waiting.");
        setLoading(false);
      }
    };

    waitForAuth();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl text-[#3b2f2f]">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fef9f3] text-[#3b2f2f] flex flex-col items-center justify-start py-10 px-4 font-sans gap-6">
      <h1 className="text-3xl font-bold">Your Profile</h1>

      <p className="text-lg">
        <strong>Games Played:</strong> {playedGames}
      </p>

      {userAchievements.length > 0 ? (
        <div className="w-full max-w-md bg-[#d2b48c] p-6 rounded-xl shadow-inner">
          <h2 className="text-2xl font-bold mb-4 text-center">Achievements</h2>
          <ul className="space-y-3">
            {userAchievements.map((ach, idx) => (
              <li
                key={idx}
                className="flex items-center gap-3 bg-green-100 text-green-800 px-4 py-2 rounded-md shadow font-semibold text-sm"
              >
                ✅ {ach}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p className="text-md italic text-gray-600">No achievements earned yet.</p>
      )}

      <button
        onClick={() => (window.location.href = '/end.html')}
        className="mt-6 bg-[#5c4430] hover:bg-[#3e2d22] text-white py-2 px-6 rounded-md font-semibold"
      >
        Back to Summary
      </button>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('app'));
root.render(<Profile />);
export default Profile;
