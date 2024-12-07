document.getElementById('auth-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    if (username) {
        localStorage.setItem('username', username);
        document.getElementById('auth-container').style.display = 'none';
        startGame(); // Ваша функция начала игры
    }
});

function startGame() {
    const username = localStorage.getItem('username');
    console.log(`Добро пожаловать, ${username}!`);
    // Ваша логика запуска игры
}

// Проверяем, есть ли имя пользователя
window.onload = () => {
    if (localStorage.getItem('username')) {
        document.getElementById('auth-container').style.display = 'none';
        startGame();
    }
};
