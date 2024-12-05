const questionsARR = [
    {
      question: "А когда с человеком может произойти дрожемент?",
      answers: [
        { text: "Когда он влюбляется", correct: false },
        { text: "Когда он идет шопиться", correct: false },
        { text: "Когда он слышит смешную шутку", correct: false },
        { text: "Когда он боится, пугается", correct: true }
      ],
      explanation: "Лексема «дрожемент» имплицирует состояние крайнего напряжения и страха."
    },
    {
        question: "Говорят, Антон заовнил всех. Это еще как понимать?",
        answers: [
          { text: "Нет ничего плохого в том, что Антон тщательно выбирает себе друзей", correct: false },
          { text: "Молодец, Антон, всех победил!", correct: true },
          { text: "Антон очень надоедливый и въедливый человек, всех задолбал", correct: false },
          { text: "Как так, заовнил? Ну и хамло. Кто с ним теперь дружить-то будет?", correct: false }
        ],
        explanation: "Термин «заовнить» заимствован из английского языка, он происходит от слова own и переводится как «победить», «завладеть», «получить»."
      },
      {
        question: "Фразу «заскамить мамонта» как понимать?",
        answers: [
          { text: "Разозлить кого-то из родителей", correct: false },
          { text: "Увлекаться археологией", correct: false },
          { text: "Развести недотепу на деньги", correct: true },
          { text: "Оскорбить пожилого человека", correct: false }
        ],
        explanation: "Заскамить мамонта — значит обмануть или развести на деньги. Почему мамонта? Потому что мошенники часто выбирают в жертвы пожилых людей (древних, как мамонты), которых легко обвести вокруг пальца"
      },
      {
        question: "Кто такие бефефе",
        answers: [
          { text: "Вши?", correct: false },
          { text: "Милые котики, такие милые, что бефефе", correct: false },
          { text: "Люди, которые не держат слово", correct: false },
          { text: "Лучшие друзья", correct: true }
        ],
        explanation: "Бефефе — это лучшие друзья. Этакая аббревиатура от английского выражения best friends forever."
      }
];

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
  }
}
// Функция для случайной перестановки вопросов и их ответов
function randomize(questions) {

  const randomized = [];

  for (const question of questions) {
      const randomizedQuestion = { ...question }; // Копируем объект вопроса
      shuffleArray(randomizedQuestion.answers); // Перемешиваем варианты ответов
      randomized.push(randomizedQuestion); // Добавляем перемешанный вопрос в новый массив
  }

  // Перемешиваем сам массив вопросов
  shuffleArray(randomized);

  return randomized;
}



const questions = randomize(questionsARR);

let correctAnswersCount = 0;
let index = 0; //номер вопроса

function start(){
    
    index++;

    document.getElementById("btn").disabled = true;

    if (index > questions.length) {

        const resultContainer = document.getElementById("result");
        resultContainer.textContent = `Вопросы закончились. Правильно отвечено на ${correctAnswersCount} из ${index-1} вопросов.`
        resultContainer.classList.remove("hidden");


        // const quest1 = document.getElementById("question-list1");
        // if(quest1.classList.contains("active")){
        //   alert();
        // }

        return;
    }
    else{

      const questionContainer = document.getElementById("container");

      const newQuestionDiv = document.createElement("div");
      newQuestionDiv.classList.add("question-list" + index);        
      // вывод текста вопроса
      newQuestionDiv.textContent = `${index}. ` + questions[index-1].question;
      document.getElementById("container").appendChild(newQuestionDiv);

      const newAnsDiv = document.createElement("div");
      newAnsDiv.classList.add("ans-options"); 
      newAnsDiv.innerHTML = "";

      const question = questions[index-1];
      question.answers.forEach(answer => {
        const optionDiv = document.createElement("div");
        optionDiv.classList.add("answer-option");
        optionDiv.textContent = answer.text;
        optionDiv.addEventListener("click", () => selectAnswer(optionDiv, answer));
        newAnsDiv.appendChild(optionDiv);
      });

      questionContainer.appendChild(newAnsDiv);
    }

}

function selectAnswer(optionDiv, ans){

  document.querySelectorAll(".answer-option").forEach(option => option.style.pointerEvents = "none");
  const questionDiv = document.querySelector(".question-list" + index); 
  // span для иконки
  const iconSpan = document.createElement("span");
  iconSpan.style.marginLeft = "10px";

  const explanationDiv = document.createElement("div");
  explanationDiv.classList.add("explanation");

  if(ans.correct){
    optionDiv.classList.add("correct"); 
    iconSpan.textContent = "✔️";
    correctAnswersCount ++;

    // убрать все неверные ответы
    setTimeout(() => {
      document.querySelectorAll(".answer-option:not(.correct)").forEach(option => option.classList.add("move-right"));
    }, 500); 

    // убрать верный
    setTimeout(() => {
      document.querySelectorAll(".answer-option.correct").forEach(option => option.classList.add("move-right"));
    }, 2000); 

    explanationDiv.textContent = "Правильно! " + questions[index - 1].explanation;

    // кнопка
    setTimeout(() => {
      const element = document.querySelector(".ans-options");
      element.remove();    
      document.getElementById("btn").disabled = false;
    }, 3000); 

  } else {

    optionDiv.classList.add("incorrect"); 
    iconSpan.textContent = "❌";

    // убрать все ответы
    setTimeout(() => {
      document.querySelectorAll(".answer-option").forEach(option => option.classList.add("move-right"));
    }, 500); 

    // кнопка
    setTimeout(() => {
      const element = document.querySelector(".ans-options");
      element.remove();    
      document.getElementById("btn").disabled = false;
    }, 1000); 
  }
  
  questionDiv.appendChild(iconSpan);
  optionDiv.appendChild(explanationDiv);


}

