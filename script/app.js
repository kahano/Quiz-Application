

const configContainer = document.querySelector(".config-container");
const quizContainer = document.querySelector(".quiz-container")
const answerOptions = document.querySelector(".answer-options")
const nextQuestionBtn = document.querySelector(".next-question-btn")
const questionStatus = document.querySelector(".question-status");
const timerDispaly = document.querySelector(".time-duration");
const resultContainer= document.querySelector(".result-container");
const resulMessage= document.querySelector(".result-message");
const tryAgainBtn= document.querySelector(".try-again-btn");
const startQuizBtn = document.querySelector(".start-quiz-btn");

let currentQuestion = null;
let quizCategory = "programming";
let numberOfQuestions = 5;
const questionsIndexHistory = [];
const Quiz_time_limit = 15;
let currentTime = Quiz_time_limit;
let timer = null;
let countRightAnswers = 0;

// count the right answers 

const showResultMessage = () =>{
  // if(highlightCorrectAnswer()){
  //   countRightAnswers++;
  // }
  resulMessage.innerHTML = `You answered <b>${countRightAnswers}</b>
        <b>Out of</b> <b>${numberOfQuestions}</b>
        questions correctly. Great effort!`
}
// show the result
const showQuizResult = () =>{
  quizContainer.style.display = "none";
  resultContainer.style.display = "block";
  showResultMessage();
  
}
// Reset the timer
const resetTimer = ()=>{
  clearInterval(timer);
  currentTime = Quiz_time_limit;
  timerDispaly.textContent = `${currentTime}s`;
}
// Intialize and start the timer for the current question
const startTimer = ()=>{
  timer = setInterval(()=>{
    currentTime--;
    timerDispaly.textContent = `${currentTime}s`;

    if(currentTime <= 5){
      quizContainer.querySelector(".quiz-timer").style.background = "#c31402";
      quizContainer.querySelector(".quiz-timer").style.animation = "spy-light 3s infinite linear";
    }

    if(currentTime<= 0){
      clearInterval(timer);
      highlightCorrectAnswer();
      nextQuestionBtn.style.visibility = "visible";
      answerOptions.querySelectorAll(".answer-option").forEach(opt => opt.style.pointerEvents = "none");   
    }

   
  },1000)
}
const getRandomQuestion=()=>{
    const categoryQuestions = questions.find(cat=> cat.category.toLowerCase()
      === quizCategory.toLowerCase()).questions || [];

      // show the result if all questions have been used
      if(questionsIndexHistory.length >= Math.min(categoryQuestions.length,numberOfQuestions)){
        return showQuizResult();
      }
      const availableQuestions = categoryQuestions.filter((_,index)=> !questionsIndexHistory.includes(index));

    const randomQuestion = availableQuestions[Math.floor(Math.random()*availableQuestions.length)]
    questionsIndexHistory.push(categoryQuestions.indexOf(randomQuestion));
    return randomQuestion;

}

//Highlight the correct answer option

const highlightCorrectAnswer = ()=>{
  // Ensure answerOptions and correctAnswer are valid
  if (!answerOptions) {
    console.error("answerOptions element is not defined.");
    return;
  }

  const answerElements = answerOptions.querySelectorAll(".answer-option");
  if (!answerElements || answerElements.length === 0) {
    console.error("No answer options found.");
    return;
  }

  // Check if the correctAnswer index is valid
  if (currentQuestion.correctAnswer < 0 || currentQuestion.correctAnswer >= answerElements.length) {
    console.error("Invalid correctAnswer index.");
    return;
  }
  const correctOption = answerElements[currentQuestion.correctAnswer];
  correctOption.classList.add("correct");
   // Add the check_circle icon, but prevent duplicate icons

    const iconHTML = `<span class="material-symbols-rounded"> check_circle </span>`;
    correctOption.insertAdjacentHTML("beforeend", iconHTML);
  
}

// Handle the user's answer  selection
const handleAnswer = (option,index)=>{
  clearInterval(timer);
  const isCorrect = currentQuestion.correctAnswer === index;
  if(isCorrect) countRightAnswers++;
  option.classList.add(isCorrect ? 'correct' : 'Incorrect')
  !isCorrect ? highlightCorrectAnswer() : "";
  // insert icon based on correctness
    // Insert the icon based on correctness
    const iconHTML = `
    <span class="material-symbols-rounded">
      ${isCorrect ? 'check_circle' : 'cancel'}
    </span>`;
    option.insertAdjacentHTML("beforeend",iconHTML);
  // Disable all answer options after one option is selected 
  answerOptions.querySelectorAll(".answer-option").forEach(opt => opt.style.pointerEvents = "none");
  nextQuestionBtn.style.visibility = "visible";
}

// Render the current question and it's options in the quiz
const renderQuestion= ()=>{
  currentQuestion= getRandomQuestion();
  if(!currentQuestion) return;

  resetTimer();
  startTimer();
 
  // update the UI
  answerOptions.innerHTML = "";
  nextQuestionBtn.style.visibility = "hidden";
  quizContainer.querySelector(".quiz-timer").style.background = "#32313c";
  document.querySelector('.quiz-question').textContent= currentQuestion.question;
  questionStatus.innerHTML = `<b>${questionsIndexHistory.length}</b> of <b>${numberOfQuestions}</b> Questions` ;

  // cerate option <li> and append them to answerOptions and add click event listeners
  currentQuestion.options.forEach((opt,index) => {
    const li = document.createElement("li");
    li.classList.add("answer-option");
    li.textContent = opt;
    answerOptions.appendChild(li);
    li.addEventListener("click",()=> handleAnswer(li,index))
  })
}

//  start quiz 

const startQuiz = ()=>{
  quizContainer.style.display = "block";
  configContainer.style.display = "none";

  quizCategory= configContainer.querySelector(".category-option.active").textContent;
  numberOfQuestions = parseInt(configContainer.querySelector(".question-option.active").textContent);

  renderQuestion();
}

// document.addEventListener("click", (event) => {
//   if (event.target.matches(".category-option, .question-option")) {
//     const option = event.target;
//     const activeElement = option.parentNode.querySelector(".active");
//     if (activeElement) {
//       activeElement.classList.remove("active");
//     }
//     option.classList.add("active");
//   }
// });

document.querySelectorAll(".category-option, .question-option").forEach(option =>
{
  option.addEventListener("click", () => {
    option.parentNode.querySelector(".active").classList.remove("active");
    option.classList.add("active");
  });
  

});
//  reset the container and return back to the config container
const resetQuiz = ()=>{
  resetTimer();
  countRightAnswers = 0;
  questionsIndexHistory.length = 0;
  configContainer.style.display = "block";
  resultContainer.style.display = "none";
}



nextQuestionBtn.addEventListener("click",
  renderQuestion
)

tryAgainBtn.addEventListener("click",resetQuiz);
startQuizBtn.addEventListener("click",startQuiz);