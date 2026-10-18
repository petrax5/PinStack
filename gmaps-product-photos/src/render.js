// Renders 1200x1200 Google Business Profile product photos for the 6 Oasis detailing packages.
// Illustrations are built in art.js.
// Usage: NODE_PATH=$(npm root -g) node render.js   (writes ../<slug>.jpg)
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const OUT = path.resolve(__dirname, '..');
const uri = (f, type = 'jpeg') => `data:image/${type};base64,` + fs.readFileSync(path.join(__dirname, f)).toString('base64');
const LOGO = uri('photos/logo.png', 'png');
const art = require('./art');

// Drop a photo named after the package (e.g. photos/1-ceramic-soap-wash.jpg / .png / .webp) to use it instead of the illustration
const photoFor = (s) => {
  for (const ext of ['jpg', 'jpeg', 'png', 'webp']) {
    const f = path.join(__dirname, 'photos', `${s.slug}.${ext}`);
    if (fs.existsSync(f)) return `data:image/${ext === 'jpg' ? 'jpeg' : ext};base64,` + fs.readFileSync(f).toString('base64');
  }
};

const services = [
  { art: art.wash, slug: '1-ceramic-soap-wash', n: 1, cat: 'Express wash', title: 'Ceramic Soap Wash', from: '$99' },
  { art: art.interior, slug: '2-interior-supreme-detail', n: 2, cat: 'Detail package', title: 'Interior Supreme Detail', from: '$299' },
  { art: art.exterior, slug: '3-exterior-supreme-detail', n: 3, cat: 'Detail package', title: 'Exterior Supreme Detail', from: '$299' },
  { art: art.full, slug: '4-full-supreme-detail', n: 4, cat: 'Detail package', title: 'Full Supreme Detail', from: '$449' },
  { art: art.correction, slug: '5-paint-correction', n: 5, cat: 'Paint correction', title: 'Paint Correction', from: '$799' },
  { art: art.coating, slug: '6-premium-ceramic-coating', n: 6, cat: 'Ceramic coating', title: 'Premium Ceramic Coating', from: '$849' },
];

const page = (s) => `<!doctype html><html><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800&display=block" rel="stylesheet">
<style>
  *{margin:0;box-sizing:border-box}
  html,body{width:1200px;height:1200px}
  body{font-family:"Plus Jakarta Sans",sans-serif;background:#f1f5f9;color:#1e293b;position:relative;overflow:hidden}
  .band{position:absolute;inset:0 0 auto 0;height:470px;border-bottom:8px solid #ea580c;
    background:radial-gradient(900px 400px at 15% -20%,#334155 0%,transparent 70%),linear-gradient(180deg,#1e293b,#0f172a)}
  header{position:absolute;top:52px;left:64px;right:64px;display:flex;align-items:center;justify-content:space-between}
  .brand{display:flex;align-items:center;gap:20px;color:#fff}
  .brand img{width:96px;height:96px;border-radius:50%;box-shadow:0 4px 18px rgba(0,0,0,.5)}
  .brand b{display:block;font-size:40px;font-weight:700;line-height:1.05}
  .brand span{font-size:26px;font-weight:500;color:#cbd5e1}
  .pill{background:#ea580c;color:#fff;font-weight:800;font-size:24px;letter-spacing:.1em;text-transform:uppercase;
    padding:14px 30px;border-radius:999px}
  .card{position:absolute;top:196px;left:64px;right:64px;height:836px;background:#fff;border-radius:28px;
    box-shadow:0 2px 4px rgba(15,23,42,.06),0 24px 60px rgba(15,23,42,.18);padding:26px;display:flex;flex-direction:column}
  .photo{height:520px;border-radius:18px;overflow:hidden;background:linear-gradient(180deg,#f8fafc,#e2e8f0)}
  .photo svg,.photo img{display:block;width:100%;height:100%}
  .photo img{object-fit:cover}
  .info{flex:1;display:flex;align-items:center;justify-content:space-between;gap:32px;padding:0 22px}
  .label{font-size:22px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:#64748b}
  h1{margin-top:10px;font-size:62px;font-weight:800;line-height:1.04;letter-spacing:-.02em;color:#0f172a;max-width:620px;text-wrap:balance}
  .price{text-align:right;flex-shrink:0}
  .price b{display:block;font-size:128px;font-weight:800;line-height:.95;letter-spacing:-.03em;color:#ea580c;margin-top:6px}
  footer{position:absolute;left:64px;right:64px;bottom:58px;display:flex;align-items:center;justify-content:space-between;
    font-size:26px;font-weight:500;color:#1e293b}
  .dark{background:#0f172a;color:#fff;font-weight:700;padding:14px 30px;border-radius:999px}
  .dark em{font-style:normal;color:#fb923c}
</style></head><body>
  <div class="band"></div>
  <header>
    <div class="brand"><img src="${LOGO}" alt=""><div><b>Oasis</b><span>Detailing Supplies</span></div></div>
    <div class="pill">Package #${s.n}</div>
  </header>
  <div class="card">
    <div class="photo">${photoFor(s) ? `<img src="${photoFor(s)}" alt="">` : s.art()}</div>
    <div class="info">
      <div><div class="label">${s.cat}</div><h1>${s.title}</h1></div>
      <div class="price"><div class="label">Starting at</div><b>${s.from}</b></div>
    </div>
  </div>
  <footer><span>223 S Tustin St, Orange · 714-363-3556</span><span class="dark">Car · SUV · <em>Truck</em></span></footer>
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
