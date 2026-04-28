/* ============================================================
   CONFIG
   ============================================================ */
const GITHUB_USER = 'CheertimeHub';
const API = 'https://api.github.com';

const LANG_COLORS = {
  JavaScript:'#f1e05a',TypeScript:'#3178c6',Python:'#3572A5',
  HTML:'#e34c26',CSS:'#563d7c',Vue:'#41b883',Go:'#00ADD8',
  Rust:'#dea584',Java:'#b07219',PHP:'#4F5D95',Ruby:'#701516',
  'C#':'#178600','C++':'#f34b7d',C:'#555555',Shell:'#89e051',
  Kotlin:'#F18E33',Swift:'#F05138',Dart:'#00B4AB',
};

/* ============================================================
   PIXEL BACKGROUND CANVAS — Sprout Lands style
   Render at 1/4 resolution → stretch via CSS (pixel art look)
   ============================================================ */
function initBgCanvas() {
  const cv  = document.getElementById('bg-canvas');
  const ctx = cv.getContext('2d');
  ctx.imageSmoothingEnabled = false;

  // preload cherry tree sprite for scene
  const treeImg = new Image();
  treeImg.src = 'assets/cherry-trees.png';

  function resize() {
    const SCALE = 4;
    cv.width  = Math.ceil(window.innerWidth  / SCALE);
    cv.height = Math.ceil(window.innerHeight / SCALE);
    cv.style.width  = window.innerWidth  + 'px';
    cv.style.height = window.innerHeight + 'px';
    draw();
  }

  function draw() {
    const W = cv.width, H = cv.height;
    ctx.clearRect(0, 0, W, H);

    /* sky — Sprout Lands colours */
    const sky = ctx.createLinearGradient(0,0,0,H*0.62);
    sky.addColorStop(0,   '#5598c8');
    sky.addColorStop(0.5, '#78c0e0');
    sky.addColorStop(1,   '#b8e4f8');
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, W, H);

    /* sun (pixel) */
    ctx.fillStyle = '#ffe850';
    ctx.fillRect(W-14, 3, 8, 8);
    ctx.fillStyle = '#fff080';
    ctx.fillRect(W-13, 1, 6, 2);   // top ray
    ctx.fillRect(W-13, 9, 6, 2);   // bottom ray
    ctx.fillRect(W-16, 5, 2, 4);   // left ray
    ctx.fillRect(W-6,  5, 2, 4);   // right ray

    /* clouds — chunky pixel style */
    const CLOUDS = [
      {x:.05,y:.06,w:22,h:9},
      {x:.28,y:.04,w:28,h:10},
      {x:.55,y:.09,w:18,h:8},
      {x:.74,y:.05,w:24,h:9},
    ];
    CLOUDS.forEach(({x,y,w,h}) => {
      const cx=Math.floor(x*W), cy=Math.floor(y*H);
      ctx.fillStyle='#ffffffee';
      ctx.fillRect(cx+2,    cy+2,   w-4, h-2);  // body
      ctx.fillRect(cx+4,    cy,     w-8, h);     // top bump
      ctx.fillRect(cx+w*.3, cy-2,   w*.3,h+2);  // center peak
      ctx.fillStyle='rgba(160,200,230,.45)';
      ctx.fillRect(cx+2, cy+h-1, w-4, 2);        // bottom shadow
    });

    /* far hills */
    ctx.fillStyle = '#90c860';
    for (let i=0;i<W;i++) {
      const h2 = Math.floor(5 + Math.sin(i*.15)*3 + Math.sin(i*.06)*4);
      ctx.fillRect(i, Math.floor(H*.56)-h2, 1, h2+2);
    }

    /* grass band */
    const GY = Math.floor(H*.60);
    ctx.fillStyle='#70b840'; ctx.fillRect(0,GY,W,2);
    ctx.fillStyle='#88cc50'; ctx.fillRect(0,GY-1,W,1);
    ctx.fillStyle='#58a030'; ctx.fillRect(0,GY+2,W,1);

    /* ground */
    const grd = ctx.createLinearGradient(0,GY+3,0,H);
    grd.addColorStop(0,  '#a8d870');
    grd.addColorStop(.12,'#c8b068');
    grd.addColorStop(1,  '#b89858');
    ctx.fillStyle=grd; ctx.fillRect(0,GY+3,W,H);

    /* grass tufts */
    ctx.fillStyle='#50982a';
    for (let i=1;i<W-1;i+=4) {
      if ((i*11+7)%7===0) {
        ctx.fillRect(i,   GY-2,1,2);
        ctx.fillRect(i+1, GY-3,1,3);
        ctx.fillRect(i+2, GY-1,1,1);
      }
    }

    /* flowers */
    const FLOWERS = ['#f8a0c0','#f0c040','#d0a0f0','#80d0a0'];
    for (let i=3;i<W-3;i+=6) {
      if ((i*13+5)%9===0) {
        ctx.fillStyle=FLOWERS[(i/6)%FLOWERS.length];
        ctx.fillRect(i, GY+2,2,2);
      }
    }

    /* simple pixel trees silhouette at bottom */
    ctx.fillStyle='#3a7828';
    const treePositions=[.02,.12,.22,.78,.88,.95];
    treePositions.forEach(p=>{
      const tx=Math.floor(p*W), ty=GY-12;
      ctx.fillRect(tx+3, ty,      4, 12);   // trunk-ish base
      ctx.fillRect(tx,   ty-4,    10,6);    // mid
      ctx.fillRect(tx+2, ty-8,    6, 5);    // top
      ctx.fillRect(tx+3, ty-10,   4, 4);    // tip
      ctx.fillStyle='#2a6018';
      ctx.fillRect(tx+1, ty-4,    1, 6);    // shadow
      ctx.fillStyle='#3a7828';
    });
  }

  treeImg.onload = () => draw();
  window.addEventListener('resize', resize);
  resize();
}

