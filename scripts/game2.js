document.addEventListener('DOMContentLoaded', () => {
    const ball = document.querySelector('.ball');
    const placeholder = document.querySelector('path');
    const body = document.body;
    const currentUser = localStorage.getItem('currentUser');
    const timerDisplay = document.getElementById('timer-display');
    const path = document.getElementById('trajectory');
    let timerStart = 0;
    let timerInterval = null;
    let score = 0;
    let timeRemaining = 30;

    // Функция для позиционирования шарика
    function positionBall() {
        const startPoint = path.getPointAtLength(0);
        const placeholderRect = placeholder.getBoundingClientRect();
        const adjustedX = startPoint.x + placeholderRect.left - ball.offsetWidth / 2;
        const adjustedY = startPoint.y + placeholderRect.top - ball.offsetHeight / 2;

        ball.style.left = `${adjustedX}px`;
        ball.style.top = `${adjustedY}px`;
    }

    // Изначально позиционируем шарик
    positionBall();

    // Обновляем позицию шарика при изменении размера окна
    window.addEventListener('resize', positionBall);

    ball.addEventListener('dragstart', dragStart);
    ball.addEventListener('dragend', dragEnd);
    placeholder.addEventListener('dragover', dragOver);
    placeholder.addEventListener('dragenter', dragEnter);
    placeholder.addEventListener('dragleave', dragLeave);
    placeholder.addEventListener('drop', dragDrop);

    function updateTimer() {
        const currentTime = (Date.now() - timerStart) / 1000;
        timeRemaining -= 0.01;
        if (timeRemaining <= 0) {
            body.style.backgroundColor = 'red';
            clearInterval(timerInterval);
            setTimeout(() => {
                body.style.backgroundColor = '';
                resetGame();
            }, 1000);
        }
        timerDisplay.textContent = currentTime.toFixed(3);
    }

    function dragStart(event) {
        clearInterval(timerInterval);
        timerDisplay.textContent = "0.000";
        timerStart = Date.now();
        timeRemaining = 30;
        timerInterval = setInterval(updateTimer, 10);

        event.target.classList.add('hold');
        setTimeout(() => event.target.classList.add('hide'), 0);
    }

    function dragEnd(event) {
        event.target.classList.remove('hold', 'hide');
    }

    function dragOver(event) {
        event.preventDefault();
    }

    function dragEnter(event) {
        event.target.classList.add('hovered');
    }

    function dragLeave(event) {
        event.target.classList.remove('hovered');
        body.style.backgroundColor = 'red';
        setTimeout(() => {
            body.style.backgroundColor = '';
            resetGame();
        }, 1000);
    }

    function dragDrop(event) {
        const ballRect = ball.getBoundingClientRect();
        const placeholderRect = placeholder.getBoundingClientRect();

        // Проверяем, достиг ли шарик правой границы контейнера с траекторией
        if (ballRect.right >= placeholderRect.right-30) {
            score = (Date.now() - timerStart) / 100;
            clearInterval(timerInterval);
            alert(`Вы победили! Score: ${score}`);

            const leaderboard = JSON.parse(localStorage.getItem('leaderboard') || '[]');
            let userFound = false;

            for (let i = 0; i < leaderboard.length; i++) {
                if (leaderboard[i].username === currentUser) {
                    leaderboard[i].time += score;
                    userFound = true;
                    break;
                }
            }

            if (!userFound) {
                leaderboard.push({ username: currentUser, time: score });
            }

            localStorage.setItem('leaderboard', JSON.stringify(leaderboard));
            window.location.href = 'course3.html';
        } else {
            clearInterval(timerInterval);
            timerDisplay.textContent = "0.000";
        }
    }

    function resetGame() {
        clearInterval(timerInterval);
        timerDisplay.textContent = "0.000";
        location.reload();
    }
});
