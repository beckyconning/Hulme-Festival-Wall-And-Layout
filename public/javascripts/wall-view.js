$(document).ready(function() {
  init();
});

var context;
var canvas;

function init() {
  canvas = $('#canvas')[0]
  context = canvas.getContext("2d");
  canvas.addEventListener("mousemove", drawAdvertTextAtPosition, false);
  canvas.addEventListener("mouseout", draw, false);
  canvas.addEventListener("click", goToAdvertURLAtPosition, false);
  clear();
  loadAndDrawImages();
}

function getMousePosition(e) {
  var x;
  var y;
  if (e.pageX || e.pageY) { 
    x = e.pageX;
    y = e.pageY;
  }
  else { 
    x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft; 
    y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop; 
  } 
  x -= $('#canvas')[0].offsetLeft;
  y -= $('#canvas')[0].offsetTop;
  return [x,y]
}

function advertIndexAtPosition(xPosition, yPosition) {
  for (advert in adverts) {
    // if horizontal position is within the horizontal bounds of another image
    if (xPosition >= adverts[advert][0] && xPosition < adverts[advert][0] + images[advert].width) {
      // if vertical position is within the vertical bounds of another image
      if (yPosition >= adverts[advert][1] && yPosition < adverts[advert][1] + images[advert].height) {
        console.log(advert);
        return advert;
      }
    }
  }
  return -1;
  console.log(-1);
}

function goToAdvertURLAtPosition(e) {
  var mousePosition = getMousePosition(e);
  var xPosition = Math.floor(mousePosition[0]/10)*10;
  var yPosition = Math.floor(mousePosition[1]/10)*10;
  var advertIndex = advertIndexAtPosition(xPosition, yPosition);
  if (advertIndex >= 0) {
    window.open(adverts[advertIndex][3], adverts[advertIndex][2]);
  }
}

function drawAdvertTextAtPosition(e) {
  var mousePosition = getMousePosition(e);
  var xPosition = Math.floor(mousePosition[0]/10)*10;
  var yPosition = Math.floor(mousePosition[1]/10)*10;
  var advertIndex = advertIndexAtPosition(xPosition, yPosition);
  if (advertIndex >= 0) {
    clear();
    draw();
    context.font = "bold 12px helvetica";
    var textWidth = context.measureText(adverts[advertIndex][2]).width;
    context.fillStyle = "#EBE6D1";
    context.strokeStyle = "333A58";
    
    var horizontalOffset = 0;
    if (mousePosition[0] > (canvas.width / 2)) {
      horizontalOffset = -textWidth;
    }
    
    context.fillRect(mousePosition[0] + horizontalOffset, mousePosition[1] - 10, textWidth, 12);
    context.strokeRect(mousePosition[0] + horizontalOffset, mousePosition[1] - 10, textWidth, 12);
    context.fillStyle = "#333A58";
    context.fillText(adverts[advertIndex][2], mousePosition[0] + horizontalOffset, mousePosition[1]);
  }
  else {
    draw();
  }
}

var images = [];
var loadedImageCount = 0;
function loadAndDrawImages() {
  loadedImageCount = 0;
  for (advert in adverts) {
    console.log(advert);
    images[advert] = new Image();
    images[advert].src = adverts[advert][4];
    images[advert].onload = imageLoaded;
  }
}

function clear() {
  context.clearRect(0, 0, canvas.width, canvas.height);
}

function draw() {
  clear();
  drawImages();
}

function imageLoaded() {
  loadedImageCount ++;
  if (loadedImageCount >= adverts.length) {
    imagesLoaded = true;
    drawImages();
  }
}

function drawImages() {
  for (image in images) {
    context.drawImage(images[image], adverts[image][0], adverts[image][1]);
  }
}