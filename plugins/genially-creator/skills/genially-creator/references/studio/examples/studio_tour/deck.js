// «Genially Studio: from one sentence to endless experiences» — a product tour, the reference deck. Canvas 1200x675.
// The reference deck of studio/: genially-creator's reference deck with the JSDoc hints tsc needs. It uses only the
// deck surface (studio/deck.d.ts, studio/DECK_CONTRACT.md) and the assets assets.json next to it requests, by id.
// Run it with gsDeck.run({ assets }) and gsDeck.wait(): AG.run() writes `ok <slide>`, `error <slide>: …`, `links …`
// and `done` to window.__deckLog. gsDeck.run({ only: ['Cover'] }) (AG.run(['Cover'])) builds only the slides named.
//
// What it shows, in one place:
// - Entrances in reading order within ~2 s: kicker and title (0 s) → cards (0.1) → text (0.2) → rows 0.12-0.15 s
//   apart → buttons last. A shape and the text on it share fx and delay. Backgrounds and glows never animate.
// - Every button is a native button (gsButton) with hex colours; links are wired once every slide exists, and
//   anything near the right edge is placed from its final width (a native button widens to fit its text).
// - Windows from one helper, laid out from the box gsPopup measured: title and text centred as one block, from their
//   painted heights. A native question in a window gets the window's height for three answers.
// - The editor's own pieces: native flip cards (gsFlipCards), a library widget (gsWidget) and library music
//   (gsLibrarySound), with no credits. Music and the voiceover on native buttons with a sound (play and pause).
// - An AI Builder piece at the size its request gave it, going on from its own "Continue" button, with the
//   request's sounds on its success and error actions.
// - A phone made of native layers: gsReveal shows each screen on a click, with gsSound and gsEffect on the same
//   clicks. Tooltips on grouped tags; a voiceover player next to its label.
window.AG = (() => {
  const api = window.geniallyAPI;
  const C = {
    night: '#14123A', card: '#221E5C', card2: '#2C2770', violet: '#6B4EFF', coral: '#FF6B6B', sun: '#FFC93C',
    mint: '#2DD4BF', clay: '#D97757', paper: '#F7F5FF', soft: '#B9B4E6', deep: '#0B0A24', white: '#FFFFFF',
  };
  // The assets of the request, by id, named once here: the rest of the deck uses these names.
  const IMG = {
    cover: 'img_cvrnight', chat: 'img_chatgen', talk: 'img_steptalk', plan: 'img_stepplan', make: 'img_stepmake',
    build: 'img_stepbuild', end: 'img_endsky',
  };
  const SND = { voice: 'aud_introvo', ding: 'aud_dingnt', tap: 'aud_taptap', chime: 'aud_chimes', buzz: 'aud_buzzer', whoosh: 'aud_whoosh' };
  const PIECE = { food: 'aib_fdchain7k' };
  const TITLE = 'Poppins', BODY = 'Inter';

  const T = (s, r, t, o = {}) => L.T(s, r, t, { size: 18, font: BODY, brand: 'body', color: C.paper, lineHeight: 1.4, ...o });
  const H = (s, r, t, o = {}) => L.T(s, r, t, { size: 40, font: TITLE, brand: 'title', bold: true, color: C.paper, lineHeight: 1.15, fx: 'fade-in-bottom', ...o });
  const B = (s, r, t, o = {}) => T(s, r, t, { fx: 'fade-in', delay: 0.2, ...o });
  const KICK = (s, r, t, o = {}) => L.T(s, r, t, { size: 14, font: TITLE, brand: 'subtitle', bold: true, uppercase: true, color: C.mint, fx: 'fade-in', ...o });
  /** @param {string} s @param {GsRect} rect @param {string} col */
  const box = (s, [x, y, w, h], col, o = {}, rad = 20) => L.S(s, L.rrect(w, h, rad), [x, y, w, h], col, { fx: 'fade-in', delay: 0.1, ...o });
  const fade = (id, op) => { if (id) api.updateItemOpacity(id, op); return id; };
  const nextPaint = () => new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));

  // Two soft glows at the corners: decoration, never animated.
  async function glow(s, a = C.violet, b = C.coral) {
    fade(await L.S(s, L.circle(), [-180, -220, 520, 520], a), 0.16);
    fade(await L.S(s, L.circle(), [920, 430, 460, 460], b), 0.12);
  }
  function head(s, kicker, title) {
    KICK(s, [60, 34, 900, 22], kicker);
    return H(s, [60, 58, 1080, 54], title);
  }

  // Native buttons; the links are wired at the end, when every slide exists.
  const links = [];
  /** @returns {GsButtonStyle} */
  const BTN = (bg = C.violet, fg = C.white, o = {}) => ({ shape: 'pill', defaultColor: bg, hoverColor: C.clay, textColor: fg, fontFamily: TITLE, bold: true, ...o });
  /** @param {string} s @param {GsLooseRect} rect @param {string} label @param {string} target @param {{ delay?: number }} [opts] */
  async function go(s, rect, label, target, { delay = 0.9 } = {}) {
    const id = await gsButton(s, rect, label, BTN());
    gsAnimate(id, 'fade-in', { delay });
    links.push([id, target]);
    return id;
  }

  // Every window the same way, from its real box at the canvas's scale (a 'fit' box is shorter than the template's):
  // title and text centred as one block.
  /** @param {string} title @param {string} text @param {{ size?: number }} [opts] @returns {GsPopupFill} */
  const win = (title, text, { size = 19 } = {}) => async (p, { rect: [x, y, w, h] }) => {
    const k = gsPopupBox()[3] / 499, pad = 48 * k, gap = 16 * k, tw = w - 2 * pad;
    const t = H(p, [x + pad, y + pad, tw - 64 * k, 50 * k], title, { size: Math.round(30 * k), color: C.sun, fx: 'fade-in' });
    const b = T(p, [x + pad, y + pad, tw, 60 * k], text, { size: Math.round(size * k), lineHeight: 1.5, fx: 'fade-in', delay: 0.15 });
    await nextPaint();
    const th = api.measureText(t).height, bh = api.measureText(b).height;
    const top = y + Math.max(pad, (h - (th + gap + bh)) / 2);
    api.updateItemPosition(t, x + pad, top);
    api.updateItemLayout(b, { position: { x: x + pad, y: top + th + gap }, size: { width: tw, height: bh } });
  };
  const WIN = { box: C.card, frame: C.violet, closeColor: C.coral };
  const TIP = { bg: C.paper, ink: C.night, accent: C.violet, titleFont: TITLE, bodyFont: BODY };

  const R = [];
  const add = (name, build) => R.push({ name, build });

  // ---------- 1. Cover ----------
  add('Cover', async () => {
    const s = L.slide('Cover', C.night);
    await L.background(s, IMG.cover);
    KICK(s, [70, 120, 520, 22], 'Genially Studio');
    H(s, [70, 148, 560, 150], 'From one sentence\nto a whole genially', { size: 52, delay: 0.1 });
    B(s, [70, 310, 500, 70], 'Interactive experiences, made by asking.', { size: 24, color: C.soft, delay: 0.3 });
    await go(s, [70, 410, 190, 60], 'Start  →', 'One sentence', { delay: 0.6 });
    // Background music from the editor's library, no credits, on a native button in the slide's style: the audio
    // player is a white card that can't be restyled. playPause: the same button stops it.
    const track = await gsLibrarySound('upbeat background music');
    const music = await gsButton(s, [280, 410, 190, 60], '♪  Music', BTN(C.card2, C.white, { showBorder: true, borderColor: C.mint }),
      { sound: track.url, name: 'Background music', loop: true, volume: 25, playMode: 'playPause' });
    gsAnimate(music, 'fade-in', { delay: 0.7 });
    await gsRename('Genially Studio: from one sentence to endless experiences');
  });

  // ---------- 2. One sentence ----------
  add('One sentence', async () => {
    const s = L.slide('One sentence', C.night);
    await glow(s);
    head(s, 'It all starts here', 'It all starts with a sentence');
    T(s, [60, 140, 300, 24], 'You', { size: 14, bold: true, color: C.soft, fx: 'fade-in', delay: 0.1 });
    await box(s, [60, 168, 480, 150], C.violet, { delay: 0.1 }, 24);
    T(s, [88, 190, 424, 160], '“Make me a lesson about the solar system for 9-year-olds, with narration and a final quiz.”', { size: 22, font: TITLE, color: C.white, fx: 'fade-in', delay: 0.1 });
    B(s, [60, 346, 480, 90], 'That becomes a whole genially: script, pictures, sound, games, and the build in the editor.', { size: 18, color: C.soft });
    // The voiceover of the request on a button too: play and pause.
    const vo = await gsButton(s, [60, 450, 240, 56], '▶  Listen to the idea', BTN(C.card2, C.white, { showBorder: true, borderColor: C.violet }),
      { sound: SND.voice, name: 'Voiceover', playMode: 'playPause' });
    gsAnimate(vo, 'fade-in', { delay: 0.5 });
    await L.P(s, IMG.chat, [600, 130, 540, 360], 'img-rounded-square', { fx: 'scale-in-center', delay: 0.4 });
    const chips = [['🪐', '8 planets'], ['🎧', 'Narration'], ['🖼', 'Pictures'], ['❓', 'Final quiz']];
    for (const [k, [e, label]] of chips.entries()) {
      const x = 600 + k * 137, d = 0.6 + k * 0.12;
      await box(s, [x, 510, 128, 76], C.card, { delay: d }, 16);
      T(s, [x + 10, 520, 108, 30], e, { size: 24, align: 'center', fx: 'fade-in', delay: d });
      T(s, [x + 6, 556, 116, 24], label, { size: 14, bold: true, align: 'center', fx: 'fade-in', delay: d });
    }
  });

  // ---------- 3. How it works: the editor's flip cards ----------
  add('How it works', async () => {
    const s = L.slide('How it works', C.night);
    await glow(s, C.mint, C.violet);
    head(s, 'How it works', 'Four steps, one conversation');
    B(s, [60, 118, 900, 30], 'Turn each card with its ↻ button to see what happens.', { size: 18, color: C.soft, delay: 0.15 });
    const steps = [
      [IMG.talk, '1 · Talk', 'You say what you need.', 'Your assistant asks the right questions: topic, audience, goal, tone, length and style.'],
      [IMG.plan, '2 · Plan', 'A script you approve.', 'It writes the outline and every text, checks the facts, and decides where pieces and sound go.'],
      [IMG.make, '3 · Create', 'Pictures, sound, pieces.', 'It makes pictures, video, voice, music, effects and AI Builder pieces, after showing you the price.'],
      [IMG.build, '4 · Build', 'Built and reviewed.', 'It builds the genially in the editor, plays it in the preview and fixes what looks wrong.'],
    ];
    for (const [k, [img, title, front, back]] of steps.entries()) {
      const { id } = await gsFlipCards(s, [60 + k * 280, 172, 240], [{
        front: { image: img, title, text: front }, back: { text: back },
        frontColor: C.card2, frontTextColor: C.white, backColor: C.violet, backTextColor: C.white,
      }], { variant: 0 });
      gsAnimate(id, 'fade-in-bottom', { delay: 0.3 + k * 0.15 });
    }
  });

  // ---------- 4. One prompt, one piece: AI Builder ----------
  add('One prompt, one piece', async () => {
    const s = L.slide('One prompt, one piece', C.night);
    await glow(s, C.mint, C.violet);
    KICK(s, [40, 34, 400, 22], 'AI Builder · Science, kids');
    H(s, [40, 58, 400, 100], 'One prompt,\none piece', { size: 34 });
    await box(s, [40, 160, 400, 200], C.card, { delay: 0.1 }, 20);
    T(s, [64, 178, 352, 24], 'THE PROMPT (SHORT)', { size: 13, bold: true, color: C.mint, fx: 'fade-in', delay: 0.15 });
    T(s, [64, 206, 352, 140], '“Build the food chain”: a drag-and-drop game for children aged 8 to 11. Six cards go into a chain of six slots. A Check button, a hint for the first wrong slot, and an end screen with the number of tries.', { size: 16, lineHeight: 1.5, fx: 'fade-in', delay: 0.2 });
    const full = await gsButton(s, [40, 384, 200, 48], 'Full prompt', BTN(C.card2, C.white, { showBorder: true, borderColor: C.violet }), {
      popup: win('The full prompt, in short', 'Mechanic: drag 6 cards (Sun, Grass, Grasshopper, Frog, Snake, Hawk) into 6 slots joined by arrows.\nCheck: right cards glow mint, wrong ones shake and return, with a hint for the first wrong slot.\nEnd: stars, “Energy unlocked!”, the number of tries, Play again and Continue.\nLook: night indigo, bento cards, Poppins and Inter. Size: exactly 700 × 500.', { size: 18 }),
      ...WIN,
    });
    gsAnimate(full.id, 'fade-in', { delay: 0.5 });
    // A tag with a tooltip: shape and text grouped, so both answer the hover and enter together.
    const tagBox = await box(s, [40, 452, 220, 38], C.mint, { delay: 0.55 }, 19);
    const tagText = T(s, [40, 459, 220, 24], 'What is AI Builder?  ⓘ', { size: 14, bold: true, color: C.night, align: 'center', fx: 'fade-in', delay: 0.55 });
    const tag = api.groupItems([tagBox, tagText]);
    gsAnimate(tag, 'fade-in', { delay: 0.55 });
    gsTooltip(tag, 'AI Builder', 'Interactive pieces written from a description in plain words: what the piece does, for whom, and how it ends.', TIP);
    // At the size the request gave it; it goes on from its own "Continue" button, with the request's sounds.
    await gsAIBuilder(s, PIECE.food, [460, 130, 700, 500], { goTo: 'nextPage', sounds: { 'success|win|correct': SND.chime, 'error|wrong|fail': SND.buzz } });
  });

  // ---------- 5. In your pocket: a phone of native layers ----------
  add('In your pocket', async () => {
    const s = L.slide('In your pocket', C.night);
    await glow(s, C.mint, C.coral);
    KICK(s, [60, 60, 600, 22], 'Sound effects');
    H(s, [60, 84, 620, 54], 'In your pocket');
    B(s, [60, 146, 600, 60], 'Sound brings a genially to life. Try it on this phone: send the quiz, open it and answer.', { size: 19, color: C.soft });
    const steps = [['1', 'Send it to the phone', C.violet], ['2', 'Tap the notification', C.mint], ['3', 'Answer the question', C.sun], ['4', 'Share your result', C.coral]];
    for (const [k, [n, t, col]] of steps.entries()) {
      const y = 232 + k * 62, d = 0.3 + k * 0.12;
      await L.S(s, L.circle(), [60, y, 44, 44], col, { fx: 'fade-in', delay: d });
      T(s, [60, y + 9, 44, 26], n, { size: 18, font: TITLE, bold: true, align: 'center', color: k === 0 ? C.white : C.night, fx: 'fade-in', delay: d });
      T(s, [122, y + 9, 420, 28], t, { size: 19, fx: 'fade-in', delay: d });
    }
    const send = await gsButton(s, [60, 496, 260, 60], '📲  Send to the phone', BTN(), { sound: SND.ding, name: 'Notification' });
    gsAnimate(send, 'fade-in', { delay: 0.9 });

    // The phone: body, screen and lock screen.
    const px = 780, py = 36, sx = px + 12, sy = py + 12, sw = 276, sh = 580;
    await L.S(s, L.rrect(300, 604, 46), [px, py, 300, 604], C.deep, { fx: 'fade-in-left', delay: 0.2 });
    await L.S(s, L.rrect(sw, sh, 36), [sx, sy, sw, sh], C.card2, { fx: 'fade-in-left', delay: 0.2 });
    T(s, [sx, sy + 70, sw, 70], '9:41', { size: 56, font: TITLE, bold: true, align: 'center', fx: 'fade-in-left', delay: 0.2 });
    T(s, [sx, sy + 154, sw, 24], 'Monday', { size: 15, color: C.soft, align: 'center', fx: 'fade-in-left', delay: 0.2 });

    // Each screen is hidden until a click shows it (gsReveal hides the targets), with a sound on the same click.
    const nb = await L.S(s, L.rrect(252, 86, 18), [sx + 12, sy + 200, 252, 86], C.paper);
    const n1 = T(s, [sx + 28, sy + 210, 220, 18], 'GENIALLY · now', { size: 11, bold: true, color: C.violet });
    const n2 = T(s, [sx + 28, sy + 230, 220, 22], 'Your genially is ready! 🎉', { size: 15, bold: true, color: C.night });
    const n3 = T(s, [sx + 28, sy + 254, 220, 20], 'Tap to open the quiz', { size: 13, color: '#4A4580' });
    const notif = api.groupItems([nb, n1, n2, n3]);
    gsReveal(send, notif, { mode: 'show' });

    const quiz = [await L.S(s, L.rrect(sw, sh, 36), [sx, sy, sw, sh], C.paper)];
    quiz.push(T(s, [sx + 24, sy + 52, 228, 20], 'SPACE QUIZ · 1 / 1', { size: 12, bold: true, color: C.violet }));
    quiz.push(T(s, [sx + 24, sy + 80, 228, 100], 'Which planet is known as the Red Planet?', { size: 22, font: TITLE, bold: true, color: C.night, lineHeight: 1.25 }));
    const answers = {};
    for (const [k, a] of ['Venus', 'Mars', 'Jupiter'].entries()) {
      answers[a] = await gsButton(s, [sx + 24, sy + 210 + k * 66, 228, 54], a, BTN(C.white, C.night, { shape: 'rounded', showBorder: true, borderColor: C.violet, hoverColor: '#E4DEFF' }));
      quiz.push(answers[a]);
    }
    gsReveal(notif, quiz, { mode: 'show' });
    gsSound(notif, SND.tap, { name: 'Tap' });

    // Wrong: a toast at the bottom, the answers stay. Right: the success screen covers everything.
    const tb = await L.S(s, L.rrect(228, 52, 14), [sx + 24, sy + 430, 228, 52], C.coral);
    const tt = T(s, [sx + 24, sy + 444, 228, 24], 'Not quite, try again!', { size: 15, bold: true, align: 'center', color: C.night });
    const toast = api.groupItems([tb, tt]);
    for (const a of ['Venus', 'Jupiter']) {
      gsReveal(answers[a], toast, { mode: 'show' });
      gsSound(answers[a], SND.buzz, { name: 'Wrong answer' });
    }
    const right = [await L.S(s, L.rrect(sw, sh, 36), [sx, sy, sw, sh], C.mint)];
    right.push(T(s, [sx, sy + 90, sw, 80], '🎉', { size: 60, align: 'center' }));
    right.push(T(s, [sx, sy + 180, sw, 44], 'Correct!', { size: 34, font: TITLE, bold: true, align: 'center', color: C.night }));
    right.push(T(s, [sx + 28, sy + 236, sw - 56, 80], 'Mars is the Red Planet: its dust is full of rusty iron.', { size: 16, align: 'center', color: C.night }));
    const share = await gsButton(s, [sx + 48, sy + 360, 180, 54], 'Share  ↗', BTN(C.night, C.white));
    right.push(share);
    gsReveal(answers.Mars, right, { mode: 'show' });
    gsSound(answers.Mars, SND.chime, { name: 'Right answer' });
    gsEffect(answers.Mars, 'confetti');
    const sb = await L.S(s, L.rrect(228, 52, 14), [sx + 24, sy + 450, 228, 52], C.night);
    const st = T(s, [sx + 24, sy + 464, 228, 24], 'Sent to your class ✓', { size: 15, bold: true, align: 'center', color: C.white });
    gsReveal(share, api.groupItems([sb, st]), { mode: 'show' });
    gsSound(share, SND.whoosh, { name: 'Share' });
  });

  // ---------- 6. A widget of the library ----------
  add('Spin for an idea', async () => {
    const s = L.slide('Spin for an idea', C.night);
    await glow(s, C.sun, C.violet);
    head(s, 'No credits needed', "The editor's own toolbox");
    B(s, [60, 120, 520, 90], "Ready pieces from Genially's library, filled with this genially's own words. Spin the wheel to pick what to make next.", { size: 20, color: C.soft, delay: 0.15 });
    const more = ['⏰  A timer for a challenge', '🔤  A word search', '🧩  A jigsaw puzzle', '🃏  A memory game'];
    for (const [k, line] of more.entries()) {
      const y = 250 + k * 72, d = 0.3 + k * 0.12;
      await box(s, [60, y, 460, 56], C.card, { delay: d }, 16);
      T(s, [84, y + 15, 420, 28], line, { size: 18, bold: true, fx: 'fade-in', delay: d });
    }
    const colors = [C.violet, C.coral, C.mint, C.sun, C.clay, C.card2];
    // segmentImage '' on every segment: the wheel comes with library photos in some of them.
    const segments = ['Lesson', 'Quiz', 'Timeline', 'Flashcards', 'Story', 'Simulation'].map((t, k) => ({
      questionText: t, color: colors[k], textColor: [C.mint, C.sun].includes(colors[k]) ? C.night : C.white, segmentImage: '',
    }));
    const wheel = await gsWidget(s, 'wheel', [640, 150, 440], {
      segments, centerLabel: 'SPIN', coreBackgroundColor: C.night, coreTextColor: C.white, centerFontFamily: TITLE,
      labelFontFamily: TITLE, labelSize: 'medium', separatorLineColor: C.night, pointerColor: C.sun,
    });
    // A widget paints at its own size, not always the rect's: centred in the right half by the size it took.
    const { width: ww, height: wh } = api.getItem(wheel).size;
    api.updateItemPosition(wheel, 880 - ww / 2, 380 - wh / 2);
    gsAnimate(wheel, 'fade-in', { delay: 0.4 });
  });

  // ---------- 7. Native questions in windows ----------
  /** @type {[string, GsQuestionContent & { type: GsQuestionType }][]} */
  const QUIZ = [
    ['What do you give AI Builder to make a piece?', { type: 'singleChoice', question: 'What do you give AI Builder to make a piece?',
      answers: [{ text: 'A description in plain words', correct: true }, 'A JavaScript file', 'A finished design file'],
      settings: { randomOrder: true, buttonText: 'Check' },
      feedback: { correct: 'Yes! Plain words are enough.', incorrect: 'Not quite: a description in plain words is enough.' } }],
    ['Does it stay editable?', { type: 'trueFalse', question: 'Everything Genially Studio builds stays editable.', correct: true,
      answerTexts: ['True', 'False'], settings: { buttonText: 'Check' },
      feedback: { correct: 'True: texts, shapes, buttons, windows and questions, all editable.', incorrect: "It's true: it's all real, editable Genially content." } }],
    ['What can it generate?', { type: 'multipleChoice', question: 'Which of these can it generate for your genially?',
      answers: [{ text: 'Pictures and sound effects', correct: true }, { text: 'Voiceovers', correct: true }, 'A printed poster'],
      settings: { randomOrder: false, buttonText: 'Check' },
      feedback: { correct: 'Right: pictures, voice and sound, all inside your genially.', incorrect: 'Pictures, voiceovers and sound effects, yes. Printing, no.' } }],
  ];
  add('Quick quiz', async () => {
    const s = L.slide('Quick quiz', C.night);
    await glow(s, C.coral, C.mint);
    head(s, 'Your turn', 'Quick quiz: what did you see?');
    B(s, [60, 116, 1000, 30], 'Three native Genially questions, with no credits. Open each card.', { size: 18, color: C.soft, delay: 0.15 });
    const cols = [C.violet, C.mint, C.sun];
    for (const [k, [topic, q]] of QUIZ.entries()) {
      const x = 60 + k * 370, d = 0.25 + k * 0.15, col = cols[k];
      await box(s, [x, 170, 340, 380], C.card, { delay: d }, 24);
      L.T(s, [x + 30, 196, 120, 100], String(k + 1), { size: 80, font: TITLE, bold: true, color: k ? col : '#A08CFF', fx: 'fade-in', delay: d });
      T(s, [x + 30, 310, 280, 100], topic, { size: 22, font: TITLE, bold: true, lineHeight: 1.25, fx: 'fade-in', delay: d });
      const { id } = await gsButton(s, [x + 30, 466, 180, 52], `Question ${k + 1}`, BTN(col, k ? C.night : C.white), {
        // A question shows only the answers that fit its height: 440 of the window's 499 fit three and keep its margin.
        popup: (p, { rect: [px, py, pw, ph] }) => {
          const k2 = gsPopupBox()[3] / 499, pad = 48 * k2, qh = Math.min(ph, Math.round(440 * k2));
          const qid = gsQuestion(p, q, [px + pad, py + (ph - qh) / 2, pw - 2 * pad, qh]);
          api.updateActivityAppearance(qid, {
            general: { BackgroundColor: C.paper, ShowBackground: true },
            question: { FontColor: C.night, FontFamily: { Name: TITLE } },
            button: { ButtonColor: C.violet, FontColor: C.white },
          });
        },
        box: C.paper, frame: C.violet, closeColor: C.coral,
      });
      gsAnimate(id, 'fade-in', { delay: d + 0.3 });
    }
  });

  // ---------- 8. A bento grid ----------
  add('It stays yours', async () => {
    const s = L.slide('It stays yours', C.night);
    await glow(s);
    head(s, 'Editable, always', 'It stays yours');
    // What matters in view, the detail on hover: each cell says one short line and keeps the rest in its tooltip.
    /** @type {[number, number, number, number, string, string, string, string][]} */
    const cells = [
      [60, 130, 520, 160, C.violet, 'Real Genially content', 'Never a flat image.', 'Texts, shapes, buttons, windows and questions: change anything in the editor.'],
      [600, 130, 260, 160, C.card2, 'Your brand kit', 'Your colours and fonts.', 'If your team has a brand kit, the genially takes its colours and fonts.'],
      [60, 310, 260, 300, C.card2, 'Change what you have', 'Add, rework, translate.', 'Add slides, rework a section, make it mobile or translate a genially you already have.'],
      [340, 310, 520, 140, C.mint, 'Reviewed before you see it', 'Played and checked in the preview.', 'It plays the genially in the preview and fixes what looks wrong before handing it over.'],
      [340, 470, 520, 140, C.sun, 'You decide what is spent', 'The price first, then your yes.', 'It shows the price of pictures, video and pieces, and waits for your yes.'],
    ];
    for (const [k, [x, y, w, h, col, title, line, more]] of cells.entries()) {
      const d = 0.2 + k * 0.12, ink = [C.mint, C.sun].includes(col) ? C.night : C.white;
      const cell = await box(s, [x, y, w, h], col, { delay: d }, 24);
      const t = T(s, [x + 26, y + 22, w - 52, 30], `${title}  ⓘ`, { size: 22, font: TITLE, bold: true, color: ink, fx: 'fade-in', delay: d });
      await nextPaint();
      // The text goes under the title's painted height, which depends on its lines.
      const p = T(s, [x + 26, y + 30 + api.measureText(t).height, w - 52, 50], line, { size: 17, color: ink, fx: 'fade-in', delay: d });
      // Grouped, so the whole cell answers the hover and enters as one.
      const group = api.groupItems([cell, t, p]);
      gsAnimate(group, 'fade-in', { delay: d });
      gsTooltip(group, title, more, TIP);
    }
    await L.P(s, IMG.build, [880, 130, 280, 280], 'img-rounded-square', { fx: 'scale-in-center', delay: 0.8 });
    await box(s, [880, 430, 280, 180], C.card, { delay: 0.85 }, 24);
    T(s, [904, 452, 232, 140], '“Make it mobile.”\n“Add a quiz after slide 5.”\n“Translate it to French.”', { size: 17, font: TITLE, lineHeight: 1.6, color: C.soft, fx: 'fade-in', delay: 0.85 });
  });

  // ---------- 9. Cards that open windows ----------
  const PROFILES = [
    ['🍎', 'Teaching', 'Lessons, escape rooms and quizzes.', C.mint,
      '“Make me a 10-slide lesson on photosynthesis for 12-year-olds, with a drag-and-drop and a final quiz.”\n“Turn my unit on the Romans into an escape room with three locks.”\n“Add an English voiceover to each slide of my genially.”'],
    ['🎓', 'Training', 'Onboarding, compliance and practice.', C.violet,
      '“Build an onboarding course for new hires in 4 sections, with a quiz after each one.”\n“Make a phishing simulation for our team, in our company colours.”\n“Turn this policy PDF into an interactive guide with windows for the details.”'],
    ['📣', 'Marketing', 'Configurators, brochures and quizzes.', C.coral,
      '“Create a product configurator for our three plans, with live prices.”\n“Make an interactive brochure of our new collection, with a video on the cover.”\n“Build a quiz that recommends the right product to each visitor.”'],
    ['🤝', 'HR', 'Welcome, culture and benefits.', C.sun,
      '“Make a welcome microsite for new employees, with a map of the office.”\n“Build a values game: match each situation with one of our values.”\n“Create a benefits explainer with a holiday calculator.”'],
  ];
  add('Ideas to start', async () => {
    const s = L.slide('Ideas to start', C.night);
    await glow(s, C.mint, C.coral);
    head(s, 'Ideas to start tomorrow', 'What will you ask for first?');
    B(s, [60, 116, 1000, 30], 'Pick your world: each card opens three requests ready to copy.', { size: 18, color: C.soft, delay: 0.15 });
    for (const [k, [e, title, line, col, reqs]] of PROFILES.entries()) {
      const x = 60 + k * 275, d = 0.25 + k * 0.15;
      await box(s, [x, 170, 255, 360], C.card, { delay: d }, 24);
      await box(s, [x + 24, 192, 48, 6], col, { delay: d }, 3);
      T(s, [x + 24, 214, 80, 70], e, { size: 48, fx: 'fade-in', delay: d });
      T(s, [x + 24, 290, 210, 36], title, { size: 26, font: TITLE, bold: true, fx: 'fade-in', delay: d });
      T(s, [x + 24, 336, 210, 80], line, { size: 16, color: C.soft, fx: 'fade-in', delay: d });
      const { id } = await gsButton(s, [x + 24, 450, 180, 52], '3 requests', BTN(col, col === C.violet ? C.white : C.night), {
        // A blank line between requests: L.T keeps it as an empty paragraph.
        popup: win(`${e} ${title}: three requests`, reqs.split('\n').join('\n\n'), { size: 22 }), ...WIN,
      });
      gsAnimate(id, 'fade-in', { delay: d + 0.3 });
    }
  });

  // ---------- 10. End ----------
  add('The end', async () => {
    const s = L.slide('The end', C.night);
    await L.background(s, IMG.end);
    H(s, [100, 210, 1000, 90], 'Imagine it. Ask for it.', { size: 64, align: 'center' });
    B(s, [100, 316, 1000, 40], 'Genially Studio: from one sentence to endless experiences.', { size: 22, color: C.soft, align: 'center', delay: 0.3 });
    // Centred from its final width: a native button widens to fit its text.
    const b = await go(s, [500, 400, 200, 60], '↺  Back to start', 'Cover', { delay: 0.6 });
    api.updateItemPosition(b, 600 - api.getItem(b).size.width / 2, 400);
  });

  function wire() {
    const byName = Object.fromEntries(api.getSlides().map(x => [x.name, x.id]));
    const errors = [];
    for (const [id, target] of links) {
      if (!byName[target]) { errors.push('no slide ' + target); continue; }
      try { gsGoTo(id, byName[target], { replace: true }); } catch (e) { errors.push(e.message); }
    }
    return { links: links.length, errors };
  }

  /** @param {string[]} [names] */
  async function run(names) {
    window.__deckLog = [];
    links.length = 0;
    for (const r of R.filter(x => !names || names.includes(x.name))) {
      try { await r.build(); window.__deckLog.push('ok ' + r.name); } catch (e) { window.__deckLog.push(`error ${r.name}: ${e.message}`); }
    }
    try { if (!names) await gsNavigation('standard'); } catch (e) { window.__deckLog.push('navigation: ' + e.message); }
    const w = wire();
    window.__deckLog.push(`links ${w.links}, errors ${w.errors.length}${w.errors.length ? ': ' + w.errors.join('; ') : ''}`);
    window.__deckLog.push('done');
  }
  return { run };
})();
