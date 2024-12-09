const canvas = document.getElementById("interactiveCanvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Particle Array
let particles = [];
const colors = [
  "255, 126, 95",
  "254, 180, 123",
  "30, 144, 255",
  "0, 195, 255",
  "255, 215, 0",
];

// Mouse Object
const mouse = {
  x: null,
  y: null,
};

let gravityMode = false; // Toggle gravity mode
let attractionMode = false; // Toggle attraction mode
let repulsionMode = false; // Toggle repulsion mode

// Particle Class
class Particle {
  constructor(x, y, size, color) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.originalSize = size; // For pulsation effect
    this.color = color;
    this.dx = (Math.random() - 0.5) * 4; // Horizontal Velocity
    this.dy = (Math.random() - 0.5) * 4; // Vertical Velocity
    this.gravity = gravityMode ? 0.2 : 0; // Gravity Effect
    this.opacity = 1;
    this.angle = Math.random() * Math.PI * 2; // For pulsation
  }

  draw() {
    ctx.beginPath();

    // Toggle between shapes
    if (attractionMode) {
      ctx.rect(
        this.x - this.size / 2,
        this.y - this.size / 2,
        this.size,
        this.size
      );
    } else {
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    }

    ctx.fillStyle = `rgba(${this.color}, ${this.opacity})`;
    ctx.fill();
  }

  update() {
    this.x += this.dx;
    this.y += this.dy;

    if (gravityMode) {
      this.dy += this.gravity;

      if (this.y + this.size > canvas.height) {
        this.dy *= -0.8; // Reverse direction and reduce speed
        this.y = canvas.height - this.size;
      }
    }

    // Particle Attraction
    if (attractionMode && mouse.x && mouse.y) {
      const dx = mouse.x - this.x;
      const dy = mouse.y - this.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const force = 1 / (distance / 100);
      this.dx += dx * force * 0.01;
      this.dy += dy * force * 0.01;
    }

    // Particle Repulsion
    if (repulsionMode && mouse.x && mouse.y) {
      const dx = this.x - mouse.x;
      const dy = this.y - mouse.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const force = 100 / (distance / 100);
      this.dx += dx * force * 0.01;
      this.dy += dy * force * 0.01;
    }

    // Pulsation Effect
    this.size = this.originalSize + Math.sin(this.angle) * 2;
    this.angle += 0.05;

    this.opacity -= 0.005;
    if (this.opacity <= 0) {
      this.reset();
    }
  }

  reset() {
    this.x = mouse.x || Math.random() * canvas.width;
    this.y = mouse.y || Math.random() * canvas.height;
    this.size = Math.random() * 10 + 2;
    this.originalSize = this.size; // Reset pulsation size
    this.color = colors[Math.floor(Math.random() * colors.length)];
    this.dx = (Math.random() - 0.5) * 4;
    this.dy = (Math.random() - 0.5) * 4;
    this.opacity = 1;
    this.angle = Math.random() * Math.PI * 2; // Reset angle for pulsation
  }
}

// Create Particles
function initParticles(count) {
  particles = [];
  for (let i = 0; i < count; i++) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    const size = Math.random() * 10 + 2;
    const color = colors[Math.floor(Math.random() * colors.length)];
    particles.push(new Particle(x, y, size, color));
  }
}

// Animate Particles
function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach((particle) => {
    particle.update();
    particle.draw();
  });
  requestAnimationFrame(animateParticles);
}

// Mouse Events
canvas.addEventListener("mousemove", (e) => {
  mouse.x = e.x;
  mouse.y = e.y;

  for (let i = 0; i < 5; i++) {
    particles.push(
      new Particle(
        e.x,
        e.y,
        Math.random() * 10 + 2,
        colors[Math.floor(Math.random() * colors.length)]
      )
    );
  }
});

// Explosion Effect
canvas.addEventListener("click", (e) => {
  for (let i = 0; i < 20; i++) {
    particles.push(
      new Particle(
        e.x,
        e.y,
        Math.random() * 10 + 2,
        colors[Math.floor(Math.random() * colors.length)]
      )
    );
  }
});

// Clear Canvas
document.getElementById("clearCanvas").addEventListener("click", () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles = [];
});

// Gravity Button
document.getElementById("mode2").addEventListener("click", () => {
  gravityMode = true;
  attractionMode = false;
  repulsionMode = false;
  particles.forEach((particle) => (particle.gravity = 0.2)); // Apply gravity to all particles
});

// Particle Trails Button
document.getElementById("mode1").addEventListener("click", () => {
  gravityMode = false;
  attractionMode = false;
  repulsionMode = false;
  particles.forEach((particle) => (particle.gravity = 0)); // Disable gravity
});

// Attraction Mode Button
document.getElementById("mode3").addEventListener("click", () => {
  attractionMode = true;
  gravityMode = false;
  repulsionMode = false;
});

// Repulsion Mode Button
document.getElementById("mode4").addEventListener("click", () => {
  repulsionMode = true;
  attractionMode = false;
  gravityMode = false;
});

// Dynamic Background Gradient
let gradientStep = 0;
function animateBackground() {
  const color1 = `hsl(${gradientStep}, 100%, 50%)`;
  const color2 = `hsl(${(gradientStep + 60) % 360}, 100%, 50%)`;
  document.body.style.background = `linear-gradient(120deg, ${color1}, ${color2})`;
  gradientStep = (gradientStep + 1) % 360;
  requestAnimationFrame(animateBackground);
}

// Resize Canvas
window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  initParticles(100);
});

// Initialize and Animate
initParticles(100);
animateParticles();
animateBackground();
