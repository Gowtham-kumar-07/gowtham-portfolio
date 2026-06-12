/* ════════════════════════════════════════════
   admin.js  —  OWNER-ONLY video manager
   Only runs on admin.html (never loaded by
   index.html, so visitors never see controls).
   ════════════════════════════════════════════ */

const CARDS_META = [
  { tag:'Brand Reel',   title:'Premium Brand Film',     grad:'linear-gradient(150deg,#1c1c3a,#0d0d1f)' },
  { tag:'Talking Head', title:'Creator Hook Reel',      grad:'linear-gradient(150deg,#1a1226,#0d0d1f)' },
  { tag:'Product',      title:'Product Launch Cut',     grad:'linear-gradient(150deg,#0f1a2e,#0a0a14)' },
  { tag:'Podcast Clip', title:'Viral Podcast Snippet',  grad:'linear-gradient(150deg,#1f1a0f,#0f0d0a)' },
  { tag:'Travel',       title:'Travel Montage Edit',    grad:'linear-gradient(150deg,#0f1f1a,#0a0f0e)' },
  { tag:'Business',     title:'CEO Thought Leadership', grad:'linear-gradient(150deg,#1f0f12,#0f0a0b)' },
];

let videos = { hero: '', cards: ['','','','','',''] };
const KEY = 'reel_videos';

/* ── Storage helpers (localStorage so no server needed) ── */
function save() {
  localStorage.setItem(KEY, JSON.stringify(videos));
  showToast('Saved! Refresh index.html to see changes.');
}
function load() {
  const raw = localStorage.getItem(KEY);
  if (raw) { try { videos = JSON.parse(raw); } catch(e){} }
}

/* ── Toast ── */
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2800);
}

/* ── Preview helper ── */
function toEmbed(url) {
  if (!url) return null;
  let m = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([A-Za-z0-9_-]{11})/);
  if (m) return { type:'iframe', src:'https://www.youtube.com/embed/'+m[1] };
  m = url.match(/youtube\.com\/shorts\/([A-Za-z0-9_-]{11})/);
  if (m) return { type:'iframe', src:'https://www.youtube.com/embed/'+m[1] };
  m = url.match(/vimeo\.com\/(\d+)/);
  if (m) return { type:'iframe', src:'https://player.vimeo.com/video/'+m[1] };
  if (/\.(mp4|webm|ogg)(\?.*)?$/i.test(url)) return { type:'video', src: url };
  return null;
}
function previewEl(url, grad) {
  const e = toEmbed(url);
  if (!e) return '<div class="a-placeholder" style="background:'+grad+'"><span>No video yet</span></div>';
  if (e.type === 'iframe') return '<iframe src="'+e.src+'" allowfullscreen></iframe>';
  return '<video src="'+e.src+'" controls playsinline></video>';
}

/* ── Build admin UI ── */
function buildAdmin() {
  // Hero row
  const heroInput = document.getElementById('hero-url');
  heroInput.value = videos.hero || '';
  refreshHeroPreview();

  // Cards
  const list = document.getElementById('card-list');
  list.innerHTML = '';
  CARDS_META.forEach(function(meta, i) {
    const url = videos.cards[i] || '';
    list.innerHTML +=
      '<div class="a-card" id="acard-'+i+'">'+
        '<div class="a-video" id="aprev-'+i+'">'+previewEl(url, meta.grad)+'</div>'+
        '<div class="a-info">'+
          '<div class="a-tag">'+meta.tag+'</div>'+
          '<div class="a-title">'+meta.title+'</div>'+
          '<div class="a-row">'+
            '<input class="a-input" id="ainput-'+i+'" type="text" placeholder="Paste YouTube, Vimeo or .mp4 URL" value="'+url+'" />'+
            '<button class="a-btn" onclick="setCard('+i+')">Set Video</button>'+
            '<button class="a-btn a-btn-clear" onclick="clearCard('+i+')">Clear</button>'+
          '</div>'+
          '<div class="a-hint" id="ahint-'+i+'"></div>'+
        '</div>'+
      '</div>';
  });
}

function refreshHeroPreview() {
  const url = document.getElementById('hero-url').value.trim();
  document.getElementById('hero-preview').innerHTML = previewEl(url, 'linear-gradient(135deg,#1a1a2e,#0f0f1a)');
}

function setHero() {
  const url = document.getElementById('hero-url').value.trim();
  if (!url) { showToast('Please paste a URL first.'); return; }
  if (!toEmbed(url)) { showToast('Unrecognised URL. Try YouTube, Vimeo or .mp4'); return; }
  videos.hero = url;
  save();
  refreshHeroPreview();
}
function clearHero() {
  videos.hero = '';
  document.getElementById('hero-url').value = '';
  save();
  refreshHeroPreview();
}

function setCard(i) {
  const url = document.getElementById('ainput-'+i).value.trim();
  if (!url) { hint(i,'Paste a URL first.'); return; }
  if (!toEmbed(url)) { hint(i,'Unrecognised URL. Try YouTube, Vimeo or a .mp4 link.'); return; }
  videos.cards[i] = url;
  save();
  document.getElementById('aprev-'+i).innerHTML = previewEl(url, CARDS_META[i].grad);
  hint(i,'');
}
function clearCard(i) {
  videos.cards[i] = '';
  document.getElementById('ainput-'+i).value = '';
  save();
  document.getElementById('aprev-'+i).innerHTML = previewEl('', CARDS_META[i].grad);
}
function hint(i, msg) {
  document.getElementById('ahint-'+i).textContent = msg;
}

/* ── Export videos.json ── */
function exportJSON() {
  const blob = new Blob([JSON.stringify(videos, null, 2)], { type:'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'videos.json';
  a.click();
  showToast('videos.json downloaded. Place it in the js/ folder.');
}

/* ── Local asset picker ── */
function pickAsset(i) {
  const inp = document.createElement('input');
  inp.type = 'file';
  inp.accept = 'video/mp4,video/webm,video/ogg';
  inp.onchange = function() {
    const file = inp.files[0];
    if (!file) return;
    // Copy to assets/ is a manual step — we just set the relative path
    const path = 'assets/' + file.name;
    document.getElementById('ainput-'+i).value = path;
    hint(i, 'Remember to copy "'+file.name+'" into the assets/ folder.');
  };
  inp.click();
}
function pickHeroAsset() {
  const inp = document.createElement('input');
  inp.type = 'file';
  inp.accept = 'video/mp4,video/webm,video/ogg';
  inp.onchange = function() {
    const file = inp.files[0];
    if (!file) return;
    document.getElementById('hero-url').value = 'assets/' + file.name;
    hint(-1,'Copy "'+file.name+'" into the assets/ folder, then click Set.');
  };
  inp.click();
}

load();
window.addEventListener('DOMContentLoaded', buildAdmin);
