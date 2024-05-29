var showimage = null; 
var hideimage = null;

function uploadShown() { 
    var can1 = document.getElementById("shown");
    var fileInput = document.getElementById("showfile");
    
    if (fileInput.files && fileInput.files[0]) {
        var reader = new FileReader();
        reader.onload = function(e) {
            var img = new Image();
            img.onload = function() {
                showimage = new SimpleImage(img);
                showimage.drawTo(can1);
                resizeShownImage();
                getShownPixel();
            };
            img.src = e.target.result;
        }
        reader.readAsDataURL(fileInput.files[0]);
    }
}

function uploadHidden() { 
    if (showimage == null) {
        alert("Please upload the shown image first.");
        var fileInput = document.getElementById("hidefile");
        fileInput.value = "";
    } else {
        var can2 = document.getElementById("hidden");
        var fileInput = document.getElementById("hidefile");
        
        if (fileInput.files && fileInput.files[0]) {
            var reader = new FileReader();
            reader.onload = function(e) {
                var img = new Image();
                img.onload = function() {
                    hideimage = new SimpleImage(img);
                    hideimage.drawTo(can2);
                    resizeHiddenImage();
                    getHiddenPixel();
                };
                img.src = e.target.result;
            }
            reader.readAsDataURL(fileInput.files[0]);
        }
    }
}

function resizeShownImage() {
  
    var maxWidth = 300;
    var maxHeight = 300;
    var originalWidth = showimage.getWidth();
    var originalHeight = showimage.getHeight();
    
    var resizeWidth = false;
    var resizeHeight = false;
    
    /* Check to see if the shown image is greater than the seen image */
    if (originalWidth > maxWidth) {
        resizeWidth = true;
    }
    if (originalHeight > maxHeight) {
        resizeHeight = true;
    }
    
    /* If both w & h are larger find which aspect ratio to use (choose the smaller of the two) */
    if (resizeWidth && resizeHeight) {
        
        var aspectRatioW = originalWidth / originalHeight;
        var aspectRatioH = originalHeight /originalWidth;
      
        console.log("aspectRatioW", aspectRatioW);
        console.log("aspectRatioH", aspectRatioH);
        if (aspectRatioW > aspectRatioH) {
            var aspectRatio = aspectRatioW;
            var newWidth = maxWidth;
            var newHeight = Math.round(newWidth / aspectRatio);
        }
        else {
            var aspectRatio = aspectRatioH;
            var newHeight = maxHeight;
            var newWidth = Math.round(newHeight / aspectRatio);
        }
        
    }
    
    /* If w is larger, set new w & set h based on aspect ratio */
    else if (resizeWidth) {
        var newWidth = maxWidth;
        var aspectRatio = originalWidth / originalHeight;
        var newHeight = Math.round(newWidth / aspectRatio);
    }
    /* If h is larger, set new h & set w based on aspect ratio */
    else if (resizeHeight) {
        var newHeight = maxHeight;
        var aspectRatio = originalHeight / originalWidth;
        var newWidth = Math.round(newHeight / aspectRatio);
    }
    /* But if the image fits in the other image no need to resize */
    else {
        var newWidth = originalWidth;
        var newHeight = originalHeight;
    }
  
    showimage.setSize(newWidth,newHeight);
    var can1 = document.getElementById("shown");
    showimage.drawTo(can1);

}

function resizeHiddenImage() {

    var maxWidth = showimage.getWidth();
    var maxHeight = showimage.getHeight();

    hideimage.setSize(maxWidth, maxHeight);

    var can2 = document.getElementById("hidden");
    hideimage.drawTo(can2);
}

function getShownPixels() {
  for (var pixel of showimage.values()) {
    
    var newSR = Math.floor(pixel.getRed()/16) * 16;
    var newSG = Math.floor(pixel.getGreen()/16) * 16;
    var newSB = Math.floor(pixel.getBlue()/16) * 16;
    
    pixel.setRed(newSR);
    pixel.setGreen(newSG);
    pixel.setBlue(newSB);
  }
}

function getHidenPixels() {
  for (var pixel of hideimage.values()){
    
    var newHR = Math.floor(pixel.getRed()/16);
    var newHG = Math.floor(pixel.getGreen()/16);
    var newHB = Math.floor(pixel.getBlue()/16);
    
    pixel.setRed(newHR);
    pixel.setGreen(newHG);
    pixel.setBlue(newHB);
  }
}

