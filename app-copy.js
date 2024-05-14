let game = [];
setUpNextTurn();
console.log(game);

//Select color game buttons
const greenButton = document.querySelector("#sgvGreen");
const redButton = document.querySelector("#sgvRed");
const yellowButton = document.querySelector("#sgvYellow");
const blueButton = document.querySelector("#sgvBlue");

// Select control buttons
const startBtn = document.querySelector("#startBtn");
const userTurnBtn = document.querySelector("#userTurnBtn");
// const speedSelect = document.querySelector("#speedSelect");

// Select level counter
const levelCounter = document.querySelector("#levelCounter");

// Create button object to store also color parameters
let buttons = [
  {
    button: greenButton,
    downColor: "#afe2af",
    upColor: "#00BB00",
    color: "green",
  },
  {
    button: redButton,
    downColor: "#ffabab",
    upColor: "#BB0000",
    color: "red",
  },
  {
    button: yellowButton,
    downColor: "#fff1c8",
    upColor: "#FCCA3A",
    color: "yellow",
  },
  {
    button: blueButton,
    downColor: "#50bcff",
    upColor: "#0000BB",
    color: "blue",
  },
];

// Array of just the svg class
let buttonElements = buttons.map((buttonObj) => buttonObj.button);

// Function to click button events
function handleClickEvents(button, downColor, upColor, color) {
  button.addEventListener("mousedown", function () {
    this.querySelector("path").setAttribute("fill", downColor);
    this.querySelector("path").style.transition = "fill 0.1s ease";
  });
  button.addEventListener("mouseup", function () {
    this.querySelector("path").setAttribute("fill", upColor);
    this.querySelector("path").style.transition = "fill 0.1s ease";
  });
  button.addEventListener("click", function () {
    playSound(color);
  });
}

// Function to play different sounds depending on the color
function playSound(color) {
  let audio = document.querySelector(`audio[data-sound="${color}"]`);
  audio.play();
}

// Function to turn lights on automatically depending on the random game generation
function autoColorEvents(button, downColor, upColor, color) {
  button.querySelector("path").setAttribute("fill", upColor);
  button.querySelector("path").style.transition = "fill 0.1s ease";
  setTimeout(function () {
    button.querySelector("path").setAttribute("fill", downColor);
    button.querySelector("path").style.transition = "fill 0.1s ease";
  }, 250);
  playSound(color);
}

//START BUTTON
startBtn.addEventListener("click", startOver);

function startOver() {
  game = [];
  clicksDone = [];
  setUpNextTurn();
  runGame();
}

// RUN THE GAME BUTTON
function runGame() {
  let remainingToSwitchOn = [...game];
  console.log(remainingToSwitchOn);
  function switchNext() {
    if (remainingToSwitchOn.length) {
      //It takes the first value of remaining, then the second, the third...
      let btnNumber = remainingToSwitchOn.shift();
      let button = buttons[btnNumber - 1];
      autoColorEvents(
        button.button,
        button.upColor,
        button.downColor,
        button.color
      );
    } else {
      clearInterval(timer);
    }
  }
  let timer = setInterval(switchNext, 1000);
}

//DEBUGGING BUTTON, simulate next level button
function getRandomInt() {
  return Math.floor(Math.random() * 4) + 1;
}
function setUpNextTurn() {
  game.push(getRandomInt());
  // document.querySelector("#current-game").innerText = game.join("-");
  document.querySelector("#levelCounter").innerText = game.length;
}

//USER'S TURN BUTTON
userTurnBtn.addEventListener("click", userTurn);

function userTurn() {
  let clicksDone = [];
  function buttonClicked(event) {
    // Check which button has been clicked
    let number = buttonElements.indexOf(event.currentTarget) + 1;
    clicksDone.push(number);
    if (game.length === clicksDone.length) {
      if (game.toString() === clicksDone.toString()) {
        console.log("user won");
        setUpNextTurn();
        runGame();
        //It should iniciate the next level
      } else {
        stopListening();
      }
    } else {
      let initial = game.slice(0, clicksDone.length);
      if (initial.toString() === clicksDone.toString()) {
        // The user has not lost yet, keeps clicking
        console.log("keep playing");
      } else {
        // The user lost
        console.log("Oh you lost, insert coin for another game");
        stopListening();
      }
    }
  }
  for (let buttonObj of buttons) {
    handleClickEvents(
      buttonObj.button,
      buttonObj.downColor,
      buttonObj.upColor,
      buttonObj.color
    );
  }
  for (let button of buttonElements) {
    button.addEventListener("click", buttonClicked);
  }
  function stopListening() {
    for (let button of buttonElements) {
      button.removeEventListener("click", buttonClicked);
    }
  }
}
