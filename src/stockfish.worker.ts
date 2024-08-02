/// <reference lib="webworker" />

// Import the Stockfish script
importScripts('assets/stockfish/stockfish.js');

// Initialize the Stockfish engine
const stockfish = new Worker('assets/stockfish/stockfish.js');

addEventListener('message', (event) => {
  stockfish.postMessage(event.data);
});

stockfish.onmessage = function (event) {
  postMessage(event.data);
};
