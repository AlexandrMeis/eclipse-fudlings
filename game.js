const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = 1280;
canvas.height = 720;

const player = {
    x: 400,
    y: 500,
    width: 64,
    height: 128,
    speed: 8,
    isJumping: false,
    velocityY: 0,
    gravity: 0.8,
    draw() {
        ctx.fillStyle = '#6A5ACD';
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
};

const keys = {};
window.addEventListener('keydown', e => keys[e.code] = true);
window.addEventListener('keyup', e => keys[e.code] = false);

function update() {
    if (keys.KeyD) player.x += player.speed;
    if (keys.KeyA) player.x -= player.speed;

    if (keys.KeyW && !player.isJumping) {
        player.velocityY = -18;
        player.isJumping = true;
    }

    player.y += player.velocityY;
    player.velocityY += player.gravity;

    const groundY = canvas.height - 100;
    if (player.y + player.height > groundY) {
        player.y = groundY - player.height;
        player.isJumping = false;
        player.velocityY = 0;
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#2C3E50';
    ctx.fillRect(0, canvas.height - 100, canvas.width, 100);
    player.draw();
}

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

gameLoop();