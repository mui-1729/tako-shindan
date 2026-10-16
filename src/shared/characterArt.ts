import { characters, legacyCharacters, type DiagnosisVersion } from './diagnosis';

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
  const color = legacyCharacters[i].color;
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


/**
 * v2: Each of the 16 outcomes has its own animal species, drawn in inline SVG.
 * These are lightweight first-pass vector mascots; no external images required.
 */
const animalBack = [
  '<path d="M100 137L106 60L150 102L195 60L217 137Z" fill="#e99a58" stroke="#80606b" stroke-width="5"/>',
  '<path d="M93 147L113 92L139 122L181 122L206 92L227 147Z" fill="#f5bf5c" stroke="#80606b" stroke-width="5"/>',
  '<circle cx="160" cy="148" r="92" fill="#ba8759" stroke="#80606b" stroke-width="5"/>',
  '<path d="M96 136L111 66L151 106L193 66L223 140Z" fill="#8696af" stroke="#80606b" stroke-width="5"/>',
  '<path d="M111 123L119 68L151 109L193 68L211 125Z" fill="#fbebee" stroke="#a1829e" stroke-width="5"/><path d="M149 95L160 25L174 95Z" fill="#fbe1a2" stroke="#a1829e" stroke-width="5"/>',
  '<path d="M103 140L108 65L148 110L188 61L218 140Z" fill="#9dc5a6" stroke="#80606b" stroke-width="5"/><path d="M113 113q-51-26-57 9l45 51M212 110q52-24 56 15l-43 46" fill="#c7d99e" stroke="#80606b" stroke-width="5"/>',
  '<circle cx="107" cy="95" r="27" fill="#ae8569" stroke="#80606b" stroke-width="5"/><circle cx="210" cy="95" r="27" fill="#ae8569" stroke="#80606b" stroke-width="5"/>',
  '<path d="M94 153q-34-68 66-80q97 11 66 80" fill="#b2c6d5" stroke="#80606b" stroke-width="5"/><path d="M136 89l24-48 24 48" fill="#dbe7ee" stroke="#80606b" stroke-width="5"/>',
  '<path d="M104 180q-52-36-40-78q59 6 70 59M218 181q52-39 38-78q-56 7-69 59" fill="#6cbbd2" stroke="#568ca5" stroke-width="5"/>',
  '<path d="M119 215q-39 67-51 24q-8-30 24-31M143 221q-25 72 0 72q22-4 22-61M176 225q3 75 26 65q23-12-5-74M210 212q43 57 49 18q1-25-27-31" fill="#c3a6e7" stroke="#80606b" stroke-width="5"/>',
  '<path d="M106 128q-21-77-3-91q27-8 44 78M173 113q18-90 44-79q19 13-1 94" fill="#ffeff3" stroke="#b78b9d" stroke-width="5"/>',
  '<path d="M89 156q0-99 71-99q71 0 71 99" fill="#83b99c" stroke="#5f8d73" stroke-width="6"/><path d="M104 118q56-69 112 0" stroke="#cde4b5" stroke-width="8" fill="none"/>',
  '<path d="M134 158q-92-130-98-45q-10 68 105 73M184 159q92-130 97-45q8 68-105 73" fill="#d6b4eb" stroke="#9875ac" stroke-width="5"/><circle cx="77" cy="132" r="20" fill="#f8d4f4"/><circle cx="243" cy="132" r="20" fill="#f8d4f4"/>',
  '<path d="M93 146L117 71L145 125L177 125L204 69L228 146Z" fill="#a7a3c2" stroke="#766888" stroke-width="6"/>',
  '<circle cx="102" cy="104" r="29" fill="#2f3c43"/><circle cx="218" cy="104" r="29" fill="#2f3c43"/>',
  '<path d="M98 138L115 59L154 104L194 57L223 139Z" fill="#b8aaad" stroke="#766888" stroke-width="5"/>',
];
const animalFront = [
  '<path d="M110 180L145 205H175L210 180L160 218Z" fill="#fff4e2"/><path d="M151 190l9 7 9-7" fill="#79525e"/>',
  '<path d="M119 105l15 30m26-35v34m26-27l-14 28" stroke="#b77841" stroke-width="10" stroke-linecap="round"/><path d="M125 186h70" stroke="#fff5dc" stroke-width="9" stroke-linecap="round"/>',
  '<ellipse cx="160" cy="192" rx="44" ry="29" fill="#fff1d0"/><path d="M153 186l7 8 7-8" fill="#8c6448"/>',
  '<path d="M121 104l16 21m46-19l-15 20" stroke="#5d6c88" stroke-width="12" stroke-linecap="round"/><ellipse cx="160" cy="192" rx="42" ry="24" fill="#eff1eb"/>',
  '<path d="M143 98q17 13 33 0" stroke="#f6cedb" stroke-width="17" fill="none"/><path d="M179 83q37-18 44 6" stroke="#e4b9dc" stroke-width="16" fill="none"/>',
  '<path d="M109 126l-16-30 37 13M212 126l16-30-38 13" fill="#729b7e"/><path d="M160 55l16 24-16 14-16-14Z" fill="#fff3cb"/>',
  '<ellipse cx="159" cy="185" rx="43" ry="27" fill="#f2e4cc"/><ellipse cx="160" cy="185" rx="9" ry="7" fill="#80606b"/>',
  '<path d="M160 154l-18 30 18 23 19-23Z" fill="#f7c46c" stroke="#a6856b" stroke-width="4"/><path d="M114 139q21 20 39 0M167 139q21 20 39 0" stroke="#80606b" stroke-width="5" fill="none"/>',
  '<path d="M191 183q58 0 66 26q-43 14-66-2" fill="#9bd7e3" stroke="#598da2" stroke-width="4"/><path d="M129 116q31-34 64 0" fill="none" stroke="#a2edf3" stroke-width="9"/>',
  '<circle cx="141" cy="155" r="7" fill="#634968"/><circle cx="179" cy="155" r="7" fill="#634968"/><path d="M145 186q15 13 30 0" stroke="#634968" stroke-width="5" fill="none"/>',
  '<path d="M114 86q12-5 18 16m57 0q13-21 20-17" stroke="#eea2b6" stroke-width="14" stroke-linecap="round"/>',
  '<ellipse cx="160" cy="182" rx="44" ry="33" fill="#e1e9c1"/><path d="M135 181h50m-25-21v45" stroke="#92ac79" stroke-width="4"/>',
  '<path d="M160 84v-24" stroke="#9875ac" stroke-width="6"/><circle cx="160" cy="55" r="8" fill="#ffe4a5"/>',
  '<circle cx="134" cy="146" r="24" fill="#e7e1ff" stroke="#766888" stroke-width="4"/><circle cx="186" cy="146" r="24" fill="#e7e1ff" stroke="#766888" stroke-width="4"/><path d="M155 169l5 12 5-12" fill="#ecc07e"/>',
  '<ellipse cx="137" cy="151" rx="24" ry="32" fill="#53525e"/><ellipse cx="183" cy="151" rx="24" ry="32" fill="#53525e"/><circle cx="137" cy="149" r="9" fill="#fff"/><circle cx="183" cy="149" r="9" fill="#fff"/><ellipse cx="160" cy="191" rx="10" ry="7" fill="#35333c"/>',
  '<path d="M111 183l-30-9m30 20l-30 7m126-18l30-9m-30 20l30 7" stroke="#8f798a" stroke-width="4" stroke-linecap="round"/><path d="M153 186l7 7 7-7" fill="#80606b"/>',
];

