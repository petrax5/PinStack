// Renders 1200x1200 Google Business Profile product photos (text-only) for the 6 Oasis detailing packages.
// Usage: NODE_PATH=$(npm root -g) node render.js   (writes ../<slug>.jpg)
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const OUT = path.resolve(__dirname, '..');
const LOGO = 'data:image/png;base64,' + fs.readFileSync(path.join(__dirname, 'photos/logo.png')).toString('base64');

const services = [
  { slug: '1-ceramic-soap-wash', n: 1, cat: 'Express wash', title: 'Ceramic Soap Wash', from: '$99',
    tag: 'A thorough wash, inside and out.',
    items: ['Ceramic wash', 'Interior vacuum', 'Spray wax', 'Tire dressing'] },
  { slug: '2-interior-supreme-detail', n: 2, cat: 'Detail package', title: 'Interior Supreme Detail', from: '$299',
    tag: 'A deep clean for every seat and surface.',
    items: ['Shampoo', 'Conditioner', 'Dash &amp; windows', 'Exterior ceramic wash'] },
  { slug: '3-exterior-supreme-detail', n: 3, cat: 'Detail package', title: 'Exterior Supreme Detail', from: '$299',
    tag: 'Deep gloss and glass-smooth paint.',
    items: ['Clay bar', 'Polish', 'Hand wax', 'Ceramic wash'] },
  { slug: '4-full-supreme-detail', n: 4, cat: 'Detail package', title: 'Full Supreme Detail', from: '$449',
    tag: 'Our complete inside-and-out detail.',
    items: ['Interior shampoo', 'Clay bar', 'Polish &amp; hand wax', 'Ceramic wash'] },
  { slug: '5-paint-correction', n: 5, cat: 'Paint correction', title: 'Paint Correction', from: '$799',
    tag: 'Removes swirls, scratches and water spots.',
    items: ['Ultimate compound', 'Water spot removal', 'Polish &amp; hand wax', 'Clay bar'] },
  { slug: '6-premium-ceramic-coating', n: 6, cat: 'Ceramic coating', title: 'Premium Ceramic Coating', from: '$849',
    tag: 'Long-term gloss and paint protection.',
    items: ['Paint correction', 'Ceramic coating', 'Interior detail', 'Paint disinfectant'] },
];

const check = `<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="12" fill="#ea580c"/><path d="M6.5 12.5l3.5 3.5 7.5-8" fill="none" stroke="#fff" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

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
  .pill{background:#ea580c;color:#fff;font-weight:800;font-size:24px;letter-spacing:.1em;text-transform:uppercase;padding:14px 30px;border-radius:999px}
  .card{position:absolute;top:196px;left:64px;right:64px;height:836px;background:#fff;border-radius:28px;overflow:hidden;
    box-shadow:0 2px 4px rgba(15,23,42,.06),0 24px 60px rgba(15,23,42,.18);padding:64px 64px 56px;display:flex;flex-direction:column}
  .num{position:absolute;right:-10px;top:-70px;font-size:420px;font-weight:800;line-height:1;letter-spacing:-.06em;
    color:transparent;-webkit-text-stroke:3px #eef2f7}
  .label{position:relative;font-size:24px;font-weight:800;letter-spacing:.14em;text-transform:uppercase;color:#c2410c}
  h1{position:relative;margin-top:18px;font-size:100px;font-weight:800;line-height:1;letter-spacing:-.03em;color:#0f172a;max-width:900px;text-wrap:balance}
  .tag{position:relative;margin-top:22px;font-size:36px;font-weight:500;color:#475569}
  ul{list-style:none;margin-top:auto;display:grid;grid-template-columns:1fr 1fr;gap:22px 40px;padding:36px 0;border-top:2px solid #e2e8f0;border-bottom:2px solid #e2e8f0}
  li{display:flex;align-items:center;gap:16px;font-size:34px;font-weight:600;color:#1e293b}
  li svg{width:38px;height:38px;flex-shrink:0}
  .bottom{margin-top:34px;display:flex;align-items:flex-end;justify-content:space-between}
  .bottom .label{color:#64748b;font-size:22px}
  .price{font-size:150px;font-weight:800;line-height:.9;letter-spacing:-.04em;color:#ea580c;margin-top:8px}
  .sizes{font-size:28px;font-weight:600;color:#475569;text-align:right;line-height:1.5;padding-bottom:10px}
  .sizes b{display:block;color:#0f172a;font-size:30px}
  footer{position:absolute;left:64px;right:64px;bottom:58px;display:flex;align-items:center;justify-content:space-between;font-size:26px;font-weight:500;color:#1e293b}
  .dark{background:#0f172a;color:#fff;font-weight:700;padding:14px 30px;border-radius:999px}
  .dark em{font-style:normal;color:#fb923c}
</style></head><body>
  <div class="band"></div>
  <header>
    <div class="brand"><img src="${LOGO}" alt=""><div><b>Oasis</b><span>Detailing Supplies</span></div></div>
    <div class="pill">Package #${s.n}</div>
  </header>
  <div class="card">
    <div class="num">0${s.n}</div>
    <div class="label">${s.cat}</div>
    <h1>${s.title}</h1>
    <div class="tag">${s.tag}</div>
    <ul>${s.items.map(i => `<li>${check}${i}</li>`).join('')}</ul>
    <div class="bottom">
      <div><div class="label">Starting at</div><div class="price">${s.from}</div></div>
      <div class="sizes"><b>Car · SUV · Truck</b>Priced by vehicle size</div>
    </div>
  </div>
  <footer><span>223 S Tustin St, Orange · (800) 916-4731</span><span class="dark">Book <em>today</em></span></footer>
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
