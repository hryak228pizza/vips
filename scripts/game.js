document.addEventListener('DOMContentLoaded', () => {

    const lamps = document.querySelectorAll('.lamp');
    const startButton = document.getElementById('start-game');
    const playerButton = document.getElementById('start-player-game');
    const timerDisplay = document.getElementById('timer-display');
    const outtimerDisplay = document.getElementById('outtimer-display');
    //
    const authSection = document.getElementById('auth-section');
    const gameSection = document.getElementById('game-section');
    const leaderboardBody = document.getElementById('leaderboard-body');
    const usernameInput = document.getElementById('username');
    const authButton = document.getElementById('start-auth');

    let sequence = [];
    let playerSequence = [];
    let currentIndex = 0;
    let activationTimes = []; // Время зажигания лампочек
    let timerStart = 0; // Начало отсчета таймера
    let timerInterval = null; // Интервал обновления таймера
    let gameStartTime = null; //отсчет с 0 при начале игры (для ффиксации времени включения ламп)
    let playerTime = null; //отсчет с 0 при начале хода игрока (для ффиксации времени нажатия на лампы)
    let score = 0;
    //let timeRemaining = 30;
    let timeRemaining = Math.floor(Math.random() * (35 - 25 + 1)) + 25;

    // Вставляем сгенерированное число в элемент с id="time-limit"
    document.getElementById('time-limit').textContent = timeRemaining;

    //
    // let currentUser = null; // Имя текущего пользователя
    let leaderboard = []; // Массив для рейтинга игроков

    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) {
        alert('Вы не авторизованы!');
        window.location.href = 'auth.html';
        return;
    }

    // Обновление таймера
    // function updateTimer() {
    //     const currentTime = (Date.now() - timerStart) / 1000;
    //     timerDisplay.textContent = currentTime.toFixed(3);
    // }

    function updateTimer() {
        const currentTime = (Date.now() - timerStart) / 1000;
        timeRemaining -= 0.01; // Уменьшаем время каждую десятую долю секунды
        if (timeRemaining <= 0) {
            clearInterval(timerInterval);
            alert('Время вышло! Игра окончена.');
            resetGame();
        }
        timerDisplay.textContent = currentTime.toFixed(3);
        // outtimerDisplay.textContent = timeRemaining.toFixed(2);
    }


    // Вспомогательная функция для зажигания лампочки
    function activateLamp(lamp, delay) {
        setTimeout(() => {
            const activationTime = (Date.now() - gameStartTime ) ;
            lamp.classList.add('active');
            activationTimes.push({ lampId: lamp.id, time: activationTime });
            setTimeout(() => lamp.classList.remove('active'), 1000); // Лампочка горит 1 сек
            console.log(lamp.id, activationTime);
        }, delay);
    }
    
    // Запуск игры
    startButton.addEventListener('click', () => {
        gameStartTime = Date.now();
        sequence = [];
        playerSequence = [];
        currentIndex = 0;
        activationTimes = [];
        clearInterval(timerInterval);
        timerDisplay.textContent = "0.000";
        startButton.disabled = true;
        playerButton.disabled = true;

        // Запуск таймера
        timerStart = Date.now();
        //timeRemaining = 30;
        timeRemaining = Math.floor(Math.random() * (35 - 25 + 1)) + 25;
        timerInterval = setInterval(updateTimer, 10);

        // Случайное зажигание лампочек
        let delay = 0;
        for (let i = 0; i < lamps.length; i++) {
            const randomLamp = lamps[Math.floor(Math.random() * lamps.length)];
            sequence.push(randomLamp.id);
            activateLamp(randomLamp, (delay += Math.random() * 2000 + 1000));
        }

        // Активировать кнопку "Сделать ход" после последней лампочки
        setTimeout(() => {
            playerButton.disabled = false;
        }, delay + 1000);
    });

    // Начало хода игрока
    playerButton.addEventListener('click', () => {
        playerTime = Date.now();
        lamps.forEach(lamp => lamp.addEventListener('click', handleLampClick));
        playerButton.disabled = true; // Блокируем кнопку, чтобы игрок мог делать только один ход

        // Сброс таймера для хода игрока
        clearInterval(timerInterval); // Останавливаем текущий таймер
        timerStart = Date.now(); // Перезапускаем с текущего момента
        timerDisplay.textContent = "0.000"; // Обнуляем отображение
        timerInterval = setInterval(updateTimer, 10); // Перезапускаем обновление таймера
    });

    // Обработка клика игрока
    function handleLampClick(event) {
        const clickedLamp = event.target;

        // Проверка, что clickedLamp существует
        if (clickedLamp && clickedLamp.classList) {
            const clickTime = Date.now() - playerTime;

            // Включаем лампочку на 1 секунду при клике
            clickedLamp.classList.add('active');
            setTimeout(() => clickedLamp.classList.remove('active'), 1000);

            if (clickedLamp.id === sequence[currentIndex]) {
                playerSequence.push({ lampId: clickedLamp.id, time: clickTime });
                const expectedTime = activationTimes[currentIndex].time; //время активации лампочки, по которой кликнули
                const reactionTime = Math.abs(expectedTime  - clickTime);
                score += reactionTime / 10;

                console.log(`Лампочка: ${clickedLamp.id}, time: ${clickTime}, diff: ${reactionTime} мс, lamp: ${expectedTime} мс`);

                currentIndex++;
                if (currentIndex === sequence.length) {
                    clearInterval(timerInterval);
                    alert(`Вы победили! Score:${score}`);

                    const leaderboard = JSON.parse(localStorage.getItem('leaderboard') || '[]');
                    leaderboard.push({ username: currentUser, time: score });
                    localStorage.setItem('leaderboard', JSON.stringify(leaderboard));

                    window.location.href = 'course2.html';

                    resetGame();
                }
            } else {
                clearInterval(timerInterval);
                alert('Неправильно! Попробуйте снова.');
                resetGame();
            }
        }
    }

    // Сброс игры
    function resetGame() {
        lamps.forEach(lamp => lamp.removeEventListener('click', handleLampClick));
        startButton.disabled = false;
        playerButton.disabled = true;
        clearInterval(timerInterval);
        timerDisplay.textContent = "0.000"; // Сброс таймера
    }
});
