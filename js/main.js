import GameObj from "./game.js";
const Game = new GameObj();

// Dom Elements
const p1Msg = document.getElementById("p1msg");
const cpMsg = document.getElementById("cpmsg");
const playAgainEl = document.getElementById("play-again");
const p1Imgs = document.querySelectorAll(
  ".playerboard .gameboard .gameboard__square img"
);

const initApp = () => {
  initAllTimeData();
  updateScoreboard();
  listenForPlayerChoice();
  listenForEnterKey();
  listenForPlayAgain();
  lockTheGameBoardHeight();
  document.querySelector("h1").focus();
};

document.addEventListener("DOMContentLoaded", initApp);

const initAllTimeData = () => {
  Game.setP1AllTime(parseInt(localStorage.getItem("p1AllTime") || 0));
  Game.setCpAllTime(parseInt(localStorage.getItem("cpAllTime") || 0));
};

const updateScoreboard = () => {
  const p1Ats = handleElement(
    "p1_all_time_score",
    Game.getP1AllTime(),
    `Play one has ${Game.getP1AllTime()} all time wins.`
  );

  const p1Ss = handleElement(
    "p1_session_score",
    Game.getP1Session(),
    `Player one has ${Game.getP1Session()} wins this session`
  );

  const cpAts = handleElement(
    "cp_all_time_score",
    Game.getCpAllTime(),
    `Computer has ${Game.getCpAllTime()} all time wins.`
  );

  const cpSs = handleElement(
    "cp_session_score",
    Game.getCpSession(),
    `Computer has ${Game.getCpSession()} wins this session`
  );

  return [p1Ats, p1Ss, cpAts, cpSs];
};

const listenForPlayerChoice = () => {
  p1Imgs.forEach((img) => {
    img.addEventListener("click", (e) => {
      if (Game.getActiveState()) return;
      Game.startGame();
      const playerChoice = e.target.parentElement.id;
      updatePlayerMsg(playerChoice);
      p1Imgs.forEach((img) => {
        if (img === e.target) {
          img.parentElement.classList.add("selected", "unclickable");
        } else {
          img.parentElement.classList.add("not-selected");
        }
      });
      computerAnimationSequence(playerChoice);
    });
  });
};

const listenForEnterKey = () => {
  addEventListener("keydown", (e) => {
    if (e.key === "Enter" && e.target.tagName === "IMG") e.target.click();
  });
};

const listenForPlayAgain = () => {
  document.querySelector("form").addEventListener("submit", (e) => {
    e.preventDefault();
    resetScoreboard();
  });
};

const lockTheGameBoardHeight = () => {
  const cpGameBoard = document.querySelector(".computerboard #cp-gameboard");
  const cpGBStyle = getComputedStyle(cpGameBoard);
  const height = cpGBStyle.getPropertyValue("height");
  cpGameBoard.style.minHeight = height;
};

const updatePlayerMsg = (playerChoice) => {
  p1Msg.textContent = `you choose ${playerChoice}!`;
};

const computerAnimationSequence = (playerChoice) => {
  setTimeout(() => computerChoiceAnimation("cp-rock", 1), 1000);
  setTimeout(() => computerChoiceAnimation("cp-paper", 2), 1500);
  setTimeout(() => computerChoiceAnimation("cp-scissors", 3), 2000);
  setTimeout(() => countDownFade(), 2750);
  setTimeout(() => {
    deleteCountDown();
    finishGameFlow(playerChoice);
  }, 2750);
  setTimeout(() => AskingForPlayingAgain(), 3750);
};

const computerChoiceAnimation = (elId, num) => {
  const element = document.getElementById(elId);
  element.firstElementChild.remove();
  const p = document.createElement("p");
  p.textContent = num;
  element.appendChild(p);
};

const countDownFade = () => {
  const countDownEl = document.querySelectorAll(
    ".computerboard .gameboard__square p"
  );
  countDownEl.forEach((el) => {
    el.classList.add("fadeOut");
  });
};

const deleteCountDown = () => {
  const countDownEl = document.querySelectorAll(
    ".computerboard .gameboard__square p"
  );
  countDownEl.forEach((el) => {
    el.remove();
  });
};

