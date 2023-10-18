const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');
ctx.canvas.width = window.innerWidth;
ctx.canvas.height = window.innerHeight;

const fps = 60;
const ballNumModifier = 10000;
const ballSpeed = 6;
const ballColor = 'rgba(249,199,94,.5)';
const ballCol = 'rgba(249,199,94,'
const lineDistanceModifier = 6;
const particleType = "star";
const starPoints = 7;
const particleSize = 5;
const dashedLine = [] //[] for solid line
const mouseRadius = 1;

// Particles
let particleArray;

// Get mouse position
let mouse = {
    x: null,
    y: null,
    radius: (canvas.height/160) * (canvas.width/160)
}

window.addEventListener('mousemove',
    function(event){
        mouse.x = event.x;
        mouse.y = event.y;
        console.log(mouse.x, mouse.y);
    }
);

function strokeStar(x, y, r, n, inset) {
    ctx.save();
    ctx.beginPath();
    ctx.translate(x, y);
    ctx.moveTo(0, 0 - r);
    for (var i = 0; i < n; i++) {
        ctx.rotate(Math.PI / n);
        ctx.lineTo(0, 0 - (r * inset));
        ctx.rotate(Math.PI / n);
        ctx.lineTo(0, 0 - r);
    }
    ctx.closePath();
    ctx.fill();
    ctx.restore();
}

class Particle{
    constructor(x, y, directionX, directionY, size, color, points){
        this.x = x;
        this.y = y;
        this.directionX = directionX;
        this.directionY = directionY;
        this.size = size;
        this.points = points;
        this.color = color;
    }

    draw(){
        ctx.beginPath();
        switch (particleType) {
            case "circle":
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
                break;
            case "star":
                strokeStar(this.x, this.y, this.size, starPoints, 0.5);
                break;
            case "starrand":
                strokeStar(this.x, this.y, this.size, this.points, 0.5);
                break;
            default:
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
                break;
        }
        
        ctx.fillStyle =  ballColor;
        ctx.fill();
    }

    update(){
        if (this.x > canvas.width || this.x < 0){
            this.directionX = -this.directionX;
        }
        if (this.y > canvas.height || this.y < 0){
            this.directionY = -this.directionY;
        }

        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx*dx + dy*dy);
        if (distance < mouse.radius + this.size){
            if (mouse.x < this.x * mouseRadius && this.x < canvas.width - this.size * mouseRadius){
                this.x += 5;
                this.directionX = -this.directionX;
            }
            if (mouse.x > this.x * mouseRadius && this.x > this.size * mouseRadius){
                this.x -= 5;
                this.directionX = -this.directionX;
            }
            if (mouse.y < this.y * mouseRadius && this.y < canvas.height - this.size * mouseRadius){
                this.y += 5;
                this.directionY = -this.directionY;
            }
            if (mouse.y > this.y * mouseRadius && this.y > this.size * mouseRadius){
                this.y -= 5;
                this.directionY = -this.directionY;
            }
        }
        this.x += this.directionX;
        this.y += this.directionY;
        this.draw();
    }
}

function init(){
    particleArray = [];
    let numberOfParticles = ((canvas.height * canvas.width) / ballNumModifier) + 10;
    for (let i = 0; i < numberOfParticles; i++){
        let size = (Math.random() * particleSize) + 2;
        let x = (Math.random() * ((innerWidth - size * 2) - (size * 2)) 
        + size * 2);
        let y = (Math.random() * ((innerHeight - size * 2) - (size * 2))
        + size * 2);
        let directionX = (Math.random() * ballSpeed) - ballSpeed/2;
        let directionY = (Math.random() * ballSpeed) - ballSpeed/2;
        let color = ballColor;
        let points = Math.floor(Math.random() * 10) + 5;

        particleArray.push(new Particle(x, y, directionX, directionY, size, color, points));
    }
}

function connect(){
    let opac = 1;
    for (let a = 0; a < particleArray.length; a++){
        for (let b = a; b < particleArray.length; b++){
            let distance = ((particleArray[a].x - particleArray[b].x)
            * (particleArray[a].x - particleArray[b].x))
            + ((particleArray[a].y - particleArray[b].y)
            * (particleArray[a].y - particleArray[b].y));
            if (distance < (canvas.width/lineDistanceModifier) * (canvas.height/lineDistanceModifier)){
                opac = 1 - (distance/(15000-1000)) - 0.1;
                ctx.strokeStyle = ballCol + opac + ')';
                ctx.lineWidth = 1;
                ctx.setLineDash(dashedLine);
                ctx.beginPath();
                ctx.moveTo(particleArray[a].x, particleArray[a].y);
                ctx.lineTo(particleArray[b].x, particleArray[b].y);
                ctx.stroke();
            }
        }
    }
}

function animate(){
    setTimeout(() => {
    requestAnimationFrame(animate);
    }, 100 / fps);
    ctx.clearRect(0, 0, innerWidth, innerHeight);

    for (let i = 0; i < particleArray.length; i++){
        particleArray[i].update();
    }
    connect();
}

window.addEventListener('resize', 
    function(){
        canvas.width = innerWidth;
        canvas.height = innerHeight;
        mouse.radius = ((canvas.height/80) * (canvas.height/80));
        init();
    }
)

init();
animate();