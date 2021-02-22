

var wrapText = function(context, text, x, y, maxWidth, lineHeight) {
    var words = text.split(' ');
    var line = '';

    for(var n = 0; n < words.length; n++) {
        var testLine = line + words[n] + ' ';
        var metrics = context.measureText(testLine);
        var testWidth = metrics.width;
        if (testWidth > maxWidth && n > 0) {
            context.strokeText(line, x, y);
            context.fillText(line, x, y);
            line = words[n] + ' ';
            y += lineHeight;
        } else {
            line = testLine;
        }
    }

    context.strokeText(line, x, y);
    context.fillText(line, x, y);
    return context;
}

var transform = function(canvas, context, centerx, centery, image, operations){
    context.save();
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.translate(canvas.width / 2, canvas.height / 2);

    if (operations.scale !== undefined)
        context.scale(operations.scale, operations.scale);

    if (operations.rotate !== undefined)
        context.rotate(operations.rotate * Math.PI / 180);

    context.translate(-canvas.width / 2, -canvas.height / 2);
    context.drawImage(image, centerx, centery);
    context.restore();
    return context;
}

var imprintImageToCanvas = function(canvas, image, height, width){
    var context = canvas.getContext('2d');
    context.drawImage(image, height, width);
    return context;
}

$(document).ready(function(){
    var image = $('#default-image')[0];

    var deviceWidth = window.innerWidth;
    var size = Math.min(300, deviceWidth-20);
    var lineHeight = 30;

    var canvas = $('canvas')[0];
    canvas.width = size;
    canvas.height = size;

    var centerx = canvas.width/2 - image.width/2;
    var centery = canvas.height/2 - image.height/2;

    var context = imprintImageToCanvas(canvas, image, centerx, centery);

    context.textAlign = 'center';
    context.lineWidth  = 4;
    context.font = '20pt Calibri';
    context.strokeStyle = 'black';
    context.fillStyle = 'white';

    var updateCanvas = function(){
        context = transform(canvas, context, centerx, centery, image, operations);
        context = wrapText(context, lowerText, size/2, size-10, size, lineHeight);
        context = wrapText(context, upperText, size/2, lineHeight+10, size, lineHeight);
    }

    var operations = {
        scale: $('#scale-image').val(),
        rotate: $('#rotate-image').val()
    }

    var lowerText = $('#lower-message').val();
    var upperText = $('#upper-message').val();

    updateCanvas();

    $('#lower-message').on('input', function(){
        lowerText = $('#lower-message').val();
        updateCanvas();
    });

    $('#upper-message').on('input', function(){
        upperText = $('#upper-message').val();
        updateCanvas();
    });

    $('#scale-image').change(function(){
        operations.scale = this.value;
        updateCanvas();
    });

    $('#rotate-image').change(function(){
        operations.rotate = this.value;
        updateCanvas();
    });

    $('#upload-image').change(function(){
        var reader = new FileReader();
        reader.onload = function(event) {
            context.clearRect(0, 0, canvas.width, canvas.height);
            img = new Image();
            img.onload = function(){
                context.drawImage(img,0,0);
                updateCanvas();
            }
            img.src = reader.result;
            image = img;
        }
        reader.readAsDataURL(this.files[0]);
    });

    $('#download-image').click(function(){
        this.href = canvas.toDataURL();
    });
});
