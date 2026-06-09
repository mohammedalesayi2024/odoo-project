const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

/* ======================
   CANVAS SETUP
====================== */
function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resize();
window.addEventListener("resize", resize);

/* ======================
   MOUSE
====================== */
const mouse = {
  x: canvas.width / 2,
  y: canvas.height / 2
};

window.addEventListener("mousemove", e => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});

/* ======================
   STARRY BACKGROUND
====================== */
const stars = Array.from({ length: 200 }, () => ({
  x: Math.random() * canvas.width,
  y: Math.random() * canvas.height,
  r: Math.random() * 1.5,
  s: Math.random() * 0.3 + 0.1
}));

function drawStars() {
  ctx.fillStyle = "white";
  stars.forEach(star => {
    ctx.beginPath();
    ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
    ctx.fill();

    star.y += star.s;
    if (star.y > canvas.height) {
      star.y = 0;
      star.x = Math.random() * canvas.width;
    }
  });
}

/* ======================
   SPIDERS
====================== */
const spiders = Array.from({ length: 3 }, (_, i) => ({
  x: mouse.x,
  y: mouse.y,
  vx: 0,
  vy: 0,
  legs: 8,
  offset: i * 0.5
}));

function drawSpiderBody(spider) {
  ctx.beginPath();
  ctx.arc(spider.x, spider.y, 4, 0, Math.PI * 2);
  ctx.fillStyle = "red";
  ctx.fill();
}

/* ======================
   SPIDER LEGS (SEGMENTED)
====================== */
function drawLegs(spider) {
  const baseLen = 8;
  const midLen = 12;
  const endLen = 10;

  for (let i = 0; i < spider.legs; i++) {
    const baseAngle = (Math.PI * 2 / spider.legs) * i;
    const wave = Math.sin(Date.now() * 0.004 + i) * 2;

    // Joint 1
    const x1 = spider.x + Math.cos(baseAngle) * baseLen;
    const y1 = spider.y + Math.sin(baseAngle) * baseLen;

    // Joint 2
    const x2 = x1 + Math.cos(baseAngle + 0.5) * midLen;
    const y2 = y1 + Math.sin(baseAngle + 0.5) * midLen;

    // Joint 3 (tip)
    const x3 = x2 + Math.cos(baseAngle + 0.8) * (endLen + wave);
    const y3 = y2 + Math.sin(baseAngle + 0.8) * (endLen + wave);

    ctx.beginPath();
    ctx.moveTo(spider.x, spider.y);
    ctx.lineTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.lineTo(x3, y3);

    ctx.strokeStyle = "rgba(255,255,255,0.45)";
    ctx.lineWidth = 1;
    ctx.stroke();
  }
}

/* ======================
   WEB LINE
====================== */
function drawWeb(spider) {
  ctx.beginPath();
  ctx.moveTo(spider.x, spider.y);
  ctx.lineTo(mouse.x, mouse.y);
  ctx.strokeStyle = "rgba(255,255,255,0.2)";
  ctx.stroke();
}

/* ======================
   ANIMATION LOOP
====================== */
function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawStars();

  spiders.forEach(spider => {
    spider.vx += (mouse.x - spider.x) * 0.02;
    spider.vy += (mouse.y - spider.y) * 0.02;

    spider.vx *= 0.85;
    spider.vy *= 0.85;

    spider.x += spider.vx + spider.offset;
    spider.y += spider.vy + spider.offset;

    drawWeb(spider);
    drawLegs(spider);
    drawSpiderBody(spider);
  });

  requestAnimationFrame(animate);
}

animate();
