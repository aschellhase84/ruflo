/**
 * Erzeugt die lokalen Platzhalterbilder unter `public/images/`.
 *
 * Warum ein eigener Generator?
 * - Es werden KEINE externen Bild-URLs benötigt (die später brechen könnten).
 * - Die Platzhalter sind stilvolle, abstrakte Landschafts- und Farbflächen
 *   in der mediterranen Farbpalette der Website.
 * - Jedes Bild hat exakt die Maße, die in `data/trip-data.ts` hinterlegt sind
 *   → keine Layout Shifts.
 *
 * Eigene Fotos einsetzen:
 *   1. Foto nach `public/images/<name>.jpg` legen
 *   2. In `data/trip-data.ts` bei dem Bild `src` und `width`/`height` anpassen
 *
 * Aufruf:  npm run placeholders
 *
 * Reines Node (zlib) — bewusst ohne Abhängigkeiten, damit der Build überall läuft.
 */
import { deflateSync } from 'node:zlib';
import { writeFileSync, readFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT_DIR = join(ROOT, 'public', 'images');

/* ------------------------------------------------------------------ */
/* Farbwelten                                                          */
/* ------------------------------------------------------------------ */

/** @type {Record<string, {sky: [string,string], hills: [string,string,string], sun: string}>} */
const TONES = {
  sand: { sky: ['#F6EFE2', '#E6D5BA'], hills: ['#DAC6A3', '#C5AB84', '#A98C66'], sun: '#FFF6E6' },
  terracotta: { sky: ['#F2DDC9', '#E1AB82'], hills: ['#CB7E51', '#A9603C', '#7E452B'], sun: '#FFE4C6' },
  olive: { sky: ['#EAEADA', '#CCD3B4'], hills: ['#9BA67B', '#76835B', '#4E593C'], sun: '#F4F2DC' },
  sky: { sky: ['#ECF2F5', '#BCD2DD'], hills: ['#A0B7C4', '#7D98A7', '#5A7381'], sun: '#F6FBFE' },
  dusk: { sky: ['#F4CDA8', '#CA8C70'], hills: ['#8F6356', '#604541', '#3A2F2F'], sun: '#FFE6BE' },
  night: { sky: ['#54606C', '#2C333B'], hills: ['#252C33', '#1B2126', '#13171B'], sun: '#93A7B4' },
  stone: { sky: ['#F7F3EC', '#DED7CA'], hills: ['#C6BEB0', '#A9A092', '#898174'], sun: '#FCF9F4' },
  wine: { sky: ['#EAD5C6', '#BB8C7C'], hills: ['#90564B', '#6D3C38', '#472729'], sun: '#F7DECA' },
};

/* ------------------------------------------------------------------ */
/* Bild-Manifest — Name, Maße, Farbwelt, Motiv                         */
/* ------------------------------------------------------------------ */

/**
 * Skalierung der Platzhalter.
 *
 * Die Motive bestehen aus weichen Verläufen und Silhouetten — die vertragen
 * eine niedrige Auflösung praktisch verlustfrei, weil next/image sie ohnehin
 * hochskaliert und Verläufe dabei nicht sichtbar leiden. 0.3 drückt die 58
 * Dateien von rund 10 MB auf etwa 2 MB.
 *
 * Für eigene Fotos ist dieser Wert irrelevant — echte Bilder kommen in voller
 * Auflösung nach public/images und werden in data/trip-data.ts eingetragen.
 *
 * Nach einer Änderung: `npm run placeholders` — das Script schreibt die neuen
 * Maße automatisch auch nach data/trip-data.ts zurück.
 */
const SCALE = 0.3;

const L = 'landscape';
const P = 'panorama';
const T = 'town';
const G = 'grove';
const S = 'soft';

/** @type {[name: string, w: number, h: number, tone: keyof typeof TONES, scene: string][]} */
const MANIFEST = [
  // Hero / Abschluss / Zitat
  ['hero-tuscany', 1920, 1200, 'dusk', P],
  ['closing-tuscany', 1920, 1200, 'terracotta', P],
  ['quote-backdrop', 1600, 1000, 'stone', L],

  // Reisebeginn
  ['journey-start', 1200, 1500, 'sky', L],
  ['journey-road', 1400, 1000, 'olive', G],

  // Orte — Rabi (Sticky Story)
  ['rabi-hero', 1600, 1000, 'olive', G],
  ['rabi-01', 1200, 1500, 'sand', G],
  ['rabi-02', 1200, 1500, 'olive', L],
  ['rabi-03', 1200, 1500, 'dusk', G],

  // Orte — Siena (Editorial Grid)
  ['siena-hero', 1600, 1000, 'terracotta', T],
  ['siena-01', 1100, 1400, 'terracotta', S],
  ['siena-02', 1400, 1000, 'sand', T],
  ['siena-03', 1100, 1100, 'wine', S],

  // Orte — Florenz (Horizontaler Bildbereich)
  ['florence-hero', 1600, 1000, 'stone', T],
  ['florence-01', 1100, 1400, 'stone', T],
  ['florence-02', 1100, 1400, 'sand', S],
  ['florence-03', 1100, 1400, 'dusk', T],
  ['florence-04', 1100, 1400, 'wine', S],

  // Orte — San Gimignano (gestapeltes Layout)
  ['san-gimignano-hero', 1600, 1000, 'sand', T],
  ['san-gimignano-01', 1200, 1500, 'stone', T],
  ['san-gimignano-02', 1400, 1000, 'olive', G],
  ['san-gimignano-03', 1200, 1200, 'terracotta', S],

  // Orte — Val d'Orcia (Panorama)
  ['val-dorcia-hero', 2200, 1100, 'olive', P],
  ['val-dorcia-01', 1400, 1000, 'sand', G],
  ['val-dorcia-02', 1400, 1000, 'dusk', P],

  // Orte — Montepulciano (Duo mit Maus-Parallax)
  ['montepulciano-hero', 1600, 1000, 'wine', T],
  ['montepulciano-01', 1200, 1500, 'wine', S],
  ['montepulciano-02', 1200, 1500, 'terracotta', G],

  // Kulinarik
  ['food-pasta', 1200, 1200, 'sand', S],
  ['food-wine', 1100, 1500, 'wine', S],
  ['food-pizza', 1400, 1000, 'terracotta', S],
  ['food-gelato', 1100, 1300, 'stone', S],
  ['food-breakfast', 1400, 1000, 'sand', S],
  ['food-market', 1200, 1200, 'olive', S],
  ['food-dinner', 1600, 900, 'dusk', S],

  // Highlights-Galerie
  ['gallery-01', 1200, 1500, 'dusk', G],
  ['gallery-02', 1400, 1000, 'sand', P],
  ['gallery-03', 1200, 1200, 'terracotta', T],
  ['gallery-04', 1100, 1450, 'olive', G],
  ['gallery-05', 1400, 950, 'sky', L],
  ['gallery-06', 1200, 1500, 'stone', T],
  ['gallery-07', 1300, 1000, 'wine', S],
  ['gallery-08', 1200, 1200, 'olive', S],
  ['gallery-09', 1100, 1400, 'sand', S],
  ['gallery-10', 1500, 1000, 'dusk', P],
  ['gallery-11', 1200, 1500, 'night', G],
  ['gallery-12', 1400, 1000, 'terracotta', L],

  // Horizontale Erinnerungen
  ['memory-first-look', 1200, 1500, 'sky', L],
  ['memory-morning-light', 1200, 1500, 'sand', G],
  ['memory-detour', 1200, 1500, 'olive', L],
  ['memory-evening', 1200, 1500, 'dusk', T],
  ['memory-quiet', 1200, 1500, 'stone', S],
  ['memory-sunset', 1200, 1500, 'terracotta', P],

  // Lieblingsmomente
  ['moment-view', 1400, 1000, 'sky', P],
  ['moment-evening', 1200, 1200, 'dusk', S],
  ['moment-food', 1200, 1200, 'wine', S],
  ['moment-unexpected', 1400, 1000, 'olive', G],
  ['moment-place', 1400, 1000, 'sand', L],
];

/* ------------------------------------------------------------------ */
/* PNG-Encoder (Truecolor, 8 bit)                                      */
/* ------------------------------------------------------------------ */

const CRC_TABLE = (() => {
  const table = new Int32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    table[n] = c;
  }
  return table;
})();

