const cells = document.querySelectorAll('.cell');
const resetButton = document.getElementById('reset');
const restartButton = document.getElementById('restart');
const themeToggle = document.getElementById('themeToggle');
const xScoreEl = document.getElementById('xScore');
const oScoreEl = document.getElementById('oScore');
const drawScoreEl = document.getElementById('drawScore');
const popup = document.getElementById('popup');
const popupMessage = document.getElementById('popupMessage');

let currentPlayer = 'X';
let gameBoard = ['', '', '', '', '', '', '', '', ''];
let xScore = 0, oScore = 0, draws = 0;
let gameActive = true;

const winConditions = [
  [0,1,2],[3,4,5],[6,7,8],
  [0,3,6],[1,4,7],[2,5,8],
  [0,4,8],[2,4,6]
];

function handleClick(index) {
  if (!gameActive || gameBoard[index] !== '') return;

  gameBoard[index] = currentPlayer;
  cells[index].textContent = currentPlayer;
  cells[index].classList.add(currentPlayer.toLowerCase());

  if (checkWin()) {
    gameActive = false;
    highlightWin();
    updateScore(currentPlayer);
    showPopup(`${currentPlayer} Wins!`);
    return;
  }

  if (gameBoard.every(cell => cell !== '')) {
    gameActive = false;
    draws++;
    drawScoreEl.textContent = draws;
    showPopup("It's a Draw!");
    return;
  }

  currentPlayer = currentPlayer === 'X' ? 'O' : 'X';

  if (getMode() === 'ai' && currentPlayer === 'O') {
    setTimeout(aiMove, 500);
  }
}

function checkWin() {
  return winConditions.some(([a,b,c]) => {
    return gameBoard[a] && gameBoard[a] === gameBoard[b] && gameBoard[a] === gameBoard[c];
  });
}

function highlightWin() {
  winConditions.forEach(([a,b,c]) => {
    if (gameBoard[a] && gameBoard[a] === gameBoard[b] && gameBoard[a] === gameBoard[c]) {
      cells[a].classList.add('win');
      cells[b].classList.add('win');
      cells[c].classList.add('win');
    }
  });
}

function updateScore(player) {
  if (player === 'X') {
    xScore++;
    xScoreEl.textContent = xScore;
  } else {
    oScore++;
    oScoreEl.textContent = oScore;
  }
}

function resetGame() {
  gameBoard = ['', '', '', '', '', '', '', '', ''];
  currentPlayer = 'X';
  gameActive = true;
  cells.forEach(cell => {
    cell.textContent = '';
    cell.classList.remove('x','o','win');
  });
}

function restartScores() {
  xScore = 0; oScore = 0; draws = 0;
  xScoreEl.textContent = 0;
  oScoreEl.textContent = 0;
  drawScoreEl.textContent = 0;
  resetGame();
}

function showPopup(message) {
  popupMessage.textContent = message;
  popup.classList.add('active');
}

function closePopup() {
  popup.classList.remove('active');
  resetGame();
}

function getMode() {
  return document.querySelector('input[name="mode"]:checked').value;
}

function aiMove() {
  let available = gameBoard.map((v,i) => v === '' ? i : null).filter(v => v !== null);
  let move = available[Math.floor(Math.random() * available.length)];
  handleClick(move);
}

/* 🎨 Theme Toggle */
themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark');
  themeToggle.textContent = document.body.classList.contains('dark') 
    ? "☀️ Light Mode" 
    : "🌙 Dark Mode";
});

cells.forEach((cell, index) => {
  cell.addEventListener('click', () => handleClick(index));
});

resetButton.addEventListener('click', resetGame);
restartButton.addEventListener('click', restartScores);
