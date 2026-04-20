let startBtn = document.querySelector(".startButton");
let infoBox = document.querySelector(".infoBox");
let exitBtn = document.querySelector(".exitbtn");
let continueBtn = document.querySelector(".continuebtn");
let quizBox = document.querySelector(".quiz-box");
let questionText = document.querySelector(".questionText");
let allOptions = document.querySelectorAll(".options");
let nextBtn = document.querySelector(".nextBtn");
let timeline = document.querySelector(".timeline");
let currentQuestionIndicator = document.querySelector(
  ".currentQuestionIndicator",
);
let progressBar = document.querySelector(".progressBar");
let timeLineTitle = document.querySelector(".time-line-title");
let replayQuiz = document.querySelector(".replay_Quiz");
let quitQuiz = document.querySelector(".quit_Quiz");
let resultBox = document.querySelector(".result-box");
let scoreText = document.querySelector(".score_text");

let userScore = 0;
let currentQuestionIndex = 0;
let timeLineInterval = null;
let progressBarInterval = null;

const tickIcon = `<div class="icon tick"><i class="fa-solid fa-check"></i></div>`;
const crossIcon = `<div class="icon cross"><i class="fa-solid fa-xmark"></i></div>`;

startBtn.addEventListener("click", () => {
  // We have to inject a class name to info box
  infoBox.classList.add("activeInfoBox");
});

exitBtn.addEventListener("click", () => {
  infoBox.classList.remove("activeInfoBox");
});

continueBtn.addEventListener("click", () => {
  infoBox.classList.remove("activeInfoBox");
  quizBox.classList.add("activeQuizBox");
  showQuestion(currentQuestionIndex);
  handleTiming(15);
  handleProgressBar();
  timeLineTitle.innerText = "Time Left";
});

nextBtn.addEventListener("click", () => {
  if (currentQuestionIndex < questions.length - 1) {
    handleTiming(15);
    handleProgressBar();
    showQuestion(++currentQuestionIndex);
    nextBtn.classList.remove("active");
    timeLineTitle.innerText = "Time Left";
  } else {
    clearInterval(progressBarInterval);
    clearInterval(timeLineInterval);
    quizBox.classList.remove("activeQuizBox");
    resultBox.classList.add("activeResultBox");
    handleShowResults();
  }
});

quitQuiz.addEventListener("click", () => {
  restart();
  resultBox.classList.remove("activeResultBox");
});

replayQuiz.addEventListener("click", () => {
  restart();
  resultBox.classList.remove("activeResultBox");
  quizBox.classList.add("activeQuizBox");
  showQuestion(currentQuestionIndex);
  handleTiming(15);
  handleProgressBar();
  timeLineTitle.innerText = "Time Left";
});

const showQuestion = (index) => {
  questionText.innerText =
    "" + questions?.[index].numb + ". " + questions?.[index].question;
  for (let i = 0; i < allOptions.length; i++) {
    allOptions[i].classList.remove("correct", "incorrect", "disabled");
    allOptions[i].innerText = questions?.[index].options?.[i];
    // if (index == 0) {
    //   allOptions[i]?.addEventListener("click", optionClickHandler);
    // }
    allOptions[i].onclick = optionClickHandler;
  }
  currentQuestionIndicator.innerText = index + 1;
};

const handleTiming = (time) => {
  clearInterval(timeLineInterval);
  timeline.innerText = time;
  let timeValue = time;
  timeLineInterval = setInterval(() => {
    timeValue--;
    if (timeValue < 10) {
      timeline.innerText = "0" + timeValue;
    } else {
      timeline.innerText = timeValue;
    }
    if (timeValue === 0) {
      timeLineTitle.innerText = "Time Off";
      clearInterval(timeLineInterval);
      nextBtn.classList.add("active");
      const correctAnswer = questions[currentQuestionIndex].answer;
      for (let i = 0; i < allOptions.length; i++) {
        allOptions[i].classList.add("disabled");
        if (allOptions[i].innerText === correctAnswer) {
          allOptions[i].classList.add("correct");
          allOptions[i].insertAdjacentHTML("beforeend", tickIcon);
        }
      }
    }
  }, 1000);
};

const handleProgressBar = () => {
  clearInterval(progressBarInterval);
  progressBar.style.width = "0%";
  let currentPercentage = 0;
  progressBarInterval = setInterval(() => {
    currentPercentage += 1 / 15;
    progressBar.style.width = currentPercentage + "%";
    if (currentPercentage >= 100) {
      clearInterval(progressBarInterval);
    }
  }, 10);
};

const optionClickHandler = (e) => {
  clearInterval(timeLineInterval);
  clearInterval(progressBarInterval);
  nextBtn.classList.add("active");
  const userAnswer = e.target.innerText;
  const correctAnswer = questions[currentQuestionIndex].answer;

  if (userAnswer === correctAnswer) {
    userScore++;
    e.target.classList.add("correct");
    e.target.insertAdjacentHTML("beforeend", tickIcon);
    for (let i = 0; i < allOptions.length; i++) {
      allOptions[i].classList.add("disabled");
    }
  } else {
    //wrong answer
    //mark user response as wrong
    //traverse and find correct answer
    //and then mark it as correct
    e.target.classList.add("incorrect");
    e.target.insertAdjacentHTML("beforeend", crossIcon);

    for (let i = 0; i < allOptions.length; i++) {
      if (
        userAnswer !== correctAnswer &&
        allOptions[i].innerText === correctAnswer
      ) {
        allOptions[i].classList.add("correct");
        allOptions[i].insertAdjacentHTML("beforeend", tickIcon);
      }
      allOptions[i].classList.add("disabled");
    }
  }
};

const restart = () => {
  clearInterval(progressBarInterval);
  clearInterval(timeLineInterval);
  userScore = 0;
  currentQuestionIndex = 0;
  timeLineTitle.innerText = "Time Left";
  nextBtn.classList.remove("active");
};

const handleShowResults = () => {
  scoreText.innerHTML = `<span
          >and nice 😎, You got
          <p>${userScore}</p>
          out of
          <p>${questions?.length}</p></span
        >`;
};
