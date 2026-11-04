# The deck contract (deck surface 2)

How to write a `deck.js` that Genially runs to build a genially. It is written for the model that writes the deck
(Claude, or any assistant with the Genially connector) and for the code that validates and runs it. It
comes with **`deck.d.ts`**, every function a deck may call, with its parameters, limits and typical mistakes.

A deck describes the slides. It does not open the editor, generate images, save or publish: whatever runs it does
that. There is no example deck to copy: the skeleton below shows the shape of the code, and the look comes from the
plan's design direction (the guide says how), so that no two geniallys come out alike.


## 1. Shape of a deck

One global, `window.AG`, made by an immediately invoked function. Style helpers go at the top, then one function per
slide, and the links go at the end, once every slide exists.

```js
window.AG = (() => {
  const api = window.geniallyAPI;
  // The palette and the fonts come from the plan; these placeholders are not a style to keep.
  const C = { ink: '#222222', paper: '#FFFFFF', accent: '#777777' };
  const IMG = { cover: 'img_a1b2c3' };   // the request's image ids, each named once
  const canvas = () => api.getGeniallySize();   // the genially's size: lay everything out on it
  const TITLE = 'Inter', BODY = 'Inter';
  const H = (s, r, t, o = {}) => L.T(s, r, t, { size: 44, font: TITLE, brand: 'title', color: C.ink, fx: 'fade-in-bottom', ...o });
  const B = (s, r, t, o = {}) => L.T(s, r, t, { size: 18, font: BODY, brand: 'body', color: C.ink, fx: 'fade-in', delay: 0.2, ...o });

  const links = [];   // [buttonId, slide name]: linked by wire() once every slide exists
  const R = [];
  const add = (name, build) => R.push({ name, build });

  add('Slide A', async () => {
    const s = L.slide('Slide A', C.paper);
    await L.background(s, IMG.cover);   // covers the canvas, whatever the picture's proportion
    H(s, [100, 200, 1000, 80], 'A title from the plan', { align: 'center' });
    const next = await gsButton(s, [500, 420, 200, 64], 'NEXT', { defaultColor: C.accent, textColor: C.paper, shape: 'pill' });
    gsAnimate(next, 'fade-in', { delay: 0.6 });
    links.push([next, 'Slide B']);
  });
  add('Slide B', async () => {
    const s = L.slide('Slide B', C.paper);
    // … its composition, as the plan describes it
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

  async function run(names) {
    window.__deckLog = [];
    links.length = 0;
    for (const r of R.filter(x => !names || names.includes(x.name))) {
      try { await r.build(); window.__deckLog.push('ok ' + r.name); } catch (e) { window.__deckLog.push(`error ${r.name}: ${e.message}`); }
    }
    const w = wire();
    window.__deckLog.push(`links ${w.links}, errors ${w.errors.length}${w.errors.length ? ': ' + w.errors.join('; ') : ''}`);
    window.__deckLog.push('done');
  }
  return { run };
})();
```

What is fixed:

- **`window.AG.run(names?)`** builds the slides named (all of them when `names` is left out), in order, and then
  links them. It never throws: a slide that fails is logged and the next one is built. `run(['Name'])` rebuilds that
  slide in place: `L.slide` empties the slide of that name and keeps its id, so the links to it still work.
- **The log**: `window.__deckLog` is emptied when `run` starts and gets `ok <slide>` or `error <slide>: <message>`
  per slide, then `links <n>, errors <k>[: …]`, then `done`. Whoever runs the deck reads it until it says `done`.
- **Slide names are unique.** Links find their target by name, and the log reports by name.
- **One function per slide**, which draws everything on it: texts, shapes, pictures, buttons, windows, questions and
  their entrance animations. Nothing is left for a pass at the end except the links.
- **No top-level work.** Defining `window.AG` draws nothing; only `run` does.

## 2. What the deck can count on

When `run` is called:

- the editor is open on a new genially with its initial empty slide (whoever runs the deck deletes it afterwards), or
  on an existing genially the deck adds to: then its own slides are there, the deck builds only its new slides (and
  the ones the user agreed to redo), each under a name the genially doesn't use, placed with `L.slide`'s `after`,
  and links to the genially's slides by their names. Its
  size is what `geniallyAPI.getGeniallySize()` says: 1200 × 675 for a blank genially made by the Genially MCP with
  its default dimensions, 360 × 640 for a mobile one. Lay everything out on it, never on a fixed height;
- the genially-creator runtime is loaded: `L`, the `gs*` functions in `deck.d.ts` and `window.geniallyAPI`;
- every ready asset of the asset request is in the map of its kind, by its id: `window.__imgs` (pictures, for `L.P`
  and `L.background`), `window.__audios` (sound effects, music and voiceovers, for `gsAudio` and `gsSound`), `window.__aibuilder`
  (AI Builder pieces, for `gsAIBuilder`) and `window.__videos` (videos, for `gsVideo`). The deck names ids, never URLs, so the same deck works
  with whatever assets it is given, and a regenerated one keeps its id. Name each id once, at the top, under a name
  that says what it is (`IMG.cover`, `SND.door`, `PIECE.quiz`), and use that name below. Before the deck runs, every id it uses is checked against the job's result.

After `run`, whoever runs the deck (the assistant, in the browser, as the guide says) reviews it, saves it and takes
the screenshots. A deck doesn't do any of that.

## 3. What a deck may use

