//more fish, make sine more prominent, bigger elements
let fishes = [];
let fishWords = ["blub", "glub", "pop", "Meow", "meow"];//did not use
let fishTypes = ["normal", "round"];

let bgWave;
let stage = 1;

// ACT SYSTEM
let bubbles = [];
let particles = [];
let glowParticles = [];
let seaweed = [];

// RECORD  
let recMode = false;
let canvas;

function setup() {
  canvas = createCanvas(1920, 1080);
  frameRate(30);

bgWave = new sdSine(20, 20.0, 120, 300, color(0, 180, 255, 120));
  // FISH
  for (let i = 0; i < 10; i++) {
    fishes.push(new ML_FaceFish(
      random(width),
      random(height),
      random(-2, 2),
      random(-2, 2),
      fishTypes[int(random(fishTypes.length))],
      fishWords[int(random(fishWords.length))]
    ));
  }

  // ACT 2 BUBBLES
  for (let i = 0; i < 60; i++) bubbles.push(new Bubble());

  // ACT 2 SEAWEED
  for (let i = 0; i < 25; i++) seaweed.push(new Seaweed());

  // ACT 4 PARTICLES + CONNECTING LINES
  for (let i = 0; i < 60; i++) particles.push(new Particle());

  // ACT 4 GLOW PARTICLES
  for (let i = 0; i < 40; i++) glowParticles.push(new GlowParticle());
}

function draw() {
  let t = frameCount;

  if (t < 300) stage = 1;
  else if (t < 700) stage = 2;
  else if (t < 1000) stage = 3;
  else stage = 4;

  // BACKGROUND
  if (stage === 1) background(120, 210, 255);
  if (stage === 2) background(40, 140, 200);
  if (stage === 3) background(10, 40, 120);
  if (stage === 4) background(0, 5, 25);

  //  ACT 1 WAVES 
  if (stage === 1) {
    bgWave.setAmp(50);
  } else {
    bgWave.setAmp(30 + stage * 20);
  }

  bgWave.calcWave(0.02);
  bgWave.renderWave();

  // extra wave 
  if (stage === 1) {
    push();
    noStroke();
    fill(255, 255, 255, 40);
 for (let i = 0; i < width; i += 40) {
  let y = height / 2 + sin(frameCount * 0.03 + i * 0.02) * 150;

  fill(255, 255, 255, 60);
  circle(i, y, 30);
}
    pop();
  }

  // ACT 2 SEAWEED & BUBBLES 
  if (stage >= 2) {
    for (let s of seaweed) {
      s.display();
    }

    for (let b of bubbles) {
      b.update();
      b.display();
    }
  }

  //  ACT 4 PARTICLES 
  if (stage === 4) {
    for (let p of particles) {
      p.moveParticle();
      p.createParticle();
      p.joinParticles(particles);
    }

    for (let g of glowParticles) {
      g.update();
      g.display();
    }
  }

  // FISH
  for (let f of fishes) {
    f.move(stage);
    f.display(stage);
  }

  if (stage >= 3) drawAnglerGlow();

 function drawTransition() {
  let fade = 0;

  // ACT 1 to 2
  if (frameCount > 250 && frameCount < 280) {
    fade = map(frameCount, 250, 280, 0, 255); // fade OUT
  } else if (frameCount >= 280 && frameCount < 300) {
    fade = 255; // HOLD (full black)
  } else if (frameCount >= 300 && frameCount < 330) {
    fade = map(frameCount, 300, 330, 255, 0); // fade IN
  }

  // // ACT 2 to 3
  // if (frameCount > 650 && frameCount < 680) {
  //   fade = map(frameCount, 650, 680, 0, 255);
  // } else if (frameCount >= 680 && frameCount < 700) {
  //   fade = 255;
  // } else if (frameCount >= 700 && frameCount < 730) {
  //   fade = map(frameCount, 700, 730, 255, 0);
  // }

  // ACT 3 to 4
  if (frameCount > 950 && frameCount < 980) {
    fade = map(frameCount, 950, 980, 0, 255);
  } else if (frameCount >= 980 && frameCount < 1000) {
    fade = 255;
  } else if (frameCount >= 1000 && frameCount < 1030) {
    fade = map(frameCount, 1000, 1030, 255, 0);
  }

  // DRAW FADE
  if (fade > 0) {
    noStroke();
    fill(0, fade);
    rect(0, 0, width, height);
  }
}
// TRANSITION
drawTransition();
  // RECORD  
  recordit();
}


