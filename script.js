const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const particles = [];
const maxParticles = 300;
let particleCreationInterval = 20;
let lastCreationTime = 0;

let mouseX = canvas.width / 2;
let mouseY = canvas.height / 2;

let bigBangTriggered = false;
const bigBangTime = Date.now() + 3000;

canvas.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

function createParticle() {
  const angle = Math.random() * 2 * Math.PI;
  const speed = bigBangTriggered ? (Math.random() * 4 + 2) : 0;

  particles.push({
    x: canvas.width / 2,
    y: canvas.height / 2,
    vx: bigBangTriggered ? Math.cos(angle) * speed : 0,
    vy: bigBangTriggered ? Math.sin(angle) * speed : 0,
    radius: Math.random() * 2 + 1,
    angle,
    orbitRadius: Math.random() * 150,
    orbitSpeed: (Math.random() * 0.01) + 0.002,
    life: 300,
    exploded: bigBangTriggered
  });
}

function updateParticles() {
  const now = Date.now();

  if (!bigBangTriggered && now >= bigBangTime) {
    for (const p of particles) {
      const angle = Math.random() * 2 * Math.PI;
      const speed = Math.random() * 10 + 10;
      p.vx = Math.cos(angle) * speed;
      p.vy = Math.sin(angle) * speed;
      p.exploded = true;
    }
    bigBangTriggered = true;
  }

  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];

    if (p.exploded) {
      p.x += p.vx;
      p.y += p.vy;

      const fadeLimit = window.innerHeight * 1.2;
      if (
        p.x < 0 || p.x > canvas.width ||
        p.y - p.radius > fadeLimit
      ) {
        particles.splice(i, 1);
        continue;
      }


    } else {
      p.angle += p.orbitSpeed;
      p.x = canvas.width / 2 + Math.cos(p.angle) * p.orbitRadius;
      p.y = canvas.height / 2 + Math.sin(p.angle) * p.orbitRadius;
    } 

    p.life -= 1;
    if (p.life <= 0) {
      particles.splice(i, 1);
    }
  }
}

function drawParticles() {
  ctx.fillStyle = "rgb(0, 0, 0)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  for (const p of particles) {
    // Opacidade baseada na posição Y da partícula no canvas
    const fadeStart = canvas.height * 0.7;
    const fadeEnd = canvas.height * 1.0;
    let opacity = 1;

    if (p.y > fadeStart) {
      opacity = 1 - ((p.y - fadeStart) / (fadeEnd - fadeStart));
      opacity = Math.max(0, Math.min(1, opacity));
    }

    const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius * 4);
    gradient.addColorStop(0, `rgba(0,17,255,${opacity})`);
    gradient.addColorStop(1, `rgba(0,17,255,0)`);

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
    ctx.fill();
  }
}



function animate() {
  const currentTime = Date.now();
  if (currentTime - lastCreationTime >= particleCreationInterval) {
    if (particles.length < maxParticles) {
      createParticle();
    }
    lastCreationTime = currentTime;
  }

  requestAnimationFrame(animate);
  updateParticles();
  drawParticles();
}

animate();

window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
      if (entry.isIntersecting) {
          entry.target.classList.add('visible');
      } else {
          entry.target.classList.remove('visible');
      }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.about-text > *').forEach(el => {
  el.classList.add('reveal');
  observer.observe(el);
});
const imageList = ["projeto1.png", "projeto2.png"];
let currentIndex = 0;

document.getElementById("nextImageBtn").addEventListener("click", () => {
    const image = document.getElementById("projectImage");
    image.classList.add("fade-out");

    setTimeout(() => {
        currentIndex = (currentIndex + 1) % imageList.length;
        image.src = imageList[currentIndex];
        image.classList.remove("fade-out");
        image.classList.add("fade-in");
    }, 300);

    setTimeout(() => {
        image.classList.remove("fade-in");
    }, 600);
});