Only what `deck.d.ts` declares, plus plain JavaScript: `Math`, `JSON`, `Array`, `Object`, `Promise`, `String`,
template literals, and `requestAnimationFrame` (to wait for a paint before measuring a text). In particular:

- **No network**: `fetch`, `XMLHttpRequest`, `WebSocket`, `EventSource`, `navigator.sendBeacon`, `<img>` or `<script>`
  tags. To know an item's size, ask the editor: `geniallyAPI.getItem(id).size`, `geniallyAPI.measureText(id)`.
- **No storage**: `localStorage`, `sessionStorage`, `indexedDB`, `document.cookie`.
- **No DOM**: `document.*`, and no `window.*` other than `geniallyAPI`, the asset maps (`__imgs`, `__audios`,
  `__videos`, `__aibuilder`), `__deckLog` and `AG`.
- **No code from text**: `eval`, `new Function`, `import()`, `setTimeout` with a string.
- **No other runtime**: no `window.rootStore`, no `MS.*`, no `gs*` or `geniallyAPI` method that `deck.d.ts` doesn't
  list. Generating assets belongs to the asset request, and saving and reviewing to whoever runs the deck.

## 4. Sending a deck

There is nothing to run before sending it. `genially_creation_manage` (`action: 'open'`) checks it: its syntax,
nothing of section 3, and that every asset id it names is ready in the asset request. What fails comes back with its
line; fix that and open it again.

## 5. Rules that make it look finished

A deck that follows `deck.d.ts` builds; what each function does, and its limits, is there. These rules are what
make it look finished, without anyone asking for a review. Each one comes from a real genially that failed without
it.

**Layout and texts**

- Lay everything out on the canvas size, 40 px from the edges. Leave the bottom-left corner (about 200 × 75) free:
  the "Powered by genially" badge sits there on free plans.
- Body text 17-22 px, titles 34-50 px. Cut the text before shrinking it. Contrast at least 4.5:1 (3:1 from 24 px).
- A text over a photo goes on a card (a rounded rectangle at 90-95 % opacity).

**Buttons and navigation**

- Every button is a native button (`gsButton`), never a shape with a text on top.
- Navigation buttons follow the mode (`gsNavigation`): in `standard` the player's arrows go forward and back, so no
  "next" button on every slide, only the jumps the order doesn't give (map → station → map); in `microsite` there are
  no arrows, so every page needs its way in and its way back; a `course` goes through its menu (`free` or
  `sequential`); a `video` advances on its own. In any mode, every part of the journey has a visible way in: a map
  with no button to the final slide leaves the player stuck.

**Windows**

- One helper draws every window the same way from the `rect` it receives, never from fixed numbers: with
  `k = rect.h / 499`, padding 48·k, the title's width cut by 64·k (clear of the close button), the text under the
  title's painted height, title and text centred as one block in the box's height, an optional picture centred in
  the right 40 %. Body text 18-20·k px.
- At most a title, one or two paragraphs and one picture per window: more is a slide or two windows. The close
  button never in the box's colour (`closeColor`).

**Animations**

- Every content slide gets entrances, in reading order, as it is drawn: title `fade-in-bottom` (0 s) → card behind
  the text `fade-in` (0.1) → text `fade-in` (0.2) → rows 0.15-0.2 s apart → pictures → buttons last. Everything
  finishes within about 2 s.
- Either everything on a slide enters or nothing: a text left without entrance shows up before its card. A shape and
  the text on it take the same effect and delay.
- Never animate a full-slide background. No exit animations. At most one looping animation per slide
  (`setItemAnimation(id, 'continuous', …)`), never on text. Questions and window content: at most a plain `fade-in`.

## 6. Errors and what to do

What `run` logs as `error <slide>: <message>`, or what the upload check reports:

| Message | Cause | Fix |
|---|---|---|
| `gsButton: defaultColor in hex, not var(--genially-…)` | A palette variable on a button: it can render transparent. | Hex colours. |
| `gsButton: action is { goTo } \| { sound } \| { popup } \| { link }` | An unknown action. | `{ goTo }`, `{ popup }` or `{ link }`; links to slides go through `wire()`. |
| An unknown field in a question (`anwsers`, `feedback.correcto`) | Questions refuse fields they don't know. | The field names in `deck.d.ts`. |
| A section that the question type doesn't have, in `updateActivityAppearance` | Sections depend on the type (`text` only on fill in the blanks…). | Only `general`, `question`, `answer`, `button`, `feedback` unless the type has more. |
| A premium question type (`openAnswer`, `survey`, `imageSurvey`) | The team's plan can't use it. | A free type. |
| `no icon for "<term>"` | No icon matches. | Another term, or an inline SVG. |
| `popup not created` | The window could not be made. | Build it again; one window per trigger. |
| An interactivity set twice on an item | Each action type goes once per item. | `{ replace: true }`, or one action per button. |
| `An item cannot show/hide itself` | `gsReveal` with the source among its targets. | Another item reveals it. |
| `links n, errors k: no slide <name>` | A link to a slide name the deck doesn't define. | The exact name given to `L.slide`. |
| `the deck uses "<id>", which no asset job of this genially has` (or `which is pending` / `failed (<reason>)`), from `open` | An asset id (a picture, an audio, a video or an AI Builder piece) that isn't a ready asset of the genially's asset request. | Only the ids of ready assets; wait for a pending one, regenerate a failed one. |
