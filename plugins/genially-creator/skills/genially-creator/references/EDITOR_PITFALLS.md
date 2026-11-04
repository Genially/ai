# Editor pitfalls

What the Genially editor does that is not obvious, whatever you are building. genially-creator reads it before
writing `deck.js`.

## Texts

- **`updateTextContent` with a bare `<p>` wipes the text's marks** (color, bold, line spacing) and the text
  falls back to the default ink. To change a text by hand, rebuild its HTML over its first paragraph (keeping the
  marks), or use `updateText(id, { content, style })`.
- **`updateTextColor` does not beat the marks.** It changes the element's color, but if the HTML carries
  `data-text-color-mark` the mark still wins. To recolor a text with marks, rewrite the mark in its HTML and pass it
  through `updateTextContent`.
- **Role of a text**: `geniallyAPI.updateTextBrandStyle(id, 'title_1' | 'title_2' | 'subtitle' | 'content')`. The
  `Content` of the live model is not HTML. To rewrite a text while keeping its marks:
  `updateTextContent(id, html, { keepMarks: true })`, and `getTextHtml(id)` to read it (it takes the style of the
  first paragraph and the first run). `getSlideText(id)` gives the slide's plain text.
- **Text heights are recalculated when the slide is painted.** An overlap that a check does not see on a freshly
  composed slide may appear after viewing it on the canvas: repeat the checks after the visual review.
- **The genially's name follows the cover title** as long as nobody has changed it by hand (`IsNameChanged`
  false), and it joins the lines without a space. Changing it from `genially.setName` is not saved: rename it with
  `gsRename` (`geniallyAPI.renameGenially`): then the
  name stops following the cover for good.

## Buttons and windows

- **Button colours in hex**, never `var(--genially-…)`: a palette var on a native button can render transparent.
  `gsButton` refuses them.
- **Round "+" buttons**: the native button has no circle shape; a square box with `shape: 'pill'` and a single
  character is a circle. Turn the visited colour off (`showVisitedState: false`) so a clicked point keeps its
  colour. Good for points on an illustration (the parts of a cell, a map).
- **A native button widens to fit its text** past the width you gave it: one near the right edge runs off the
  canvas. Place it by its right edge once created (`1160 - getItem(id).size.width`).
- **A button can't hide itself.** `setShowHideInteractivity` refuses an item among its own targets ("An item cannot
  show/hide itself"), so a button that reveals something stays visible.
- **Every window has a name**, or it shows up unnamed in the slide panel for whoever edits the genially next.
  `gsPopup` names it after its slide and its trigger's label when you don't pass `name`.
- **A window can't be cloned through the API**: `setSlidePopupInteractivity({ target: { popupSlideId } })` links
  the same window and `duplicateSlide` skips windows. To have two alike, build two.

## Shapes, images and widgets

- Custom SVG shapes must carry `class="color1" style="fill:#000000"`, and the color is applied with `color` in
  `createSvg` or afterwards with `updateSvgColor`. Only `.color1` is painted: `colors` stores `color2…` but neither
  the editor nor the viewer paints them yet. A root `<svg>` without `width`/`height` fills the item box (its
  `preserveAspectRatio` decides the fit).
- **An SVG is drawn with the proportion of its `viewBox`**, even with `preserveAspectRatio="none"` and a different
  box: the inner `<svg>` takes the width of the box and the height given by the `viewBox`, from the top. A shape
  with a 200×40 `viewBox` in a 780×54 box comes out 156 high and covers what is underneath. Give each stretched shape
  a `viewBox` with the proportion of its box.
- To fix the SVG of an element already created: `await geniallyAPI.updateSvgSource(id, markup)`, which saves it as
  a persistent resource and keeps the colors.
- **Rounded or circular photos**: `geniallyAPI.updateImageFrame(id, 'img-rounded-square' | 'img-circle')`.
- **AI images**: ask for `1280x800`, `800x1280` or `1024x1024` (any other size returns 400). They don't come out at
  the requested size: GPT Image gives 1536×1024, 1024×1536 or 1024×1024 (ratios 1.5, 2/3, 1);
  flux, nanobanana or ideogram give 16:9 for `1280x800`. Size them by the real width and height of the result.
