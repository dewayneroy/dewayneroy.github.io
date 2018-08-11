var pa, equal, path, tool;

function followship(e) {
    var ship = document.querySelector('.spaceship-canvas');
    var canvas = document.getElementById('myCanvas');
    pa = paper.setup(canvas);
    tool = new paper.Tool();
    path = new paper.Path();
    equal = pa.view.size.height;
    var angle;
    var previous;
    var px;
    var py;
    var pos;
    $('.spaceship-canvas').css('top', e.clientY + 'px');
    $('.spaceship-canvas').css('left', e.clientX + 'px');
    tool.onMouseMove = function(event) {
        path.add(event.point);
        if (path._segments.length > 10) { pos = path._segments[path._segments.length - 5];
            px = pos._point._x;
            py = pos._point._y }
        $('.spaceship-canvas').css('top', event.event.pageY + 'px');
        $('.spaceship-canvas').css('left', event.event.pageX + 'px');
        angle = Math.atan2(event.event.pageY - py, event.event.pageX - px) * 180 / Math.PI;
        $('.spaceship-canvas').css('transform', 'rotate(' + (angle + 90) + 'deg) translate(-50%, -50%)')
    }
    init();
    return equal
}
var total = 2000;
var spawnWave = 3;
var spawnFreq = 0.0013;
var colorStep = 0.15;
var vw, vh;
var canvas = document.querySelector("#mcan");
var context = canvas.getContext("2d");
var ticker = TweenLite.ticker;
var xPos = vw / 20;
var yPos = vh * 0.9;
var prevX = xPos;
var prevY = yPos;
var emitX = 0;
var emitY = 0;
var hue = 0;
var lastTime = 0;
var spawnTimer = 0;
var particles = new LinkedList();
var pool = new LinkedList();
var has_stopped = !0;
var hold = 0;
var interval;
var has_moved = !1;
var prevTime = 0;
var frames = 0;

function reset() { total = 2000;
    spawnWave = 3;
    spawnFreq = 0.0013;
    colorStep = 0.15;
    xPos = vw / 20;
    yPos = vh * 0.9;
    prevX = xPos;
    prevY = yPos;
    emitX = 0;
    emitY = 0;
    hue = 0;
    lastTime = 0;
    spawnTimer = 0;
    has_stopped = !0;
    hold = 0;
    interval;
    has_moved = !1;
    prevTime = 0;
    frames = 0 }

function init() {
    vw = canvas.width = window.innerWidth;
    vh = canvas.height = equal;
    var i = total;
    while (i--) { pool.add(new Particle()) }
    lastTime = ticker.time;
    document.addEventListener("mouseenter", enterAction);
    window.addEventListener("resize", resizeAction);
    window.addEventListener("mousemove", mouseAction);
    window.addEventListener("touchmove", touchAction);
    ticker.addEventListener("tick", update)
};
var Particle = (function() {
    var Particle = function() { this.prev = null;
        this.next = null;
        this.alpha = random(0.8, 1);
        this.brightness = random(60, 80);
        this.friction = random(0.98, 1);
        this.gravity = random(0.03, 0.07);
        this.hue = random(0, 360);
        this.size = 2;
        this.time = random(0.7, 1.1);
        this.vx = this._vx = random(-1.75, 1.75);
        this.vy = this._vy = random(-1.5, 1.5);
        this.x = 0;
        this.y = 0;
        this.animation = new TimelineLite({ paused: !0, onComplete: () => { pool.add(particles.remove(this)) } });
        this.animation.to(this, this.time, { alpha: 0.5, brightness: 50, x: random(-5, 5), y: random(-50, 50), ease: Linear.easeNone, modifiers: { x: x => { this.spawnX += this.vx; return this.spawnX + x }, y: y => { this.vy += this.gravity; this.spawnY += this.vy; return this.spawnY + y } } }) }
    Particle.prototype = { spawn: function(x, y, hue, startTime) { var norm = 1 - startTime / this.time;
            this.vx = this._vx;
            this.vy = this._vy;
            this.vy += this.gravity * norm;
            this.spawnX = x + this.vx;
            this.spawnY = y + this.vy;
            this.hue = random(0, 360);
            this.animation.play(startTime) } }
    return Particle
})();

function update() {
    context.fillStyle = "rgba(0,0,0, 1)";
    context.fillRect(0, 0, vw, vh);
    var p = particles.first;
    while (p) { context.fillStyle = `hsla(${p.hue}, 100%, ${p.brightness}%, ${p.alpha})`;
        context.fillRect(p.x, p.y, p.size, p.size);
        p = p.next }
    var current = ticker.time;
    var delta = current - lastTime;
    spawnTimer -= delta;
    while (spawnTimer <= 0) {
        spawnTimer += spawnFreq;
        hue += colorStep;
        var norm = 1 + spawnTimer / delta;
        emitX = prevX + (xPos - prevX) * norm;
        emitY = prevY + (yPos - prevY) * norm;
        if (xPos != prevX || yPos != prevY && has_moved == !0) { var i = spawnWave; while (i--) { if (!pool.size) continue; var color = random(0, 50); var particle = particles.add(pool.remove(pool.first));
                particle.spawn(emitX, emitY, color >> 0, -spawnTimer);
                has_stopped = !1;
                hold = 0 } } else {
            if (has_stopped == !1 && landing_area_bounds != undefined && has_moved == !0) {
                has_stopped = !0;
                clearInterval(interval);
                if (emitX >= landing_area_bounds.left && emitX <= landing_area_bounds.right && emitY >= landing_area_bounds.top && emitY <= landing_area_bounds.bottom) {
                    interval = setInterval(function() {
                        if (hold < 50) { hold++;
                            $('.spot').css('transform', 'scale(' + (hold / 50) + ')') } else if (hold >= 50) { landing();
                            reset();
                            clearInterval(interval); return !1 }
                    }, 16)
                } else { clearInterval(interval);
                    hold = 0;
                    has_moved = !1 }
            }
        }
    }
    frames++;
    if (current > prevTime + 1) { prevTime = current;
        frames = 0 }
    lastTime = current;
    prevX = xPos;
    prevY = yPos
}

function touchAction(event) { event.preventDefault();
    xPos = event.targetTouches[0].clientX;
    yPos = event.targetTouches[0].clientY; if (has_moved == !1) { setTimeout(function() { has_moved = !0 }, 1000) } }

function mouseAction(event) { event.preventDefault();
    xPos = event.clientX;
    yPos = event.clientY; if (has_moved == !1) { setTimeout(function() { has_moved = !0 }, 1000) } }

function resizeAction() { vw = canvas.width = window.innerWidth;
    vh = canvas.height = equal }

function enterAction(event) { event.preventDefault();
    prevX = event.clientX;
    prevY = event.clientY }

function random(min, max) {
    if (max == null) { max = min;
        min = 0 }
    return Math.random() * (max - min) + min
}