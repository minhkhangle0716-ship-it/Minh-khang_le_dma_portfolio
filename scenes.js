let caughtFish = [];
let clickLock = false;
let hookY = 250;
let fishList = [];
let fishSpawnTimer = 0;
let fishSpawnDelay = 120; // 
let currentMusic = null;

function playMusic(snd) {
  if (currentMusic && currentMusic !== snd) {
    currentMusic.stop();
  }

  currentMusic = snd;

  if (!snd.isPlaying()) {
    snd.loop();
    snd.setVolume(0.2);
  }
}

function stopMusic(snd) {
  if (snd && snd.isPlaying()) snd.stop();
  if (currentMusic === snd) currentMusic = null;
}
function stopAllMusic() {
  if (sndEarth) sndEarth.stop();
  if (snd4) snd4.stop();
  if (sndLowGrav) sndLowGrav.stop();
  if (sndHome) sndHome.stop(); 

  currentMusic = null;
}

const HOOK_X = () => width / 2;
const HOOK_SIZE = 12; 
const BIOME_FISH = {

  //  EARTH
  earth: [

    {

      species: "default",
      col: [70,170,220],
      size: 1.0
    },

    {
      species: "crab",
      col: [230,120,60],
      size: 1.05
    },

    {
   
      species: "jelly",
      col: [180,120,255],
      size: 1.0
    }
  ],

  // HIGH GRAVITY
  high: [

    {
      
      species: "scalefish",
      col: [18,140,150], // dark turquoise
      size: 1.6
    },

    {
      
      species: "shark",
      col: [140,80,230],
      size: 1.8
    },

    {
      
      species: "spikefish",
      col: [25,60,120], // navy blue
      size: 1.5
    }
  ],

  //  LOW GRAVITY
  low: [

    {
      
      species: "puffer",
      col: [255,150,210],
      size: 0.9
    },

    {
     
      species: "bluefish",
      col: [120,255,240],
      size: 1.25 
    },

    {
     
      species: "cloudfish",
      col: [230,230,255],
      size: 0.9
    }
  ]
};
function resetFishSystem(biome) {
  fishList = [];

  for (let i = 0; i < 4; i++) {
    fishList.push(createFish(biome));
  }

  fishSpawnTimer = 0;
}
function getRandomFish(biome) {
  let list = BIOME_FISH[biome];
  return list[int(random(list.length))];
}
function spawnBiomeFish(biome) {
  let f = getRandomFish(biome);
  return {
    biome: biome,
    data: f,
    x: width + 80,
    y: random(200, height - 200)
  };
}
function createFish(biome) {
  let f = getRandomFish(biome);

  return {
    biome,
    data: f,
    x: random([0, width]),   
    y: random(150, height - 150),
    vx: random([-2, -1.5, -1, 1, 1.5, 2]),
    dir: random([1, -1])
  };
}
function updateCaughtFish() {
  for (let f of caughtFish) {
    f.x += f.vx;
    f.y += f.vy;

    // FULL CANVAS BOUNCE 
    if (f.x < 0) {
      f.x = 0;
      f.vx *= -1;
    }
    if (f.x > width) {
      f.x = width;
      f.vx *= -1;
    }
    if (f.y < 0) {
      f.y = 0;
      f.vy *= -1;
    }
    if (f.y > height) {
      f.y = height;
      f.vy *= -1;
    }
  }
}// HOME
function ML_home() {
  
  this.enter = function () {
    stopAllMusic();
    ghosty.visible = false;

    playMusic(sndHome); 

  // give fish motion if missing (important fix)
  for (let f of caughtFish) {
    if (!f.vx) f.vx = random(-2, 2);
    if (!f.vy) f.vy = random(-2, 2);
  }
}

  this.draw = function () {

    fillGradient('linear', {
      from: [0, 0],
      to: [width, height],
      steps: [color(10, 30, 120), color(0, 180, 255)]
    });

    rect(0, 0, width, height);
    image(titleOverlay, 0, 0, width, height);
drawBiomeBackground("earth");
    fill(255);
    textAlign(CENTER);
    textSize(18);
    text("Start or Help", width / 2, height / 2 + 40);

    text("Fish Caught: " + caughtFish.length, width / 2, height / 2 + 85);
updateCaughtFish(); // makes them move

let preview = caughtFish.slice(-150);

let startX = width / 2 - 140;
let startY = height / 2 + 140;

for (let i = 0; i < preview.length; i++) {
  let f = preview[i];

  push();

  let x = f.x;
  let y = f.y;

  translate(x, y);

  drawColoredFish({
    x: 0,
    y: 0,
    vx: f.vx || 1,
    data: f.data
  });

  pop();
}
    if (checkButtonPress("Start", width / 2, height / 2 + 150, 120, 40,
      color(80, 200, 120), color(120), color(255))) {
      this.sceneManager.showScene(ML_main);
    }

    if (checkButtonPress("Help", width / 2, height / 2 + 220, 120, 40,
      color(220, 100, 100), color(120), color(255))) {
      this.sceneManager.showScene(ML_help);
    }
  }
}

