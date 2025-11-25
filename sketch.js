let img;
let emojiRGB = null;
const Grid_W = 40;
const Grid_H = 40;
const Cell_size = 16;
let ready = false;
let emojiGrid = [];
let emojiText;
let selectedText = "";
let currentIndex = 0;
let cnv;
let infoDiv; 
const imagePaths = [
  "eye.png",
  "rabbit.jpeg",
  "pink.jpeg",
  "black.jpeg",
  "blue.jpeg",
  "red.jpeg",
  "green.jpeg",
  "cat.jpeg",
  "strawberry.jpeg",
];

function preload() {
  img = loadImage("pink.jpeg");
  emojiRGB = loadJSON("emoji.json");
  emojiText = loadJSON("emojiText.json");
}
function setup() {

  
  W = Grid_W * Cell_size;
  H = Grid_H * Cell_size;
  cnv = createCanvas(W, H);
  centerCanvas();
  textAlign(CENTER, CENTER);
  textSize(Cell_size);
  img.resize(Grid_W, Grid_H);
  image(img, 0, 0, W, H);
  textSize(Cell_size);
  buildEmojiGrid();
  console.log("emojiText:", emojiText);

  const btn = createButton("change image");
  btn.position(10, 10);
  btn.mousePressed(changeImage);
  btn.addClass('changeimage');

  const downloadBtn = createButton("download");
  downloadBtn.position(10, 40);
  downloadBtn.mousePressed(saveImage);
  downloadBtn.addClass('downloadBtn'); 

  const fileInput = createFileInput(handleFile);
  fileInput.position(10, 70);
  fileInput.attribute("accept", "image/*");
 
  
  const clickTip = createDiv("click the emoji");
  clickTip.style('color', '#ff00ff');
  clickTip.style('font-family','Helvetica');
  clickTip.position(10, 130);    // 提示文字：也在左边
  
  infoDiv = createDiv("");
  infoDiv.addClass('emojiInfo');   // 方便用 CSS 改样式（可选）

  // 让它在画布下面一点点
  const x = cnv.position().x;              // 如果你有 cnv 变量
  const y =  20;
  infoDiv.position(x, y);

  

  ready = true;

  //console.log([emojiRGB])
}

function draw() {
  background(250,25);
  image(img, 0, 0, W, H);
  //if( mouseX >= 0 && mouseX<width && mouseY>= 0 &&mouseY< height){
  //const c = get(mouseX,mouseY);
  // console.log(c);
  //}
  if (!ready) {
    text("loading...", width / 2, height / 2);
    return;
  }
  drawEmojiGrid();
  // if (selectedText !== "") {
  //   const x = W / 2;   // 中心位置
  // const y = ;

 
  // noStroke();
  // fill(255, 0, 255, 180);        
  // rectMode(CENTER);           
  // rect(x, y, W * 0.8, 40, 10); 

  // // 2. 再画文字
  // fill(255, 255, 0);          
  // textAlign(CENTER, CENTER); 
  // text(selectedText, x, y);
  // }
}
function drawEmojiGrid() {
  for (y = 0; y < Grid_H; y++) {
    for (x = 0; x < Grid_W; x++) {
      const emoji = emojiGrid[y][x];
      cx = x * Cell_size + Cell_size / 2;
      cy = y * Cell_size + Cell_size / 2;
      text(emoji, cx, cy);
    }
  }
}
function buildEmojiGrid() {
  emojiGrid = [];
  for (y = 0; y < Grid_H; y++) {
    let row = [];
    for (x = 0; x < Grid_W; x++) {
      const c = img.get(x, y);
      const r = c[0];
      const g = c[1];
      const b = c[2];
      const emoji = getClosetemoji(r, g, b);
      row.push(emoji);
    }
    emojiGrid.push(row);
  }
}
function colordist(r1, g1, b1, r2, g2, b2) {
  const dr = r1 - r2;
  const dg = g1 - g2;
  const db = b1 - b2;
  return dr * dr + dg * dg + db * db;
}
function getClosetemoji(r, g, b) {
  let bestemoji = null;
  let bestDist = Infinity;
  for (const emoji in emojiRGB) {
    const rgb = emojiRGB[emoji];
    const er = rgb[0];
    const eg = rgb[1];
    const eb = rgb[2];
    const d = colordist(r, g, b, er, eg, eb);

    if (d < bestDist) {
      bestDist = d;
      bestemoji = emoji;
    }
  }
  return bestemoji;
}

//}
function mousePressed() {
  if (!ready) return;
  gx = floor(mouseX / Cell_size);
  gy = floor(mouseY / Cell_size);
  if (0 < gx && gx > Grid_W && 0 < gy && gy > Grid_H) {
    return;
  }
  emoji = emojiGrid[gy][gx];
  if (emojiText[emoji]) {
    selectedText = emojiText[emoji];
    infoDiv.html(selectedText); 

    console.log("emojiText:", selectedText);
    //text(selectedText,30,30);
  } else {
    selectedText = "";
    infoDiv.html('');
  }
}


function changeImage() {
  currentIndex = (currentIndex + 1) % imagePaths.length;
  newPath = imagePaths[currentIndex];
  console.log("change to:", newPath);

  loadImage(newPath, (newImg) => {
    img = newImg;
    img.resize(Grid_W, Grid_H);
    buildEmojiGrid();
    selectedText = "";
  });
}



function saveImage() {
  saveCanvas("emoji_art", "png");
}

function handleFile(file) {
  if (file.type === "image") {
    loadImage(file.data, function (newImg) {
      img = newImg; //Replace the global img with the new one
      img.resize(Grid_W, Grid_H);
      image(img, 0, 0, W, H);
      buildEmojiGrid();
      selectedText = "";
    });
  } else {
    console.log("not an image file");
  }
}
function centerCanvas() {
  
  const x = (windowWidth - width) / 2;
  const y = (windowHeight - height) / 2;

  
  cnv.position(x, y);
}
function windowResized() {
  centerCanvas();  
}

