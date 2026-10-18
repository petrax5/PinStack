// Renders 1200x1200 Google Business Profile product photos for the 6 Oasis detailing packages.
// Usage: node render.js   (writes ../<slug>.jpg)
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const OUT = path.resolve(__dirname, '..');
const LOGO = 'data:image/png;base64,' + fs.readFileSync(path.join(OUT, 'logo.png')).toString('base64');

// Shared sedan silhouette (viewBox 0 0 600 300, facing right)
const car = (body = 'url(#body)', extra = '') => `
  <ellipse cx="300" cy="262" rx="270" ry="14" fill="#000" opacity=".35"/>
  <path d="M38 218 C36 192 52 176 88 170 L176 160 C206 124 246 98 306 95 L384 95 C428 95 462 114 500 154 L546 162 C578 168 592 186 590 212 L588 230 C587 238 581 242 573 242 L48 242 C42 242 38 236 38 230 Z" fill="${body}"/>
  <path d="M196 160 C222 128 254 110 300 108 L300 160 Z" fill="url(#glass)"/>
  <path d="M316 108 L382 108 C414 108 440 124 470 160 L316 160 Z" fill="url(#glass)"/>
  <path d="M60 196 L580 196" stroke="#fff" stroke-opacity=".5" stroke-width="3"/>
  <rect x="330" y="176" width="34" height="6" rx="3" fill="#94a3b8"/>
  <path d="M552 178 L586 184 L586 196 L556 194 Z" fill="#fde68a"/>
  <path d="M40 186 L58 184 L58 198 L40 200 Z" fill="#ef4444"/>
  ${extra}
  <g><circle cx="150" cy="240" r="44" fill="#0b1220"/><circle cx="150" cy="240" r="26" fill="#cbd5e1"/><circle cx="150" cy="240" r="9" fill="#475569"/></g>
  <g><circle cx="470" cy="240" r="44" fill="#0b1220"/><circle cx="470" cy="240" r="26" fill="#cbd5e1"/><circle cx="470" cy="240" r="9" fill="#475569"/></g>`;

const sparkle = (x, y, s = 1, c = '#fff') =>
  `<path transform="translate(${x} ${y}) scale(${s})" d="M0 -30 C4 -8 8 -4 30 0 C8 4 4 8 0 30 C-4 8 -8 4 -30 0 C-8 -4 -4 -8 0 -30 Z" fill="${c}"/>`;

const defs = `
  <defs>
    <linearGradient id="body" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#ffffff"/><stop offset=".55" stop-color="#e2e8f0"/><stop offset="1" stop-color="#94a3b8"/>
    </linearGradient>
    <linearGradient id="bodyGloss" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#fb923c"/><stop offset=".5" stop-color="#ea580c"/><stop offset="1" stop-color="#9a3412"/>
    </linearGradient>
    <linearGradient id="glass" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#93c5fd"/><stop offset="1" stop-color="#1e3a8a"/>
    </linearGradient>
    <radialGradient id="drop" cx=".35" cy=".3" r=".8">
      <stop offset="0" stop-color="#fff"/><stop offset=".4" stop-color="#bae6fd"/><stop offset="1" stop-color="#0ea5e9"/>
    </radialGradient>
    <linearGradient id="mirror" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#1e293b"/><stop offset=".45" stop-color="#334155"/><stop offset=".5" stop-color="#e2e8f0"/><stop offset=".56" stop-color="#334155"/><stop offset="1" stop-color="#0f172a"/>
    </linearGradient>
    <linearGradient id="dull" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#64748b"/><stop offset="1" stop-color="#475569"/>
    </linearGradient>
    <linearGradient id="shield" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#38bdf8" stop-opacity=".45"/><stop offset="1" stop-color="#38bdf8" stop-opacity=".05"/>
    </linearGradient>
    <linearGradient id="seat" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#fdba74"/><stop offset="1" stop-color="#c2410c"/>
    </linearGradient>
  </defs>`;

const drop = (x, y, s = 1) =>
  `<path transform="translate(${x} ${y}) scale(${s})" d="M0 -18 C8 -6 12 0 12 6 A12 12 0 0 1 -12 6 C-12 0 -8 -6 0 -18 Z" fill="url(#drop)"/>`;
const bubble = (x, y, r) =>
  `<circle cx="${x}" cy="${y}" r="${r}" fill="#fff" fill-opacity=".92" stroke="#e0f2fe" stroke-width="2"/><circle cx="${x - r * .35}" cy="${y - r * .35}" r="${r * .25}" fill="#fff"/>`;

