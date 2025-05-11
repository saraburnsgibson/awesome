export async function saveGame(grid, score, skillLevel, achievements, idToken) {
  const user = firebase.auth().currentUser;
  const name = user?.displayName || user?.email || "Anonymous";

  console.log("🔁 Saving game for:", name);


  await fetch("http://localhost:3000/save-game", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${idToken}`,
    },
    body: JSON.stringify({
      grid,
      score,
      skillLevel,
      achievements,
      timestamp: new Date().toISOString(),
      name,
    }),
  });
}
