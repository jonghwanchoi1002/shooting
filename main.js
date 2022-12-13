// Version 1.1

// var bgm;

// bgm = new sound('sound/battleThemeA.mp3');
// bgm.play();

// canvas setting
let canvas;
let ctx;
canvas = document.createElement("canvas");
ctx = canvas.getContext("2d");
canvas.width = 400;
canvas.height = 700;
document.body.appendChild(canvas);

// 변수 선언
let backgroundImage, spaceshipImage, bulletImage, enemyImage, gameOverImage, explosionImage, press_s, press_r, backgroundStart;

let gameOver = true; // true이면 게임 오버
let gameStart = true;
let gameRestart = false;

let score = 0;

// 우주선 좌표
// spaceshipX = canvas.width / 2 - 24;
// let spaceshipY = canvas.height - 48;

let bulletList = []; // 총알들을 저장하는 리스트

class Spaceship {
  constructor(name) {
    this.name = name;
    this.x = canvas.width / 2 - 24;
    this.y = canvas.height - 48;
  }

  getSpaceshipX() {
    return this.x;
  }

  getSpaceshipY() {
    return this.y;
  }

  setSpaceshipX(x) {
    this.x = x;
  }

  setSpaceshipY(y) {
    this.y = y;
  }
}

// creating a spaceship
let spaceship = new Spaceship("X-Wing");
let enemyList = []; // 적군 리스트

// 총알 클래스 생성 (function 이용)
function Bullet() {
  this.x = 0;
  this.y = 0;
  this.init = function () {
    this.x = spaceship.x + 12;
    this.y = spaceship.y;
    this.sound = new Audio();
    this.sound.src = 'sound/firing.mp3';
    this.sound.volume = 0.1;
    this.sound.play();
    this.alive = true; // true면 살아있는 총알, false면 사라지는 총알

    bulletList.push(this);
  };
  this.update = function () {
    this.y -= 5;
  };

  this.enemyHit = function () {
    for (let i = 0; i < enemyList.length; i++) {
      if (
        this.y <= enemyList[i].y &&
        this.x >= enemyList[i].x &&
        this.x <= enemyList[i].x + 48
      ) {
        explosionList.push(new Explosion(enemyList[i].x, enemyList[i].y));
        
        // 총알과 적군의 우주선이 없어짐, 점수 획득
        score++;
        this.alive = false;
        enemyList.splice(i, 1);
        
      }
    }
  };

  this.reachedUpperScreen = function () {
    for (let i = 0; i < bulletList.length; i++) {
      if (bulletList[i].y <= 0) {
        bulletList.splice(i, 1);
      }
    }
  };
}

function generateRandomValue(min, max) {
  let randomNum = Math.floor(Math.random() * (max - min + 1)) + min;
  return randomNum;
}


// 적군 클래스 생성
function Enemy() {
  this.x = 0;
  this.y = 0;
  this.init = function () {
    this.y = 0;
    this.x = generateRandomValue(0, canvas.width - 48);

    enemyList.push(this);
  };
  this.update = function () {
    this.y += 2;

    if (this.y > canvas.height - 48) {
      gameOver = true;
      gameRestart = true;
      // console.log("game over");
    }
  };
}

// enemy explosion
let explosionList = [];

class Explosion {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.opacity = 1;
    this.sound = new Audio();
    this.sound.src = 'sound/explosion.wav';
    this.sound.volume = 0.1;
  }
  
  draw() {
    ctx.save();      
    ctx.globalAlpha = this.opacity;
    ctx.drawImage(explosionImage, this.x, this.y);
    ctx.restore();
  }
  update() {
    this.draw();
    this.sound.play();
    this.opacity -= 0.2
  }
}

// 이미지를 가져오는 함수
function loadImage() {
  backgroundStart = new Image();
  backgroundStart.src = "img/startpage.png"

  backgroundImage = new Image();
  backgroundImage.src = "img/background.png";

  spaceshipImage = new Image();
  spaceshipImage.src = "img/X-Wing Starfighter.png";

  bulletImage = new Image();
  bulletImage.src = "img/bullet.png";

  enemyImage = new Image();
  enemyImage.src = "img/Star Trek Enterprise NCC 1701 E.png";

  gameOverImage = new Image();
  gameOverImage.src = "img/game over.jpg";

  explosionImage = new Image();
  explosionImage.src = "img/explosion.png"

  press_s = new Image();
  press_s.src = "img/press s.png";

  press_r = new Image();
  press_r.src = "img/press_r.png";
}

function start(){
  gameOver = false;
  gameStart = false;
}

function startPage(){
  ctx.drawImage(backgroundStart, 0, 0, 400, 700);
  ctx.drawImage(press_s, 0, 0, 400, 700);
}

function restart(){
  location.reload();
  gameStart = false;
  gameOver = false;
  gameRestart = false;
}

function restartPage(){
  ctx.drawImage(backgroundStart, 0, 0, 400, 700);
  ctx.drawImage(gameOverImage, 0, canvas.height / 8, 400, 300);
  ctx.drawImage(press_r, 0, 0, 400, 700);
}

