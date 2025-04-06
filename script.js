const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const particles = [];
const maxParticles = 200;  // Mais partículas para um fundo mais denso
let particleCreationInterval = 30; // Intervalo para criar partículas
let lastCreationTime = 0;

let mouseX = canvas.width / 2;
let mouseY = canvas.height / 2;

// Função que captura a posição do mouse
canvas.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

function createParticle() {
  const angle = Math.random() * 2 * Math.PI;
  const speed = Math.random() * 4 + 2; // Partículas mais rápidas e com movimento mais dinâmico

  particles.push({
    x: Math.random() * canvas.width,  // A origem da partícula é aleatória, mas ainda tem um centro de dispersão
    y: Math.random() * canvas.height,
    vx: Math.cos(angle) * speed,
    vy: Math.sin(angle) * speed,
    radius: Math.random() * 2 + 1,  // Partículas maiores para um efeito mais denso
    life: 100,
    originalVx: Math.cos(angle) * speed,
    originalVy: Math.sin(angle) * speed,
    reacted: false,
    smoothFactor: 0.3,
  });
}

function updateParticles() {
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];

    // Cria uma interação com o mouse, mas também permite que as partículas se movam por conta própria
    const dx = p.x - mouseX;
    const dy = p.y - mouseY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    // Se a partícula estiver perto do mouse, ela se move em direção a ele
    if (distance < 50 && !p.reacted) {
      const angle = Math.atan2(dy, dx);
      const speed = 1.5;
      p.vx += Math.cos(angle) * speed * p.smoothFactor;
      p.vy += Math.sin(angle) * speed * p.smoothFactor;
      p.reacted = true;
    }

    // Atualiza a posição da partícula
    p.x += p.vx;
    p.y += p.vy;

    // Caso as partículas saiam da tela, elas aparecem novamente de forma aleatória
    if (p.x < 0 || p.x > canvas.width || p.y < 0 || p.y > canvas.height) {
      p.x = Math.random() * canvas.width;
      p.y = Math.random() * canvas.height;
    }

    p.life -= 1;

    // Remove partículas com vida baixa
    if (p.life <= 0) {
      particles.splice(i, 1);
    }
  }
}

function drawParticles() {
  ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);  // Aplique uma leve "sombra" no fundo para o movimento contínuo

  for (const p of particles) {
    const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius * 4);
    gradient.addColorStop(0, "rgb(0, 17, 255)");
    gradient.addColorStop(1, "rgba(0, 26, 255, 0.22)");

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