// FISH CLASS
class ML_FaceFish {
  constructor(x, y, sx, sy, type, word) {
    this.lx = x;
    this.ly = y;
    this.speedx = sx;
    this.speedy = sy;
    this.type = type;
    this.word = word; //not needed bc no text
    this.baseSize = random(0.65, .85);
    this.sc = this.baseSize;
    this.finRot = 0;
    this.finPhase = random(TWO_PI);
    this.eyeSize = random(1.0, 2.0);
    this.hairSize = random(0.9, 1.4);
    this.hueShift = random(-18, 18); //starts as yellow, breaks if  removed
    this.brightShift = random(-15, 15);
    this.hairBase = color(random(80, 255), random(80, 255), random(80, 255)); //pastel tones
  }

  move(stage) {
    this.lx += this.speedx;
    this.ly += this.speedy;
    if (this.lx < 0 || this.lx > width) this.speedx *= -1;
    if (this.ly < 0 || this.ly > height) this.speedy *= -1;
    this.finRot = sin(frameCount * 0.1 + this.finPhase) * 35;
    if (stage >= 3) this.lx += sin(frameCount * 0.01) * 0.5;
  }

  display(stage) {
    push();
    translate(this.lx, this.ly);
    scale(this.sc);
    this.mlHead(stage);
    this.mlFace(stage);
    pop();
  }

  mlFace(stage) {
    this.mlEyes();
    this.mlNose();
    this.mlMouth();
    this.mlHair(stage);
  }

  mlHead(stage) {
    push();
    noStroke();
    let base;
    if (stage === 1) base = color(255, 200, 90);
    else if (stage === 2) base = color(120, 190, 230);
    else if (stage === 3) base = color(70, 120, 200);
    else base = color(30, 60, 120);

    base = color(
      red(base) + this.hueShift,
      green(base) + this.hueShift * 0.5,
      blue(base) + this.brightShift + 40
    );

    fill(base);
    if (this.type === "round") ellipse(0, 0, 240, 200);
    else ellipse(0, 0, 180, 200);

    push();
    translate(-70, 0);
    rotate(radians(this.finRot));
    fill(0, 120, 180, 160);
    triangle(0, 0, -70, -30, -70, 30);
    pop();

    push();
    translate(70, 0);
    rotate(radians(-this.finRot));
    fill(0, 120, 180, 160);
    triangle(0, 0, 70, -30, 70, 30);
    pop();
    pop();
  }

  mlEyes() {
    push();
    scale(this.eyeSize);
    fill(255);
    ellipse(-35, -20, 30, 30);
    ellipse(35, -20, 30, 30);
    fill(0);
    ellipse(-35, -20, 15, 15);
    ellipse(35, -20, 15, 15);
    fill(255);
    ellipse(-40, -20, 6, 6);
    ellipse(40, -20, 6, 6);
    pop();
  }

  mlNose() {
    push();
    scale(1.2);
    fill(200, 80, 60, 150);
    triangle(0, -40, -15, 20, 15, 20);
    pop();
  }

  mlMouth() {
    push();
    fill(255, 120, 120);
    ellipse(0, 60, 50, 45);
    fill(255, 200, 200);
    ellipse(0, 60, 35, 35);
    pop();
  }

  mlHair(stage) {
    push();
    let stageTint;
    if (stage === 1) stageTint = color(255, 220, 120);
    else if (stage === 2) stageTint = color(120, 200, 255);
    else if (stage === 3) stageTint = color(60, 100, 200);
    else stageTint = color(100, 180, 255);
    let finalHair = lerpColor(this.hairBase, stageTint, 0.3); //asked gpt
    fill(finalHair);
    scale(this.hairSize);
    arc(0, -50, 150, 100, PI, TWO_PI);
    pop();
  }
}


