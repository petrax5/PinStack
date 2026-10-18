// Front three-quarter sports car (viewBox 0 0 1096 520). Front face on the left, near side receding right.

// panels
const SIDE = `M402 360 C410 335 432 318 474 311 C520 305 560 303 600 303 L880 292 C930 290 966 300 976 318
  L979 360 C979 380 971 392 956 396 L912 400 A56 62 0 1 0 808 404 L528 418 A60 68 0 1 0 412 420 L404 412 Z`;
const FASCIA = `M402 360 C300 352 200 344 128 338 C112 340 106 352 108 366 L116 400 C118 410 126 414 138 414 L404 412 Z`;
const HOOD = `M128 338 C200 344 300 352 402 360 C410 335 432 318 474 311 C500 300 520 293 540 289 L300 272
  C250 278 200 300 160 316 C140 324 130 330 128 338 Z`;
const DECK = `M716 248 C800 260 906 284 976 318 C966 300 930 290 880 292 L806 293 Z`;
const WINDSHIELD = `M300 272 L540 289 C566 262 586 242 600 232 L384 220 C352 236 324 254 300 272 Z`;
const ROOF = `M384 220 L600 232 C650 236 690 242 716 248 C696 234 650 220 600 215 C520 210 440 211 384 220 Z`;
const SIDE_GLASS = `M560 293 C582 268 600 248 612 238 C660 240 696 245 722 252 C752 264 782 279 800 292 Z`;

const BODY_ALL = [SIDE, FASCIA, HOOD, DECK, ROOF, WINDSHIELD, SIDE_GLASS];
const bodyClip = (id) => `<clipPath id="${id}">${BODY_ALL.map(d => `<path d="${d}"/>`).join('')}</clipPath>`;

const defs = `
  <linearGradient id="sideP" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#6c9cf6"/><stop offset=".12" stop-color="#2f62de"/><stop offset=".5" stop-color="#173b98"/>
    <stop offset=".85" stop-color="#0b1f5a"/><stop offset="1" stop-color="#071330"/>
  </linearGradient>
  <linearGradient id="sideFade" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0" stop-color="#fff" stop-opacity=".12"/><stop offset=".45" stop-color="#fff" stop-opacity="0"/>
    <stop offset="1" stop-color="#000" stop-opacity=".35"/>
  </linearGradient>
  <linearGradient id="hoodP" x1="0" y1="1" x2=".6" y2="0">
    <stop offset="0" stop-color="#2557d4"/><stop offset=".55" stop-color="#4f86f0"/><stop offset="1" stop-color="#9cc0ff"/>
  </linearGradient>
  <linearGradient id="fasciaP" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#2a5bd7"/><stop offset=".45" stop-color="#143488"/><stop offset="1" stop-color="#081538"/>
  </linearGradient>
  <linearGradient id="deckP" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="#3d6fe2"/><stop offset="1" stop-color="#0f2a72"/>
  </linearGradient>
  <linearGradient id="glass34" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="#5a6b86"/><stop offset=".4" stop-color="#1b2435"/><stop offset="1" stop-color="#0a0f18"/>
  </linearGradient>
  <linearGradient id="glassStreak" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".5" stop-color="#fff" stop-opacity=".35"/><stop offset="1" stop-color="#fff" stop-opacity="0"/>
  </linearGradient>
  <radialGradient id="rim34" cx="38%" cy="32%" r="80%">
    <stop offset="0" stop-color="#ffffff"/><stop offset=".45" stop-color="#c3cbd6"/><stop offset="1" stop-color="#4b5563"/>
  </radialGradient>`;

// wheel seen at an angle: tread cylinder + compressed face
const wheel = (cx, cy, r, squeeze = .78, id = '') => {
  const rx = r * squeeze;
  return `
  <g>
    <ellipse cx="${cx - r * .28}" cy="${cy}" rx="${rx}" ry="${r}" fill="#0b0e13"/>
    <rect x="${cx - r * .28}" y="${cy - r}" width="${r * .28}" height="${r * 2}" fill="#14181f"/>
    <g transform="translate(${cx} ${cy}) scale(${squeeze} 1)">
      <circle r="${r}" fill="url(#tire)"/>
      <circle r="${r * .74}" fill="#1f242c"/>
      <path transform="scale(${r / 46})" d="M-31 -10 A33 33 0 0 1 -12 -31 L-7 -19 A20 20 0 0 0 -19 -6 Z" fill="#ea580c"/>
      ${Array.from({ length: 10 }, (_, i) => `<path transform="rotate(${i * 36}) scale(${r / 46})" d="M-3 -12 L-6 -42 C-2 -44 2 -44 6 -42 L3 -12 Z" fill="url(#rim34)"/>`).join('')}
      <circle r="${r * .74}" fill="none" stroke="url(#rim34)" stroke-width="${r * .1}"/>
      <circle r="${r * .2}" fill="url(#rim34)"/><circle r="${r * .08}" fill="#ea580c"/>
    </g>
  </g>`;
};