- **Rotation and opacity**: `updateItemRotation(id, degrees)` and `updateItemOpacity(id, 0..1)`.
  `geniallyAPI.updateItemPosition` takes separate x and y or an object.
- **The palette**: `geniallyAPI.setDocumentPalette({ primary, secondary, tertiary })` keeps the keys you don't pass
  and throws on uppercase hex.
- **Widgets**: their configuration is read and changed with `geniallyAPI.getWidgetConfig(id)` /
  `setWidgetConfig(id, config)` (not validated against the widget's schema), and action fields with
  `setWidgetAction(id, field, { goToSlide } | { playAudio } | null)`. Watch out for `var(--genially-primary)` in a
  widget: in a light palette it is white and the widget's titles disappear.
- **Card faces**: `geniallyAPI.updateCardSideBackground(id, 'front'|'back', i, { documentColor: 'primary' })` also
  takes a CSS color or `{ r, g, b, a }`; `i` counts the cards without the template one (with
  `{ includeTemplateCard: true }` it is the index in the container's group). `gsCards(id)` gives the cards and their
  `index`, and `ItemInfo.containerBoxSide` the face of each text.
- **Questions**: colours and fonts with `updateActivityAppearance(id, { general, question, answer, button, … })`,
  merged with what is there (there is no getter). IMAGE questions carry an image per answer:
  `updateActivityAnswerImage(id, k, url)`.
- **A question draws its own background**: no card behind it (it looks like two boxes), and give it the full rect
  `[x, y, w, h]`, or it takes a default height (about 480) that won't match what is next to it. A button below it must
  not cover its send button.
- **Short-answer questions keep the font in effect at creation inline in their text**, over `updateActivityAppearance`:
  write the question again (`updateInteractiveQuestion(id, { question })`) after styling it. `settings.buttonText`
  replaces "Send"; the answer's placeholder follows the viewer's language and can't be changed.
- **Library icons** (`searchIcons`, `L.icon`): hits carry no name and the first one is often off-topic ('sun' and
  'layers' return the same icon). Check it in the screenshot, or draw a simple inline SVG when the meaning matters.

## Slides and saving

- **Deleting texts inside groups fails** (`[mobx-state-tree] Cannot modify … groupsMap`) and leaves the deletion
  half done, which autosave uploads. To empty a slide with groups, create a new slide and bring over what you want to
  keep.
- **Copying slides from another genially**: `geniallyAPI.exportSlides(ids)` in one tab and
  `importSlides(buffer, { afterSlideId? })` in the other: at the end by default, it returns the new ids and the editor
  adds " Copy" to the names (`gsCopySlides` / `gsPasteSlides`).
- **Inactive collaborative session.** With `?ia-manage=true` the editor never goes idle.
  Without it, it goes idle 15 min after the window loses focus; `gsSave()` wakes it up (`saveNow` with `wakeUp`).
  If the result has `error` or `idle: true`, bring the window to the front and save
  again, and check `serverSlides` against `localSlides`. With `stuck: true` (a save running for more than 3 min
  without retries), reload the editor instead of saving again; with `unauthorized: true`, stop and tell the
  person.
- **Recovering** what a run broke: `gsVersions()` lists the saved versions and `gsVersion(id)` reads one (read-only;
  restore it by hand from the editor's version history; element ids are kept). Needs a plan with version history.
- **When you finish, reload the editor and review again**: it is the only way to see what was really saved.

## The browser

- **The built-in browser page may be hidden** (`document.visibilityState === 'hidden'`). Then the canvas only
  repaints when capturing: after `selectSlide`, take 3–5 small screenshots (scale 0.1) and then the good one, and
  distrust the first. Animations may look half-drawn, and screenshots with `zoom` may come out stale.
- **Slide panel thumbnails** load late: a thumbnail without a photo does not mean the photo is missing.
