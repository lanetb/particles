const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');
ctx.canvas.width = window.innerWidth;
ctx.canvas.height = window.innerHeight;

const fps = 60;

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

class Particle{
    constructor(x, y, directionX, directionY, size, color){
        this.x = x;
        this.y = y;
        this.directionX = directionX;
        this.directionY = directionY;
        this.size = size;
        this.color = color;
    }

    draw(){
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        ctx.fillStyle = '#ffffff';
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
            if (mouse.x < this.x && this.x < canvas.width - this.size * 10){
                this.x += 5;
                this.directionX = -this.directionX;
            }
            if (mouse.x > this.x && this.x > this.size * 10){
                this.x -= 5;
                this.directionX = -this.directionX;
            }
            if(mouse.y < this.y && this.y < canvas.height - this.size * 10){
                this.y += 5;
                this.directionY = -this.directionY;
            }
            if(mouse.y > this.y && this.y > this.size * 10){
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
    let numberOfParticles = ((canvas.height * canvas.width) / 6500) + 10;
    for (let i = 0; i < numberOfParticles; i++){
        let size = (Math.random() * 3) + 2;
        let x = (Math.random() * ((innerWidth - size * 2) - (size * 2)) 
        + size * 2);
        let y = (Math.random() * ((innerHeight - size * 2) - (size * 2))
        + size * 2);
        let directionX = (Math.random() * 3) - 1.5;
        let directionY = (Math.random() * 3) - 1.5;
        let color = '#ffffff';

        particleArray.push(new Particle(x, y, directionX, directionY, size, color));
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
            if (distance < (canvas.width/6) * (canvas.height/6) + 20000){
                opac = 1 - (distance/15000);
                ctx.strokeStyle = 'rgba(255,255,255,' + opac + ')';
                ctx.lineWidth = 1;
                ctx.setLineDash([5, 5]);
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
    }, 1000 / fps);
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