function car({ seats = false, extra = '' } = {}) {
  return `
  <defs>${defs}${bodyClip('car34clip')}</defs>
  <ellipse cx="560" cy="430" rx="470" ry="34" fill="#0f172a" opacity=".38" filter="url(#blur14)"/>
  <path d="M120 414 L404 420 L540 428 L960 404 L980 396 L960 420 L540 446 L404 440 L130 426 Z" fill="#0f172a" opacity=".55" filter="url(#blur6)"/>


  <!-- wheel wells -->
  <ellipse cx="860" cy="372" rx="54" ry="60" fill="#06080c"/>
  <ellipse cx="470" cy="386" rx="58" ry="66" fill="#06080c"/>

  <path d="${SIDE}" fill="url(#sideP)"/>
  <path d="${SIDE}" fill="url(#sideFade)"/>
  <path d="${DECK}" fill="url(#deckP)"/>
  <path d="${HOOD}" fill="url(#hoodP)"/>
  <path d="${FASCIA}" fill="url(#fasciaP)"/>
  <path d="${ROOF}" fill="#0d1a3d"/>
  <path d="${WINDSHIELD}" fill="url(#glass34)"/>
  <path d="${SIDE_GLASS}" fill="url(#glass34)"/>
  ${seats ? `<g clip-path="url(#seatClip)"><clipPath id="seatClip"><path d="${WINDSHIELD}"/><path d="${SIDE_GLASS}"/></clipPath>
    <path d="M420 290 C416 262 428 246 446 246 C462 246 470 260 466 280 L462 292 Z" fill="#c58448"/>
    <path d="M494 294 C490 266 502 250 520 250 C536 250 544 264 540 284 L536 296 Z" fill="#b8763d"/>
    <path d="M650 292 C646 268 658 254 676 254 C692 254 700 266 696 284 L694 294 Z" fill="#c58448"/></g>` : ''}
  <path d="M330 268 L420 226 L470 228 L380 278 Z" fill="url(#glassStreak)"/>
  <path d="M630 290 L670 242 L700 244 L660 292 Z" fill="url(#glassStreak)" opacity=".7"/>

  <!-- hood creases + highlight -->
  <path d="M170 338 C220 318 260 296 300 274" stroke="#fff" stroke-opacity=".35" stroke-width="2.5" fill="none"/>
  <path d="M360 354 C400 330 450 306 520 290" stroke="#0b1f5a" stroke-opacity=".35" stroke-width="2.5" fill="none"/>
  <path d="M200 330 C260 320 330 312 420 306" stroke="#fff" stroke-opacity=".45" stroke-width="10" fill="none" filter="url(#blur6)"/>
  <!-- shoulder line + side sculpting -->
  <path d="M410 352 C430 326 460 316 500 312 C600 306 760 298 880 294 C930 292 962 302 974 318" stroke="#fff" stroke-opacity=".75" stroke-width="2.5" fill="none"/>
  <path d="M540 370 C640 360 760 350 900 344" stroke="#fff" stroke-opacity=".3" stroke-width="8" fill="none" filter="url(#blur6)"/>
  <path d="M700 332 C740 326 780 326 812 334 L800 368 C770 360 740 356 706 356 Z" fill="#050a18"/>
  <path d="M706 334 C740 330 776 330 806 336" stroke="#fff" stroke-opacity=".4" stroke-width="2" fill="none"/>
  <path d="M570 302 C566 340 566 380 568 414" stroke="#061033" stroke-width="2" opacity=".8" fill="none"/>
  <rect x="600" y="318" width="30" height="6" rx="3" fill="#c7d2e0" opacity=".9"/>
  <path d="M528 292 C540 280 560 278 572 284 L566 298 L536 300 Z" fill="#1d4ed8"/><path d="M532 292 L566 286" stroke="#fff" stroke-opacity=".6" stroke-width="2"/>
  <!-- rocker -->
  <path d="M528 410 L808 398 L810 406 L530 420 Z" fill="#050a18"/>

  <!-- front face: lights, intakes, splitter -->
  <path d="M322 350 C352 352 382 356 402 362 L398 378 C372 374 346 370 318 366 Z" fill="#0b1220"/>
  <path d="M330 356 C356 358 380 361 396 366 L394 372 C372 369 350 366 328 363 Z" fill="#fff" filter="url(#glow)"/>
  <path d="M134 342 C160 344 186 346 210 348 L206 362 C182 360 158 358 132 355 Z" fill="#0b1220"/>
  <path d="M138 346 C160 348 184 350 204 352 L202 357 C180 355 160 354 137 352 Z" fill="#fff" filter="url(#glow)"/>
  <path d="M196 372 L338 380 L330 404 L202 398 Z" fill="#050a18"/>
  <g stroke="#1e293b" stroke-width="2">${[214, 240, 266, 292, 316].map(x => `<path d="M${x} 376 L${x - 2} 400"/>`).join('')}</g>
  <path d="M120 372 L178 374 L176 398 L124 394 Z" fill="#050a18"/>
  <path d="M352 384 L400 386 L398 408 L348 406 Z" fill="#050a18"/>
  <path d="M110 402 L404 412 L404 422 L114 412 Z" fill="#0b0e13"/>
  <path d="M128 338 C200 344 300 352 402 360" stroke="#fff" stroke-opacity=".8" stroke-width="2.5" fill="none"/>
  <!-- roofline glint -->
  <path d="M384 220 L600 232 C650 236 690 242 716 248 C800 260 906 284 976 318" stroke="#fff" stroke-opacity=".7" stroke-width="2" fill="none"/>
  <path d="M790 300 C860 290 930 292 968 312" stroke="#fff" stroke-opacity=".5" stroke-width="7" fill="none" filter="url(#blur6)"/>

  ${wheel(860, 372, 50, .74)}
  ${wheel(470, 386, 56, .76)}
  ${extra}`;
}

module.exports = { car, SIDE, HOOD, DECK, FASCIA, ROOF, WINDSHIELD, SIDE_GLASS, bodyClip };