/* ============================================================
   PIXEL PETAL CANVAS
   ============================================================ */
function initPetalCanvas() {
  const cv = document.getElementById('petal-canvas');
  const ctx = cv.getContext('2d');
  ctx.imageSmoothingEnabled = false;

  cv.width  = window.innerWidth;
  cv.height = window.innerHeight;
  cv.style.width  = cv.width  + 'px';
  cv.style.height = cv.height + 'px';

  window.addEventListener('resize', () => {
    cv.width  = window.innerWidth;
    cv.height = window.innerHeight;
  });

  // pixel petal colours: cherry blossom palette
  const COLOURS = ['#f8c0d0','#f0a0b8','#e87898','#fce8f0','#d87090','#f4b8c8'];

  const petals = Array.from({length:28}, () => ({
    x:   Math.random() * window.innerWidth,
    y:   Math.random() * window.innerHeight,
    vy:  0.4 + Math.random() * 0.7,
    vx:  (Math.random()-0.5) * 0.5,
    size: (Math.random() < 0.5) ? 3 : 4,
    col: COLOURS[Math.floor(Math.random()*COLOURS.length)],
    phase: Math.random() * Math.PI * 2,
  }));

  function tick(t) {
    ctx.clearRect(0, 0, cv.width, cv.height);
    const now = t * 0.001;

    petals.forEach(p => {
      p.x += p.vx + Math.sin(now + p.phase) * 0.3;
      p.y += p.vy;
      if (p.y > cv.height + 10) {
        p.y = -10;
        p.x = Math.random() * cv.width;
      }
      // draw pixel petal (2×2 or 3×3 square with corners cut)
      const s = p.size;
      ctx.fillStyle = p.col;
      ctx.fillRect(Math.floor(p.x)+1, Math.floor(p.y),   s-2, s);
      ctx.fillRect(Math.floor(p.x),   Math.floor(p.y)+1, s,   s-2);
    });

    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

/* ============================================================
   GITHUB API
   ============================================================ */
async function get(url) {
  const r = await fetch(url, { headers:{ Accept:'application/vnd.github+json' } });
  if (!r.ok) throw new Error(r.status);
  return r.json();
}

async function loadProfile() {
  const d = await get(`${API}/users/${GITHUB_USER}`);

  const img = document.getElementById('avatar');
  img.src = d.avatar_url; img.alt = d.login;

  const name = d.name || d.login;
  document.getElementById('display-name').textContent = name;
  document.getElementById('r-username').textContent   = name;
  document.getElementById('full-bio').textContent     = d.bio || 'Full-stack developer building cool things ✨';

  document.getElementById('total-repos').textContent     = d.public_repos ?? '—';
  document.getElementById('total-followers').textContent = d.followers    ?? '—';

  const chips = document.getElementById('r-chips');
  chips.innerHTML = '';
  [d.location&&'📍 '+d.location, d.company&&'🏢 '+d.company, d.blog&&'🔗 '+d.blog]
    .filter(Boolean).forEach(t => {
      const s = document.createElement('span');
      s.className='r-chip'; s.textContent=t; chips.appendChild(s);
    });

  loadStars(d.public_repos);
}

async function loadStars(count) {
  try {
    let total = 0;
    const pages = Math.min(Math.ceil(count/100),5);
    for (let p=1;p<=pages;p++) {
      const repos = await get(`${API}/users/${GITHUB_USER}/repos?per_page=100&page=${p}`);
      repos.forEach(r => total += r.stargazers_count);
    }
    document.getElementById('total-stars').textContent = total;
  } catch { document.getElementById('total-stars').textContent='—'; }
}

async function loadPinned() {
  const list = document.getElementById('proj-list');
  try {
    const res = await fetch('./pinned.json');
    if (!res.ok) throw new Error();
    const pinned = await res.json();
    if (pinned.length) { renderProjects(list,pinned); return; }
  } catch {}

  try {
    const repos = await get(`${API}/users/${GITHUB_USER}/repos?per_page=100&sort=updated`);
    const top = repos
      .filter(r=>!r.fork)
      .sort((a,b)=>b.stargazers_count-a.stargazers_count)
      .slice(0,6)
      .map(r=>({name:r.name,full_name:r.full_name,description:r.description,
                url:r.html_url,language:r.language,stars:r.stargazers_count}));
    renderProjects(list,top);
  } catch {
    list.innerHTML='<li class="proj-empty">ไม่สามารถโหลด repos ได้</li>';
  }
}

function renderProjects(list, repos) {
  list.innerHTML='';
  if (!repos.length) { list.innerHTML='<li class="proj-empty">ยังไม่มี pinned repos</li>'; return; }
  repos.forEach(r=>{
    const color = LANG_COLORS[r.language]||'#8b8b8b';
    const li = document.createElement('li');
    li.className='project-item';
    li.innerHTML=`
      <div class="proj-blt"></div>
      <div class="proj-body">
        <a class="proj-name" href="${r.url||'https://github.com/'+r.full_name}" target="_blank">${r.name}</a>
        <div class="proj-desc">${r.description||'No description.'}</div>
        <div class="proj-meta">
          ${r.language?`<span class="proj-lang"><span class="ldot" style="background:${color}"></span>${r.language}</span>`:''}
          <span class="proj-stars">⭐ ${r.stars??0}</span>
        </div>
      </div>`;
    list.appendChild(li);
  });
}

/* ============================================================
   NAV
   ============================================================ */
function initNav() {
  document.querySelectorAll('.nav-btn').forEach(btn=>{
    btn.addEventListener('click',e=>{
      e.preventDefault();
      document.querySelectorAll('.nav-btn').forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
      const t = document.querySelector(btn.getAttribute('href'));
      if (t) t.scrollIntoView({behavior:'smooth',block:'start'});
    });
  });
}

/* ============================================================
   INIT
   ============================================================ */
async function init() {
  initBgCanvas();
  initPetalCanvas();
  initNav();
  await Promise.allSettled([loadProfile(), loadPinned()]);
}

document.addEventListener('DOMContentLoaded', init);
