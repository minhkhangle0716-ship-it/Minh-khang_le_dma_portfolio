let snd1, snd2, snd3, snd4;
let sndEarth;
let sndHome;
let sndLowGrav;
let mgr;
let ghosty;
let earthOverlay;
let highOverlay;
let lowOverlay;
let titleOverlay;
let anglerCanvas;

function preload() {
  snd1 = loadSound("assets/mixkit-cartoon-toy-whistle-616.wav");
  snd2 = loadSound("assets/mixkit-one-clap-481.wav");
  sndCatch = loadSound("assets/mixkit-fish-flapping-2457.wav");
  snd4 = loadSound("assets/mixkit-light-rain-loop-2393.wav")
  sndEarth = loadSound("assets/mixkit-birds-chirping-near-the-river-2473.wav");
sndLowGrav = loadSound("assets/mixkit-ocean-of-love-1113.mp3");
sndHome = loadSound("assets/mixkit-majestic-475.mp3");


  earthOverlay = loadImage("assets/a_earth.png");
highOverlay = loadImage("assets/a_high.png");
lowOverlay = loadImage("assets/a_low.png");
titleOverlay = loadImage("assets/a_title.png");
}

function setup() {
  anglerCanvas = createCanvas(1100, 700);
  anglerCanvas.elt.tabIndex = 0;
  anglerCanvas.elt.setAttribute("aria-label", "Alien Angler game. Use the arrow keys to control the fishing hook.");
  anglerCanvas.elt.addEventListener("pointerdown", () => anglerCanvas.elt.focus({ preventScroll: true }));
  window.addEventListener("keydown", event => {
    if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " "].includes(event.key)) {
      event.preventDefault();
    }
  }, { capture: true });

  mgr = new SceneManager();

  ghosty = createSprite(0, 0);
  ghosty.addAnimation("normal",
    "assets/a_1.png",
    "assets/ghost_spin0003.png"
  );

  ghosty.addAnimation("stand",
  "assets/a_1.png",
  "assets/a_2.png",
  "assets/a_3.png"
);
ghosty.animation.frameDelay = 9;

  ghosty.visible = false;

  mgr.addScene(ML_home);
  mgr.addScene(ML_main);
  mgr.addScene(ML_help);
  mgr.addScene(ML_gameScene);
mgr.addScene(ML_gameHighGravity);
mgr.addScene(ML_gameLowGravity);
  mgr.showScene(ML_home);
}

function draw() {
  mgr.draw();
}

function mousePressed() {
  mgr.handleEvent("mousePressed");
}

function mouseReleased() {
  mgr.handleEvent("mouseReleased");
}

function keyPressed() {
  if (key === '1') mgr.showScene(ML_home);
  if (key === '2') mgr.showScene(ML_main);
  if (key === '3') mgr.showScene(ML_help);
  if (key === '4') mgr.showScene(ML_gameScene);
}