// MAP SELECT
function ML_main() {

  this.enter = function () {
    snd4.stop();
    ghosty.visible = false;
  }

  this.draw = function () {

    fillGradient('radial', {
      from: [width / 2, height / 2, 0],
      to: [width / 2, height / 2, width],
      steps: [color(0, 40, 90), color(0, 200, 255), color(0, 0, 40)]
    });

    rect(0, 0, width, height);

    // SONAR EFFECT
    push();
    translate(width / 2, height / 2);
    noFill();

    for (let i = 0; i < 8; i++) {
      let r = (frameCount * 8 + i * 60) % 900;
      stroke(0, 255, 255, 120 - i * 12);
      strokeWeight(2);
      ellipse(0, 0, r, r);
    }

    pop();

    // GRID
    for (let y = 0; y < height; y += 35) {
      for (let x = 0; x < width; x += 35) {
        let s = map(cos(frameCount * 0.03 + x * 0.03), -1, 1, 10, 28);
        noStroke();
        fill(0, 255, 255, 20);
        rect(x, y, s, s, 4);
      }
    }

    // TITLE
    // BACK BUTTON
let backBtn = checkButtonPress(
  "Back",
  80,
  50,
  120,
  45,
  color(220, 120, 120),
  color(180),
  color(255)
);

if (backBtn) {
  playshortsound();
  this.sceneManager.showScene(ML_home);
}
    fill(255);
    textAlign(CENTER);
    textSize(48);
    text("MAP SELECT", width / 2, 80);

    textSize(16);
    text("Choose a biome", width / 2, 110);

    // CARD SETTINGS
    let cardW = 250;
    let cardH = 180;
    let gap = 40;

    let totalWidth = (cardW * 3) + (gap * 2);
    let startX = (width - totalWidth) / 2;
    let y = 300;

    // CARD POSITIONS
    let c1x = startX + cardW / 2;
    let c2x = startX + cardW + gap + cardW / 2;
    let c3x = startX + (cardW + gap) * 2 + cardW / 2;

    // DRAW CARDS (now clickable)
    if (drawBiomeCard(c1x, y, "Earth Ocean", 0)) {
      this.sceneManager.showScene(ML_gameScene);
    }

    if (drawBiomeCard(c2x, y, "High Gravity", 1)) {
      this.sceneManager.showScene(ML_gameHighGravity);
    }

    if (drawBiomeCard(c3x, y, "Low Gravity", 2)) {
      this.sceneManager.showScene(ML_gameLowGravity);
    }
  }
}
// HELP
function ML_help() {

  let backBtn = false;

  this.enter = function () {
    snd4.stop();
    ghosty.visible = true;
    ghosty.position.x = width / 2;
    ghosty.position.y = 320;
  }

  this.draw = function () {

    fillGradient('linear', {
      from: [0, height],
      to: [width, 0],
      steps: [color(20, 20, 20), color(0, 150, 200)]
    });

    rect(0, 0, width, height);

    for (let y = 0; y < height; y += 45) {
      for (let x = 0; x < width; x += 45) {

        let s = map(sin(frameCount * 0.01 + y * 0.01), -1, 1, 50, 22);

        noStroke();
        fill(255, 255, 255, 10);

        triangle(
          x, y - s,
          x - s, y + s,
          x + s, y + s
        );
      }
    }

    fill(255);
    textAlign(CENTER);
    textSize(30);
    text("Help", width / 2, 80);

    textSize(18);
text("Catch fish using arrow keys up and down to grow your aquarium", width / 2, 180);
text("Use buttons 1-4 to navigate pages or interact with clickable buttons", width / 2, 220);
    backBtn = checkButtonPress("Back", width / 2, 440, 140, 45,
      color(220, 150, 100), color(180), color(255));

    if (backBtn) this.sceneManager.showScene(ML_home);

    if (ghosty.mouse.pressing()) {
      this.sceneManager.showScene(ML_main);
    }
  }
}