const AskingForPlayingAgain = () => {
  playAgainEl.classList.toggle("d-none");
  playAgainEl.focus();
};

const resetScoreboard = () => {
  p1Imgs.forEach((img) => {
    img.parentElement.classList.remove(
      "selected",
      "not-selected",
      "unclickable"
    );
  });
  const gameSquares = document.querySelectorAll(".gameboard div");
  gameSquares.forEach((square) => {
    square.classList.add("gameboard__square");
  });
  const cpSquares = document.querySelectorAll(
    ".computerboard .gameboard__square"
  );
  cpSquares.forEach((square) => {
    if (square.firstElementChild) square.firstElementChild.remove();
    if (square.id === "cp-rock") createGameImg("rock", square);
    if (square.id === "cp-paper") createGameImg("paper", square);
    if (square.id === "cp-scissors") createGameImg("scissors", square);
  });
  p1Msg.textContent = "player one chooses...";
  cpMsg.textContent = "computer chooses...";
  playAgainEl.ariaLabel = "PLayer one chooses";
  p1Msg.focus();
  playAgainEl.classList.toggle("d-none");
  Game.endGame();
};

const finishGameFlow = (playerChoice) => {
  const cpChoice = getCpChoice();
  const winner = determineWinner(playerChoice, cpChoice);
  const actionMsg = buildActionMsg(winner, playerChoice, cpChoice);
  displayActionMsg(actionMsg);
  updateAriaResult(actionMsg, winner);
  updateScoreState(winner);
  updatePersistentData(winner);
  updateScoreboard();
  updateWinnerMsg(winner);
  displayCpChoice(cpChoice);
};

const getCpChoice = () => {
  const ranNum = Math.floor(Math.random() * 3);
  const rpsArray = ["rock", "paper", "scissors"];
  return rpsArray[ranNum];
};

const determineWinner = (player, computer) => {
  if (player === computer) return "Tie";
  if (
    (player === "rock" && computer === "paper") ||
    (player === "paper" && computer === "scissors") ||
    (player === "scissors" && computer === "rock")
  )
    return "Computer";
  return "Player";
};

const buildActionMsg = (winner, playerChoice, cpChoice) => {
  if (winner === "Tie") return "Tie game!";
  if (winner === "Computer") {
    const action = getAction(cpChoice);
    return `${cpChoice} ${action} ${playerChoice}.`;
  } else {
    const action = getAction(playerChoice);
    return `${playerChoice} ${action} ${cpChoice}.`;
  }
};

const getAction = (choice) => {
  return choice === "rock" ? "smashes" : choice === "paper" ? "wraps" : "cuts";
};

const displayActionMsg = (actionMsg) => {
  cpMsg.textContent = actionMsg;
};

const updateAriaResult = (result, winner) => {
  const winMsg =
    winner === "Player"
      ? "Congratulations, you are the winner."
      : winner === "Computer"
      ? "The computer is the winner"
      : "";
  playAgainEl.ariaLabel = `${result} ${winMsg} click or press enter to play again.`;
};

const updateScoreState = (winner) => {
  if (winner === "Tie") return;
  winner === "Computer" ? Game.cpWins() : Game.p1Wins();
};

const updatePersistentData = (winner) => {
  const store = winner === "Computer" ? "cpAllTime" : "p1AllTime";
  const score =
    winner === "Computer" ? Game.getCpAllTime() : Game.getP1AllTime();
  localStorage.setItem(store, score);
};

const updateWinnerMsg = (winner) => {
  if (winner === "Tie") return;
  const msg =
    winner === "Computer" ? "🖥️ Computer Wins! 🖥️" : "🏆🔥 You win! 🔥🏆";
  p1Msg.textContent = msg;
};

const displayCpChoice = (choice) => {
  const square = document.getElementById("cp-paper");
  createGameImg(choice, square);
};

const createGameImg = (icon, appendToElement) => {
  const img = document.createElement("img");
  img.src = `imgs/${icon}.png`;
  img.alt = icon;
  appendToElement.appendChild(img);
};

const handleElement = (elId, elTxt, elAriaL) => {
  const getEle = document.getElementById(elId);
  getEle.textContent = elTxt;
  getEle.ariaLabel = elAriaL;
  return getEle;
};
