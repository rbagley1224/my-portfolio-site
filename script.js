// Scroll reveal
const reveals = document.querySelectorAll(".reveal");
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
    }
  });
});

document.querySelectorAll('.reveal, .hidden').forEach(el => observer.observe(el));

// Fake form submission
const form = document.getElementById("testForm");
const spinner = document.getElementById("spinner");
const successMessage = document.getElementById("successMessage");

form.addEventListener("submit", function(e) {
  e.preventDefault();
  // Extra validation
  const name = form.querySelector("#name").value.trim();
  const email = form.querySelector("#email").value.trim();

  // Simple email regex for example
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!name) {
    alert("Please enter your name.");
    return;
  }

  if (!email || !emailRegex.test(email)) {
    alert("Please enter a valid email address.");
    return;
  }
  spinner.style.display = "block";
  successMessage.classList.remove("visible");

  setTimeout(() => {
    spinner.style.display = "none";
    successMessage.classList.add("visible");
    form.reset();
  }, 2000);
});

const elements = document.querySelectorAll('.hidden');

elements.forEach(el => observer.observe(el));

const backToTopButton = document.getElementById("backToTop");

window.addEventListener("scroll", () => {
  if (window.scrollY > 300) {
    backToTopButton.style.display = "block";
  } else {
    backToTopButton.style.display = "none";
  }
});

backToTopButton.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

const toggleBtn = document.getElementById('darkModeToggle');


function updateToggleButton(isDark) {
  if (isDark) {
    toggleBtn.textContent = 'Light Mode ☀️';
    toggleBtn.setAttribute('aria-pressed', 'true');
  } else {
    toggleBtn.textContent = 'Dark Mode 🌙';
    toggleBtn.setAttribute('aria-pressed', 'false');
  }
}

// Initialize on page load
const darkModeEnabled = localStorage.getItem('darkMode') === 'enabled';
if (darkModeEnabled) {
  document.body.classList.add('dark-mode');
}
updateToggleButton(darkModeEnabled);

// Toggle dark mode on click
toggleBtn.addEventListener('click', () => {
  const isDark = document.body.classList.toggle('dark-mode');
  updateToggleButton(isDark);

  if (isDark) {
    localStorage.setItem('darkMode', 'enabled');
  } else {
    localStorage.setItem('darkMode', 'disabled');
  }
});

const canvas = document.getElementById('star-canvas');
const ctx = canvas.getContext('2d');

let width, height;
function resize() {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', resize);

// Star class for twinkling stars
class Star {
  constructor() {
    this.x = Math.random() * width;
    this.y = Math.random() * height;
    this.radius = Math.random() * 1.2 + 0.3;
    this.alpha = Math.random();
    this.alphaChange = 0.005 + Math.random() * 0.01;
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, 255, 255, ${this.alpha.toFixed(2)})`;
    ctx.fill();
  }

  update() {
    this.alpha += this.alphaChange;
    if (this.alpha <= 0) {
      this.alpha = 0;
      this.alphaChange = -this.alphaChange;
    } else if (this.alpha >= 1) {
      this.alpha = 1;
      this.alphaChange = -this.alphaChange;
    }
  }
}

// Shooting star class
class ShootingStar {
  constructor() {
    this.reset();
  }

  reset() {
    this.x = Math.random() * width;
    this.y = Math.random() * height / 2;
    this.len = Math.random() * 80 + 50;
    this.speed = Math.random() * 10 + 6;
    this.angle = Math.PI / 4;
    this.size = Math.random() * 1.5 + 0.5;
    this.active = true;
  }

  draw() {
    ctx.strokeStyle = 'white';
    ctx.lineWidth = this.size;
    ctx.beginPath();
    ctx.moveTo(this.x, this.y);
    ctx.lineTo(this.x - this.len * Math.cos(this.angle), this.y + this.len * Math.sin(this.angle));
    ctx.stroke();
  }

  update() {
    this.x += this.speed * Math.cos(this.angle);
    this.y -= this.speed * Math.sin(this.angle);

    if (this.x > width || this.y < 0) {
      this.active = false;
    }
  }
}

// Create stars
const stars = [];
const maxStars = 150;
for (let i = 0; i < maxStars; i++) {
  stars.push(new Star());
}

let shootingStars = [];
let shootingStarTimer = 0;
const shootingStarInterval = 5000; // every 5 seconds on average

function animate(time = 0) {
  ctx.clearRect(0, 0, width, height);

  // Draw and update stars
  stars.forEach(star => {
    star.update();
    star.draw();
  });

  // Manage shooting stars
  shootingStarTimer += 16; // approx 60fps frame time

  if (shootingStarTimer > shootingStarInterval) {
    shootingStars.push(new ShootingStar());
    shootingStarTimer = 0;
  }

  shootingStars.forEach((star, index) => {
    if (star.active) {
      star.update();
      star.draw();
    } else {
      shootingStars.splice(index, 1);
    }
  });

  requestAnimationFrame(animate);
}

animate();

(function() {
  const canvas = document.getElementById('light-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width, height;
  let orbs = [];

  function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
  }
  window.addEventListener('resize', resize);
  resize();

  class Orb {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.radius = 10 + Math.random() * 20;
      this.alpha = 0;
      this.alphaChange = 0.005 + Math.random() * 0.01;
      this.speedX = (Math.random() - 0.5) * 0.2;
      this.speedY = (Math.random() - 0.5) * 0.2;
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;

      this.alpha += this.alphaChange;
      if (this.alpha <= 0 || this.alpha >= 0.6) {
        this.alphaChange = -this.alphaChange;
      }

      if (this.x < 0) this.x = width;
      if (this.x > width) this.x = 0;
      if (this.y < 0) this.y = height;
      if (this.y > height) this.y = 0;
    }

    draw() {
      const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius);
      gradient.addColorStop(0, `rgba(255, 230, 190, ${this.alpha})`);
      gradient.addColorStop(1, 'rgba(255, 223, 100, 0)');

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function initOrbs(count) {
    orbs = [];
    for (let i = 0; i < count; i++) {
      orbs.push(new Orb());
    }
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);
    orbs.forEach(orb => {
      orb.update();
      orb.draw();
    });
    requestAnimationFrame(animate);
  }

  initOrbs(30);
  animate();
})();

// Animate each process step on scroll
const processSteps = document.querySelectorAll(".process-step");

processSteps.forEach((step, index) => {
  observer.observe(step);
});

// Toggle step detail visibility on click
processSteps.forEach(step => {
  step.addEventListener("click", () => {
    step.classList.toggle("active");
  });
});

const steps = document.querySelectorAll('.step');

steps.forEach(step => {
  step.addEventListener('click', () => {
    steps.forEach(s => s.classList.remove('active'));
    step.classList.add('active');
  });
});

document.addEventListener("DOMContentLoaded", function () {
  const reveals = document.querySelectorAll('.reveal');

  const observer = new IntersectionObserver(function (entries, observer) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target); // Remove this line if you want repeated animations
      }
    });
  }, {
    threshold: 0.1
  });

  reveals.forEach(function (reveal) {
    observer.observe(reveal);
  });
});