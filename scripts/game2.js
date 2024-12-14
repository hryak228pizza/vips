document.addEventListener('DOMContentLoaded', () => {


const ball = document.querySelector('.ball');
const placeholder = document.querySelector('path');
ballRect = ball.getBoundingClientRect();
// const finishZone = document.querySelector('.finish-zone');
const body = document.body;
const currentUser = localStorage.getItem('currentUser');
const windowInnerWidth = document.documentElement.clientWidth;

///
console.log(document.querySelector('path'));

let timerStart = 0; // Начало отсчета таймера
let timerInterval = null; // Интервал обновления таймера
const timerDisplay = document.getElementById('timer-display');
let score = 0;
let timeRemaining = 30;

ball.addEventListener('dragstart', dragStart);
ball.addEventListener('dragend', dragEnd);

placeholder.addEventListener('dragover', dragOver);
placeholder.addEventListener('dragenter', dragEnter);
placeholder.addEventListener('dragleave', dragLeave);
placeholder.addEventListener('drop', dragDrop);

console.log(placeholder.getPointAtLength(0));
// ball.style.top = placeholder.getPointAtLength(0).y;
ball.style.top = `${placeholder.getPointAtLength(0).y + 230}px`
ball.style.left = `${placeholder.getPointAtLength(0).x}px`
console.log(ball.getBoundingClientRect());
console.log(ball.getBoundingClientRect().y);

// function updateTimer() {
//     const currentTime = (Date.now() - timerStart) / 1000;
//     timerDisplay.textContent = currentTime.toFixed(3);
// }
function updateTimer() {
    const currentTime = (Date.now() - timerStart) / 1000;
    timeRemaining -= 0.01; // Уменьшаем время каждую десятую долю секунды
    if (timeRemaining <= 0) {
        body.style.backgroundColor = 'red';
        clearInterval(timerInterval);
        // alert('Время вышло! Игра окончена.');
        // resetGame();
        // event.target.classList.remove('hovered');
        // console.log('game ended');

        // alert('вы проиграли! Попробуйте снова.');
        
        setTimeout(() => {
            body.style.backgroundColor = '';
            clearInterval(timerInterval);  
            resetGame();  
        }, 1000); 
    }
    timerDisplay.textContent = currentTime.toFixed(3);
    // outtimerDisplay.textContent = timeRemaining.toFixed(2);
}

function dragStart(event){
    console.log(placeholder.x);

    clearInterval(timerInterval);
    timerDisplay.textContent = "0.000";

    // Запуск таймера
    timerStart = Date.now();
    timeRemaining = 30;
    timerInterval = setInterval(updateTimer, 10);

    event.target.classList.add('hold');
    setTimeout(() => event.target.classList.add('hide') , 0);
    
}

function dragEnd(){
    event.target.classList.remove('hold', 'hide');
}

function dragOver(event){
    event.preventDefault();
}

function dragEnter(event){
    event.target.classList.add('hovered');
    console.log('game started');
}

function dragLeave(event){

//     var draggedElement = event.target;  // Элемент, который был перетащен
//   draggedElement.remove(); 



    event.target.classList.remove('hovered');
    console.log('game ended');

    // alert('вы проиграли! Попробуйте снова.');
    body.style.backgroundColor = 'red';
    setTimeout(() => {
        body.style.backgroundColor = '';
        clearInterval(timerInterval);  
    resetGame();  
    }, 1000); 

    
}

function dragDrop(event){
    console.log(document.documentElement.clientWidth);
    console.log(event.clientX);

    if(document.documentElement.clientWidth - event.clientX <= 30){
        score = (Date.now() - timerStart) /100;
        console.log(score);

        event.target.classList.remove('hovered');
        // event.target.append(ball);
        console.log('you win');

        clearInterval(timerInterval);
        alert(`Вы победили! Score:${score}`);
        // resetGame();

        const leaderboard = JSON.parse(localStorage.getItem('leaderboard') || '[]');

        // Ищем пользователя в рейтинге
        let userFound = false;
        for (let i = 0; i < leaderboard.length; i++) {
            if (leaderboard[i].username === currentUser) {
                leaderboard[i].time += score;
            userFound = true;
            break;
            }
        }

        localStorage.setItem('leaderboard', JSON.stringify(leaderboard));

        window.location.href = 'course3.html';
    }
    else{
        clearInterval(timerInterval);
    timerDisplay.textContent = "0.000"; // Сброс таймера
    }

    


    // const ballRect = ball.getBoundingClientRect();

    // console.log(document.documentElement.clientWidth);
    // console.log(ballRect.right);
    // if(document.documentElement.clientWidth - ballRect.right <= 30){
    //     alert('win');
    // }
}


function resetGame() {
    
    clearInterval(timerInterval);
    timerDisplay.textContent = "0.000"; // Сброс таймера


    location.reload();
}

// function releaseMouseButton() {
//     // Создаем событие mouseup
//     const mouseUpEvent = new MouseEvent('mouseup', {
//         bubbles: true, // Событие должно пузыриться, чтобы оно сработало на документе
//         cancelable: true
//     });

//     // Диспатчим событие mouseup на документ
//     document.dispatchEvent(mouseUpEvent);
//     console.log('Mouse button released programmatically');
// }

});