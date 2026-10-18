// Studio-style vector illustrations for each package (viewBox 0 0 1096 520, matches the photo slot).

const C = require('./car34');
const W = 1096, H = 520, GROUND = 420;

const defs = `
<defs>
  <radialGradient id="studio" cx="50%" cy="18%" r="85%">
    <stop offset="0" stop-color="#ffffff"/><stop offset=".55" stop-color="#e8edf3"/><stop offset="1" stop-color="#c5cfdb"/>
  </radialGradient>
  <linearGradient id="floor" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#dfe5ec"/><stop offset="1" stop-color="#f4f6f9"/>
  </linearGradient>
  <linearGradient id="paint" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#5b8def"/><stop offset=".18" stop-color="#2a5bd7"/><stop offset=".5" stop-color="#16388f"/>
    <stop offset=".78" stop-color="#0c2160"/><stop offset="1" stop-color="#081538"/>
  </linearGradient>
  <linearGradient id="paintSide" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0" stop-color="#000" stop-opacity=".35"/><stop offset=".12" stop-color="#000" stop-opacity="0"/>
    <stop offset=".88" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".3"/>
  </linearGradient>
  <linearGradient id="glass" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="#3b4a63"/><stop offset=".45" stop-color="#151d2c"/><stop offset="1" stop-color="#0a0f18"/>
  </linearGradient>
  <linearGradient id="glassHi" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".5" stop-color="#fff" stop-opacity=".28"/><stop offset="1" stop-color="#fff" stop-opacity="0"/>
  </linearGradient>
  <radialGradient id="rim" cx="40%" cy="35%" r="75%">
    <stop offset="0" stop-color="#f8fafc"/><stop offset=".5" stop-color="#b6c0cc"/><stop offset="1" stop-color="#5f6b7a"/>
  </radialGradient>
  <radialGradient id="tire" cx="50%" cy="50%" r="50%">
    <stop offset=".72" stop-color="#1b1f26"/><stop offset=".9" stop-color="#2b313b"/><stop offset="1" stop-color="#0d1015"/>
  </radialGradient>
  <linearGradient id="sweep" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".5" stop-color="#fff" stop-opacity=".55"/><stop offset="1" stop-color="#fff" stop-opacity="0"/>
  </linearGradient>
  <linearGradient id="fade" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#fff" stop-opacity=".22"/><stop offset=".6" stop-color="#fff" stop-opacity="0"/>
  </linearGradient>
  <mask id="reflMask"><rect x="0" y="${GROUND}" width="${W}" height="${H - GROUND}" fill="url(#fade)"/></mask>
  <radialGradient id="foam" cx="38%" cy="30%" r="75%">
    <stop offset="0" stop-color="#ffffff"/><stop offset=".7" stop-color="#f1f5fb"/><stop offset="1" stop-color="#cdd9ea"/>
  </radialGradient>
  <radialGradient id="bead" cx="35%" cy="30%" r="70%">
    <stop offset="0" stop-color="#ffffff" stop-opacity=".95"/><stop offset=".35" stop-color="#bfdbfe" stop-opacity=".55"/>
    <stop offset="1" stop-color="#1e3a8a" stop-opacity=".35"/>
  </radialGradient>
  <linearGradient id="sheen" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0" stop-color="#22d3ee" stop-opacity="0"/><stop offset=".35" stop-color="#22d3ee" stop-opacity=".28"/>
    <stop offset=".55" stop-color="#a78bfa" stop-opacity=".25"/><stop offset=".75" stop-color="#f472b6" stop-opacity=".18"/><stop offset="1" stop-color="#f472b6" stop-opacity="0"/>
  </linearGradient>
  <linearGradient id="leather" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="#d08a4a"/><stop offset=".5" stop-color="#a35a24"/><stop offset="1" stop-color="#6b3610"/>
  </linearGradient>
  <linearGradient id="leatherDark" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0" stop-color="#3a2416"/><stop offset=".5" stop-color="#4b2f1c"/><stop offset="1" stop-color="#2a1a10"/>
  </linearGradient>
  <filter id="blur6"><feGaussianBlur stdDeviation="6"/></filter>
  <filter id="blur14"><feGaussianBlur stdDeviation="14"/></filter>
  <filter id="blur2"><feGaussianBlur stdDeviation="2"/></filter>
  <filter id="glow"><feGaussianBlur stdDeviation="5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
</defs>`;

const backdrop = (g = GROUND) => `
  <rect width="${W}" height="${H}" fill="url(#studio)"/>
  <rect y="${g}" width="${W}" height="${H - g}" fill="url(#floor)"/>
  <rect y="${g - 1}" width="${W}" height="2" fill="#fff" opacity=".7"/>`;

