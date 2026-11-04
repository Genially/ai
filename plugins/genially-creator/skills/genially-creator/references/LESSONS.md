# What was learned in the geniallys made so far (a motor racing history presentation, the water escape room and others)

## Slides

- Read the canvas with `geniallyAPI.getGeniallySize()`: the Genially connector's `create_genially` makes 1200 × 675
  by default; `geniallyAPI.setCanvasSize({ width, height })` changes it. On 1200 × 675, backgrounds
  of 1280 × 800 go at `[0, -37, 1200, 750]` so they are not distorted; on 1200 × 765, at `[-12, 0, 1224, 765]`.
- A `deck.js` with one function per slide and the style helpers at the top (`studio/examples/studio_tour/deck.js`). The JS
  tool cuts off at 45 s: `gsDeck.run({ assets })` answers within that while the deck goes on, `gsDeck.wait()` until
  it says `done`, and the log (`window.__deckLog`) comes in `gsDeck.result()`.
- Links (go to slide) are added **at the end**, when all slides exist: the target's id is needed. Buttons are native
  (`gsButton`): one item, one link. A shape with a text on top is grouped (`geniallyAPI.groupItems`) and the group
  gets the link; linking the shape and the text separately gave two interactivities and double audio.
- Setting the same interactivity type twice on an item throws: re-link with `{ replace: true }`, and check the result
  with `geniallyAPI.getItemInteractivities(id)`.
- A native button is never narrower than its text (in "Historia de España", "Línea del tiempo" in Cinzel bold asked
  for 230 and ended at 287). `gsButton` resolves with its final width: read it with `getSlideItems` and line a row up
  from the right edge (`x = 1160 - width`, the next one `x - 16 - width`), never from the width you asked for. The
  width is final as soon as `gsButton` resolves, and a wider size holds.
- A button's icon is a name of the editor's icon font: `star` worked, `arrow_forward` came out as a cut "A" (seen on
  31 Oct 2026). Check every icon in the screenshot.
- **Texts** (same bench): the editor fits a text box to its text, so `verticalAlign` alone moved nothing; `L.T`'s
  `valign: 'center' | 'bottom'` now moves the box itself within its rect. An `<a href>` in `html: true` text is
  dropped (its words stay): link a whole item with `gsLink`. Measured off-screen, a text came out about 1.5 times
  taller than painted, and an unpainted slide kept the rect's height, where the view also applied `verticalAlign`:
  `L.T` stores it top-aligned and `gsDeck` moves the boxes after the deck, on each slide painted.
- **Labels inside a shape of lines** (a circuit's wires, a meter's ring): `L.S` remembers, in the tab, the shapes
  whose every element has no fill and no `colorN` class, and gsReview doesn't judge contrast against them. It
  forgets them on a reload, and doesn't know shapes made with `createSvg` by hand: a "low contrast … against the shape
  X" there is judged on the screenshot. Draw wires as plain `stroke` paths, without `class="color1"` (the editor
  paints its colour on that region).
- **`brand: 'title'` takes the Brand Kit's title style, capitals included**: every title came out in capitals until
  `uppercase: false` (3 Nov 2026). Pass `uppercase: false` (or `true`) on the titles whenever the plan says how they
  are written.
- Leave the bottom-left corner (about 200 × 75) free on free-plan geniallys: the "Powered by genially" badge sits there.
- The genially's name comes from the first title. If it ends up wrong (a word of the cover, "x"), `gsRename(name)`: with the
  editor's `renameGenially` it also stops following the cover.
- The empty slide the genially is created with goes away by itself: `gsDeck` deletes it after the first full run.
- Text cards over photos need a background (cream at 90-95 %) to be readable.
- SVG: filled shape with `class="color1"` and the colour afterwards; the `viewBox` with the proportions of its box.

## Animations

Every genially came out with half the slides still and the rest animated in odd ways (a paragraph there before its
title, the background fading in, a button arriving last of all after two seconds). The person asked for a review
every time. Now they go in as each slide is drawn, and `gsReview()` checks them.

