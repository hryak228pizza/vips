
const currentUser = localStorage.getItem('currentUser');

// Основная функция для создания лабиринта
(function initializeMaze(heightInput, widthInput, maze, walls, currentPosition) {
    // Установка фиксированных значений высоты и ширины
    const height = 31;
    const width = 31; 

    // Установка стилей для контейнера лабиринта
    const mazeContainer = document.getElementById('maze');
    mazeContainer.style.height = `${height * 10}px`;
    mazeContainer.style.width = `${width * 10}px`;

    // Создание сетки лабиринта
    for (let y = 0; y < height; y++) {
        maze[y] = [];
        for (let x = 0; x < width; x++) {
            maze[y][x] = 'wall';
            const block = document.createElement('div');
            block.className = 'block wall';
            block.id = `${y}-${x}`;
            mazeContainer.appendChild(block);
        }
    }

    // Функция для преобразования ячейки в часть лабиринта
    function carveMaze(y, x, addWalls = true) {
        maze[y][x] = 'maze';
        document.getElementById(`${y}-${x}`).className = 'block';

        if (addWalls) {
            addWall(y + 1, x, [y, x]);
            addWall(y - 1, x, [y, x]);
            addWall(y, x + 1, [y, x]);
            addWall(y, x - 1, [y, x]);
        }
    }

    //Проверка на тупик

    // Функция для проверки, находится ли ячейка в пределах лабиринта
    function isValid(y, x) {
        return y >= 0 && y < height && x >= 0 && x < width;
    }

    // Функция для добавления стены в массив walls
    function addWall(y, x, host) {
        if (isValid(y, x) && maze[y][x] === 'wall') {
            walls.push([y, x, host]);
        }
    }

    // Начальная позиция в лабиринте
    carveMaze(currentPosition[0], currentPosition[1], true);

    // Генерация лабиринта с использованием алгоритма "Прим"
    while (walls.length > 0) {
        const randomIndex = Math.floor(Math.random() * walls.length);
        const [wallY, wallX, host] = walls[randomIndex];
        const opposite = [
            host[0] + (wallY - host[0]) * 2,
            host[1] + (wallX - host[1]) * 2
        ];

        if (isValid(opposite[0], opposite[1]) && maze[opposite[0]][opposite[1]] !== 'maze') {
            carveMaze(wallY, wallX, false);
            carveMaze(opposite[0], opposite[1], true);
        }

        walls.splice(randomIndex, 1);
    }

    // Установка начальной и конечной точек лабиринта
    document.getElementById('0-0').className = 'block me';
    document.getElementById(`${height - 1}-${width - 1}`).className = 'block finish';

    // Переменные для таймера
    let timerStarted = false;
    let timerStart;
    const timerDisplay = document.getElementById('timer-display');    
    //let timeRemaining = 30;
    let timeRemaining = Math.floor(Math.random() * (35 - 25 + 1)) + 25;

    // Вставляем сгенерированное число в элемент с id="time-limit"
    document.getElementById('time-limit').textContent = timeRemaining;

    // Функция для обновления таймера
    function updateTimer() {
        const elapsedTime = (Date.now() - timerStart) / 1000;
        timeRemaining -= 0.01;
        if (timeRemaining <= 0) {
            clearInterval(timerInterval);
            alert('Время вышло! Игра окончена.');
            location.reload();
        }
        timerDisplay.textContent = elapsedTime.toFixed(3);
    }
    

    // Обработка движения персонажа
    document.body.onkeydown = function (event) {
        const directionMap = {
            37: [0, -1], // Влево
            38: [-1, 0], // Вверх
            39: [0, 1],  // Вправо
            40: [1, 0]   // Вниз
        };

        const move = directionMap[event.keyCode];
        if (!move) return;

        if (!timerStarted) {
            timerStarted = true;
            timerStart = Date.now();
            timerInterval = setInterval(updateTimer, 10);
            //timeRemaining = 30;
            timeRemaining = Math.floor(Math.random() * (35 - 25 + 1)) + 25;
            // updateTimer();
        }

        const newPosition = [            
            currentPosition[0] + move[0],
            currentPosition[1] + move[1]
        ];
        

        if (isValid(newPosition[0], newPosition[1]) && maze[newPosition[0]][newPosition[1]] !== 'wall') {
            document.getElementById(`${currentPosition[0]}-${currentPosition[1]}`).style.backgroundColor = 'Green';
            document.getElementById(`${currentPosition[0]}-${currentPosition[1]}`).className = 'block';
            currentPosition = newPosition;
            document.getElementById(`${currentPosition[0]}-${currentPosition[1]}`).className = 'block me';


            // Проверка на тупик
            console.log(document.getElementById(`${currentPosition[0]-1}`));
            //if(document.getElementById(`${currentPosition[0]-1}-${currentPosition[1]}`)            

            // Проверка на победу
            if (currentPosition[0] === height - 1 && currentPosition[1] === width - 1) {
                // document.getElementById('complete').style.display = 'block';
                timerStarted = false;
                
                score = (Date.now() - timerStart) / 100;
                // setTimeout( () => alert(`Вы победили! Score:${score}`), 50 );

                setTimeout(() => {
                    alert(`Вы победили! Score:${score}`) ;
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

                    window.location.href = 'leaderboard.html';
                }, 50);
            }
        }
    };

})(
    31,
    31,
    [],
    [],
    [0, 0]
);
