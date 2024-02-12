const prompt = require('prompt-sync')();

const BOARD_WIDTH = 20;
const BOARD_HEIGHT = 20;
const SNAKE_SIZE = 3;
// const APPLE_SIZE = 1;

// let board = [];
let snake = [];
let apple = [];
let direction = 'right';
let score = 0;
let isPlaying = false;
let playerName = '';

const init = () => {
  board = Array(BOARD_HEIGHT).fill(null).map(() => Array(BOARD_WIDTH).fill(0));
  snake = [{ x: Math.floor(BOARD_WIDTH / 2), y: Math.floor(BOARD_HEIGHT / 2) }];
  for (let i = 1; i <= SNAKE_SIZE - 1; i++) {
    snake.push({ x: snake[0].x - i, y: snake[0].y });
  }
  placeApple();
  draw();
}

const placeApple = () => {
  do {
    apple = {
      x: Math.floor(Math.random() * BOARD_WIDTH),
      y: Math.floor(Math.random() * BOARD_HEIGHT),
    };
  } while (isColliding(apple));
}

const isColliding = (object) => {
  return (
    object.x < 0 ||
    object.x >= BOARD_WIDTH ||
    object.y < 0 ||
    object.y >= BOARD_HEIGHT ||
    snake.some((segment) => segment.x === object.x && segment.y === object.y)
  );
}

const draw = () => {
  
  process.stdout.write('\x1bc');

  if (!isPlaying) {
    process.stdout.write('=================== Build from scratch by Fadhel Murphy =================== \n\n');
    process.stdout.write('Selamat datang di Game uler ala Nokia! Silahkan pilih:\n');
    process.stdout.write('1. Mulai Game\n');
    process.stdout.write('2. Keluar\n');
  } else {
    for (let y = 0; y < BOARD_HEIGHT; y++) {
      for (let x = 0; x < BOARD_WIDTH; x++) {
        let char = ' ';
        // Draw horizontal lines
        if (y === 0) {
          char = '‾';
        }
        if (y === BOARD_HEIGHT - 1) {
          char = '_';
        }
        // Draw vertical lines
        if (x === 0) {
          char = '▏';
        }
        if (x === BOARD_WIDTH - 1) {
          char = '▕';
        }
        // Draw snake and apple
        if (snake.some((segment) => segment.x === x && segment.y === y)) {
          if (snake[0].x === x && snake[0].y === y) {
            char = '\x1b[31mo\x1b[0m'; // Red head
          } else {
            char = 'o';
          }
        } else if (apple.x === x && apple.y === y) {
          char = '@';
        }
        process.stdout.write(char);
      }
      process.stdout.write('\n');
    }
  
    process.stdout.write(`Nama Pemain: ${playerName}\n`);
    process.stdout.write(`Score: ${score}\n`);
  }
}

const update = () => {
  if (!isPlaying) {
    return;
  }

  const newHead = {
    x: snake[0].x,
    y: snake[0].y,
  };

  switch (direction) {
    case 'up':
      newHead.y--;
      break;
    case 'down':
      newHead.y++;
      break;
    case 'left':
      newHead.x--;
      break;
    case 'right':
      newHead.x++;
      break;
  }

  if (isColliding(newHead)) {
    gameOver();
    return;
  }

  snake.unshift(newHead);

  if (newHead.x === apple.x && newHead.y === apple.y) {
    score++;
    placeApple();
  } else {
    snake.pop();
  }

  draw();
}

const gameOver = () => {
  console.log('Game Over!');
  console.log(`Score: ${score}`);
  process.exit();
}

const handleKey = () => {
  if (!isPlaying) {
    let choice = prompt('Pilih: ');
    if (choice === '1') {
      playerName = prompt('Masukkan nama pemain: ');
      if (playerName.length > 0) {
        isPlaying = true;
        update();
      } else {
        console.log('Nama pemain tidak boleh kosong!');
      }
    } else if (choice === '2') {
      console.log('Terima kasih telah bermain!');
      process.exit();
    } else {
      console.log('Pilihan tidak valid!');
    }
  } else {
    const key = prompt('Tekan tombol WASD untuk bergerak dan Q untuk kembali ke menu : ');
    if (key.toLowerCase() === 'q') {
      isPlaying = false;
      draw();
    } else {
      const newDirection = {
        w: 'up',
        s: 'down',
        a: 'left',
        d: 'right',
      }[key.toLowerCase()];

      if (newDirection && newDirection !== direction) {
        direction = newDirection;
      }
    }
  }
}

init();
setInterval(update, 100);
setInterval(handleKey, 100); // Check for input every 100ms