export function animalSvg(index: number): string {
  const i = Math.min(15, Math.max(0, Math.floor(index)));
  const palette = characters[i].color;
  const isOctopus = i === 9;
  const face = isOctopus
    ? '<path d="M99 183q0-82 61-82t61 82q0 69-61 69t-61-69Z" fill="#c3a6e7" stroke="#8d6b9c" stroke-width="5"/>'
    : '<path d="M100 155q0-69 60-69t60 69v39q0 61-60 61t-60-61Z" fill="#fff5ea" stroke="#947c82" stroke-width="5"/>';
  const eyes = i === 13 || i === 14 || i === 7
    ? '' : '<ellipse cx="137" cy="159" rx="6" ry="8" fill="#584452"/><ellipse cx="183" cy="159" rx="6" ry="8" fill="#584452"/>';
  const blush = '<ellipse cx="118" cy="180" rx="12" ry="7" fill="#eda3b9" opacity=".55"/><ellipse cx="202" cy="180" rx="12" ry="7" fill="#eda3b9" opacity=".55"/>';
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 320" width="320" height="320">
  <defs><radialGradient id="bg"><stop stop-color="#fffefa"/><stop offset="1" stop-color="${palette}"/></radialGradient></defs>
  <circle cx="160" cy="159" r="148" fill="url(#bg)" opacity=".62"/>
  <circle cx="62" cy="79" r="9" fill="#fff" opacity=".85"/><circle cx="254" cy="213" r="12" fill="#fff" opacity=".8"/>
  <path d="M252 60l5-18 6 18 17 5-17 6-6 18-5-18-17-6Z" fill="#fff2ac"/>
  <ellipse cx="160" cy="276" rx="83" ry="13" fill="#855d74" opacity=".15"/>
  <path d="M114 229q-18-10-37 12m129-12q18-10 36 12" fill="none" stroke="#947c82" stroke-width="14" stroke-linecap="round"/>
  <ellipse cx="160" cy="236" rx="60" ry="45" fill="${palette}" stroke="#947c82" stroke-width="5"/>
  ${animalBack[i]}
  ${face}
  ${blush}
  ${eyes}
  ${animalFront[i]}
  <path d="M146 206q14 13 28 0" fill="none" stroke="#795765" stroke-width="4" stroke-linecap="round"/>
  </svg>`;
}

export function characterImage(index: number, version: DiagnosisVersion = 2): string {
  const svg = version === 1 ? characterSvg(index) : animalSvg(index);
  return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
}
