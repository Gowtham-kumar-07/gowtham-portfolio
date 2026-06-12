/* ════════════════════════════════════════════
   main.js  —  PUBLIC viewer (read-only)
   Loads videos.json and renders cards.
   Visitors CANNOT add or change any video.
   ════════════════════════════════════════════ */

const CARDS_META = [
  { tag:'Brand Reel',   title:'Premium Brand Film',     views:'1.7M views', grad:'linear-gradient(150deg,#1c1c3a,#0d0d1f)' },
  { tag:'Talking Head', title:'Creator Hook Reel',      views:'1.2M views', grad:'linear-gradient(150deg,#1a1226,#0d0d1f)' },
  { tag:'Product',      title:'Product Launch Cut',     views:'980K views',  grad:'linear-gradient(150deg,#0f1a2e,#0a0a14)' },
  { tag:'Podcast Clip', title:'Viral Podcast Snippet',  views:'2.1M views',  grad:'linear-gradient(150deg,#1f1a0f,#0f0d0a)' },
  { tag:'Travel',       title:'Travel Montage Edit',    views:'760K views',  grad:'linear-gradient(150deg,#0f1f1a,#0a0f0e)' },
  { tag:'Business',     title:'CEO Thought Leadership', views:'1.4M views',  grad:'linear-gradient(150deg,#1f0f12,#0f0a0b)' },
];

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

function videoHTML(url) {
  const e = toEmbed(url);
  if (!e) return '';
  return e.type === 'iframe'
    ? '<iframe src="'+e.src+'" allowfullscreen allow="encrypted-media"></iframe>'
    : '<video src="'+e.src+'" controls playsinline></video>';
}

function placeholder(grad) {
  return '<div class="card-placeholder" style="background:'+grad+'">'+
    '<div class="ring"><svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M8 5v14l11-7z"/></svg></div>'+
    '<p class="ph-label">Coming soon</p></div>';
}

function buildGrid(videos) {
  const grid = document.getElementById('work-grid');
  if (!grid) return;
  grid.innerHTML = '';
  CARDS_META.forEach(function(meta, i) {
    const url = videos.cards && videos.cards[i] ? videos.cards[i] : '';
    const inner = url ? videoHTML(url) : placeholder(meta.grad);
    grid.innerHTML +=
      '<div class="work-card fade-in">'+
        '<div class="card-video">'+inner+'</div>'+
        '<div class="card-footer">'+
          '<div class="work-tag">'+meta.tag+'</div>'+
          '<div class="work-title">'+meta.title+'</div>'+
          '<div class="work-views">&#8593; '+meta.views+'</div>'+
        '</div>'+
      '</div>';
  });
  document.querySelectorAll('.fade-in:not(.visible)').forEach(function(el){ io.observe(el); });
}

fetch('js/videos.json')
  .then(function(r){ return r.json(); })
  .then(function(v){
    if (v.hero) {
      var shell = document.getElementById('hero-shell');
      if (shell) shell.innerHTML = videoHTML(v.hero) || shell.innerHTML;
    }
    buildGrid(v);
  })
  .catch(function(){ buildGrid({}); });

var io = new IntersectionObserver(function(entries){
  entries.forEach(function(e){ if(e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.1 });
document.querySelectorAll('.fade-in').forEach(function(el){ io.observe(el); });

document.getElementById('hamburger').addEventListener('click', function(){
  document.getElementById('nav-drawer').classList.toggle('open');
});
function closeDrawer(){ document.getElementById('nav-drawer').classList.remove('open'); }