- **Per slide, in reading order**: title `fade-in-bottom` (0 s) → card behind the text `fade-in` (0.1) → text
  `fade-in` (0.2) → rows (cards, icons, stations) one after another, 0.15-0.2 s apart (`gsAnimate(ids, effect,
  { delay, step })`) → images `fade-in` or `scale-in-center` → buttons last. Everything finishes within about 2 s.
- **Speed `vel2`** (1 s). The editor's default is `vel3` (2 s), which looks sluggish; `L.T` / `L.S` / `L.P` and
  `gsAnimate` already use `vel2`. Speeds: `vel1` 0.5 s, `vel2` 1, `vel3` 2, `vel4` 3, `vel5` 4.
- **Never animate** a full-slide background or the decoration that frames the slide. A text left without
  entrance on an animated slide shows up first, before its card: either everything on the slide enters or nothing.
- **A shape and the text on it** (a card, a station, a drawn button) take the same effect and the same delay, or
  the text floats in before its box.
- **Groups**: `groupItems` clears the children's animations and moves them onto the group. Animate the group id,
  after grouping. A native button (`gsButton`) is one item: animate its id.
- **Effects**: for presentations and lessons, `fade-in`, `fade-in-bottom` / `-left` / `-right` / `-top`,
  `scale-in-center`, `slide-in-*`. `bounce-in-*`, `swirl-*`, `roll-in-*`, `rotate*` only in games and for one
  element at a time. At most one looping animation per slide (`pulsate-bck` or `float-vert` on the button to
  press, `heartbeat` on a chest), set with `setItemAnimation(id, 'continuous', effect)`, and never on text.
- **No exit animations** (`'out'`): they hide content the person expects to keep reading.
- Leave AI Builder pieces and native questions without entrance, or a plain `fade-in`: their own screen animates.
- Inside a window, at most a `fade-in` on the content: the window already opens with its own transition.
- Read them back with `geniallyAPI.getItems({ slideIds, fields: ['type', 'rect', 'animation'] })` (or
  `getSlideItems`): each item's `animation` is `{ effectIn, effectOut, effectContinuous, durationIn, delayIn, … }`,
  or `null` for items that can't be animated.

## Navigation

Buttons depend on the navigation mode (`gsNavigation`, `gsCourse`). The player already gives a way forward in most of
them: a button that repeats it is clutter.

| Mode | What the player gives | Buttons the deck adds |
| --- | --- | --- |
| `standard` | Arrows, always visible: forward and back in the order of the slides. | No "Next" / "Back" on every slide. Only the jumps the order doesn't give: map → station → back to the map, an index, opening a window. |
| `microsite` | No arrows: pages are read through their links. | Here they are needed: a menu or index, and on every page a way in and a way back (home, back, next section). A page nothing links to can't be reached. |
| `course` | The course menu, with its sections and lessons, and next / previous between lessons. `menu.navigation` decides: `free` (any lesson) or `sequential` (each one unlocks the next). | None for going through lessons; only jumps inside a lesson or to a window. Choose `free` or `sequential` with the user: sequential when the order matters (a training to finish), free for reference material. |
| `video` | Pages advance on their own, each after its `seconds`; whoever watches can also move freely with the player. | None. Keep pages readable in their time and without anything that must be clicked to go on (no piece or question that blocks it). |

- **Course mode puts its own controls on the slide**: the menu button on the top-left corner, another button on the
  top-right and next / previous arrows on both sides. They covered a header at the top and a text at x = 40 (3 Nov
  2026); gsReview doesn't see them. Their sizes aren't measured yet: in `course`, as a safe guess, keep the top corners
  free (about 100 × 80) and the content about 100 px in from both sides, and check every page in the preview.
