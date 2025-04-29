const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Настройка размеров холста
canvas.width = 1280;
canvas.height = 720;

// Объект игрока
const player = {
    x: 400,
    y: 500,
    width: 64,
    height: 128,
    speed: 8,
    isJumping: false,
    velocityY: 0,
    gravity: 0.8,

    // Отрисовка игрока
    draw() {
        ctx.fillStyle = '#6A5ACD'; // Фиолетовый цвет (Eclipse стиль)
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
};

// Обработка нажатий клавиш
const keys = {};
window.addEventListener('keydown', (e) => (keys[e.key] = true));
window.addEventListener('keyup', (e) => (keys[e.key] = false));

// Обновление игровой логики
function update() {
    // Движение влево/вправо
    if (keys.ArrowRight) player.x += player.speed;
    if (keys.ArrowLeft) player.x -= player.speed;

    // Прыжок
    if (keys.Space && !player.isJumping) {
        player.velocityY = -18; // Сила прыжка
        player.isJumping = true;
    }

    // Гравитация
    player.y += player.velocityY;
    player.velocityY += player.gravity;

    // Коллизия с "полом"
    const groundY = canvas.height - 100; // Высота пола
    if (player.y + player.height > groundY) {
        player.y = groundY - player.height;
        player.isJumping = false;
        player.velocityY = 0;
    }
}

// Отрисовка кадра
function draw() {
    // Очистка холста
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Рисуем "пол"
    ctx.fillStyle = '#2C3E50'; // Темно-синий цвет
    ctx.fillRect(0, canvas.height - 100, canvas.width, 100);

    // Рисуем игрока
    player.draw();
}

// Игровой цикл
function gameLoop() {
    update(); // Обновляем логику
    draw();   // Рисуем кадр
    requestAnimationFrame(gameLoop); // Повторяем
}

// Запуск игры
gameLoop();