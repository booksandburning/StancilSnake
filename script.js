// Initialize canvas and context
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Load game images
const snakeHeadImg = document.getElementById('snakeHeadImg');
const appleImg = document.getElementById('appleImg');

// Game configuration
const gridSize = 20;
const gameSpeed = 100; // milliseconds between updates

// Game state variables
let snake = [{x: 10, y: 10}];
let food = {};
let direction = 'right';
let score = 0;
let gameInterval;
let gameStarted = false;

// Game interface functions
function showStartScreen() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Semi-transparent background
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Title text
    ctx.fillStyle = 'white';
    ctx.font = '30px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('SStancil SSnake!!!!', canvas.width / 2, canvas.height / 2 - 30);
    
    // Instructions
    ctx.font = '20px Arial';
    ctx.fillText('Press ENTER to Start', canvas.width / 2, canvas.height / 2 + 20);
    
    // Controls info
    ctx.font = '16px Arial';
    ctx.fillText('Use Arrow Keys to move', canvas.width / 2, canvas.height / 2 + 60);
}

function gameOver() {
    clearInterval(gameInterval);
    gameStarted = false;
    
    // Game over screen
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = 'white';
    ctx.font = '30px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Game Over!', canvas.width / 2, canvas.height / 2 - 30);
    ctx.font = '20px Arial';
    ctx.fillText(`Your score: ${score}`, canvas.width / 2, canvas.height / 2 + 10);
    ctx.fillText('Press ENTER to play again', canvas.width / 2, canvas.height / 2 + 50);
}

function updateScoreDisplay() {
    const scoreDisplay = document.getElementById('scoreDisplay');
    scoreDisplay.textContent = `Score: ${score}`;
}

// Game mechanics functions
function startGame() {
    if (gameStarted) return;
    
    gameStarted = true;
    snake = [{x: 10, y: 10}];
    direction = 'right';
    score = 0;
    updateScoreDisplay();
    generateFood();
    gameInterval = setInterval(update, gameSpeed);
}

function generateFood() {
    food = {
        x: Math.floor(Math.random() * (canvas.width / gridSize)),
        y: Math.floor(Math.random() * (canvas.height / gridSize))
    };
    
    // Ensure food doesn't appear on the snake
    for (let segment of snake) {
        if (segment.x === food.x && segment.y === food.y) {
            generateFood(); // Recursive call to try again
            return;
        }
    }
}

function checkCollision(head) {
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            return true;
        }
    }
    return false;
}

function update() {
    const head = {x: snake[0].x, y: snake[0].y};

    switch (direction) {
        case 'up':    head.y--; break;
        case 'down':  head.y++; break;
        case 'left':  head.x--; break;
        case 'right': head.x++; break;
    }

    // Check for wall collision or self collision
    if (head.x < 0 || head.x >= canvas.width / gridSize || 
        head.y < 0 || head.y >= canvas.height / gridSize || 
        checkCollision(head)) {
        gameOver();
        return;
    }

    // Move snake
    snake.unshift(head);

    // Check if snake ate food
    if (head.x === food.x && head.y === food.y) {
        score++;
        updateScoreDisplay();
        generateFood();
    } else {
        snake.pop(); // Remove tail if no food eaten
    }

    draw();
}

// Drawing functions
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw snake
    for (let i = 0; i < snake.length; i++) {
        if (i === 0) {
            drawSnakeHead(snake[i].x, snake[i].y);
        } else {
            // Draw snake body
            ctx.fillStyle = 'green';
            ctx.fillRect(snake[i].x * gridSize, snake[i].y * gridSize, gridSize, gridSize);
        }
    }

    // Draw food
    ctx.drawImage(appleImg, food.x * gridSize, food.y * gridSize, gridSize, gridSize);
}

function drawSnakeHead(x, y) {
    ctx.drawImage(snakeHeadImg, x * gridSize, y * gridSize, gridSize, gridSize);
}

// Event handlers
document.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        if (!gameStarted) {
            startGame();
            return;
        }
    }
    
    if (!gameStarted) return;
    
    switch (event.key) {
        case 'ArrowUp':
            if (direction !== 'down') direction = 'up';
            break;
        case 'ArrowDown':
            if (direction !== 'up') direction = 'down';
            break;
        case 'ArrowLeft':
            if (direction !== 'right') direction = 'left';
            break;
        case 'ArrowRight':
            if (direction !== 'left') direction = 'right';
            break;
    }
});

// Initialize game
window.onload = function() {
    showStartScreen();
};