const BODY = `M196 396 C176 396 166 384 168 366 L174 330 C176 315 188 305 204 302 L300 290
  C362 236 424 206 504 200 L612 198 C662 198 704 214 752 252 L792 282
  C852 290 902 300 922 312 C938 321 942 340 940 360 L936 384 C934 392 928 396 920 396
  L829 396 A70 70 0 1 0 711 396 L389 396 A70 70 0 1 0 271 396 Z`;

const GLASS = `M326 292 C378 246 432 220 504 214 L604 212 C648 212 684 226 728 258 L744 272 C600 278 460 284 326 292 Z`;

const wheel = (cx) => `
  <g transform="translate(${cx} 358)">
    <circle r="66" fill="#0b0e13"/>
    <circle r="62" fill="url(#tire)"/>
    <circle r="46" fill="#2a303a"/>
    <path d="M-30 -14 A33 33 0 0 1 -6 -32 L-2 -20 A20 20 0 0 0 -18 -8 Z" fill="#ea580c"/>
    ${[0, 72, 144, 216, 288].map(a => `<path transform="rotate(${a})" d="M-7 -12 L-11 -43 C-5 -46 5 -46 11 -43 L7 -12 Z" fill="url(#rim)"/>`).join('')}
    <circle r="46" fill="none" stroke="url(#rim)" stroke-width="6"/>
    <circle r="13" fill="url(#rim)"/><circle r="5" fill="#334155"/>
  </g>`;

const car = ({ seats = false, extra = '' } = {}) => {
  const body = `
    <clipPath id="wellClip"><rect x="0" y="0" width="${W}" height="396"/></clipPath>
    <g clip-path="url(#wellClip)"><circle cx="330" cy="358" r="70" fill="#0b0e13"/><circle cx="770" cy="358" r="70" fill="#0b0e13"/></g>
    <path d="${BODY}" fill="url(#paint)"/>
    <path d="${BODY}" fill="url(#paintSide)"/>
    <path d="M206 312 C400 300 700 292 926 318 L926 326 C700 304 400 310 206 322 Z" fill="#fff" opacity=".55" filter="url(#blur2)"/>
    <path d="M190 372 L934 372 L932 388 L192 388 Z" fill="#000" opacity=".25"/>
    <path d="${GLASS}" fill="url(#glass)"/>
    ${seats ? `<g opacity=".9"><path d="M430 282 C428 258 440 246 458 246 C470 246 476 256 474 270 L470 282 Z" fill="#b8763d"/>
      <path d="M612 276 C610 254 622 242 640 242 C652 242 658 252 656 266 L652 276 Z" fill="#b8763d"/></g>` : ''}
    <path d="M360 270 C420 236 470 224 520 220 L500 280 L352 288 Z" fill="url(#glassHi)" opacity=".7"/>
    <path d="M562 211 L574 211 L570 280 L556 280 Z" fill="#0a0f18"/>
    <path d="M326 292 C460 284 600 278 744 272" stroke="#c7d2e0" stroke-width="3" fill="none"/>
    <path d="M566 282 L560 392 M410 288 L404 392" stroke="#061033" stroke-width="2.5" opacity=".7"/>
    <rect x="474" y="304" width="34" height="7" rx="3.5" fill="#c7d2e0"/><rect x="628" y="300" width="34" height="7" rx="3.5" fill="#c7d2e0"/>
    <path d="M728 262 C744 256 762 260 766 272 L742 278 Z" fill="#0c2160"/>
    <path d="M884 316 C904 318 924 324 934 332 L930 340 C912 334 896 330 880 328 Z" fill="#fff" filter="url(#glow)"/>
    <path d="M172 324 L210 318 L208 330 L171 336 Z" fill="#ef4444" filter="url(#glow)"/>
    <path d="M300 290 C362 236 424 206 504 200 L612 198 C662 198 704 214 752 252" stroke="#fff" stroke-opacity=".6" stroke-width="2" fill="none"/>
    ${extra}`;
  const wheels = wheel(330) + wheel(770);
  return `
    <ellipse cx="555" cy="${GROUND + 2}" rx="420" ry="22" fill="#0f172a" opacity=".45" filter="url(#blur14)"/>
    <ellipse cx="555" cy="${GROUND}" rx="360" ry="8" fill="#0f172a" opacity=".55" filter="url(#blur6)"/>
    <g mask="url(#reflMask)"><g transform="translate(0 ${GROUND * 2}) scale(1 -1)">${body}${wheels}</g></g>
    ${body}${wheels}`;
};

