const delayTime = 2000; // wachttijd voor de volgende vraag
const myQuestion = document.getElementById('myQuestion');
const myAnswer = document.getElementById('myAnswer');
const quizWrapper = document.getElementById('quizWrapper');
const questionBox = document.getElementById('questionBox');
const resultBox = document.getElementById('resultBox');
const quizTitle = document.getElementById('quizTitle')

let quizJsonFile = "quiz1.json"; // het JSON bestand met de quizz


let counter = 0;
let quiz;
let playerData = {}; // object, hierin worden de game gegevens opgeslagen

function init(){
  // haal de data op met AJAX
  makeAjaxCall (quizJsonFile, "GET").then (handleReceivedData); // doe het! wacht op promise
  function handleReceivedData(jsonString){ // pak de data aan
    let quizString = jsonString;
    // console.log(quizString); // debug
    quiz = JSON.parse(quizString);
    console.log(quiz); // debug
    initQuiz(); // start de quiz
  }
}

function initQuiz(){
  // reset alle player game variabelen
  playerData.goodAnswers = 0;
  playerData.wrongAnswers = 0;
  playerName = ""; // toekomstige uitbreiding naam speler opvragen
  resultBox.style.display = "none"; // verberg de resultbox

  quizTitle.innerHTML = quiz.quizMetaData.title; 

  prepareQuestions(); // start de quiz
}

function prepareQuestions() {
  questionBox.className = "questionBox-new";
  let quizImage = quiz.quizMetaData.imageURI;
  quizWrapper.style.backgroundImage = "url("+ quizImage + ")";
  if (counter < quiz.quizContent.length) {
    myQuestion.innerHTML = quiz.quizContent[counter].question;
    myAnswer.innerHTML = "";
    for (let i = 0; i < quiz.quizContent[counter].answers.length; i++) {
      let answer = document.createElement('li');
      answer.className = "answer";
      answer.score = quiz.quizContent[counter].answers[i].feedback;
      answer.innerHTML = quiz.quizContent[counter].answers[i].answer;
      myAnswer.appendChild(answer);
      myAnswer.addEventListener('click', evaluate, true)
    }
  } else {
    finishQuiz();
    
  }
}

function evaluate(evt) {
  if (evt.target.score) {
    evt.target.className = "right";
    playerData.goodAnswers += 1; // increase good score
  } else {
    evt.target.className = "wrong";
    playerData.wrongAnswers += 1; // increase wrong score
  }
  counter++;
  questionBox.className = "questionBox";
  setTimeout(prepareQuestions, delayTime);
}

function finishQuiz() {
  questionBox.style.display = "none";
  resultBox.style.display = "block";
  quizWrapper.style.backgroundImage = ""; 
  quizWrapper.background = "silver"; 
  resultBox.innerHTML = "<h1>Your results:<br>correct answers: "+playerData. 
  goodAnswers + "<br>wrong answers " +  playerData.wrongAnswers + "</h1>"; 
}

init(); // start it
