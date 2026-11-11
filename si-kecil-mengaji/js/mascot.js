/*
 * Maskot: "Unta Kecil" (anak unta). Dilukis dengan SVG supaya ringan & luar talian.
 */
function mascotSVG({ stage = 0, sleeping = false, mood = 'happy' } = {}) {
  const st = MASCOT_STAGES[Math.min(stage, MASCOT_STAGES.length - 1)];
  const extra = st.extra.split(',');
  const eyes = sleeping
    ? '<path d="M122 62 q5 4 10 0 M140 62 q5 4 10 0" stroke="#4e342e" stroke-width="3" fill="none" stroke-linecap="round"/>'
    : '<circle cx="127" cy="60" r="5" fill="#3e2723"/><circle cx="145" cy="60" r="5" fill="#3e2723"/>' +
      '<circle cx="128.5" cy="58.5" r="1.6" fill="#fff"/><circle cx="146.5" cy="58.5" r="1.6" fill="#fff"/>';
  const mouth = sleeping
    ? '<ellipse cx="140" cy="80" rx="3" ry="2" fill="#6d4c41"/>'
    : mood === 'wow'
      ? '<ellipse cx="140" cy="80" rx="5" ry="6" fill="#6d4c41"/>'
      : '<path d="M131 77 q9 9 18 0" stroke="#6d4c41" stroke-width="3" fill="none" stroke-linecap="round"/>';
  const zz = sleeping
    ? '<text x="160" y="40" font-size="18" fill="#7c4dff" font-family="sans-serif" class="zz">z</text><text x="172" y="26" font-size="13" fill="#7c4dff" font-family="sans-serif" class="zz z2">z</text>'
    : '';
  const scarf = extra.includes('scarf')
    ? '<path d="M112 96 q22 14 40 -2 l2 10 q-22 16 -44 2z" fill="#2ecc71"/><path d="M116 104 l-6 22 l10 -2 l2 -18z" fill="#27ae60"/>'
    : '';
  const cap = extra.includes('cap')
    ? '<path d="M118 42 q18 -16 40 0 l0 6 q-20 -6 -40 0z" fill="#fafafa" stroke="#ddd"/>'
    : '';
  const crown = extra.includes('crown')
    ? '<path d="M120 30 l6 -14 l8 10 l6 -14 l6 14 l8 -10 l4 14z" fill="#ffca28" stroke="#f9a825" stroke-width="2"/>'
    : '';
  return `
<svg class="mascot" viewBox="0 0 200 200" style="--s:${st.scale}" role="img" aria-label="Maskot unta">
  <g class="mascot-body">
    <ellipse cx="100" cy="190" rx="${60 * st.scale}" ry="6" fill="rgba(0,0,0,.08)"/>
    <g transform="translate(100 190) scale(${st.scale}) translate(-100 -190)">
      <rect x="58" y="140" width="12" height="46" rx="6" fill="#d7a86e"/>
      <rect x="78" y="144" width="12" height="44" rx="6" fill="#c8955a"/>
      <rect x="108" y="140" width="12" height="46" rx="6" fill="#d7a86e"/>
      <rect x="126" y="144" width="12" height="44" rx="6" fill="#c8955a"/>
      <ellipse cx="95" cy="132" rx="52" ry="30" fill="#e8bd84"/>
      <ellipse cx="88" cy="104" rx="26" ry="22" fill="#e8bd84"/>
      <path d="M44 128 q-14 4 -12 18" stroke="#c8955a" stroke-width="5" fill="none" stroke-linecap="round"/>
      <path d="M118 120 q4 -40 8 -52 l22 0 q-4 20 -10 56z" fill="#e8bd84"/>
      ${scarf}
      <ellipse cx="138" cy="64" rx="26" ry="24" fill="#f0c993"/>
      <ellipse cx="146" cy="80" rx="16" ry="11" fill="#f6dcb5"/>
      <ellipse cx="116" cy="46" rx="7" ry="10" fill="#d7a86e" transform="rotate(-25 116 46)"/>
      <ellipse cx="160" cy="46" rx="7" ry="10" fill="#d7a86e" transform="rotate(25 160 46)"/>
      <circle cx="122" cy="72" r="5" fill="#ffab91" opacity=".6"/>
      <circle cx="158" cy="72" r="5" fill="#ffab91" opacity=".6"/>
      ${eyes}${mouth}${cap}${crown}
    </g>
  </g>
  ${zz}
</svg>`;
}

function mascotStage() {
  const m = Store.masteredCount();
  let s = 0;
  MASCOT_STAGES.forEach((st, i) => { if (m >= st.min) s = i; });
  return s;
}
