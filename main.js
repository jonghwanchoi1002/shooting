// 캔버스 세팅
let canvas;
let ctx;
canvas = document.createElement("canvas");
ctx = canvas.getContext("2d");
canvas.width = 400;
canvas.height = 700;
document.body.appendChild(canvas);

// 변수 선언
let backgroundImage, spaceshipImage, bulletImage, enemyImage, gameOverImage;

let gameOver = false; // true이면 게임 오버

let score = 0;
// 우주선 좌표
let spaceshipX = canvas.width / 2 - 24;
let spaceshipY = canvas.height - 48;

let bulletList = []; // 총알들을 저장하는 리스트

// 총알 클래스 생성 (function 이용)
function Bullet() {
  this.x = 0;
  this.y = 0;
  this.init = function () {
    this.x = spaceshipX + 12;
    this.y = spaceshipY;

    this.alive = true; // true면 살아있는 총알, false면 사라지는 총알

    bulletList.push(this);
  };
  this.update = function () {
    this.y -= 5;
    if (this.y <= 0) {
        this.alive = false;
    }
  };

  this.checkHit = function () {
    for (let i = 0; i < enemyList.length; i++) {
      if (
        this.y <= enemyList[i].y &&
        this.x >= enemyList[i].x &&
        this.x <= enemyList[i].x + 48
      ) {
        // 총알과 적군의 우주선이 없어짐, 점수 획득
        score++;
        this.alive = false;
        enemyList.splice(i, 1);
      }
    }
  };
}

function generateRandomValue(min, max) {
  let randomNum = Math.floor(Math.random() * (max - min + 1)) + min;
  return randomNum;
}

let enemyList = []; // 적군 리스트

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
      // console.log("game over");
    }
  };
}

// 이미지를 가져오는 함수
function loadImage() {
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
}

// 이미지를 렌더링하는(보여주는) 함수
function render() {
  ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
  ctx.drawImage(spaceshipImage, spaceshipX, spaceshipY);
  
  ctx.fillText(`Score:${score}`, 20, 20);
  ctx.fillStyle = "White";
  ctx.font = "20px Arial";
  
  for (let i = 0; i < bulletList.length; i++) {
    if (bulletList[i].alive) {
      ctx.drawImage(bulletImage, bulletList[i].x, bulletList[i].y);
    }
  }

  for (let i = 0; i < enemyList.length; i++) {
    ctx.drawImage(enemyImage, enemyList[i].x, enemyList[i].y);
  }
}

let keysDown = {};
function setupKeyboardListener() {
  // 이벤트를 읽어오는 함수
  // addEventListener 함수는 항상 event에 대한 정보를 넘겨줌
  document.addEventListener("keydown", function (event) {
    // 버튼 체크
    // console.log("무슨 키가 눌렸어?", event.key);

    keysDown[event.key] = true;
    // console.log("키다운 객체에 들어간 값은?", keysDown);
  });
  document.addEventListener("keyup", function (event) {
    delete keysDown[event.key];
    // console.log("버튼 클릭 후", keysDown);

    if (event.key == " ") {
      createBullet(); // 총알 생성
    }
  });
}

function createBullet() {
  // console.log("총알 생성!");
  let b = new Bullet(); // 총알 하나 생성
  b.init();
  // console.log("새로운 총알 리스트", bulletList);
}

function createEnemy() {
  const interval = setInterval(function () {
    let e = new Enemy();
    e.init();
  }, 500);
}

function update() {
  if ("ArrowRight" in keysDown) {
    spaceshipX += 5;
  }
  if ("ArrowLeft" in keysDown) {
    spaceshipX -= 5;
  }
  if ("ArrowUp" in keysDown) {
    spaceshipY -= 5;
  }
  if ("ArrowDown" in keysDown) {
    spaceshipY += 5;
  }

  // 우주선 좌표값 최소 최대값 설정 (안 그러면 화면 밖으로 벗어남)
  if (spaceshipX <= 0) {
    spaceshipX = 0;
  }
  if (spaceshipX >= canvas.width - 48) {
    spaceshipX = canvas.width - 48;
  }
  if (spaceshipY <= 0) {
    spaceshipY = 0;
  }
  if (spaceshipY >= canvas.height - 48) {
    spaceshipY = canvas.height - 48;
  }

  // 총알의 y좌표 업데이트하는 함수 호출
  for (let i = 0; i < bulletList.length; i++) {
    if (bulletList[i].alive) {
      bulletList[i].update();
      bulletList[i].checkHit();
    }
  }

  for (let i = 0; i < enemyList.length; i++) {
    enemyList[i].update();
  }
}

function main() {
  if (!gameOver) {
    update(); // 좌표값을 업데이트 하고
    render(); // 그려주고 (렌더링하고)
    // console.log("animation calls main function");
    requestAnimationFrame(main);
  } else {
    ctx.drawImage(gameOverImage, 0, canvas.height / 4, 400, 300);
  }
}

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