const sparkle = (x, y, s = 1, c = '#fff') =>
  `<path transform="translate(${x} ${y}) scale(${s})" d="M0 -26 C3 -6 6 -3 26 0 C6 3 3 6 0 26 C-3 6 -6 3 -26 0 C-6 -3 -3 -6 0 -26 Z" fill="${c}" filter="url(#glow)"/>`;

const svg = (inner) => `<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">${defs}${backdrop()}${inner}</svg>`;
// car scenes: lower horizon so the 3/4 car sits on the studio floor
const carSvg = (inner) => `<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">${defs}${backdrop(330)}<g transform="translate(548 330) scale(1.12) translate(-548 -330)">${inner}</g></svg>`;

// deterministic pseudo-random so renders are stable
const rand = (seed) => () => (seed = (seed * 16807) % 2147483647) / 2147483647;

function foamLayer() {
  const r = rand(7), out = [];
  // follow the roof/hood/trunk outline
  const pts = [[200, 300], [260, 294], [320, 284], [370, 248], [430, 220], [500, 206], [560, 202], [620, 202], [680, 216], [730, 246], [780, 280], [840, 292], [890, 302], [925, 316]];
  for (const [x, y] of pts) for (let i = 0; i < 4; i++) {
    const rr = 14 + r() * 22;
    out.push(`<circle cx="${x + (r() - .5) * 50}" cy="${y - r() * 18}" r="${rr}" fill="url(#foam)"/>`);
  }
  const drips = [[280, 300, 40], [450, 300, 26], [620, 296, 52], [820, 300, 34], [900, 312, 30]]
    .map(([x, y, h]) => `<path d="M${x - 9} ${y} L${x + 9} ${y} L${x + 7} ${y + h} A7 7 0 0 1 ${x - 7} ${y + h} Z" fill="url(#foam)"/>`);
  return `<g filter="url(#blur2)" opacity=".35"><path d="${BODY}" fill="#fff"/></g>${drips.join('')}${out.join('')}`;
}

function droplets(n, seed, area) {
  const r = rand(seed), out = [];
  for (let i = 0; i < n; i++) {
    const x = area[0] + r() * (area[2] - area[0]), y = area[1] + r() * (area[3] - area[1]), s = .6 + r() * .8;
    out.push(`<path transform="translate(${x.toFixed(1)} ${y.toFixed(1)}) scale(${s.toFixed(2)})" d="M0 -16 C7 -5 11 1 11 6 A11 11 0 0 1 -11 6 C-11 1 -7 -5 0 -16 Z" fill="url(#bead)" stroke="#fff" stroke-opacity=".6" stroke-width="1"/>`);
  }
  return out.join('');
}

function beads(seed) {
  const r = rand(seed), out = [];
  const zones = [[330, 600, 230, 296], [760, 920, 290, 322], [210, 300, 296, 312], [300, 920, 330, 380]];
  for (const [x0, x1, y0, y1] of zones) for (let i = 0; i < 26; i++) {
    const x = x0 + r() * (x1 - x0), y = y0 + r() * (y1 - y0), rr = 2.5 + r() * 5;
    out.push(`<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${rr.toFixed(1)}" fill="url(#bead)"/><circle cx="${(x - rr * .35).toFixed(1)}" cy="${(y - rr * .35).toFixed(1)}" r="${(rr * .3).toFixed(1)}" fill="#fff"/>`);
  }
  return `<clipPath id="bodyClip"><path d="${BODY}"/></clipPath><g clip-path="url(#bodyClip)">${out.join('')}</g>`;
}

