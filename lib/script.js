'use strict';

const movingState = {
    movingLeft: false,
    movingRight: true,
    movingDown: false,
    movingUp: false,
};
let traceInterval = 0;
let traceHistory = [];
let eatenFruits = 0;

let buttonStartGame = document.querySelector('#button-start-game');

const GAME_UPDATE_SPEED = 500;
const GAME_ROWS = 5;
const GAME_CELLS = 5;

field.style.width = GAME_CELLS * 20 + 'px';
field.style.height = GAME_ROWS * 20 + 'px';

const fruitCurrentCoords = {
    left: null,
    top: null,
};
let isStarted = false;

document.addEventListener('keydown', (event) => {
    event.preventDefault();
    if (event.code === 'ArrowLeft') {
        updateMoving('movingLeft');
    } else if (event.code === 'ArrowRight') {
        updateMoving('movingRight');
    } else if (event.code === 'ArrowDown') {
        updateMoving('movingDown');
    } else if (event.code === 'ArrowUp') {
        updateMoving('movingUp');
    }
});

buttonLeft.addEventListener('mousedown', () => updateMoving("movingLeft"));
buttonUp.addEventListener('mousedown', () => updateMoving("movingUp"));
buttonRight.addEventListener('mousedown', () => updateMoving("movingRight"));
buttonDown.addEventListener('mousedown', () => updateMoving("movingDown"));

function updateMoving(variable) {
    for (let state of Object.keys(movingState)) {
        movingState[state] = false;
    }
    movingState[variable] = true;
}

function move() {
    if (!isStarted) return;

    generateTrace();

    updateTail();

    if (movingState.movingLeft) {
        snake.style.left = snake.offsetLeft - snake.clientWidth + 'px';
    } else if (movingState.movingRight) {
        snake.style.left = snake.offsetLeft + snake.clientWidth + 'px';
    } else if (movingState.movingDown) {
        snake.style.top = snake.offsetTop + snake.clientHeight + 'px';
    } else if (movingState.movingUp) {
        snake.style.top = snake.offsetTop - snake.clientHeight + 'px';
    }

    if (isHitAnObstacle()) {
        initiateGameOver(false);
    }

    if (isAteFruit()) {

        if (eatenFruits >= (field.clientWidth * field.clientHeight) / 20 / 20 - 1) {
            initiateGameOver(true);
            return;
        }
        eatenFruits++;

        generateFruit();
        traceInterval = 1;
    }
}

function updateTail() {
    if (traceInterval === 0) {
        traceHistory.shift().remove();
    } else {
        traceInterval--;
    }
}

function generateTrace() {
    let traceBlock = document.createElement('div');
    traceBlock.classList.add('snakeable');
    traceBlock.style.left = snake.offsetLeft + 'px';
    traceBlock.style.top = snake.offsetTop + 'px';
    field.append(traceBlock);

    addReflection(traceBlock);

    traceHistory.push(traceBlock);
}

function addReflection(element) {
    setInterval(() => {
        element.style.backgroundColor === 'red'
            ? (element.style.backgroundColor = 'lightcoral')
            : (element.style.backgroundColor = 'red');
    }, 500);
}

function initiateGameOver(isWin) {
    clearInterval(moveInterval);
    info.hidden = false;
    if (isWin) {
        info.textContent = 'You win!';
    } else {
        info.textContent = 'You lose!';
    }
    buttonStartGame.style.opacity = 1;
    buttonsTable.hidden = true;
    isStarted = false;
}

function removeTraceHistory() {
    for (let trace of traceHistory) {
        trace.remove();
    }
    traceHistory = [];
}

function isAteFruit() {
    return snake.offsetLeft === fruitCurrentCoords.left &&
        snake.offsetTop === fruitCurrentCoords.top;
}

function isHitAnObstacle() {
    if (
        snake.offsetLeft > field.clientWidth + field.offsetLeft ||
        snake.offsetLeft < field.offsetLeft + field.clientLeft ||
        snake.offsetTop > field.clientHeight + field.offsetTop ||
        snake.offsetTop < field.offsetTop + field.clientTop
    ) {
        snake.hidden = true;
        return true;
    }
    for (let trace of traceHistory) {
        if (
            snake.offsetLeft === trace.offsetLeft &&
            snake.offsetTop === trace.offsetTop
        ) {
            return true;
        }
    }

    return false;
}

function generateFruit() {
    let x;
    let y;
    let dx = 0;
    let dy = 0;

    let innerCounter = 0;

    while (!x || !y || isIntersectingSnake(x + dx, y + dy)) {
        x = field.offsetLeft + field.clientLeft;
        y = field.offsetTop + field.clientTop;

        innerCounter++;

        if (innerCounter > 1024 * 1024) {
            console.log(eatenFruits);
            break;
        }

        let maxMovesRight = field.clientWidth / fruit.clientWidth;
        let maxMovesDown = field.clientHeight / fruit.clientHeight;

        dx = Math.floor(
            fruit.clientWidth * Math.floor(Math.random() * maxMovesRight)
        );
        dy = Math.floor(
            fruit.clientHeight * Math.floor(Math.random() * maxMovesDown)
        );
    }

    fruit.style.left = x + dx + 'px';
    fruit.style.top = y + dy + 'px';

    fruitCurrentCoords.left = x + dx;
    fruitCurrentCoords.top = y + dy;
}

let moveInterval;
setInterval(changeBackground, GAME_UPDATE_SPEED);

function changeBackground() {
    field.style.backgroundColor =
        '#' +
        Math.round(Math.random() * 255).toString(16) +
        Math.round(Math.random() * 255).toString(16) +
        Math.round(Math.random() * 255).toString(16);
}

buttonStartGame.addEventListener('click', startGame);

addReflection(snake);

function startGame() {
    prepareSnake();
    updateMoving('movingRight');
    removeTraceHistory();
    buttonsTable.hidden = false;
    eatenFruits = 0;

    fruitCurrentCoords.left = fruitCurrentCoords.top = null;

    info.hidden = true;

    fruit.hidden = false;
    setInterval(() => {
        fruit.style.backgroundColor === 'lime'
            ? (fruit.style.backgroundColor = 'white')
            : (fruit.style.backgroundColor = 'lime');
    }, 500);
    generateFruit();
    isStarted = true;
    buttonStartGame.style.opacity = 0;
    moveInterval = setInterval(move, GAME_UPDATE_SPEED);
}

function prepareSnake() {
    snake.hidden = false;
    snake.style.left = 'auto';
    snake.style.top = 'auto';
}

function isIntersectingSnake(x, y) {
    if (x === snake.offsetLeft && y === snake.offsetTop) return true;

    for (let trace of traceHistory) {
        if (trace.offsetLeft === x && trace.offsetTop === y) return true;
    }

    return false;
}