const art = {
  wash: `<svg viewBox="0 -60 600 340">${defs}
    ${car()}
    ${[[120,150,26],[160,138,34],[205,128,24],[250,104,30],[290,92,22],[335,96,28],[380,100,24],[420,118,30],[470,140,26],[515,158,22],[95,170,20],[555,170,18],[230,150,16],[450,160,16]].map(b=>bubble(...b)).join('')}
    ${[[110,30],[200,0],[300,-20],[400,10],[500,40],[160,60],[350,40],[460,-10],[250,50],[550,80]].map(([x,y],i)=>drop(x,y,1+(i%3)*.25)).join('')}
  </svg>`,

  interior: `<svg viewBox="0 0 600 340">${defs}
    <ellipse cx="300" cy="320" rx="200" ry="14" fill="#000" opacity=".35"/>
    <rect x="248" y="20" width="96" height="62" rx="28" fill="url(#seat)" transform="rotate(-10 296 50)"/>
    <rect x="276" y="76" width="22" height="26" rx="6" fill="#9a3412" transform="rotate(-10 287 90)"/>
    <path d="M222 108 C226 92 246 86 300 88 C348 90 360 98 356 118 L330 236 C326 252 312 258 296 258 L232 258 C214 258 204 246 206 228 Z" fill="url(#seat)"/>
    <path d="M244 116 L232 236 M300 104 L284 238" stroke="#9a3412" stroke-width="5" stroke-linecap="round" opacity=".55"/>
    <path d="M208 238 C200 262 214 280 244 282 L444 282 C474 282 488 266 482 246 C478 232 466 226 446 226 L300 226 C262 226 230 226 208 238 Z" fill="url(#seat)"/>
    <path d="M300 250 L470 250" stroke="#9a3412" stroke-width="5" stroke-linecap="round" opacity=".55"/>
    <rect x="330" y="282" width="20" height="30" fill="#334155"/><rect x="414" y="282" width="20" height="30" fill="#334155"/>
    ${sparkle(150,90,1.6)}${sparkle(470,120,1.2)}${sparkle(520,40,.8,'#fdba74')}${sparkle(110,220,.9,'#fdba74')}${sparkle(410,60,.7)}
  </svg>`,

  exterior: `<svg viewBox="0 -40 600 320">${defs}
    ${car('url(#bodyGloss)', `<path d="M90 176 C200 160 380 152 560 168" stroke="#fff" stroke-opacity=".7" stroke-width="7" fill="none" stroke-linecap="round"/>`)}
    ${sparkle(250,110,1.4)}${sparkle(520,150,1.1)}${sparkle(110,165,.9)}${sparkle(420,30,.8,'#fdba74')}${sparkle(170,40,1,'#fdba74')}${sparkle(560,60,.7)}
  </svg>`,

  full: `<svg viewBox="0 -60 600 340">${defs}
    ${car('url(#bodyGloss)', `<path d="M90 176 C200 160 380 152 560 168" stroke="#fff" stroke-opacity=".7" stroke-width="7" fill="none" stroke-linecap="round"/>`)}
    <g transform="translate(300 -10)">
      <circle r="52" fill="#fff"/><circle r="44" fill="none" stroke="#ea580c" stroke-width="5"/>
      <path d="M0 -26 L7.6 -9 L26 -8 L12 4 L16 22 L0 12 L-16 22 L-12 4 L-26 -8 L-7.6 -9 Z" fill="#ea580c"/>
    </g>
    ${sparkle(130,40,1.3)}${sparkle(480,30,1.2)}${sparkle(540,150,.9)}${sparkle(80,150,.8,'#fdba74')}${sparkle(220,120,.8)}
  </svg>`,

  correction: `<svg viewBox="0 0 600 340">${defs}
    <clipPath id="panel"><rect x="40" y="30" width="520" height="280" rx="26"/></clipPath>
    <g clip-path="url(#panel)">
      <rect x="40" y="30" width="520" height="280" fill="url(#mirror)"/>
      <path d="M40 30 L330 30 L250 310 L40 310 Z" fill="url(#dull)"/>
      <g stroke="#e2e8f0" stroke-opacity=".5" stroke-width="2" fill="none">
        ${[30,55,80,105,130,160].map(r=>`<circle cx="150" cy="170" r="${r}"/>`).join('')}
        ${[25,50,75].map(r=>`<circle cx="230" cy="80" r="${r}"/>`).join('')}
        <path d="M60 260 L120 230 M90 290 L170 250 M70 70 L130 110"/>
      </g>
      <path d="M330 30 L250 310" stroke="#fff" stroke-width="5"/>
    </g>
    <rect x="40" y="30" width="520" height="280" rx="26" fill="none" stroke="#fff" stroke-opacity=".25" stroke-width="3"/>
    <g transform="translate(300 160) rotate(-18)">
      <rect x="40" y="-24" width="190" height="48" rx="24" fill="#0f172a" stroke="#475569" stroke-width="3"/>
      <rect x="-20" y="-40" width="86" height="80" rx="22" fill="#ea580c"/>
      <ellipse cx="-34" cy="0" rx="22" ry="78" fill="#fdba74"/><ellipse cx="-40" cy="0" rx="14" ry="70" fill="#fff7ed"/>
    </g>
    ${sparkle(440,250,1.2)}${sparkle(525,285,.7)}${sparkle(380,60,.6,'#fdba74')}
  </svg>`,

  coating: `<svg viewBox="0 -40 600 320">${defs}
    <path d="M14 254 C14 60 160 -20 300 -20 C440 -20 586 60 586 254 Z" fill="url(#shield)" stroke="#7dd3fc" stroke-width="5"/>
    <path d="M70 120 C120 40 210 10 300 10" stroke="#fff" stroke-opacity=".6" stroke-width="8" fill="none" stroke-linecap="round"/>
    ${car('url(#bodyGloss)', `<path d="M90 176 C200 160 380 152 560 168" stroke="#fff" stroke-opacity=".7" stroke-width="7" fill="none" stroke-linecap="round"/>`)}
    ${[[120,60],[200,20],[420,25],[500,70],[540,140],[60,160],[300,-6]].map(([x,y],i)=>drop(x,y,.9+(i%2)*.4)).join('')}
    ${sparkle(250,150,1)}${sparkle(470,180,.7)}
  </svg>`,
};