// GAME
function ML_gameScene() {

  let score = 0;

this.enter = function () {
  stopAllMusic(); 
  ghosty.visible = false;
  resetFishSystem("earth");

  playMusic(sndEarth);
}

this.exit = function () {
  stopAllMusic();
}
  this.draw = function () {

    background(0);
    
    image(earthOverlay, 0, 0, width, height);
drawBiomeBackground("earth");
    fill(255);
    textAlign(CENTER);
    textSize(30);
    text("Earth Biome", width / 2, 60);

    textSize(18);
    text("Fish Caught: " + score, width / 2, 120);

    if (checkButtonPress("Home", 80, 50, 120, 45,
      color(50, 120, 180), color(180), color(255))) {
      this.sceneManager.showScene(ML_home);
    }

    // hook
    if (keyIsDown(UP_ARROW)) hookY -= 6;
    if (keyIsDown(DOWN_ARROW)) hookY += 1;
    hookY = constrain(hookY, 60, height - 60);

    stroke(255);
    line(HOOK_X(), 0, HOOK_X(), hookY);

    fill(255, 200, 0);
    ellipse(HOOK_X(), hookY, HOOK_SIZE, HOOK_SIZE);

    // spawn + update fish
    fishSpawnTimer++;
    if (fishSpawnTimer > fishSpawnDelay) {
      fishList.push(createFish("earth"));
      fishSpawnTimer = 0;
    }

    for (let i = fishList.length - 1; i >= 0; i--) {
      let f = fishList[i];

      f.x += f.vx;

      drawColoredFish(f);

      if (dist(HOOK_X(), hookY, f.x, f.y) < 40) {
  score++;

  if (sndCatch && sndCatch.isPlaying()) {
    sndCatch.stop(); // 
  }
  sndCatch.play();

  caughtFish.push({
    x: random(width),
    y: random(height),
    vx: random([-2, 2]),
    vy: random(-1, 1),
    data: f.data
  });

  fishList.splice(i, 1);
}
    }
  }
}
function ML_gameHighGravity() {

  let score = 0;

  this.enter = function () {
  stopAllMusic(); 
  ghosty.visible = false;
  resetFishSystem("earth");

  playMusic(snd4);
}

this.exit = function () {
  stopAllMusic();
}
  this.draw = function () {

    background(0);
    image(highOverlay, 0, 0, width, height);
drawBiomeBackground("high");
    fill(255);
    textAlign(CENTER);
    textSize(30);
    text("High Gravity", width / 2, 60);

    textSize(18);
    text("Fish Caught: " + score, width / 2, 120);

    if (checkButtonPress("Home", 60, 40, 100, 40,
      color(50, 120, 180), color(180), color(255))) {
      this.sceneManager.showScene(ML_home);
    }

    // hook physics
    hookY += 2.8;
    if (keyIsDown(UP_ARROW)) hookY -= 2.5;
    hookY *= 0.995;
    hookY = constrain(hookY, 40, height - 40);

    stroke(255);
    line(HOOK_X(), 0, HOOK_X(), hookY);

    fill(255, 200, 0);
    ellipse(HOOK_X(), hookY, HOOK_SIZE, HOOK_SIZE);

    // spawn
    fishSpawnTimer++;
    if (fishSpawnTimer > fishSpawnDelay) {
      fishList.push(createFish("high"));
      fishSpawnTimer = 0;
    }

    // update fish (fast + left right movement)
    for (let i = fishList.length - 1; i >= 0; i--) {
      let f = fishList[i];

      f.x += f.vx;

      drawColoredFish(f);

if (dist(HOOK_X(), hookY, f.x, f.y) < 40) {
  score++;

  if (sndCatch && sndCatch.isPlaying()) {
    sndCatch.stop(); // prevents spam stacking
  }
  sndCatch.play();

  caughtFish.push({
    x: random(width),
    y: random(height),
    vx: random([-2, 2]),
    vy: random(-1, 1),
    data: f.data
  });

  fishList.splice(i, 1);
}    }
  }
}