function combinePixels() {
  var showPixels = showimage.values();
  var hidePixels = hideimage.values();
  
  for (var i = 0; i < showPixels.length; i++) {
    var showPixel = showPixels[i];
    var hidePixel = hidePixels[i];
    
    var newR = (Math.floor(showPixel.getRed() / 16) * 16) + Math.floor(hidePixel.getRed() / 16);
    var newG = (Math.floor(showPixel.getGreen() / 16) * 16) + Math.floor(hidePixel.getGreen() / 16);
    var newB = (Math.floor(showPixel.getBlue() / 16) * 16) + Math.floor(hidePixel.getBlue() / 16);
    
    showPixel.setRed(newR);
    showPixel.setGreen(newG);
    showPixel.setBlue(newB);
    
  }
  var can1 = document.getElementById("shown");
  var cxt1 = can1.getContext("2d");
  showimage.drawTo(can1);
  
  var can2 = document.getElementById("hidden");
  var cxt2 = can2.getContext("2d");
  cxt2.clearRect(0, 0, can2.width, can2.height);
  
  getComboPixel();
}

function getShownPixel() {
  var shwPix = showimage.getPixel(10, 10);
  
  var redSBinary = shwPix.getRed().toString(2).padStart(8, '0');
  var greenSBinary = shwPix.getGreen().toString(2).padStart(8, '0');
  var blueSBinary = shwPix.getBlue().toString(2).padStart(8, '0');

  var showMesInput = document.getElementById("showMes");
  showMesInput.value = "R: " + redSBinary + ", G: " + greenSBinary + ", B: " + blueSBinary; 
}

function getHiddenPixel() {
  var hdePix = hideimage.getPixel(10, 10);
  
  var redHBinary = hdePix.getRed().toString(2).padStart(8, '0');
  var greenHBinary = hdePix.getGreen().toString(2).padStart(8, '0');
  var blueHBinary = hdePix.getBlue().toString(2).padStart(8, '0');

  var hideMesInput = document.getElementById("hideMes");
  hideMesInput.value = "R: " + redHBinary + ", G: " + greenHBinary + ", B: " + blueHBinary; 
}

function getComboPixel() {
  var can = document.getElementById("shown");
  var cxt = can.getContext("2d");
  var imageData = cxt.getImageData(10, 10, 1, 1);
  var pixel = imageData.data;

  var redNBinary = pixel[0].toString(2).padStart(8, '0');
  var greenNBinary = pixel[1].toString(2).padStart(8, '0');
  var blueNBinary = pixel[2].toString(2).padStart(8, '0');

  var newMesInput = document.getElementById("newMes");
  newMesInput.value = "R: " + redNBinary + ", G: " + greenNBinary + ", B: " + blueNBinary; 
}

function extractHiddenImage() {
  /* Not a whole function, only to show the math behind extracting an image that has already been hidden */
  var can = document.getElementById("shown");
  var cxt = can.getContext("2d");
  var imageData = cxt.getImageData(10, 10, 1, 1);
  var pixel = imageData.data;
  
  var newRed = Math.floor(pixel[0] % 16) * 16;
  var newGreen = Math.floor(pixel[1] % 16) * 16;
  var newBlue = Math.floor(pixel[2] % 16) * 16;
  var newAlpha = pixel[3];
  
  pixel[0] = newRed;
  pixel[1] = newGreen;
  pixel[2] = newBlue;
  
  var redBinary = pixel[0].toString(2).padStart(8, '0');
  var greenBinary = pixel[1].toString(2).padStart(8, '0');
  var blueBinary = pixel[2].toString(2).padStart(8, '0');
  
  var newMesInput = document.getElementById("exMes");
  newMesInput.value = "R: " + redBinary + ", G: " + greenBinary + ", B: " + blueBinary; 
}

function clearButt() {
  var can1 = document.getElementById("shown");
  var Context1 = can1.getContext("2d");
  Context1.clearRect(0, 0, can1.width, can1.height);

  var can2 = document.getElementById("hidden");
  var Context2 = can2.getContext("2d");
  Context2.clearRect(0, 0, can2.width, can2.height);
  
  var showfileinput = document.getElementById("showfile");
  var hidefileinput = document.getElementById("hidefile");
  var showmesinput = document.getElementById("showMes");
  var hidemesinput = document.getElementById("hideMes");
  var newmesinput = document.getElementById("newMes");
  
  
  showfileinput.value = "";
  hidefileinput.value = "";
  showmesinput.value = "Upload a shown image";
  hidemesinput.value = "Upload an image to hide";
  newmesinput.value = "Hide your image";
}