// 이미지를 렌더링하는(보여주는) 함수
function render() {

  ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
  ctx.drawImage(spaceshipImage, spaceship.x, spaceship.y);

  ctx.fillText(`Score:${score}`, 20, 20);
  ctx.fillStyle = "White";
  ctx.font = "20px Arial";

  // rendering bullets
  for (let i = 0; i < bulletList.length; i++) {
    if (bulletList[i].alive) {
      ctx.drawImage(bulletImage, bulletList[i].x, bulletList[i].y);
    }  
  }
  // rendering enemies
  for (let i = 0; i < enemyList.length; i++) {
    ctx.drawImage(enemyImage, enemyList[i].x, enemyList[i].y);
    // ctx.globalAlpha = 0;
  }

  // rendering explosion effect

  for (let i = 0; i < explosionList.length; i++) {
    ctx.drawImage(explosionImage, explosionList[i].x, explosionList[i].y);  
  }
}

let keysDown = {};
function setupKeyboardListener() {
  // 이벤트를 읽어오는 함수
  // addEventListener 함수는 항상 event에 대한 정보를 넘겨줌
  document.addEventListener("keydown", function (event) {
    keysDown[event.key] = true;
  });

  document.addEventListener("keyup", function (event) {
    delete keysDown[event.key];
    // console.log("버튼 클릭 후", keysDown);

    if (event.key == "e" || event.key == "E") {
      end();
    }

    if (event.key == "s" || event.key == "S") {
      start();
    }

    if (event.key == "r" || event.key == "R") {
      restart();
    }

    if (event.key == " ") {
      createBullet(); // 총알 생성
    }
  });
}

function createBullet() {
  let b = new Bullet(); // 총알 하나 생성
  b.init();
}

function createEnemy() {
  const interval = setInterval(function () {
    let e = new Enemy();
    e.init();
  }, 500);
}

function update() {
  if ("ArrowRight" in keysDown) {
    spaceship.setSpaceshipX(spaceship.x + 5);
  }
  if ("ArrowLeft" in keysDown) {
    spaceship.setSpaceshipX(spaceship.x - 5);
  }
  if ("ArrowUp" in keysDown) {
    spaceship.setSpaceshipY(spaceship.y - 5);
  }
  if ("ArrowDown" in keysDown) {
    spaceship.setSpaceshipY(spaceship.y + 5);
  }

  // 우주선 좌표값 최소 최대값 설정 (안 그러면 화면 밖으로 벗어남)
  if (spaceship.x <= 0) {
    spaceship.setSpaceshipX(0);
  }
  if (spaceship.x >= canvas.width - 48) {
    spaceship.setSpaceshipX(canvas.width - 48);
  }
  if (spaceship.y <= 0) {
    spaceship.setSpaceshipY(0);
  }
  if (spaceship.y >= canvas.height - 48) {
    spaceship.setSpaceshipY(canvas.height - 48);
  }

  // 총알의 y좌표 업데이트하는 함수 호출
  for (let i = 0; i < bulletList.length; i++) {
    if (bulletList[i].alive) {
      bulletList[i].update();
      bulletList[i].enemyHit();
      bulletList[i].reachedUpperScreen();
    }
  }

  for (let i = 0; i < enemyList.length; i++) {
    enemyList[i].update();
  }

  for (let i = 0; i < enemyList.length; i++) {
    if (
      spaceship.y <= enemyList[i].y + 30 &&
      spaceship.y + 40 >= enemyList[i].y &&
      spaceship.x <= enemyList[i].x + 30 &&
      spaceship.x + 30 >= enemyList[i].x
    ) {
      gameOver = true;
      gameRestart = true;
    }
  }

  for (let i = 0; i < explosionList.length; i++) {
    if (explosionList[i].opacity <= 0) {
      explosionList.splice(i, 1);
    }
    else {
      explosionList[i].update();
    }
    
  }
  console.log('explosionList', explosionList);

  
}

// Sound Effect
function sound(src) {
  this.sound = document.createAttribute("audio");
  this.sound.src = src;
  document.body.appendChild(this.sound);
  this.play = function() {
    this.sound.play();
  }
  this.stop = function() {
    this.sound.stop();
  }
}

// Background music
let bgm;
function startBgm() {
  this.sound = new Audio();
  this.sound.src = 'sound/battleThemeA.mp3';
  this.sound.volume = 0.2;
  this.addEventListener('ended', function(){
    this.currentTime = 0;
    this.play();
  }, false);
  this.sound.play();
}

function main() {
  if (gameOver && gameStart) {
    startPage();
    requestAnimationFrame(main);
  }
  if (!gameOver && !gameRestart) {
    update(); // 좌표값을 업데이트 하고
    render(); // 그려주고 (렌더링하고)
    requestAnimationFrame(main);
  }
  if (gameOver && gameRestart) {
    restartPage();
    requestAnimationFrame(main);
  }
}

startBgm();
loadImage();
setupKeyboardListener();
createEnemy();
main();



// 방향키를 누르면
// 우주선의 x, y 좌표가 바뀌며
// 다시 렌더링 해준다
// 방향키를 누르면 바뀌는 이벤트 세팅

// 총알 만들기
// 1. 스페이스바를 누르면 총알 발사
// 2. 총알이 발사 = y 좌표값이 변화, 스페이스바를 누른 순간 우주선의 x 좌표값
// 3. 발사된 총알들은 총알 배열에 저장을 한다
// 4. 총알들은 x, y 좌표값이 있어야 한다
// 5. 총알 배열을 가지고 렌더링(그려준다)