const services = [
  { slug: '1-ceramic-soap-wash', title: 'Ceramic Soap Wash', tag: 'Inside &amp; out express wash', from: '$99', art: art.wash },
  { slug: '2-interior-supreme-detail', title: 'Interior Supreme Detail', tag: 'Shampoo, condition &amp; deep clean', from: '$299', art: art.interior },
  { slug: '3-exterior-supreme-detail', title: 'Exterior Supreme Detail', tag: 'Clay bar, polish &amp; hand wax', from: '$299', art: art.exterior },
  { slug: '4-full-supreme-detail', title: 'Full Supreme Detail', tag: 'Our complete inside + out detail', from: '$449', art: art.full },
  { slug: '5-paint-correction', title: 'Paint Correction', tag: 'Remove swirls, scratches &amp; spots', from: '$799', art: art.correction },
  { slug: '6-premium-ceramic-coating', title: 'Premium Ceramic Coating', tag: 'Long-lasting gloss &amp; protection', from: '$849', art: art.coating },
];

const page = (s) => `<!doctype html><html><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@600;700;800&display=block" rel="stylesheet">
<style>
  *{margin:0;box-sizing:border-box}
  html,body{width:1200px;height:1200px}
  body{font-family:"Plus Jakarta Sans",sans-serif;color:#fff;overflow:hidden;
    background:
      radial-gradient(900px 600px at 50% 38%, rgba(234,88,12,.32), transparent 65%),
      radial-gradient(700px 500px at 100% 0%, rgba(37,99,235,.25), transparent 60%),
      linear-gradient(170deg,#1e293b 0%,#0f172a 75%);
    display:flex;flex-direction:column;align-items:center;padding:64px 80px 72px;position:relative}
  .brand{position:absolute;top:56px;left:64px;display:flex;align-items:center;gap:18px}
  .brand img{width:104px;height:104px;border-radius:50%;box-shadow:0 6px 24px rgba(0,0,0,.45)}
  .brand div{font-weight:800;font-size:26px;letter-spacing:.06em;line-height:1.15}
  .brand span{display:block;font-weight:600;font-size:20px;letter-spacing:.04em;color:#94a3b8}
  .art{margin-top:150px;width:880px;height:500px;display:flex;align-items:center;justify-content:center}
  .art svg{width:100%;height:100%;overflow:visible;filter:drop-shadow(0 18px 30px rgba(0,0,0,.45))}
  h1{margin-top:auto;font-size:96px;font-weight:800;line-height:1.02;letter-spacing:-.02em;text-align:center;
     text-wrap:balance;max-width:1040px;text-shadow:0 4px 20px rgba(0,0,0,.4)}
  .tag{margin-top:18px;font-size:38px;font-weight:600;color:#cbd5e1;text-align:center}
  .from{margin-top:34px;display:inline-flex;align-items:baseline;gap:14px;background:#ea580c;border-radius:999px;
        padding:14px 44px 18px;box-shadow:0 10px 30px rgba(234,88,12,.45)}
  .from small{font-size:34px;font-weight:700}
  .from b{font-size:60px;font-weight:800;letter-spacing:-.01em}
</style></head><body>
  <div class="brand"><img src="${LOGO}" alt=""><div>OASIS<span>DETAILING · ORANGE, CA</span></div></div>
  <div class="art">${s.art}</div>
  <h1>${s.title}</h1>
  <div class="tag">${s.tag}</div>
  <div class="from"><small>From</small><b>${s.from}</b></div>
</body></html>`;

(async () => {
  const browser = await chromium.launch();
  const p = await browser.newPage({ viewport: { width: 1200, height: 1200 } });
  for (const s of services) {
    await p.setContent(page(s), { waitUntil: 'networkidle' });
    await p.evaluate(() => document.fonts.ready);
    await p.screenshot({ path: path.join(OUT, `${s.slug}.jpg`), type: 'jpeg', quality: 92 });
    console.log('wrote', s.slug);
  }
  await browser.close();
})();
