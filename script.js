const listOfAllDice = document.querySelectorAll(".die");
const scoreInputs = document.querySelectorAll("#score-options input");
const scoreSpans = document.querySelectorAll("#score-options span");
const currentRound = document.getElementById("current-round");
const currentRoundRolls = document.getElementById("current-round-rolls");
const totalScore = document.getElementById("total-score");
const scoreHistory = document.getElementById("score-history");
const rollDiceBtn = document.getElementById("roll-dice-btn");
const keepScoreBtn = document.getElementById("keep-score-btn");
const rulesContainer = document.querySelector(".rules-container");
const rulesBtn = document.getElementById("rules-btn");

let diceValuesArr = [];
let isModalShowing = false;
let score = 0;
let total = 0;
let round = 1; 
let rolls = 0; 

const rollDice = () => {
  diceValuesArr = [];

  for (let i = 0; i < 5; i++) {
    const randomDice = Math.floor(Math.random() * 6) + 1;
    diceValuesArr.push(randomDice);
  };

  listOfAllDice.forEach((dice, index) => {
    dice.textContent = diceValuesArr[index];
  });
};

const updateStats = () => {
  currentRoundRolls.textContent = rolls;
  currentRound.textContent = round;
};

const updateRadioOption = (index, score) => {
  scoreInputs[index].disabled = false;
  scoreInputs[index].value = score;
  scoreSpans[index].textContent = `, score = ${score}`;
};

const updateScore = (selectedValue, achieved) => {
  score += parseInt(selectedValue);
  totalScore.textContent = score;

  scoreHistory.innerHTML += `<li>${achieved} : ${selectedValue}</li>`;
};

const getHighestDuplicates = (arr) => {
  const counts = {};

  for (const num of arr) {
    if (counts[num]) {
      counts[num]++;
    } else {
      counts[num] = 1;
    }
  }

  let highestCount = 0;

  for (const num of arr) {
    const count = counts[num];
    if (count >= 3 && count > highestCount) {
      highestCount = count;
    }
    if (count >= 4 && count > highestCount) {
      highestCount = count;
    }
  }

  const sumOfAllDice = arr.reduce((a, b) => a + b, 0);

  if (highestCount >= 4) {
    updateRadioOption(1, sumOfAllDice);
  }

  if (highestCount >= 3) {
    updateRadioOption(0, sumOfAllDice);
  }

  updateRadioOption(5, 0);
};

const detectFullHouse = (arr) => {
  const counts = {};
  for (const num of arr) {
    counts[num] = (counts[num] || 0) + 1;
  }

  const values = Object.values(counts);
  if (values.includes(3) && values.includes(2)) {
    updateRadioOption(2, 25); // Full House is worth 25 points
  } else {
    updateRadioOption(5, 0); // If not, update the last radio button with 0 points
  }
};

const checkForStraights = (arr) => {
  const sortedArr = [...new Set(arr)].sort((a, b) => a - b);

  const isSmallStraight = 
    (sortedArr.includes(1) && sortedArr.includes(2) && sortedArr.includes(3) && sortedArr.includes(4)) ||
    (sortedArr.includes(2) && sortedArr.includes(3) && sortedArr.includes(4) && sortedArr.includes(5)) ||
    (sortedArr.includes(3) && sortedArr.includes(4) && sortedArr.includes(5) && sortedArr.includes(6));

  const isLargeStraight = 
    (sortedArr.includes(1) && sortedArr.includes(2) && sortedArr.includes(3) && sortedArr.includes(4) && sortedArr.includes(5)) ||
    (sortedArr.includes(2) && sortedArr.includes(3) && sortedArr.includes(4) && sortedArr.includes(5) && sortedArr.includes(6));

  if (isLargeStraight) {
    updateRadioOption(4, 40); // Large Straight is worth 40 points
    updateRadioOption(3, 30); // Also update the fourth radio button with 30 points
  } else if (isSmallStraight) {
    updateRadioOption(3, 30); // Small Straight is worth 30 points
  } else {
    updateRadioOption(5, 0); // If not, update the last radio button with 0 points
  }
};

const resetRadioOptions = () => {
  scoreInputs.forEach((input) => {
    input.disabled = true;
    input.checked = false;
  });

  scoreSpans.forEach((span) => {
    span.textContent = "";
  });
};

const resetGame = () => {
  diceValuesArr = [0, 0, 0, 0, 0];
  score = 0;
  round = 1;
  rolls = 0;

  listOfAllDice.forEach((dice, index) => {
    dice.textContent = diceValuesArr[index];
  });

  totalScore.textContent = score;
  scoreHistory.innerHTML = "";

  currentRoundRolls.textContent = rolls;
  currentRound.textContent = round;

  resetRadioOptions();
};

rollDiceBtn.addEventListener("click", () => {
  if (rolls === 3) {
    alert("You have made three rolls this round. Please select a score.");
  } else {
    rolls++;
    resetRadioOptions();
    rollDice();
    updateStats();
    getHighestDuplicates(diceValuesArr);
    detectFullHouse(diceValuesArr);
    checkForStraights(diceValuesArr); // Call checkForStraights when the dice are rolled
  }
});

rulesBtn.addEventListener("click", () => {
  isModalShowing = !isModalShowing;

  if (isModalShowing) {
    rulesBtn.textContent = "Hide rules";
    rulesContainer.style.display = "block";
  } else {
    rulesBtn.textContent = "Show rules";
    rulesContainer.style.display = "none";
  }
});

keepScoreBtn.addEventListener("click", () => {
  let selectedValue;
  let achieved;

  for (const radioButton of scoreInputs) {
    if (radioButton.checked) {
      selectedValue = radioButton.value;
      achieved = radioButton.id;
      break;
    }
  }

  if (selectedValue) {
    rolls = 0;
    round++;
    updateStats();
    resetRadioOptions();
    updateScore(selectedValue, achieved);
    if (round > 6) {
      setTimeout(() => {
        alert(`Game Over! Your total score is ${score}`);
        resetGame();
      }, 500);
    }
  } else {
    alert("Please select an option or roll the dice.");
  }
});