const seatScene = () => `
  <ellipse cx="548" cy="${GROUND + 4}" rx="230" ry="18" fill="#0f172a" opacity=".45" filter="url(#blur14)"/>
  <g transform="translate(400 40)">
    <path d="M118 0 C150 -4 196 0 206 14 C214 26 210 52 196 60 L120 62 C104 56 98 26 104 12 C106 6 110 2 118 0 Z" fill="url(#leather)"/>
    <rect x="138" y="58" width="12" height="28" fill="#1f2937"/><rect x="172" y="58" width="12" height="28" fill="#1f2937"/>
    <path d="M70 92 C76 78 96 72 150 74 C214 76 240 84 236 108 L206 300 C202 322 184 332 160 332 L82 332 C56 332 42 316 46 290 Z" fill="url(#leatherDark)"/>
    <path d="M98 100 C104 90 120 88 152 89 C196 90 206 96 204 112 L180 290 C178 304 168 310 154 310 L104 310 C88 310 80 300 82 286 Z" fill="url(#leather)"/>
    <g stroke="#6b3610" stroke-width="2.5" opacity=".75" fill="none">
      <path d="M100 150 L200 150 M96 190 L194 190 M92 230 L188 230 M88 270 L184 270"/>
      <path d="M135 92 L118 308 M170 92 L152 308"/>
    </g>
    <path d="M110 104 C120 98 140 96 160 97" stroke="#fff" stroke-opacity=".45" stroke-width="5" stroke-linecap="round" fill="none"/>
    <path d="M30 318 C26 300 40 292 70 292 L320 292 C352 292 368 304 364 326 L358 352 C356 366 344 374 326 374 L66 374 C44 374 32 364 30 350 Z" fill="url(#leatherDark)"/>
    <path d="M60 306 C60 300 66 298 80 298 L310 298 C330 298 340 304 338 316 L334 336 C332 346 324 350 312 350 L82 350 C68 350 60 344 60 334 Z" fill="url(#leather)"/>
    <path d="M140 300 L136 348 M210 300 L208 348 M280 300 L280 348" stroke="#6b3610" stroke-width="2.5" opacity=".75"/>
    <path d="M80 304 L300 304" stroke="#fff" stroke-opacity=".4" stroke-width="5" stroke-linecap="round"/>
  </g>
  ${sparkle(330, 120, 1.5)}${sparkle(780, 170, 1.1)}${sparkle(720, 80, .7, '#fb923c')}${sparkle(300, 300, .8, '#fb923c')}${sparkle(820, 330, .9)}`;

const correctionScene = () => `
  <defs>
    <linearGradient id="mirrorPaint" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#1e4fd0"/><stop offset=".5" stop-color="#0f2f86"/><stop offset="1" stop-color="#081538"/>
    </linearGradient>
    <clipPath id="panel"><path d="M40 120 C300 70 800 70 1056 120 L1056 520 L40 520 Z"/></clipPath>
    <clipPath id="left"><path d="M0 0 L560 0 L470 520 L0 520 Z"/></clipPath>
  </defs>
  <g clip-path="url(#panel)">
    <rect width="${W}" height="${H}" fill="url(#mirrorPaint)"/>
    <g opacity=".85">
      <rect x="560" y="150" width="520" height="34" rx="17" fill="#fff" opacity=".65" filter="url(#blur6)"/>
      <rect x="600" y="240" width="460" height="16" rx="8" fill="#fff" opacity=".4" filter="url(#blur2)"/>
      <rect x="520" y="360" width="560" height="60" rx="30" fill="#93c5fd" opacity=".25" filter="url(#blur14)"/>
    </g>
    <g clip-path="url(#left)">
      <rect width="${W}" height="${H}" fill="#5b6b86"/>
      <rect width="${W}" height="${H}" fill="url(#mirrorPaint)" opacity=".55"/>
      <g stroke="#e2e8f0" stroke-width="1.4" fill="none" opacity=".5">
        ${[24, 44, 66, 90, 116, 144, 176].map(r => `<circle cx="230" cy="300" r="${r}"/>`).join('')}
        ${[20, 40, 62, 86].map(r => `<circle cx="400" cy="190" r="${r}"/>`).join('')}
        ${[18, 36, 56].map(r => `<circle cx="110" cy="440" r="${r}"/>`).join('')}
        <path d="M60 200 L170 160 M300 460 L420 400 M90 330 L130 380 M330 300 L420 330"/>
      </g>
      ${[[150,180],[300,250],[380,420],[90,280],[250,420],[430,280]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="6" fill="#e2e8f0" opacity=".35"/>`).join('')}
    </g>
    <path d="M560 0 L470 520" stroke="#fff" stroke-width="4" opacity=".9"/>
  </g>
  <path d="M40 120 C300 70 800 70 1056 120" stroke="#fff" stroke-opacity=".7" stroke-width="3" fill="none"/>
  <text x="250" y="160" font-family="Plus Jakarta Sans" font-weight="800" font-size="22" letter-spacing="3" fill="#fff" opacity=".85">BEFORE</text>
  <text x="780" y="140" font-family="Plus Jakarta Sans" font-weight="800" font-size="22" letter-spacing="3" fill="#fff" opacity=".85">AFTER</text>
  <g transform="translate(560 330) rotate(-12)">
    <ellipse cx="0" cy="58" rx="120" ry="18" fill="#000" opacity=".4" filter="url(#blur14)"/>
    <path d="M-104 30 L104 30 L98 54 C60 62 -60 62 -98 54 Z" fill="#ea580c"/>
    <path d="M-104 30 L104 30 L102 38 L-102 38 Z" fill="#fdba74"/>
    <rect x="-80" y="14" width="160" height="18" rx="6" fill="#1f2937"/>
    <path d="M-44 14 L-36 -40 L36 -40 L44 14 Z" fill="#111827"/>
    <path d="M-36 -40 C-36 -60 -10 -70 30 -70 L250 -86 C272 -88 286 -74 286 -54 C286 -36 272 -26 252 -26 L36 -18 Z" fill="url(#leatherDark)" style="fill:#1f2937"/>
    <path d="M30 -64 L250 -80" stroke="#fff" stroke-opacity=".35" stroke-width="5" stroke-linecap="round"/>
    <rect x="90" y="-74" width="80" height="12" rx="6" fill="#ea580c" transform="rotate(-4 130 -68)"/>
    <path d="M286 -54 C330 -50 360 -30 420 -10" stroke="#111827" stroke-width="10" fill="none" stroke-linecap="round"/>
  </g>
  ${sparkle(900, 220, 1.4)}${sparkle(1000, 330, .9)}${sparkle(760, 420, .7, '#fdba74')}`;

function foam34() {
  const r = rand(7), out = [];
  const pts = [[140,334],[200,340],[260,344],[320,350],[380,354],[190,312],[250,290],[300,272],[420,280],[500,288],
    [400,222],[460,218],[520,220],[580,228],[650,234],[720,240],[790,250],[850,268],[910,286],[960,306]];
  for (const [x, y] of pts) for (let i = 0; i < 3; i++)
    out.push(`<circle cx="${(x + (r() - .5) * 40).toFixed(1)}" cy="${(y - r() * 14).toFixed(1)}" r="${(12 + r() * 18).toFixed(1)}" fill="url(#foam)"/>`);
  const drips = [[230,346,38],[340,352,30],[640,304,46],[760,298,30],[900,296,40],[960,318,28]]
    .map(([x, y, h]) => `<path d="M${x - 8} ${y} L${x + 8} ${y} L${x + 6} ${y + h} A6 6 0 0 1 ${x - 6} ${y + h} Z" fill="url(#foam)"/>`);
  return `<g clip-path="url(#car34clip)"><rect width="${W}" height="${H}" fill="#fff" opacity=".22"/></g>${drips.join('')}${out.join('')}`;
}

function beads34(seed) {
  const r = rand(seed), out = [];
  const zones = [[160, 520, 296, 352], [480, 960, 312, 400], [820, 960, 262, 300]];
  for (const [x0, x1, y0, y1] of zones) for (let i = 0; i < 34; i++) {
    const x = x0 + r() * (x1 - x0), y = y0 + r() * (y1 - y0), rr = 2.5 + r() * 5;
    out.push(`<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${rr.toFixed(1)}" fill="url(#bead)"/><circle cx="${(x - rr * .35).toFixed(1)}" cy="${(y - rr * .35).toFixed(1)}" r="${(rr * .3).toFixed(1)}" fill="#fff"/>`);
  }
  return `<g clip-path="url(#car34clip)">${out.join('')}</g>`;
}

