//making constants and assigning them by id
const startCard = document.getElementById("start-card");
const questionCard = document.getElementById("question-card");
const scoreCard = document.getElementById("score-card");
const leaderboardCard = document.getElementById("leaderboard-card");
//store questions here
const questions = [
  {
    question: "Which of the following is not a JavaScript data type?",
    choices: ["a. null", "b. undefined", "c. number", "d. all of the above"],
    answer: "d. all of the above",
  },
  {
    question: "Which of the following is correct about JavaScript?",
    choices: [
      "a. JavaScript is an Object-Based language",
      "b. JavaScript is an Assembly language",
      "c. JavaScript is an Object-Oriented language",
      "d. JavaScript is a High-Level language",
    ],
    answer: "a. JavaScript is an Object-Based language",
  },
  {
    question: "Arrays in JavaScript are defined by which statement?",
    choices: [
      "a. An ordered list of values",
      "b. An ordered list of objects",
      "c. An ordered list of strings",
      "d. An ordered list of functions",
    ],
    answer: "a. An ordered list of values",
  },
  {
    question: "Which of the following is not an error in JavaScript?",
    choices: [
      "a. Missing a bracket",
      "b. Division by zero",
      "c. Syntax error",
      "d. Missing semicolon",
    ],
    answer: "b. Division by zero",
  },
  {
    question: "What event occurs when the user clicks on an HTML element?",
    choices: ["a. onMouseClick", "b. onClick", "c. onMouseOver", "d. onChange"],
    answer: "a. onMouseClick",
  },
];

//this hides the cards
function hideCards() {
  startCard.setAttribute("hidden", true);
  questionCard.setAttribute("hidden", true);
  scoreCard.setAttribute("hidden", true);
  leaderboardCard.setAttribute("hidden", true);
}

const resultDiv = document.getElementById("result-div");
const resultText = document.getElementById("result-text");

//this will hide the results
function hideResult() {
  resultDiv.style.display = "none";
}
let intervalID;
let time;
let currentQuestion;

document.getElementById("start-button").addEventListener("click", startQuiz);

function startQuiz() {
  //hide any visible cards and show next
  hideCards();
  questionCard.removeAttribute("hidden");

  //Current question should be zero to follow JavaScript rules
  currentQuestion = 0;
  displayQuestion();

  //set total time based on number of questions
  time = questions.length * 15;

  //setting function "countdown" for 1000ms or 1 second
  intervalID = setInterval(countdown, 1000);

  //this will start the timer from the top
  displayTime();
}
//Timer function
function countdown() {
  time--;
  displayTime();
  if (time < 1) {
    endQuiz();
  }
}

//This will isplay time on page
const timeDisplay = document.getElementById("time");
function displayTime() {
  timeDisplay.textContent = time;
}

//This is the current question and choices
function displayQuestion() {
  let question = questions[currentQuestion];
  let choices = question.choices;

  let QuestionElement = document.getElementById("question-text");
  QuestionElement.textContent = question.question;

  for (let i = 0; i < choices.length; i++) {
    let choice = choices[i];
    let choiceButton = document.getElementById("choice" + i);
    choiceButton.textContent = choice;
  }
}

document.querySelector("#quiz-options").addEventListener("click", checkAnswer);

//This is to answer if choice picked is correct
function choiceIsCorrect(choiceButton) {
  return choiceButton.textContent === questions[currentQuestion].answer;
}

//if answer is incorrect, time is lost
function checkAnswer(eventObject) {
  let choiceButton = eventObject.target;
  resultDiv.style.display = "block";
  if (choiceIsCorrect(choiceButton)) {
    resultText.textContent = "Correct!";
    setTimeout(hideResult, 1000);
  } else {
    resultText.textContent = "Incorrect!";
    setTimeout(hideResult, 1000);
    if (time >= 10) {
      time = time - 10;
      displayTime();
    } else {
      //this displays time to zero

      time = 0;
      displayTime();
      endQuiz();
    }
  }

  //question count one by one
  currentQuestion++;
  //Quiz is over at end of question array
  if (currentQuestion < questions.length) {
    displayQuestion();
  } else {
    endQuiz();
  }
}

//displays the scoreboard
const score = document.getElementById("score");

function endQuiz() {
  clearInterval(intervalID);
  hideCards();
  scoreCard.removeAttribute("hidden");
  score.textContent = time;
}

const submitButton = document.getElementById("submit-button");
const inputElement = document.getElementById("initials");

//store user initials and score when submit button is clicked
submitButton.addEventListener("click", storeScore);

function storeScore(event) {
  //stops event from continuing
  event.preventDefault();

  //alert user to put in a value
  if (!inputElement.value) {
    alert("Please enter your initials before hitting submit!");
    return;
  }

  //stores high scores
  let leaderboardItem = {
    initials: inputElement.value,
    score: time,
  };

  updateStoredLeaderboard(leaderboardItem);

  hideCards();
  leaderboardCard.removeAttribute("hidden");

  renderLeaderboard();
}

//leaderboard is stored in local storage
function updateStoredLeaderboard(leaderboardItem) {
  var leaderboardArray = getLeaderboard();
  leaderboardArray.push(leaderboardItem);
  localStorage.setItem("leaderboardArray", JSON.stringify(leaderboardArray));
}

//
function getLeaderboard() {
  let storedLeaderboard = localStorage.getItem("leaderboardArray");
  if (storedLeaderboard || null) {
    let leaderboardArray = JSON.parse(storedLeaderboard);
    return leaderboardArray;
  } else {
    leaderboardArray = [];
  }
  return leaderboardArray;
}

//display leaderboard on leaderboard card
function renderLeaderboard() {
  let sortedLeaderboardArray = sortLeaderboard();
  const highscoreList = document.getElementById("highscore-list");
  highscoreList.innerHTML = "";
  for (let i = 0; i < sortedLeaderboardArray.length; i++) {
    let leaderboardEntry = sortedLeaderboardArray[i];
    let newListItem = document.createElement("li");
    newListItem.textContent =
      leaderboardEntry.initials + " - " + leaderboardEntry.score;
    highscoreList.append(newListItem);
  }
}

//sort leaderboard array from highest to lowest
function sortLeaderboard() {
  let leaderboardArray = getLeaderboard();
  if (!leaderboardArray) {
    return;
  }

  leaderboardArray.sort(function (a, b) {
    return b.score - a.score;
  });
  return leaderboardArray;
}

const clearButton = document.getElementById("clear-button");
clearButton.addEventListener("click", clearHighscores);

//clear local storage and the  leaderboard
function clearHighscores() {
  localStorage.clear();
  renderLeaderboard();
}

const backButton = document.getElementById("back-button");
backButton.addEventListener("click", returnToStart);

//back to start
function returnToStart() {
  hideCards();
  startCard.removeAttribute("hidden");
}

//use link to view the highscores
const leaderboardLink = document.getElementById("leaderboard-Link");
leaderboardLink.addEventListener("click", showLeaderboard);

function showLeaderboard() {
  hideCards();
  leaderboardCard.removeAttribute("hidden");

  //stops the countdown
  clearInterval(intervalID);

  //time is not displayed on screen
  time = undefined;
  displayTime();

  //display leaderboard
  renderLeaderboard();
}