function ML_gameLowGravity() {

  let score = 0;

this.enter = function () {
  stopAllMusic(); 
  ghosty.visible = false;
  resetFishSystem("earth");

  playMusic(sndLowGrav);
}
this.exit = function () {
  stopAllMusic();
}
  this.draw = function () {

    background(0);
    image(lowOverlay, 0, 0, width, height);
drawBiomeBackground("low");
    fill(255);
    textAlign(CENTER);
    textSize(30);
    text("Low Gravity", width / 2, 60);

    textSize(18);
    text("Fish Caught: " + score, width / 2, 120);

    if (checkButtonPress("Home", 60, 40, 100, 40,
      color(50, 120, 180), color(180), color(255))) {
      this.sceneManager.showScene(ML_home);
    }

    // hook
    if (keyIsDown(UP_ARROW)) hookY -= 6;
    if (keyIsDown(DOWN_ARROW)) hookY += 1;
    hookY = constrain(hookY, 40, height - 40);

    stroke(255);
    line(HOOK_X(), 0, HOOK_X(), hookY);

    fill(255, 200, 0);
    ellipse(HOOK_X(), hookY, HOOK_SIZE, HOOK_SIZE);

    // 
    fishSpawnTimer++;
    if (fishSpawnTimer > fishSpawnDelay / 2) {
      fishList.push(createFish("low"));
      fishSpawnTimer = 0;
    }

    // movement
    for (let i = fishList.length - 1; i >= 0; i--) {
      let f = fishList[i];

      f.x += f.vx;
      f.y += sin(frameCount * 0.02 + i) * 1.5;

      drawColoredFish(f);

  if (dist(HOOK_X(), hookY, f.x, f.y) < 40) {
  score++;

  if (sndCatch && sndCatch.isPlaying()) {
    sndCatch.stop(); 
  }
  sndCatch.play();

  caughtFish.push({
    x: random(width),
    y: random(height),
    vx: random([-2, 2]),
    vy: random(-1, 1),
    data: f.data
  });

  fishList.splice(i, 1);
}
    }
  }
}
// FISH
function drawFish(x, y, s) {
  noStroke();
  fill(255, 120, 120);
ellipse(x, y, s * 1.2, s * 0.8);
triangle(x + s * 0.6, y, x + s * 0.6 + 10, y - 5, x + s * 0.6 + 10, y + 5);}

