
/* 
Make sure to check out the project 1 example on custom functions first.
namely being able to make a custom function with aruguements.
 */

let currentkey = '1';
let bgc ;
let gkcount;
let spiralAngle = 0;


function setup() {
    createCanvas(1000, 700);
    background(255);
    smooth();
    bgc = color(255);
    gkcount = 20;
}


function draw() {
    // triggering the clear_print function
    if( keyIsPressed) {
      clear_print();
    }
    // triggering the newkeychoice
    if(mouseIsPressed) {
     drawChoice();
    }
}


 // wrapper function ( no parameters or arguments )
function drawChoice() {

  /*
   the key mapping if statements that you can change to do anything you want.
   just make sure each key option has the a stroke or fill and then what type of 
   graphic function. The 'key' global property contains whatever key was last pressed
  */


  let currentkey = key;

switch(currentkey) {

case '1':
  drawline(color(0), mouseX, mouseY, pmouseX, pmouseY);
  break;

case '2':
  drawline(color(255,0,0), mouseX, mouseY, pmouseX, pmouseY);
  break;

case '3':
  drawline(color(20,190,155), mouseX, mouseY, pmouseX, pmouseY);
  break;

case '4':
  drawFatLine(color(0,255,255,10), mouseX, mouseY, pmouseX, pmouseY);
  break;

case '5':
  eraser(bgc,mouseX, mouseY,25);
  break;

case '6':
  steveRanBrush(gkcount, mouseX, mouseY, pmouseX, pmouseY);

  if (gkcount > 50 ) {
      gkcount = 1;
  } else {
      gkcount += .5;
  }
  break;

case '7':
  mlglitter(color(250,200,60,90), mouseX, mouseY);
  break;


 case '8':
  mlflower(color(100, 100, 200, 120), mouseX, mouseY, 25, 8);
  break;

case '9':
  mlsticks(color(20,190,155), 8, mouseX, mouseY, pmouseX, pmouseY);
  break;

default:
  console.log("None");
  break;
}

}
//color, x and y of line start, x and y of line end
function drawline( k,  lx, ly,  px, py) {
  
  strokeWeight(10);
  stroke(k);
  line(lx, ly, px, py);
  console.log(mouseX);
  console.log(pmouseX);
}

function drawFatLine( k,  lx, ly,  px, py) {
  strokeWeight(100);
  stroke(k);
  line(lx, ly, px, py);
}

function steveRanBrush(kcount, lx, ly,  px, py) {

  //strokeWeight(random(1,35));
  strokeWeight(kcount);
  stroke(0,kcount*3,0);
  //image(b,lx,ly, 30,30);
  line(lx, ly, px, py);
}

function mlglitter(k, lx, ly) {

  noStroke();

  for (let i = 0; i < 15; i++) {
    fill(k);
    ellipse(lx + random(-20,20), 
            ly + random(-20,20), 
            random(1,5), 
            random(3,1));
  }

}

function eraser( k, lx, ly, sz) {
  fill(k);
  stroke(k);
  ellipse(lx, ly, sz,sz);
}

function clear_print() {

  // these 2 options let you choose between clearing the background
  // and saveing the current image as a file.
  if (key == 'x' || key == 'X') {
    background(255);
  } else if (key == 'p' || key == 'P') {
    saveFrames('image-0', 'png', 1, 1);
    key = '';  // resets the key so it does not make more than one image.
  }

}
function mlflower(k, lx, ly, radius, points) {

  push();
  translate(lx, ly);

  stroke(k);
  strokeWeight(2);
  noFill();

  for (let i = 0; i < points; i++) {
    let angle = spiralAngle + i * TWO_PI / points;
    let x = cos(angle) * radius;
    let y = sin(angle) * radius;
    line(0, 0, x, y);
  }

  spiralAngle += 0.1;
  pop();
}

function mlsticks(k, weight, lx, ly, px, py) {

  stroke(k);
  strokeWeight(weight);
  noFill();

  let offset = sin(frameCount * 0.1) * 30;

  line(lx + offset, ly, px - offset, py);
}
