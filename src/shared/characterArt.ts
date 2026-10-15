import { characters } from './diagnosis';

/**
 * Tiny self-contained, original SVG mascots.
 * No network requests and no image hosting; usable in both cards and canvas exports.
 */
const props = [
  '<path d="M123 77l8-23 27 16 25-30 19 29 28-14-7 36Z" fill="#ffd56c" stroke="#965c30" stroke-width="5" stroke-linejoin="round"/><circle cx="160" cy="61" r="6" fill="#fff5b2"/>',
  '<path d="M118 84L143 57l14 26 16-33 37 35" fill="none" stroke="#88606d" stroke-width="12" stroke-linejoin="round"/><path d="M196 62l25-11" stroke="#ffd86b" stroke-width="8" stroke-linecap="round"/>',
  '<path d="M114 69Q160 18 206 69" fill="none" stroke="#f4a29a" stroke-width="16" stroke-linecap="round"/><path d="M137 53l-18-25M184 54l16-26" stroke="#ef8f82" stroke-width="8" stroke-linecap="round"/>',
  '<path d="M123 71h74l-11-25h-52Z" fill="#9edbba" stroke="#4b8c72" stroke-width="5"/><path d="M148 49h23" stroke="#fff9db" stroke-width="6" stroke-linecap="round"/>',
  '<path d="M160 32l12 30 31 2-24 20 8 30-27-17-27 17 8-30-24-20 31-2Z" fill="#ffe38c" stroke="#ab7c4d" stroke-width="4"/>',
  '<rect x="119" y="53" width="82" height="35" rx="16" fill="#647cb8" stroke="#415c9a" stroke-width="5"/><circle cx="140" cy="70" r="13" fill="#b6edf8"/><circle cx="180" cy="70" r="13" fill="#b6edf8"/>',
  '<path d="M116 74q-4-38 29-37q15-30 36 0q30-2 24 37" fill="#fff7e7" stroke="#b99d7a" stroke-width="5"/><path d="M130 73h61" stroke="#b99d7a" stroke-width="5"/>',
  '<path d="M112 99q-15-53 48-53t48 53" fill="none" stroke="#566b85" stroke-width="14"/><rect x="103" y="85" width="20" height="35" rx="9" fill="#88a6c3"/><rect x="197" y="85" width="20" height="35" rx="9" fill="#88a6c3"/>',
  '<path d="M124 70q36-49 72 0" fill="none" stroke="#9b7c66" stroke-width="9"/><path d="M160 38v46" stroke="#be9274" stroke-width="8"/><circle cx="160" cy="38" r="12" fill="#ffd98c"/>',
  '<path d="M116 79l19-35 26 26 27-31 19 40" fill="#d5c6f4" stroke="#876db4" stroke-width="5"/><circle cx="185" cy="52" r="8" fill="#fff3a2"/>',
  '<path d="M136 78q-18-28-5-45q20 0 29 23q12-23 29-23q15 17-5 45" fill="#fff1f5" stroke="#de95ad" stroke-width="5"/><circle cx="159" cy="56" r="8" fill="#f0b5c5"/>',
  '<rect x="125" y="50" width="70" height="43" rx="8" fill="#91c3a7" stroke="#548d70" stroke-width="5"/><path d="M138 63h43m-43 12h24" stroke="#eefcf2" stroke-width="5" stroke-linecap="round"/>',
  '<path d="M120 70q30-44 80 0" fill="none" stroke="#9974bf" stroke-width="13" stroke-linecap="round"/><path d="M158 45l3-18 4 18" stroke="#fff1a5" stroke-width="7" stroke-linecap="round"/>',
  '<path d="M125 53h70v37h-70Z" fill="#a4b8e2" stroke="#5776ab" stroke-width="5"/><path d="M160 53v37M139 69h13M170 69h13" stroke="#f4f8ff" stroke-width="4"/>',
  '<path d="M160 34l44 21v29q0 24-44 42q-44-18-44-42V55Z" fill="#eef6f0" stroke="#77aa9a" stroke-width="6"/><path d="M143 79l12 12 24-26" fill="none" stroke="#77aa9a" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>',
  '<path d="M113 98q8-62 47-61q39-1 47 61l-25-15-22 10-22-10Z" fill="#5b627e" stroke="#34394b" stroke-width="6"/><circle cx="187" cy="64" r="5" fill="#d6d5e5"/>',
];

export function characterSvg(index: number): string {
  const i = Math.min(15, Math.max(0, Math.floor(index)));
  const color = characters[i].color;
  const grin = i % 4 === 0
    ? '<path d="M145 164q15 23 30 0" stroke="#7e5363" stroke-width="5" fill="#fa8d9b" stroke-linecap="round"/>'
    : '<path d="M147 164q13 14 26 0" stroke="#7e5363" stroke-width="5" fill="none" stroke-linecap="round"/>';
  const eye = i % 5 === 0
    ? '<path d="M128 144q9-9 19 0m26 0q9-9 19 0" fill="none" stroke="#59485b" stroke-width="6" stroke-linecap="round"/>'
    : '<ellipse cx="139" cy="144" rx="6.5" ry="9" fill="#59485b"/><ellipse cx="183" cy="144" rx="6.5" ry="9" fill="#59485b"/>';
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 320" width="320" height="320">
  <defs><linearGradient id="a" x2=".15" y2="1"><stop stop-color="#fffefa"/><stop offset="1" stop-color="${color}"/></linearGradient><linearGradient id="b" x2="0.3" y2="1"><stop stop-color="#ffffff" stop-opacity=".9"/><stop offset="1" stop-color="${color}"/></linearGradient></defs>
  <circle cx="160" cy="164" r="139" fill="url(#a)" opacity=".45"/>
  <circle cx="62" cy="93" r="8" fill="#fff" opacity=".9"/><circle cx="267" cy="130" r="11" fill="#fff" opacity=".85"/>
  <path d="M71 121l5-16 5 16 16 5-16 5-5 16-5-16-16-5Z" fill="#fff1a1" opacity=".95"/>
  <path d="M245 66l4-14 4 14 14 4-14 4-4 14-4-14-14-4Z" fill="#ffffff"/>
  <ellipse cx="161" cy="273" rx="95" ry="14" fill="#aa8498" opacity=".14"/>
  <path d="M103 207Q67 171 57 207Q51 243 87 242Q104 239 113 221M218 207Q255 172 266 207Q271 244 236 242Q221 239 208 220" fill="${color}" stroke="#9c7f91" stroke-width="6" stroke-linejoin="round"/>
  <path d="M104 207q-21 54-4 65q18 12 38-30q-5 40 16 42q18 2 24-38q17 44 34 27q13-13 2-64" fill="url(#b)" stroke="#9c7f91" stroke-width="6" stroke-linejoin="round"/>
  <path d="M98 154C98 104 125 84 160 84S223 104 223 154v56c0 39-28 55-63 55s-63-16-63-55Z" fill="url(#b)" stroke="#9c7f91" stroke-width="6"/>
  <ellipse cx="120" cy="166" rx="13" ry="8" fill="#f4a5b5" opacity=".62"/>
  <ellipse cx="202" cy="166" rx="13" ry="8" fill="#f4a5b5" opacity=".62"/>
  ${eye}${grin}${props[i]}
  <path d="M126 123q15-10 28 0" stroke="#fff" stroke-width="8" opacity=".35" stroke-linecap="round" fill="none"/>
  </svg>`;
}

export function characterImage(index: number): string {
  return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(characterSvg(index));
}