function drawMovingFish(x, y, s, vx) {
  push();
  translate(x, y);

  if (vx < 0) scale(-1, 1); // flip left

  noStroke();
  fill(255, 120, 120);

  ellipse(0, 0, s * 1.2, s * 0.8);

  triangle(
    s * 0.6, 0,
    s * 0.6 + 10, -5,
    s * 0.6 + 10, 5
  );

  pop();
}
function drawColoredFish(f) {

  let c = f.data.col;
  let species = f.data.species || "default";
  let scaleSize = f.data.size || 1;

  let bodyW = 30 * scaleSize;
  let bodyH = 20 * scaleSize;

  push();
  translate(f.x, f.y);

  let dir = (f.vx < 0) ? -1 : 1;
  scale(dir, 1);

  noStroke();

  // EARTH BIOME

  //  DEFAULT BLUE FISH 
  if (species === "default") {

    fill(c[0], c[1], c[2]);

    ellipse(0, 0, bodyW, bodyH);

    // tail
    triangle(
      -bodyW * 0.5, 0,
      -bodyW * 0.9, -8,
      -bodyW * 0.9, 8
    );

    // top fin
    triangle(
      -2, -bodyH * 0.3,
      8, -bodyH,
      18, -bodyH * 0.2
    );

    // side fin
    fill(c[0] + 20, c[1] + 20, c[2] + 20, 180);

    ellipse(4, 5, 10, 5);
  }

  //  CRAB
  else if (species === "crab") {

    fill(c[0], c[1], c[2]);

    ellipse(0, 0, bodyW * 1.1, bodyH * 0.9);

    triangle(-10, 8, -18, 16, -2, 12);
    triangle(5, 8, 16, 16, 0, 12);

    triangle(-10, -8, -18, -16, -2, -12);
    triangle(5, -8, 16, -16, 0, -12);

    // claws
    triangle(
      bodyW * 0.25, -4,
      bodyW * 0.6, -14,
      bodyW * 0.45, 0
    );

    triangle(
      bodyW * 0.25, 4,
      bodyW * 0.6, 14,
      bodyW * 0.45, 0
    );

    // spikes
    for (let i = -1; i <= 1; i++) {
      triangle(
        i * 6, -bodyH * 0.4,
        i * 6 + 3, -bodyH * 0.8,
        i * 6 + 6, -bodyH * 0.4
      );
    }
  }

  //  JELLY
  else if (species === "jelly") {

  fill(c[0], c[1], c[2]);

  ellipse(0, -2, bodyW * 0.9, bodyH);

  let dir = 1; 

  //  tendrils
  stroke(c[0], c[1], c[2]);
  strokeWeight(2);

  for (let i = -2; i <= 2; i++) {

    line(
      i * 4,
      bodyH * 0.2,
      i * 4 + sin(frameCount * 0.08 + i) * 5 * dir,
      bodyH + 10
    );
  }

  noStroke();

  // side fins
  ellipse(-10, 0, 8, 14);
  ellipse(10, 0, 8, 14);

  // EYES 
  fill(255);
  ellipse(-6, -6, 4, 4);
  ellipse(6, -6, 4, 4);

  fill(0);
  ellipse(-6, -6, 2, 2);
  ellipse(6, -6, 2, 2);
}

  // HIGH GRAVITY

  // SCALE FISH
  else if (species === "scalefish") {

    fill(20, 120, 130);

    ellipse(0, 0, bodyW * 1.7, bodyH * 0.55);

    triangle(
      -bodyW * 0.8, 0,
      -bodyW * 1.4, -10,
      -bodyW * 1.4, 10
    );

    // armor plates
    fill(40, 170, 180);

    for (let i = -2; i <= 2; i++) {
      rect(i * 8, -4, 5, 8, 2);
    }

    //  fins
    triangle(-5, -6, 0, -18, 8, -6);
    triangle(10, -5, 18, -14, 24, -5);

    triangle(0, 5, 8, 14, 16, 5);
  }

  //  SHARK 
  else if (species === "shark") {

    fill(c[0], c[1], c[2]);

    ellipse(0, 0, bodyW * 1.5, bodyH * 0.6);

    //  tail
    triangle(
      -bodyW * 0.7, 0,
      -bodyW * 1.3, -14,
      -bodyW * 1.3, 14
    );

    //  fins
    triangle(0, -5, 12, -22, 24, -4);

    triangle(-10, 5, 0, 14, 10, 5);

    //  gills
    stroke(255, 120);

    line(10, -4, 10, 4);
    line(14, -4, 14, 4);
    line(18, -4, 18, 4);

    noStroke();
  }

  //  spikefish 
  else if (species === "spikefish") {

    fill(40, 70, 120);

    ellipse(0, 0, bodyW * 1.2, bodyH * 0.7);

    // armored shell spikes
    for (let i = -2; i <= 2; i++) {

      triangle(
        i * 6,
        -bodyH * 0.3,
        i * 6 + 3,
        -bodyH,
        i * 6 + 6,
        -bodyH * 0.3
      );
    }

    // fins
    triangle(-8, 5, -18, 12, -2, 8);
    triangle(8, 5, 18, 12, 2, 8);

    // tail
    triangle(
      -bodyW * 0.6, 0,
      -bodyW, -8,
      -bodyW, 8
    );
  }

  
  // LOW GRAVITY

  //  PUFFER 
  else if (species === "puffer") {

    fill(c[0], c[1], c[2]);

    ellipse(0, 0, bodyW * 0.9, bodyH * 0.9);

    // spikes
    stroke(c[0], c[1], c[2]);

    for (let a = 0; a < TWO_PI; a += PI / 8) {

      let x1 = cos(a) * bodyW * 0.45;
      let y1 = sin(a) * bodyH * 0.45;

      let x2 = cos(a) * bodyW * 0.7;
      let y2 = sin(a) * bodyH * 0.7;

      line(x1, y1, x2, y2);
    }

    noStroke();

triangle(
  bodyW * 0.45, 0,
  bodyW * 0.85, -4,
  bodyW * 0.85, 4
);

// tail 
triangle(
  -bodyW * 0.5, 0,
  -bodyW * 0.95, -10,
  -bodyW * 0.95, 10
);
  }

//  bluefish 
else if (species === "bluefish") {

  //  BODY 
  fill(c[0], c[1], c[2]);
  ellipse(0, 0, bodyW * 1.6, bodyH * 1.2);

  fill(255, 255, 255, 120);
  ellipse(0, 0, bodyW * 0.7, bodyH * 0.5);

  fill(c[0], c[1], c[2], 200);

  triangle(
    -bodyW * 0.2, 0,
    -bodyW * 1.1, -bodyH * 0.8,
    -bodyW * 0.8, 0
  );

  triangle(
    -bodyW * 0.2, 0,
    -bodyW * 1.1, bodyH * 0.8,
    -bodyW * 0.8, 0
  );

  triangle(
    bodyW * 0.2, 0,
    bodyW * 1.1, -bodyH * 0.8,
    bodyW * 0.8, 0
  );

  triangle(
    bodyW * 0.2, 0,
    bodyW * 1.1, bodyH * 0.8,
    bodyW * 0.8, 0
  );

  // TAIL 
  fill(c[0], c[1], c[2]);
  triangle(
    -bodyW * 0.9, 0,
    -bodyW * 1.5, -10,
    -bodyW * 1.5, 10
  );

  fill(255);
  ellipse(bodyW * 0.35, -2, 6, 6);

  
}
  //  cloudfish 
else if (species === "cloudfish") {

  fill(c[0], c[1], c[2]);

  ellipse(0, 0, bodyW * 1.2, bodyH * 0.9);

  // wing 
  ellipse(-16, 0, 14, 30);
  

  // tail 
  triangle(
    -bodyW * 0.6, 0,
    -bodyW * 1.1, -8,
    -bodyW * 1.1, 8
  );

  fill(255);
  ellipse(8, -2, 7, 7);

 
}
  // EYE

  fill(255);
  ellipse(bodyW * 0.2, -2, 5, 5);

  fill(0);
  ellipse(bodyW * 0.2, -2, 2, 2);

  pop();
}
function checkButtonPress(str, bx, by, boxW, boxH, up, over, down) {

  let hover =
    mouseX > bx - boxW / 2 &&
    mouseX < bx + boxW / 2 &&
    mouseY > by - boxH / 2 &&
    mouseY < by + boxH / 2;

  let state = false;
  let col = up;

  if (hover) {
    col = mouseIsPressed ? down : over;
    state = mouseIsPressed;
  }

  push();
  rectMode(CENTER);
  fill(col);
  stroke(255);
  rect(bx, by, boxW, boxH, 10);

  fill(20);
  noStroke();
  textAlign(CENTER, CENTER);
  textSize(16);
  text(str, bx, by);
  pop();

  let result = false;

  if (state && !clickLock) {
  result = true;
  clickLock = true;

  playshortsound();
}

  if (!mouseIsPressed) clickLock = false;

  return result;
}

