// RequestAnimFrame: a browser API for getting smooth animations
window.requestAnimFrame = (function() {
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function(callback) {
            window.setTimeout(callback, 1000 / 60);
        };
})();

var keyword = "ABOUT";

var canvas = document.getElementById("particles");
var ctx = canvas.getContext("2d");

var bgCanvas;
var bgctx;

var W = window.innerWidth,
    H = window.innerHeight;
canvas.width = W;
canvas.height = H;

//anim txt
bgCanvas = document.createElement('canvas');
bgctx = bgCanvas.getContext('2d');

bgCanvas.width = window.innerWidth;
bgCanvas.height = window.innerHeight;


bgctx.fillStyle = "#fff";
bgctx.font = '150px impact';
bgctx.fillText(keyword, 85, 275);

var particles = [],
    minDist = 70,
    dist;

var nbParticlesVisbles = 300;

var denseness = 4;

var itercount = 0;
var itertot = 40;


var tabCoordTarget = [];

var getCoords = function() {
    var imageData, pixel, height, width;

    imageData = bgctx.getImageData(0, 0, canvas.width, canvas.height);

    for (height = 0; height < bgCanvas.height; height += denseness) {
        for (width = 0; width < bgCanvas.width; width += denseness) {
            pixel = imageData.data[((width + (height * bgCanvas.width)) * 4) - 1];
            //Pixel is black from being drawn on. 
            if (pixel == 255) {
                tabCoordTarget.push({ x: width, y: height });
                particles.push(new Particle(width, height));
            }
        }
    }


}


function paintCanvas() {
    ctx.fillStyle = "rgba(255,255,255,1)";
    ctx.fillRect(0, 0, W, H);
}

function Particle(goalX, goalY) {

    this.x = Math.random() * W;
    this.y = Math.random() * H;

    this.vx = (-1 + Math.random() * 1) / 5;
    this.vy = (-1 + Math.random() * 1) / 5;

    this.goalX = goalX;
    this.goalY = goalY;

    var velx = (goalX - this.x) / itertot;
    var vely = (goalY - this.y) / itertot;

    this.v = { x: velx, y: vely };

    this.r = true;

    this.radius = Math.random() * 2;

    this.draw = function() {
        ctx.fillStyle = "black";
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);

        ctx.fill();
    }
}


var timer = 0;

document.getElementById('btParticles').addEventListener("click", () => {
    timer = 1;
})

function draw() {

    paintCanvas();

    for (var i = 0; i < particles.length; i++) {
        p = particles[i];
        p.draw();
    }

    if (timer === 0) {
        update();
    } else {
        timer = 1;
        updateTxt();
    }

}

var updateTxt = function() {
    itercount++;
    // nbParticlesVisbles = particles.length;

    for (var i = 0; i < particles.length; i++) {
        p = particles[i];

        if (p.r == true) {
            p.x += p.v.x;
            p.y += p.v.y
        }
        /*} else {
            p.x += Math.random() * 0.01;
            p.y += Math.random() * 0.01;
        }*/
        if (itercount == itertot) {
            p.v = { x: (Math.random() * 6) * 2 - 6, y: (Math.random() * 6) * 2 - 6 };
            p.r = false;
        }

    }
}


function update() {

    for (var i = 0; i < particles.length; i++) {
        p = particles[i];

        p.x += p.vx;
        p.y += p.vy


        if (p.x + p.radius > W)
            p.x = p.radius;

        else if (p.x - p.radius < 0) {
            p.x = W - p.radius;
        }

        if (p.y + p.radius > H)
            p.y = p.radius;

        else if (p.y - p.radius < 0) {
            p.y = H - p.radius;
        }

        for (var j = i + 1; j < particles.length; j++) {
            p2 = particles[j];
            distance(p, p2);
        }
    }
}

// Distance calculator between two particles
function distance(p1, p2) {
    var dist,
        dx = p1.x - p2.x,
        dy = p1.y - p2.y;

    dist = Math.sqrt(dx * dx + dy * dy);

    if (dist <= minDist) {

        ctx.beginPath();
        ctx.strokeStyle = "rgba(0,0,0," + (1.2 - dist / minDist) + ")";
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();
        ctx.closePath();

    }
}

function animloop() {
    draw();
    requestAnimFrame(animloop);
}

getCoords();
setTimeout(() => {
    animloop();
}, 500)