function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const body = Buffer.concat([Buffer.from(type, 'ascii'), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body), 0);
  return Buffer.concat([len, body, crc]);
}

const paeth = (a, b, c) => {
  const p = a + b - c;
  const pa = Math.abs(p - a);
  const pb = Math.abs(p - b);
  const pc = Math.abs(p - c);
  return pa <= pb && pa <= pc ? a : pb <= pc ? b : c;
};

/**
 * RGB-Pixelpuffer (w*h*3) → PNG-Buffer.
 * Adaptive Filterwahl je Zeile (minimale Summe der Absolutwerte) — das ist die
 * übliche PNG-Heuristik und halbiert die Dateigröße bei weichen Verläufen.
 */
function encodePng(width, height, rgb) {
  const stride = width * 3;
  const bpp = 3;
  const raw = Buffer.alloc((stride + 1) * height);
  const candidate = Buffer.alloc(stride);
  const best = Buffer.alloc(stride);

  for (let y = 0; y < height; y++) {
    const cur = y * stride;
    const prev = (y - 1) * stride;
    let bestFilter = 0;
    let bestScore = Infinity;

    for (let f = 0; f < 5; f++) {
      let score = 0;
      for (let i = 0; i < stride; i++) {
        const a = i >= bpp ? rgb[cur + i - bpp] : 0;
        const b = y > 0 ? rgb[prev + i] : 0;
        const c = y > 0 && i >= bpp ? rgb[prev + i - bpp] : 0;
        const x = rgb[cur + i];
        const v =
          f === 0 ? x
          : f === 1 ? x - a
          : f === 2 ? x - b
          : f === 3 ? x - ((a + b) >> 1)
          : x - paeth(a, b, c);
        const byte = v & 0xff;
        candidate[i] = byte;
        score += byte < 128 ? byte : 256 - byte;
      }
      if (score < bestScore) {
        bestScore = score;
        bestFilter = f;
        candidate.copy(best);
      }
    }

    const dst = y * (stride + 1);
    raw[dst] = bestFilter;
    best.copy(raw, dst + 1);
  }

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 2; // colour type: truecolor
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;

  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(raw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

/* ------------------------------------------------------------------ */
/* Hilfsfunktionen                                                     */
/* ------------------------------------------------------------------ */

const hex = (h) => [
  parseInt(h.slice(1, 3), 16),
  parseInt(h.slice(3, 5), 16),
  parseInt(h.slice(5, 7), 16),
];
const mix = (a, b, t) => [
  a[0] + (b[0] - a[0]) * t,
  a[1] + (b[1] - a[1]) * t,
  a[2] + (b[2] - a[2]) * t,
];
const clamp01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v);
const smooth = (t) => t * t * (3 - 2 * t);

/** Deterministischer PRNG, damit derselbe Bildname immer dasselbe Motiv ergibt. */
function rngFor(seedText) {
  let h = 2166136261;
  for (let i = 0; i < seedText.length; i++) {
    h ^= seedText.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  let s = h >>> 0;
  return () => {
    s |= 0;
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// 4×4 Bayer-Matrix gegen Banding in den Verläufen.
// Bewusst schwach dosiert (DITHER): jedes zusätzliche Rauschbit kostet in PNG
// rund 290 KB pro Full-HD-Bild — bei 58 Platzhaltern ist das der Unterschied
// zwischen ~2 MB und ~21 MB im Repository.
const BAYER = [
  [0, 8, 2, 10],
  [12, 4, 14, 6],
  [3, 11, 1, 9],
  [15, 7, 13, 5],
];
const DITHER = 0;

/* ------------------------------------------------------------------ */
/* Motive                                                              */
/* ------------------------------------------------------------------ */

/**
 * Zeichnet eine abstrakte Landschaft: Himmelsverlauf, weiche Sonne,
 * gestaffelte Hügelketten mit Dunstperspektive, optional Türme/Zypressen.
 */
function renderScene(width, height, tone, scene, seed) {
  const rand = rngFor(seed);
  const t = TONES[tone];
  const skyTop = hex(t.sky[0]);
  const skyLow = hex(t.sky[1]);
  const sun = hex(t.sun);
  const hillColors = t.hills.map(hex);

  const rgb = Buffer.alloc(width * height * 3);

  if (scene === 'soft') {
    // Abstrakte Stimmungsfläche für Kulinarik-, Detail- und Innenbilder:
    // einfallendes Licht auf einer dunkleren Fläche, plus eine angedeutete
    // Tischkante. Bewusst kontrastreich — eine reine Tonwertfläche würde wie
    // ein Renderfehler aussehen.
    const aspectS = width / height;
    const light = {
      x: 0.24 + rand() * 0.34,
      y: 0.2 + rand() * 0.26,
      r: 0.42 + rand() * 0.2,
    };
    const shade = {
      x: 0.62 + rand() * 0.3,
      y: 0.68 + rand() * 0.26,
      r: 0.45 + rand() * 0.25,
    };
    const edgeY = 0.58 + rand() * 0.22; // angedeutete Kante / Horizont
    const tilt = (rand() - 0.5) * 0.12;

    const lightColor = mix(sun, skyTop, 0.35);
    const midColor = mix(hillColors[0], skyLow, 0.35);
    const darkColor = mix(hillColors[2], hillColors[1], 0.35);

    for (let y = 0; y < height; y++) {
      const vy = y / (height - 1);
      for (let x = 0; x < width; x++) {
        const vx = x / (width - 1);

        // Diagonale Grundfläche: oben links heller, unten rechts dunkler
        const diag = clamp01((vx * 0.45 + vy * 0.75) / 1.2);
        let c = mix(midColor, darkColor, smooth(diag) * 0.85);

        // Lichteinfall
        const ldx = (vx - light.x) * aspectS;
        const ldy = vy - light.y;
        const ld = Math.sqrt(ldx * ldx + ldy * ldy) / light.r;
        if (ld < 1) c = mix(c, lightColor, Math.pow(smooth(1 - ld), 1.5) * 0.92);

        // Gegenschatten
        const sdx = (vx - shade.x) * aspectS;
        const sdy = vy - shade.y;
        const sd = Math.sqrt(sdx * sdx + sdy * sdy) / shade.r;
        if (sd < 1) c = mix(c, darkColor, Math.pow(smooth(1 - sd), 1.6) * 0.7);

        // Weiche Kante quer durchs Bild — gibt der Fläche einen Halt
        const edge = edgeY + (vx - 0.5) * tilt;
        const band = clamp01((vy - edge) / 0.16);
        c = mix(c, mix(c, darkColor, 0.4), smooth(band) * 0.55);

        // Vignette
        const dx = (vx - 0.5) * 1.3;
        const dy = (vy - 0.5) * 1.15;
        const vig = clamp01(Math.sqrt(dx * dx + dy * dy) / 0.95);
        c = mix(c, [c[0] * 0.6, c[1] * 0.58, c[2] * 0.6], Math.pow(vig, 2.4) * 0.6);

        writePixel(rgb, width, height, x, y, c);
      }
    }
    return rgb;
  }

  // Hügelketten als Summe weniger Sinuswellen — ruhig, nie zackig.
  const horizon = scene === 'panorama' ? 0.62 : 0.55;
  const layerCount = scene === 'panorama' ? 4 : 3;
  const layers = Array.from({ length: layerCount }, (_, i) => {
    const depth = i / Math.max(1, layerCount - 1);
    return {
      base: horizon + depth * (scene === 'panorama' ? 0.16 : 0.2) + rand() * 0.03,
      amp: (0.05 - depth * 0.02) * (0.7 + rand() * 0.6),
      waves: [
        { f: 0.7 + rand() * 0.9, p: rand() * Math.PI * 2, a: 1 },
        { f: 1.9 + rand() * 1.6, p: rand() * Math.PI * 2, a: 0.45 },
        { f: 3.7 + rand() * 2.4, p: rand() * Math.PI * 2, a: 0.18 },
      ],
      color: mix(hillColors[Math.min(i, hillColors.length - 1)], hillColors[hillColors.length - 1], depth * 0.25),
      haze: 1 - depth * 0.85,
    };
  });

  const ridgeAt = (layer, vx) => {
    let v = 0;
    for (const w of layer.waves) v += Math.sin(vx * Math.PI * 2 * w.f + w.p) * w.a;
    return layer.base + v * layer.amp;
  };

  // Silhouetten auf dem hintersten Kamm — so stehen sie frei gegen den Himmel:
  // Türme (town) oder Zypressen (grove).
  const silhouettes = [];
  if (scene === 'town' || scene === 'grove') {
    const count = scene === 'town' ? 5 + Math.floor(rand() * 4) : 4 + Math.floor(rand() * 5);
    for (let i = 0; i < count; i++) {
      const cx = 0.08 + (i + rand() * 0.6) / count * 0.86;
      silhouettes.push({
        cx,
        halfWidth: scene === 'town' ? (0.008 + rand() * 0.016) : 0.006 + rand() * 0.008,
        height: scene === 'town' ? 0.05 + rand() * 0.12 : 0.09 + rand() * 0.13,
      });
    }
  }

  const sunX = 0.2 + rand() * 0.6;
  const sunY = horizon * (0.3 + rand() * 0.45);
  const sunR = 0.045 + rand() * 0.025;
  const aspect = width / height;

  for (let y = 0; y < height; y++) {
    const vy = y / (height - 1);
    for (let x = 0; x < width; x++) {
      const vx = x / (width - 1);
      let c;

      // Himmel
      const skyT = smooth(clamp01(vy / horizon));
      c = mix(skyTop, skyLow, skyT);

      // Sonne mit weichem Halo
      const sdx = (vx - sunX) * aspect;
      const sdy = vy - sunY;
      const sd = Math.sqrt(sdx * sdx + sdy * sdy);
      if (sd < sunR * 7) {
        const halo = Math.pow(clamp01(1 - sd / (sunR * 7)), 2.4) * 0.5;
        const core = sd < sunR ? smooth(clamp01(1 - sd / sunR)) * 0.85 : 0;
        c = mix(c, sun, clamp01(halo + core));
      }

      // Hügel von hinten (layers[0], höchster Kamm) nach vorn — nähere Ketten
      // übermalen die entfernteren.
      for (let i = 0; i < layers.length; i++) {
        const layer = layers[i];
        const ridge = ridgeAt(layer, vx);
        let inside = vy >= ridge;

        if (!inside && i === 0 && silhouettes.length) {
          for (const s of silhouettes) {
            const top = ridge - s.height;
            if (vy < top) continue;
            const p = clamp01((ridge - vy) / s.height); // 0 = Fuß, 1 = Spitze
            const hw =
              scene === 'town'
                ? s.halfWidth
                : s.halfWidth * Math.pow(1 - p, 0.55) * 1.35;
            if (Math.abs(vx - s.cx) <= hw) {
              inside = true;
              break;
            }
          }
        }

        if (inside) {
          // Dunstperspektive: entferntere Ketten laufen in den Himmel aus.
          const fade = clamp01((vy - ridge) / 0.12);
          const body = mix(layer.color, mix(layer.color, skyLow, 0.55), (1 - smooth(fade)) * layer.haze);
          c = mix(body, mix(body, hillColors[hillColors.length - 1], 0.35), clamp01((vy - ridge) * 1.6));
        }
      }

      // Vignette — hält den Blick in der Bildmitte
      const dx = (vx - 0.5) * 1.35;
      const dy = (vy - 0.5) * 1.15;
      const vig = clamp01(Math.sqrt(dx * dx + dy * dy) / 0.95);
      c = mix(c, [c[0] * 0.62, c[1] * 0.6, c[2] * 0.62], Math.pow(vig, 2.6) * 0.55);

      writePixel(rgb, width, height, x, y, c);
    }
  }

  return rgb;
}

function writePixel(rgb, width, height, x, y, c) {
  const d = DITHER === 0 ? 0 : (BAYER[y & 3][x & 3] / 16 - 0.5) * DITHER;
  const i = (y * width + x) * 3;
  rgb[i] = Math.max(0, Math.min(255, Math.round(c[0] + d)));
  rgb[i + 1] = Math.max(0, Math.min(255, Math.round(c[1] + d)));
  rgb[i + 2] = Math.max(0, Math.min(255, Math.round(c[2] + d)));
}

/* ------------------------------------------------------------------ */
/* Blur-Placeholder je Farbwelt (winzige 8×8-PNGs als Data-URL)        */
/* ------------------------------------------------------------------ */

function tonePlaceholder(tone) {
  const t = TONES[tone];
  const top = hex(t.sky[0]);
  const bottom = hex(t.hills[1]);
  const n = 8;
  const rgb = Buffer.alloc(n * n * 3);
  for (let y = 0; y < n; y++) {
    for (let x = 0; x < n; x++) {
      const c = mix(top, bottom, smooth(y / (n - 1)));
      const i = (y * n + x) * 3;
      rgb[i] = Math.round(c[0]);
      rgb[i + 1] = Math.round(c[1]);
      rgb[i + 2] = Math.round(c[2]);
    }
  }
  return `data:image/png;base64,${encodePng(n, n, rgb).toString('base64')}`;
}

/* ------------------------------------------------------------------ */
/* Ausführung                                                          */
/* ------------------------------------------------------------------ */

mkdirSync(OUT_DIR, { recursive: true });

let totalBytes = 0;
/** Name → tatsächlich geschriebene Maße, für den Abgleich mit trip-data.ts. */
const written = new Map();

for (const [name, w, h, tone, scene] of MANIFEST) {
  const width = Math.max(2, Math.round(w * SCALE));
  const height = Math.max(2, Math.round(h * SCALE));
  // Seed bewusst ohne Maße — dasselbe Motiv bleibt bei jeder Skalierung gleich.
  const rgb = renderScene(width, height, tone, scene, `${name}:${tone}:${scene}`);
  const png = encodePng(width, height, rgb);
  writeFileSync(join(OUT_DIR, `${name}.png`), png);
  written.set(name, { width, height });
  totalBytes += png.length;
}

/*
 * Maße in data/trip-data.ts nachziehen.
 *
 * width/height dort müssen die echten Dateimaße beschreiben — sonst stimmen
 * die von next/image erzeugten srcset-Kandidaten nicht. Angefasst werden nur
 * Einträge, die auf einen generierten Platzhalter zeigen; eigene Fotos
 * (andere Dateiendung oder anderer Name) bleiben unberührt.
 */
const tripDataPath = join(ROOT, 'data', 'trip-data.ts');
let tripData = readFileSync(tripDataPath, 'utf8');
let synced = 0;

tripData = tripData.replace(
  /(src: '\/images\/([\w-]+)\.png',[\s\S]{0,400}?width: )(\d+)(,[\s\S]{0,120}?height: )(\d+)(,)/g,
  (match, head, name, oldWidth, mid, oldHeight, tail) => {
    const size = written.get(name);
    if (!size) return match;
    synced += 1;
    return `${head}${size.width}${mid}${size.height}${tail}`;
  },
);

writeFileSync(tripDataPath, tripData);

const toneEntries = Object.keys(TONES)
  .map((tone) => `  ${tone}: '${tonePlaceholder(tone)}',`)
  .join('\n');

writeFileSync(
  join(ROOT, 'data', 'image-tones.ts'),
  `// AUTOMATISCH ERZEUGT von scripts/generate-placeholders.mjs — nicht von Hand bearbeiten.
// Winzige 8x8-PNGs als Blur-Placeholder für next/image (verhindert "harte" Bildeinblendungen).

export type ImageTone = ${Object.keys(TONES)
    .map((t) => `'${t}'`)
    .join(' | ')};

export const toneBlurData: Record<ImageTone, string> = {
${toneEntries}
};
`,
);

console.log(
  `${MANIFEST.length} Platzhalter erzeugt bei Skalierung ${SCALE} ` +
    `(${(totalBytes / 1024 / 1024).toFixed(2)} MB) → public/images/\n` +
    `${synced} Bildmaße in data/trip-data.ts abgeglichen.`,
);