const sweep34 = (x) => `<g clip-path="url(#car34clip)"><path d="M${x} 200 L${x + 110} 200 L${x - 40} 440 L${x - 150} 440 Z" fill="url(#sweep)"/></g>`;

module.exports = {
  wash: () => carSvg(C.car({ extra: foam34() }) + droplets(26, 3, [120, 30, 980, 190])),
  interior: () => svg(seatScene()),
  exterior: () => carSvg(C.car({ extra: sweep34(560) })
    + sparkle(402, 360, 1.3) + sparkle(600, 300, 1.1) + sparkle(250, 300, .9) + sparkle(820, 150, .8, '#fb923c') + sparkle(300, 150, .7)),
  full: () => carSvg(`<ellipse cx="550" cy="420" rx="410" ry="42" fill="#ffffff" opacity=".65"/>
    <ellipse cx="550" cy="420" rx="426" ry="48" fill="none" stroke="#ea580c" stroke-width="4" opacity=".55"/>`
    + C.car({ seats: true, extra: sweep34(700) })
    + sparkle(402, 360, 1.2) + sparkle(880, 290, 1) + sparkle(200, 250, .8) + sparkle(640, 150, .9, '#fb923c') + sparkle(960, 200, .6)),
  correction: () => svg(correctionScene()),
  coating: () => carSvg(C.car({ extra: `<g clip-path="url(#car34clip)"><rect width="${W}" height="${H}" fill="url(#sheen)"/></g>` + beads34(11) })
    + droplets(10, 21, [140, 40, 960, 170])
    + sparkle(400, 358, 1.1) + sparkle(880, 300, .9) + sparkle(220, 140, .7, '#fb923c')),
};
