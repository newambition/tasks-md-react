// src/utils/confetti.js
import confetti from "canvas-confetti";

// Get the canvas element (ensure it exists in your public/index.html or App.js)
// We'll add the canvas element in App.js
let confettiCanvas = null;
let myConfetti = null;

export function initializeConfetti() {
  if (!confettiCanvas) {
    confettiCanvas = document.getElementById("confetti-canvas");
    if (confettiCanvas) {
      myConfetti = confetti.create(confettiCanvas, {
        resize: true,
        useWorker: true,
      });
      console.log("Confetti initialized.");
    } else {
      console.error("Confetti canvas element not found!");
    }
  }
}

export function triggerConfetti() {
  if (!myConfetti) {
    console.warn("Confetti not initialized yet.");
    initializeConfetti(); // Attempt to initialize again
    if (!myConfetti) return; // Exit if still not initialized
  }

  myConfetti({
    particleCount: 120,
    spread: 80,
    colors: ["#00aeef", "#ff6b6b", "#ffd166", "#06d6a0"],
    origin: { y: 0.7 },
    gravity: 0.9,
  });
}