- **Pick the mode from what it is** (GUIDE §1) and tell the user in the plan, in their words ("you move on with
  the arrows", "you find your way with the course menu").
- **Games with a map or free order** (an escape room): in `standard` the arrows let the player skip stations and
  reach the end; when the order or the challenge matters, use `microsite` and give every path its button. In the
  escape room the map had no button to the chest and the player finished without knowing how to go on: every part of
  the journey needs a visible way in, "IR AL COFRE" on the map, and the last station leads to the chest.
- Go through the whole genially in the preview, without shortcuts, before calling it good.
- Check every link by code, not by the preview's aria labels (they said "Go to page 1" for a link to page 2): for
  each slide, `getItemInteractivities` of every item, mapping `target.slideId` back to the slide's name.

## Native questions

- **True / false** (`trueFalse`): pass the answer texts in the genially's language, `answerTexts: ['Verdadero',
  'Falso']`. Without them they come out as whatever was used last, or in the viewer's interface language ("True" /
  "False" in an English editor).
- **Send button and random order**: `settings: { sendButton: false }` sends on the first click and
  `settings: { randomOrder: false }` keeps the order you wrote. The send button can only go where one click is the
  answer: single choice, true/false, image selection with one right answer, and single-choice surveys.
- **Button text**: `settings: { buttonText: 'Comprobar' }` (up to 20 characters)
  writes the button in the genially's language; `null` goes back to "Send" in the viewer's language.
- **Misspelt fields**: an unknown field (`anwsers`, `feedback.correcto`) throws instead of being ignored.
- **Distractors** in fill in the blanks (wrong options to choose from in each gap) don't exist in Genially's
  questions: use `singleChoice`, or an AI Builder piece.
- **Sort**: leave the height out and it grows with the items. A box too short shows four rows and scrolls the rest
  behind a fade, so they look missing (five items in 900 × 456 showed four). Measured heights: four items fitted in
  about 404 (3 Nov 2026), so 184 + 69 × items is an upper bound, not the size. Five items don't fit a standard window
  (a box 499 high, 451 inside its margins): put a sort of five or more on a slide of its own.
- **Several questions on one slide** (a final quiz of five): one question per window, each opened by a native button.
  A question fits inside a window: lay it out from the box the window gives you, like any other content.
  ```js
  for (const [k, q] of QUIZ.entries()) {
    await gsButton(s, [100 + 200 * k, 300, 180, 56], `Question ${k + 1}`, BTN,
      { popup: async (p, { rect: [x, y, w] }) => { gsQuestion(p, q, [x + 40, y + 40, w - 80]); }, box: C.paper });
  }
  ```
  A question shows only the answers that fit its height, with no error (2 Nov 2026: four answers in a 451-high
  question in a 499-high window showed three): leave the height out, or count about 70 px per answer below the
  question, and read every answer in the preview. In a window, keep it at most 440 high (`440 * k` on another canvas):
  451 left exactly the 24 px margin gsReview asks for, and the question painted a little taller. The other way is one question per slide, chained with buttons. Both are tried and work: no need to test them on a
  scratch slide first.
- **Style**: a question comes out in the editor's default colours. `geniallyAPI.updateActivityAppearance(id,
  { general, question, answer, button, feedback, … })` merges each section with the model's own keys, as one undo
  step:
  ```js
  geniallyAPI.updateActivityAppearance(qid, {
    general: { BackgroundColor: C.paper, ShowBackground: true },
    question: { FontColor: C.ink, FontFamily: { Name: 'Fredoka' } },
    button: { ButtonColor: C.coral, FontColor: '#FFFFFF' },
  });
  ```
  Which sections exist depends on the type (`instructions` and `result` only on some, `text` on fill in the
  blanks); one that a type doesn't have throws before anything changes. There is no getter for the current
  appearance: pass only what you want to change.

## Flip cards

Tried in the local editor and view on 1 Nov 2026.

- **Use the editor's own cards** (`gsFlipCards`), not a drawn card with a transparent layer that shows and hides
  its back: the native card turns over in 3D with the editor's animation, and the person can edit both faces in the
  editor's card panel.
- **It turns from its corner button**, not from a click on the face (the face only tilts on hover). Say "turn the
  card" or "pulsa ↻" on the slide when the activity depends on it.
- **The variants are fixed**: one vertical card (picture, title and text on the front, a text on the back), one
  horizontal card (title and text, a text on the back), or a stack of three of either. The stacks have no back:
  a swipe passes to the next card and a bar under them shows how far it went. A row of four flip cards is four
  calls; four steps can't be one stack (the stacks take three, and a deck can't add cards).
- **Give every text**: one left out shows the library's placeholder ("Título", "Escribe aquí una descripción
  breve"), so it throws; `''` removes a text and `image: null` the picture.
- **The texts come near black**: on a dark face give `frontTextColor: '#FFFFFF'` (and `backTextColor`), or the
  title is unreadable. The face colours take hex, `var(--genially-primary)` or `{ documentColor: 'primary' }`.
- **Give the width only**: it keeps its proportions (vertical 240 wide → 382 high, horizontal 340 → 204), and its
  texts scale with it. Short texts: the back of a vertical card holds about five lines at 240 wide.
- **The horizontal card (variant 2) needs 340 wide or more**: at 264 its title box was about 74 px wide, the title
  broke into two lines and pushed the text to the bottom half, leaving the top empty (3 Nov 2026). Keep its title to
  one or two short words, or use the vertical card in a narrow column. The card the editor keeps as a template (never
  shown) has its own "Title" / "Subtitle" texts: an overlap gsReview reports on a card's face that isn't on screen is
  that one.

```js
const { cards: [card] } = await gsFlipCards(sid, [80, 160, 240], [{
  front: { image: IMG.mercury, title: 'Mercury', text: 'The closest to the Sun' },
  back: { text: 'A year lasts 88 days.\nIt has no moons.' },
  frontColor: C.ink, frontTextColor: '#FFFFFF', backColor: C.paper, backTextColor: C.ink,
}]);
```

## Components panel widgets

Seen on 2 Nov 2026 (Claude × Genially Studio, local editor and view):

- **Timer**: it came out 184 and then 280 wide for the same width given (280). Read its real size after inserting
  (`getItem(id).size`) before centring it or placing what goes next to it.
- **Word search**: at 280-300 wide it cuts its tenth row, in the view too, with or without its word list. Give it at
  least 360 wide, or fewer words, and look at it in the preview.
- **Wheel**: segments keep the library's photos unless each one's `segmentImage` is set (`''` for none).

## Windows and tooltips

- Tooltip: `gsTooltip(ids, title, text, colours)`. It is added to whatever click the element already has.
- Window: `gsPopup(ids, fill, { box, frame })` creates a popup from the `blank` template, you fill it in `fill` and it
  keeps the close button in front. The template scales with the canvas and stays centred: a white box of 855 × 499
  at 172,88 on 1200 × 675, about 969 × 565 at 115,100 on 1200 × 765, and 256.5 × 149.7 at 51.75,245.15 on a 360 × 640
  mobile canvas. `fill` receives the real box as `rect` ([x, y, w, h]); `gsPopupBox()` computes it from
  `getGeniallySize()` when there is no popup yet. Place the content from them, never from fixed numbers.
- **Layout of a window**, the same for all of them (one `win(title, text)` helper in `deck.js`, as in
  `studio/examples/studio_tour/deck.js`): with `k = rect.h / 499`, padding of about 48·k on every side; the title at the
  top left, its width cut by 64·k so it never reaches the close button's corner (the button is centred on the window's
  top-right corner, half outside, so about 30·k of it falls inside the box); the
  text under the title's painted height (`measureText`, after a frame), never at a guessed y; title and text then
  placed as one block centred in the box's height (never higher than the padding), so a short text doesn't leave the
  window half empty; an image, if any, centred in the right 40 %. At most a title, one or two paragraphs and one image: if it needs more, it is a slide or two
  windows. Body text at 18-20·k px; cut the text before shrinking it.
- What went wrong before: content placed with the 1200 × 675 numbers on a 1200 × 765 genially (the box is bigger
  and lower there), a paragraph that ran past the bottom of the box, the title under the close button, and a close
  button the same colour as the box (`closeColor`). `gsReview()` flags content outside the box, closer than 24·k to
  its edge or under the close button; the screenshot of each open window in the preview catches the rest.
- Use them for secondary things: help, definitions, "did you know…?", character or piece fact cards.
- **Drawn flip cards**, only for what the native ones can't hold (a picture on the back, more than a short text):
  `await gsFlip(frontIds, backIds)`. Tried on 31 Oct 2026 in the view, these failed: `gsReveal` alone
  (one way only: on hover the back covered the front and never hid, and an item can't hide itself); an interactivity
  on an item inside a group (ignored with no error, and it broke the front's show); a group hiding its own items (the
  group stays visible as an empty box and takes the clicks). What works is a transparent layer over the card that
  toggles the back's group, which is what `gsFlip` makes; the front can't have its own clicks under it.
- **The editor's "smartLink" error** (31 Oct 2026): "Cannot use 'in' operator to search for 'smartLink' in undefined"
  on every delete, group or slide change came from a navigationMenu with a sound in one of its items: the editor's
  menu reads each item's action as a go to slide (since fixed in the editor). `gsWidget` refuses it; a
  menu item only goes to a slide.
- **Sounds of the library**: `gsLibrarySound('pop')` gave "Pop", a 27-second song, which ended up on 70 widgets' action
  sounds. For an effect pass `{ maxSeconds: 3 }` and check `duration`.
- Own close button inside a window: `gsCloseButton(ids)` (it can't share its click with another action).
- "More information" to a web page: `gsLink(ids, 'https://…', { newTab })`. Unverified accounts can't add links.
- On hover: `gsReveal(source, targets, { mode: 'show', event: 'hover' })` for a hint that appears,
  `gsSound(ids, url, { event: 'hover' })`, `gsEffect(ids, 'confetti', { event: 'hover' })`. Go to slide and windows
  are click-only.

## AI Builder

- Only for pieces with logic (games, simulations, quizzes). They are assets of the request: the connector generates
  and publishes each one (8-12 minutes, 30 credits), all at the same time, and nothing asks back, so the prompt
  carries everything. The deck inserts it with `gsAIBuilder` at the size the request gave it.
- **Size** (seen on 30 Oct 2026, local tests): a drag-and-drop asked for at 740 × 540 without saying so came out
  taller than its box, the bottom cards cut off, and the row of gaps widened past both sides when the first card was
  dropped. Asked in the prompt to fit in exactly that size and never grow while it is played, it fitted.
- **Continue** (same tests): a piece fired its `onCompletedAction` as soon as it was completed, so the player jumped
  to the next slide without seeing the end screen. Asked to fire it only from its "Continuar" button, it waited.
- **End screen** (same tests): the end screen's "Continuar" and "Jugar otra vez" did not answer clicks or Enter,
  while the drags worked: something drawn over them took the clicks. Ask for the end screen's buttons to sit above
  everything else and answer clicks, and play every piece to its end screen in the preview before saying it works.
- **Prompt**: common style block (palette, fonts, tone, piece background, feedback, hints, sound, what
  happens at the end) + the exact mechanic, the texts, the answers and the solution.
- **Actions**: action-type fields come out empty and do nothing. `gsAIBuilder(…, { goTo, sounds })` fills them as it
  inserts the piece (`AIB.wire(sid, { target, sounds })` on a piece already there). `sounds` is `{ pattern: sound }`
  over the field name (in `gsAIBuilder` a sound is an audio id of the request, a URL or `{ audio, volume }`; in
  `AIB.wire`, a URL or `{ url, volume }`), and the **first** matching pattern wins: put
  the specific ones first, or the chest will sound like a correct answer:

  ```js
  await AIB.wire(sid, { target: mapSlideId, sounds: { 'chest|cofre|open': urlCofre, 'sound|success|win': urlExito } })
  ```

  A failure's field (`onFailSoundAction`) takes a sound only from a key that names a failure (`'fail|wrong|error'`),
  so a generic `'sound'` never plays on a mistake (until 0.31.1 no failure field got a sound at all). `goTo` goes on
  the piece's continue button alone when it has one (`continueAction`): its `onCompletedAction` fires as soon as the
  piece is solved, before its explanations and end screen (2 Nov 2026: a phishing inbox jumped to the next slide on
  "Check my answers"). A piece with only `onCompletedAction` gets the target there.

  What it does with each field:
  - go to slide: `{ type: 'goToSlide', target: { slideId } }`;
  - sound: `{ type: 'playAudio', source: url, name, playMode: 'playPause' }`.
- **Images**: it adds stock photos that almost never fit (a penguin as an "ice cube", a book behind the
  chest). Ask it not to use photos and replace the image fields with images of the request in the style:
  `gsAIBuilder(…, { images: { 'zones.0.image': IMG.chest } })`, paths from `AIB.images(sid)`.
- **Fonts** (1 Nov 2026): a piece asked for Cinzel and Lora in the prompt came out in Helvetica. The AI Builder's code
  can't load a font itself; a font comes from a font field of its config, which the player loads from Google Fonts
  by name. Ask in the prompt for one font field per role ("a font field for the titles, default Cinzel, and one for
  the texts, default Lora"), and set them in the deck too: `gsAIBuilder(…, { config: { titleFont: 'Cinzel' } })`, with
  the field names the piece has (`getWidgetConfig(itemId).config`); a font goes by its name alone.
- **Fixes**: a piece's texts, options and right answers often live in its config (`getWidgetConfig(itemId).config`,
  e.g. `gameStages`): fixing them there with `setWidgetConfig` is instant and free, and it goes in the deck as the
  piece's `config` so a rebuilt slide keeps it. Until 0.28.1 that `config` replaced the piece's whole config (seen on
  31 Oct 2026: the piece lost its texts and action fields, and a list in it lost its images); now it is laid over the
  piece's own field by field, as `gsWidget`'s, and a key the piece hasn't got throws. For anything else, change the piece's prompt in the asset request,
  describing the exact failure, and generate it again with the same id: the connector asks the AI Builder for a change
  to that piece (30 credits and 8-12 minutes again: tell the user what failed and what the fix costs before). Failures seen: broken checkerboard pattern, start screen without texts, sound as an
  empty action, the area that grew and covered the piece on a correct answer. An edit asked to add one button did not
  add it, and made the piece fire `onCompletedAction` by itself on finishing, skipping its end screen: after every
  change play it again to the end and re-check its actions.
- In a mode without arrows (`microsite`), a piece slide also gets a native button to go on: in the local view, a
  piece's own "Continuar" (`genially.runAction(cfg.continueAction)` from a click) did not navigate, while the same call
  fired by the piece on finishing did. Cause not found, not checked in production. In `standard` and `course` the
  player's arrows or menu already go on.
- It is tested at `view.genially.com/Preview/Index/<id>?idSlide=<slide>` (`AIB.previewUrl`, which uses the local view
  on a local editor): inside the iframe clicks work; on the editor canvas they do not.
- Mazes have to be really solved: in the aquifer one, the drop could not go down from the exit and you
  had to go back to the surface. It was checked by reading the colours of the cells from a screenshot.

## Local images

- A deck can't use a local file: every picture comes from the asset request, by its id. The helpers that upload one
  from disk (`gsPut`, `gsVerify`, `gsImageFile`: base64 through the JS calls, only for small files) are for work done
  by hand in the editor, never for `deck.js`.

## AI images

- **The Genially MCP generates them**, in the asset request, with the price shown to the user first
  (`studio/ASSETS.md`): one style for every picture, written once, and each picture with its id, role, prompt and size
  (`1280x800`, `800x1280` or `1024x1024`; any other size is refused). Cut-outs (a character, an object) come without
  background by default; when the background removal fails the result says `transparent: false` and the picture is a
  rectangle: regenerate it or use another one.
- **The style wins over a picture's own look** (seen on 31 Oct 2026): a style card asked for "neon night" came out in
  the genially's soft 3D, because the shared style goes after every prompt. A picture that must look different (a
  sample of another style) can't: describe its subject and let it share the look, or show the other look with
  colours and shapes drawn in the deck.
- Be literal and say what must not appear ("no animals, no cup"). Look at every picture before writing the deck;
  regenerating one costs it again, so say which and how much before.
- A picture comes out at the model's size, not the one asked for (a `1280x800` request is 1536 × 1024 from GPT
  Image): lay it out with the `width` and `height` of the job's result, or as a slide background (`L.background`).
- A picture regenerated under the same id keeps working in the deck: the deck names ids, never URLs.
- When AI pictures can't be made, the library's photos (`gsPlace` with `{ panel: 'resources', category: 'images',
  query }`, Pexels) work for history and places in a framed-photo layout.

## Videos

- **The Genially MCP generates them**, in the asset request: each with its id, what happens in it, its length (2 to
  20 seconds) and its aspect ratio. They take a few minutes and are charged when delivered, by the second (200 a
  second at 720p): say the cost before, it is the dearest asset.
  - No sound: music or a voiceover goes apart, as an audio.
  - Describe what moves and how the camera does, not a still scene: "a drop slides down a leaf and falls into the
    river, slow push in", not "a river in the morning". No text in the image.
  - The deck places them by id, from `window.__videos`: `gsVideo(sid, VID.river, [x, y, w])`. Check in the preview
    that it plays: a screenshot only shows its poster.

## Audio

- **The Genially MCP generates it**, in the asset request, with the team's AI credits: sound effects and music, each
  with its id, prompt and length (2 credits a second), and voiceovers, each with its id, its exact text and one of 12
  voices (any voice speaks the language of its text), charged as text to speech by its characters (5 credits plus
  20 per 100 characters): tell the user its text and the kind of voice before generating it.
  - Describe the sound, not the scene: "single wooden door knock", not "someone arrives". A sound effect is ready
    when `genially_assets_generate` answers; music takes about a minute.
  - A voiceover's text is what is said, word for word, in the genially's language: write it to be heard (short
    sentences, numbers and abbreviations in words). It is ready when `genially_assets_generate` answers.
  - The deck places them by id, from `window.__audios`: on a native button (`gsButton` with `sound`), `gsSound` (on
    click) or, only to see the time and scrub it, `gsAudio` (the editor's player).
  - A common sound (a bell, applause) costs nothing from the library: `gsLibrarySound(query)` gives its URL.
- **The player's size**: at 64 its time label came out cut at the right edge. Check it in the screenshot and give it
  more room.
- **The player's look**: it is a white card with the audio's title and time, and nothing restyles it; on a dark slide
  (2 Nov 2026) the title came out cut to one letter. Music and voiceovers go on a native button in the slide's style:
  `gsButton(…, { sound, loop, volume, playMode: 'playPause' })`; the same button pauses it and, pressed again, goes on
  where it stopped. `gsReview` flags a player.
- **Volume**: background music at 20-30 under a narration (`{ volume: 25, loop: true }`); effects at 100.
- In the pieces, a sound goes in their sound actions: `gsAIBuilder(…, { sounds: { success: SND.win } })` by the
  audio's id. A piece's prompt is written before its audios exist, so it can't carry their URLs.
- It cannot be heard from here: say so in the report.

## Browser

- If the page is hidden (`document.visibilityState === 'hidden'`, screen asleep or the app in the background), the
  screenshots freeze and menus do not open: ask the person to bring the window to the front.
- **Open the `openUrl` with `navigate`, never from a script**: opening it with the browser's JavaScript tool ended in
  `Error: timeout <openUrl>` and the editor never opened; ask `open` for a new link, the old one may be spent
  (3 Nov 2026).
- Coordinate clicks depend on the window size: find the buttons by text (`find`) and use their ref.
- Next to "Create with AI" is the editor's preview button: a click beside it opens it.
- **Close the preview before editing** (`gsPreview.close()`): editing an item inside a window while the preview is
  open sent the preview back to the first slide, and `gsPreview.ready()` rejected (2 Nov 2026).
- If you reload, the editor (opened with `?ia-manage=true`) loads the runtime again by itself: wait for
  `window.gsRuntime`, paste the deck again and give `gsDeck.run` the assets again (SKILL.md, step 7).
