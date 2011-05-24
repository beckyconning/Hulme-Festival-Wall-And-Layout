$(document).ready(function() {
  init();
});
var canvas;
var context;
var gridColor = "333A58";
var images = [];
var loadedImageCount = 0;

function init() {
  canvas = $('#canvas')[0];
  context = canvas.getContext("2d");
  
  canvas.addEventListener("mousemove", drawImageCursor, false);
  canvas.addEventListener("click", setPosition, false);
  $('#position-automatically')[0].addEventListener("click", setPositionAutomatically, false);
  
  
  clear();
  drawGrid(gridColor);
  loadAndDrawImages();
}   

function setPosition(e) {
  var mousePosition = getMousePosition(e);
  var xPosition = Math.floor(mousePosition[0]/10)*10;
  var yPosition = Math.floor(mousePosition[1]/10)*10;
  if (imageCanBePlacedHere(xPosition, yPosition)) {
    $('#advert_x_position').val(xPosition);
    $('#advert_y_position').val(yPosition);
    $('#setPosition').submit();
  }
}

function setPositionAutomatically() {
  var position;
  if (position = firstAvailableValidPosition()) {
    $('#xPosition').val(position[0]);
    $('#yPosition').val(position[1]);
    $('#setPosition').submit();
  }
}

function firstAvailableValidPosition() {
  for (var y = 0; y < (canvas.height - imageCursor.height + 1); y += 10) {
    for (var x = 0; x < (canvas.width - imageCursor.width + 1); x += 10) {
      if (imageCanBePlacedHere(x,y)) {
        return [x,y];
      }
    }
  }
  return false;
}

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
  drawGrid(gridColor);
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
    
function drawGrid(color) {
  //for (var x = 0; x < canvas.width; x += 10) {
  //  context.moveTo(x, 0);
  //  context.lineTo(x, canvas.height);
  //}
  //
  //for (var y = 0; y < canvas.height; y += 10) {
  //  context.moveTo(0, y);
  //  context.lineTo(canvas.width, y);
  //}
  //
  //context.lineWidth = "1";
  //context.strokeStyle = color;
  //context.stroke();
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

function imageIsOverlapped(xPosition, yPosition) {
  var overlap = false;
  for (advert in adverts) {
    // if cursor image's left edge is within the horizontal bounds of another image
    if (xPosition >= adverts[advert][0] && xPosition < adverts[advert][0] + images[advert].width) {
      // if cursor image's top edge is within the vertical bounds of another image
      if (yPosition >= adverts[advert][1] && yPosition < adverts[advert][1] + images[advert].height) {
        overlap = true;
        break;
      }
    }
    
    // if cursor image's right edge is within the horizontal bounds of another image
    if (xPosition + imageCursor.width > adverts[advert][0] && xPosition < adverts[advert][0] + images[advert].width) {
      // if cursor image's bottom edge is within the horizontal bounds of another image
      if (yPosition + imageCursor.height > adverts[advert][1] && yPosition < adverts[advert][1] + images[advert].height) {
        overlap = true;
        break;
      }
    }
  }
  
  return overlap;
}

function imageIsOutOfBounds(xPosition, yPosition) {
  var outOfBounds = false;
  for (advert in adverts) {
    // if cursor image's right or bottom edges are outside of the canvas' bounds
    if (xPosition + imageCursor.width > canvas.width + 1 || yPosition + imageCursor.height > canvas.height + 1) {
      outOfBounds = true;
      break;
    }
  }
  
  return outOfBounds;
}

function imageCanBePlacedHere(xPosition, yPosition) {      
  if (imageIsOverlapped(xPosition, yPosition) || imageIsOutOfBounds(xPosition, yPosition)) {
    return false;
  }
  else {
    return true
  }
}

function drawImageCursor(e) {
  draw();
  
  if (loadedImageCount >= adverts.length) {
    var mousePosition = getMousePosition(e);
    var xPosition = Math.floor(mousePosition[0]/10)*10;
    var yPosition = Math.floor(mousePosition[1]/10)*10;
    
    context.drawImage(imageCursor, xPosition, yPosition);
    
    context.lineWidth = 1; 
    
    if (imageCanBePlacedHere(xPosition, yPosition)) {
      context.strokeStyle = '#333A58';
    }
    else {
      context.strokeStyle = '#F80016';
    }
    
    context.strokeRect(xPosition, yPosition, imageCursor.width, imageCursor.height);
  }
}