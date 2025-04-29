const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = 1280;
canvas.height = 720;

// 1. Добавляем прелоадер
let assetsLoaded = false;
const totalAssets = 4;
let loadedAssets = 0;

// 2. Новый класс для загрузки изображений
class AssetLoader {
    static loadImage(src) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.src = src;
            img.onload = () => resolve(img);
            img.onerror = (err) => reject(err);
        });
    }
}

// --- Игрок ---
const player = {
    x: 400,
    y: 500,
    width: 64,
    height: 128,
    speed: 8,
    isJumping: false,
    velocityY: 0,
    gravity: 0.8,
    health: 100,
    draw() {
        ctx.fillStyle = '#6A5ACD';
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
};

// --- Враги ---
class Enemy {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 64;
        this.height = 64;
        this.speed = 3;
        this.direction = 1;
        this.health = 50;
        
        // Анимация
        this.frames = [];
        this.currentFrame = 0;
        this.animationTimer = 0;
        this.frameDuration = 100;
    }

    async loadSprites() {
        try {
            for(let i = 1; i <= 4; i++) {
                const img = await AssetLoader.loadImage(`assets/sprites/enemies/slime/frame_${i}.png`);
                this.frames.push(img);
                loadedAssets++;
                if(loadedAssets === totalAssets) assetsLoaded = true;
            }
        } catch(err) {
            console.error('Ошибка загрузки спрайтов:', err);
        }
    }

    update(deltaTime) {
        if(!assetsLoaded) return;

        this.x += this.speed * this.direction;
        if(this.x > canvas.width - this.width || this.x < 0) {
            this.direction *= -1;
        }
        
        this.animationTimer += deltaTime;
        if(this.animationTimer >= this.frameDuration) {
            this.currentFrame = (this.currentFrame + 1) % 4;
            this.animationTimer = 0;
        }
    }

    draw() {
        if(assetsLoaded) {
            ctx.drawImage(
                this.frames[this.currentFrame],
                this.x,
                this.y,
                this.width,
                this.height
            );
        } else {
            ctx.fillStyle = '#FF5555';
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }
}

// 3. Инициализация врагов с загрузкой
const enemies = [
    new Enemy(200, 500),
    new Enemy(800, 500)
];

enemies.forEach(enemy => enemy.loadSprites());

// --- Коллизии ---
function checkCollisions() {
    enemies.forEach(enemy => {
        if(player.x < enemy.x + enemy.width &&
           player.x + player.width > enemy.x &&
           player.y < enemy.y + enemy.height &&
           player.y + player.height > enemy.y) {
            player.health -= 0.5;
        }
    });
}

// --- Управление ---
const keys = {};
window.addEventListener('keydown', e => keys[e.code] = true);
window.addEventListener('keyup', e => keys[e.code] = false);

// --- Игровой цикл ---
let lastTime = 0;
function gameLoop(timestamp) {
    const deltaTime = timestamp - lastTime;
    lastTime = timestamp;
    
    update(deltaTime);
    draw();
    requestAnimationFrame(gameLoop);
}

function update(deltaTime) {
    if(keys.KeyD) player.x += player.speed;
    if(keys.KeyA) player.x -= player.speed;
    if(keys.KeyW && !player.isJumping) {
        player.velocityY = -18;
        player.isJumping = true;
    }

    player.y += player.velocityY;
    player.velocityY += player.gravity;

    const groundY = canvas.height - 100;
    if(player.y + player.height > groundY) {
        player.y = groundY - player.height;
        player.isJumping = false;
        player.velocityY = 0;
    }

    enemies.forEach(enemy => enemy.update(deltaTime));
    checkCollisions();
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = '#2C3E50';
    ctx.fillRect(0, canvas.height - 100, canvas.width, 100);
    
    player.draw();
    enemies.forEach(enemy => enemy.draw());
    
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '24px Arial';
    ctx.fillText(`Health: ${Math.round(player.health)}`, 20, 40);
    
    // 4. Индикатор загрузки
    if(!assetsLoaded) {
        ctx.fillStyle = '#FFF';
        ctx.font = '32px Arial';
        ctx.fillText(
            `Загрузка спрайтов: ${Math.round((loadedAssets/totalAssets)*100)}%`, 
            canvas.width/2 - 200, 
            canvas.height/2
        );
    }
}

gameLoop();