// RECORD 
function keyPressed() {
  if (key === 's' || key === 'S') {
    if (isLooping()) noLoop();
    else loop();
  }

  if (key === 'r' || key === 'R') {
    recMode = !recMode;
  }
}

function recordit() {
  if (recMode) {
    let ext = nf(frameCount, 4);
saveCanvas(canvas, 'frame-' + ext, 'jpg');  }
}


// ACT 2 SEAWEED
class Seaweed {
  constructor() {
    this.x = random(width);
    this.baseY = height;
    this.h = random(120, 260);
    this.phase = random(TWO_PI);
  }
display() {
  push();
  stroke(0, 200, 140, 180);
  strokeWeight(4);
  noFill();

  beginShape();
  for (let i = 0; i < this.h; i += 8) {
    let sway = sin(frameCount * 0.03 + this.phase + i * 0.08) * 20;
    vertex(this.x + sway, this.baseY - i);
  }
  endShape();

  pop();
}
}


// ACT 4 GLOW PARTICLES
class GlowParticle {
  constructor() {
    this.x = random(width);
    this.y = random(height);
    this.r = random(2, 6);
    this.vx = random(-0.5, 0.5);
    this.vy = random(-0.5, 0.5);
  }
  update() {
    this.x += this.vx;
    this.y += this.vy;
    if (this.x < 0 || this.x > width) this.vx *= -1;
    if (this.y < 0 || this.y > height) this.vy *= -1;
  }
  display() {
  noStroke();

  fill(120, 200, 255, 60);
  ellipse(this.x, this.y, this.r * 8);

  fill(180, 240, 255, 120);
  ellipse(this.x, this.y, this.r * 4);

  fill(255);
  ellipse(this.x, this.y, this.r * 2);
}
}


// ANGLER GLOW
function drawAnglerGlow() {
  for (let f of fishes) {
    let glowY = f.ly - 90;
    noStroke();
    fill(120, 220, 255, 40);
    ellipse(f.lx, glowY, 80);
    fill(120, 220, 255, 90);
    ellipse(f.lx, glowY, 40);
    fill(255, 255, 255, 180);
    ellipse(f.lx, glowY, 10);
  }
}


// BUBBLES
class Bubble {
  constructor() {
    this.x = random(width);
    this.y = random(height);
    this.r = random(10, 50);
    this.speed = random(0.5, 2);
  }
  update() {
    this.y -= this.speed;
    if (this.y < -20) {
      this.y = height + 20;
      this.x = random(width);
    }
  }
  display() {
    noStroke();
    fill(180, 220, 255, 80);
    ellipse(this.x, this.y, this.r);
  }
}


// PARTICLES
class Particle {
  constructor() {
    this.x = random(width);
    this.y = random(height);
    this.r = random(20, 40);
    this.sx = random(-1, 1);
    this.sy = random(-1, 3);
  }
  moveParticle() {
    this.x += this.sx;
    this.y += this.sy;
    if (this.x < 0 || this.x > width) this.sx *= -1;
    if (this.y < 0 || this.y > height) this.sy *= -1;
  }
  createParticle() {
  noStroke();
  fill(255, 255, 255, 30);
  circle(this.x, this.y, this.r * 3);
}
 joinParticles(list) {
  for (let p of list) {
    let d = dist(this.x, this.y, p.x, p.y);

    if (d < 140) {
      stroke(255, 255, 255, 40);
      strokeWeight(1.5);
      line(this.x, this.y, p.x, p.y);
    }
  }
}
}


// WAVES
class sdSine {
  constructor(xs, t, a, p, c) {
    this.xs = xs;
    this.t = t;
    this.a = a;
    this.p = p;
    this.c = c;
    this.dx = (TWO_PI / this.p) * this.xs;
    this.y = new Array(floor(width / this.xs));
  }
  calcWave(speed) {
    this.t += speed;
    let x = this.t;
    for (let i = 0; i < this.y.length; i++) {
      this.y[i] = sin(x) * this.a;
      x += this.dx;
    }
  }
  renderWave() {
    noStroke();
    fill(this.c);
    for (let i = 0; i < this.y.length; i++) {
      circle(i * this.xs, height / 2 + this.y[i], 10);
    }
  }
  setAmp(a) {
    this.a = a;
  }
}