// SOUND
function playshortsound() {
  if (!snd2.isPlaying()) snd2.play();
  else snd2.stop();
}
function drawBiomeCard(x, y, name, type) {

  let w = 250;
  let h = 180;

  let hover =
    mouseX > x - w / 2 &&
    mouseX < x + w / 2 &&
    mouseY > y - h / 2 &&
    mouseY < y + h / 2;

  push();
  rectMode(CENTER);

  // CARD
  fill(hover ? color(40, 80, 140) : color(20, 40, 80, 220));
  stroke(255);
  rect(x, y, w, h, 15);

  // PLAY TEXT
  fill(255);
  textAlign(CENTER);
  textSize(14);
  text("PLAY", x, y - 70);

  // TITLE
  textSize(18);
  text(name, x, y + 70);

  // OVERLAY PREVIEW
  imageMode(CENTER);

  if (type === 0) {
    image(earthOverlay, x, y - 5, 180, 100);
  }

  if (type === 1) {
    image(highOverlay, x, y - 5, 180, 100);
  }

  if (type === 2) {
    image(lowOverlay, x, y - 5, 180, 100);
  }

  pop();

  // CLICK RETURN
  let clicked = hover && mouseIsPressed && !clickLock;

  if (clicked) {
    clickLock = true;
    return true;
  }

  if (!mouseIsPressed) {
    clickLock = false;
  }

  return false;
}
function drawBiomeBackground(type) {
  noStroke();

  //  BUBBLES 
  for (let i = 0; i < 25; i++) {
    let x = (frameCount * 0.5 + i * 80) % width;
    let y = (i * 97 + frameCount * 0.3) % height;

    fill(255, 255, 255, 60);
    ellipse(x, y, 6 + (i % 3) * 2);
  }

  
}