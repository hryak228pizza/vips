document.addEventListener('DOMContentLoaded', () => {
    const trajectories = [
        document.querySelector('.trajectory1'),
        document.querySelector('.trajectory2'),
        document.querySelector('.trajectory3')
    ];
    
    const randomIndex = Math.floor(Math.random() * trajectories.length);
    const selectedTrajectory = trajectories[randomIndex];

    trajectories.forEach(svg => {
        svg.style.display = svg === selectedTrajectory ? 'block' : 'none';
    });
    
    const ball = document.querySelector('.ball');
    //const placeholder = document.querySelector('path');
    const body = document.body;
    const currentUser = localStorage.getItem('currentUser');
    const timerDisplay = document.getElementById('timer-display');

    //const path = document.getElementById('trajectory');
    const path = selectedTrajectory.querySelector('path');

    let timerStart = 0;
    let timerInterval = null;
    let score = 0;
    //let timeRemaining = 30;
    let timeRemaining = Math.floor(Math.random() * (35 - 25 + 1)) + 25;

    // Вставляем сгенерированное число в элемент с id="time-limit"
    document.getElementById('time-limit').textContent = timeRemaining;

    // Функция для позиционирования шарика
    function positionBall() {
        if (!path) return;

        const startPoint = path.getPointAtLength(0);
        const pathRect = path.getBoundingClientRect();
        const ballRect = ball.getBoundingClientRect();

        // Вычисляем корректные координаты относительно окна
        const adjustedX = startPoint.x + pathRect.left - ballRect.width / 2;
        const adjustedY = startPoint.y + pathRect.top - ballRect.height / 2;

        ball.style.left = `${adjustedX}px`;
        ball.style.top = `${adjustedY-10}px`;
    }

    window.addEventListener('resize', () => {
        setTimeout(positionBall, 100); // Добавляем небольшую задержку для корректного пересчета размеров
    });
    
    // Изначально позиционируем шарик
    positionBall();

    // Обновляем позицию шарика при изменении размера окна
    window.addEventListener('resize', positionBall);

    ball.addEventListener('dragstart', dragStart);
    ball.addEventListener('dragend', dragEnd);
    // placeholder.addEventListener('dragover', dragOver);
    // placeholder.addEventListener('dragenter', dragEnter);
    // placeholder.addEventListener('dragleave', dragLeave);
    // placeholder.addEventListener('drop', dragDrop);
    path.addEventListener('dragover', dragOver);
    path.addEventListener('dragenter', dragEnter);
    path.addEventListener('dragleave', dragLeave);
    path.addEventListener('drop', dragDrop);

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
        console.log(ball.getBoundingClientRect()); // Проверка координат

        clearInterval(timerInterval);
        timerDisplay.textContent = "0.000";
        timerStart = Date.now();
        timeRemaining = 30;
        timerInterval = setInterval(updateTimer, 10);

        event.target.classList.add('hold');
        //setTimeout(() => event.target.classList.add('hide'), 0);
    }

    function dragEnd(event) {
        event.target.classList.remove('hold', 'hide');
    }

    function dragOver(event) {
        event.preventDefault();
    }

    function dragEnter(event) {
        event.target.classList.add('hovered');
        //console.log(event.clientX);
    }

    // function dragLeave(event) {
    //     event.target.classList.remove('hovered');
    //     body.style.backgroundColor = 'red';
    //     setTimeout(() => {
    //         body.style.backgroundColor = '';
    //         resetGame();
    //     }, 1000);
    // }

    function dragLeave(event) {
        event.target.classList.remove('hovered');
        
        const ballRect = ball.getBoundingClientRect();
        const pathRect = path.getBoundingClientRect();
    
        // Проверяем, выходит ли шарик за правую границу траектории
        const isWinningExit = event.clientX >= pathRect.right;
        console.log("event.clientX  "   + event.clientX);
        console.log("pathRect.x  " + pathRect.right);
        console.log("isWinningExit  " + isWinningExit);
        
        if (isWinningExit) {
            clearInterval(timerInterval);
            body.style.backgroundColor = 'green';

            score = (Date.now() - timerStart) / 1000;
            //alert(`Вы победили! Ваш результат: ${score.toFixed(3)} секунд`);
            const victoryMessageElement = document.getElementById('victory-message');
            victoryMessageElement.style.display = 'block';
            timerDisplay.style.display = 'none';
            const timer = document.querySelector('.timer');
            timer.style.display = 'none';


            // Добавляем сообщение о победе
            victoryMessageElement.innerHTML = `Вы победили! Ваш результат: ${score.toFixed(3)} секунд`;
    
            // Обновляем таблицу рекордов
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
    
            // Переход на следующий экран
            setTimeout(() => {
                window.location.href = 'course3.html';
            }, 3000);
        } else {

            const ballRect = ball.getBoundingClientRect();
            const pathRect = path.getBoundingClientRect();
            //console.log(ballRect.right);
            //console.log(pathRect.right);

            // Если шарик выходит за границу в любом другом месте → проигрыш
            body.style.backgroundColor = 'red';
            setTimeout(() => {
                body.style.backgroundColor = '';
                resetGame();
            }, 1000);
        }
    }
    

    function dragDrop(event) {
        //const ballRect = ball.getBoundingClientRect();
        //const placeholderRect = placeholder.getBoundingClientRect();

        const placeholderRect = path.getBoundingClientRect();
        const ballRect = ball.getBoundingClientRect();

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
