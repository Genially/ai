---
name: genially-creator
description: Creates a complete, interactive genially (presentation, lesson, escape room, game, dossier…) from a topic and a style reference, with the Genially connector and the Genially editor open in the browser. Plans it with the user, generates its pictures, videos, sound effects, music and voiceovers through the connector, writes a deck.js that builds the whole genially from them, runs it in the editor, reviews every slide and fixes it until it looks finished; uses the AI Builder only for the interactive pieces, the editor's library for ready-made ones, and windows and tooltips for secondary information. Use it when asked to "make me a genially / a presentation / an escape room about…", "with this style", "with interactive pieces" or "with sound", and to add slides, pieces or sound to a genially the user already has (also: "hazme un genially sobre…", "una presentación sobre…", "un escape room sobre…", "con este estilo", "con piezas interactivas", "con sonido", "añade a mi genially…", "cambia este genially").
---

# genially-creator (v0.15)

Makes geniallys like a 22-slide history presentation with 5 AI Builder pieces and 8 audio clips, or an 11-slide escape
room. The reference deck is [references/studio/examples/studio_tour/deck.js](references/studio/examples/studio_tour/deck.js),
a 10-slide product tour, with the asset request it uses ([assets.json](references/studio/examples/studio_tour/assets.json)):
native buttons, windows laid out from their box, native questions and flip cards, a library widget and music, an AI
Builder piece with its full prompt, a phone of layers shown on click with sounds, entrance animations, links wired at
the end and the run log. Copy its patterns, in the style of the genially you are making, and write it in the language
of the genially being built.

Paths in this file are relative to its folder, which holds everything it reads. When you pass one to another agent or
to the terminal, make it absolute from the folder you read this file from.

## What it needs

- **The Genially connector** (its tools: `create_genially`, `brand_kit_get`, `genially_assets_*`,
  `genially_creation_manage`). If they are missing, tell the user to connect Genially in the app they are using
  and stop.
- **A browser you control**: the built-in browser of the desktop app you run in, or Chrome through that app's
  extension. If there is none, say so at the start, before spending anything: this skill can't build a genially
  without one.
- **Nothing to load.** The editor opened with `?ia-manage=true` loads the Studio runtime itself
  (`window.gsRuntime`, `gsDeck`, `L`, the `gs*` functions, `AIB`). Never paste a runtime into it.

The deck's documentation is in [references/studio/](references/studio/). Before writing `deck.js`, read
`deck.d.ts` (everything a deck may call, and on its first line the deck surface version), `DECK_CONTRACT.md` (the
shape of a deck and the rules that make it look finished) and `GUIDE.md` (design direction, composition, review and
report); `WIDGETS.md` lists the Components panel widgets, and its section of each one (`## wheel`) gives that
widget's fields: read only the sections of the widgets you use. Then
[references/LESSONS.md](references/LESSONS.md) (what was learned making real geniallys),
[references/API_FACTS.md](references/API_FACTS.md) (what the editor API does that is easy to get wrong) and
[references/EDITOR_PITFALLS.md](references/EDITOR_PITFALLS.md) (what the editor does that is not obvious): skipping
them has cost runs errors that they explain.

## Rules

- Speak in the user's language, as Genially does: close, enthusiastic, clear, never technical. No jargon, ids, JSON
  or tool names.
- **Two yeses, each asked once.** The plan (step 2), where nothing is spent yet; then what will be generated, with its
  exact price against their credits (step 4), before any credit is spent. Say what each thing costs: **each AI Builder
  piece takes 8-12 minutes and 30 credits, and they are made at the same time**; a video, 200 credits a second at
  720p (twice at 1080p); a voiceover, 5 credits plus 20 per 100 characters; pictures and sounds, what the estimate
  says. Generating something again costs it again: say what and how much before. Don't ask again for what they
  approved.
- **The MCP generates the assets; the deck places them.** Pictures, videos, sound effects, music, voiceovers and AI
  Builder pieces go in
  the asset request (`genially_assets_generate`), each with its own id. `deck.js` builds the whole genially from
  them, one function per slide: texts, shapes, pictures, audio, AI Builder pieces, buttons, windows, questions,
  library pieces and widgets, animations, links and the genially's name. Saving and reviewing are yours, in the browser, after the deck runs.
- **Rebuilding a slide empties it.** `gsDeck.run({ only: ['Name'] })` draws that slide again from the deck: whatever
  you changed on it by hand (a piece's config) is gone. Make the fix in the deck.
- **The AI Builder only for the interactive pieces**, never for the whole presentation. Everything else is drawn by
  the deck so that anyone can edit the genially.
- **Secondary information in windows and tooltips** (definitions, help, "did you know…?", fact cards): they are
  lighter than a piece and anyone can edit them.
- **Something to discover on every content slide.** Every slide between the cover and the end has something to
  click, hover or play: a tooltip, a window, a reveal, a flip card, a question, a piece, a sound. The main idea in
  view, short (about 80 words besides the title); the detail discovered. Only video mode goes without.
- **The editor's own piece before a drawn one**, by the table in `GUIDE.md` §4: a tooltip, a window, a reveal, a
  flip card, a native question, a widget, a button with a sound; the AI Builder for what none of them does. Never
  shapes and texts that imitate one of them, and never `gsAudio`'s player where a button with the sound will do.
- **Finished means animated and laid out, without being asked.** Every content slide gets entrance animations in
  reading order, and every window is laid out from its real box, clear of its edge and its close button. Recipes
  in [LESSONS.md](references/LESSONS.md#animations) and [LESSONS.md](references/LESSONS.md#windows-and-tooltips);
  step 11 checks both with `gsReview()` and by looking. The person should never have to ask for this review.
- Work on a new genially made with `create_genially`, or on a genially of the user's they ask you to change
  ([Changing an existing genially](#changing-an-existing-genially)). Never on catalogue originals, and never empty,
  delete or redo a slide of theirs they haven't agreed to.
- Save without forcing (`gsSave()`); on a conflict, stop and tell the user.
- **Nothing that matters lives only on `window`**: a reload of the tab wipes it. `deck.js`, the plan, the asset
  request and its result go in files of the working folder. Values you set in the tab
  and need later go through `gsState.set('KEY', …)`; after a reload, `gsState.restore()`.
- **Don't publish, and don't offer to**: publishing from here isn't supported yet. If the person asks, tell them to
  publish it themselves from the editor ("Publish changes" / "Share").
- No keys in project files or in the conversation. The editor link `genially_creation_manage` gives works once and
  for 5 minutes: open it right away, never write it to a file, and never show it as a link to click.

## Flow

1. **Brief, as a conversation.** Find out what they want to make (topic and type: presentation, lesson, escape room,
   game, dossier), who it is for, what it is for (what the audience should know or do at the end), the tone, the
   language, the duration and the graphic style: offer two or three styles that suit it, or ask for a reference (an
   image, a brand, a genially). A couple of questions at a time, not a form; what they leave open, propose and say.
2. **Script** (`plan.md` in a working folder outside the plugin), as the guide's "The plan and its resources" says:
   - outline and text of each slide, with checked facts (verify what is claimed: dates, figures);
   - which slides get a window, a tooltip, a video, a sound effect, music or a voiceover, an AI Builder piece, and
     why;
   - ready-made pieces from the editor's library, placed by the deck with no credits: `gsPlace` (a dice, a timer, a
     chart, an illustration), `gsWidget` (a Components panel widget with its own texts), `gsLibrarySound` (a common
     sound). The asset request and the AI Builder only for what the library doesn't have;
   - **flip cards** are the editor's own (Compositions → Cards), with `gsFlipCards`: a real card that turns over with
     the editor's animation, not a drawn card with a layer that shows its back. One card per call (a row of four is
     four calls); a stack of three passes on a swipe and has no back. Details in
     [LESSONS.md](references/LESSONS.md#flip-cards);
   - **native questions** (`gsQuestion`) for quizzes instead of AI Builder pieces: details in
     [LESSONS.md](references/LESSONS.md#native-questions);
   - navigation: the mode (standard, microsite, course or video, GUIDE §1), cover → … → end, and how each place is
     reached. Buttons follow the mode: none to go forward where the player's arrows or the course menu already do;
     in a microsite, a way in and a way back on every page. **Every part of the game must have a visible entry
     point** (in the escape room the button to the final chest was missing: the player finished and did not know how
     to go on). Details in [LESSONS.md](references/LESSONS.md#navigation);
   - for games, the full solution (codes, answers);
   - the style: palette (hex), fonts Genially has, graphic resources (tape, torn paper, grid, frames…) and the style
     of the pictures.
   Show it in plain prose, with how many AI Builder pieces, videos and voiceovers it has and what they cost by the
   rates above, say that you will give the exact price before generating, and wait for the user's yes. Nothing is
   spent yet.
3. **The genially.** `create_genially` (blank: 1200 × 675 by default) and, if the team has a brand kit the user wants,
   `brand_kit_get`. Keep its id and its editor link in the working folder.
4. **Assets.** The asset request (`assets.json` in the working folder, as `references/studio/ASSETS.md`
   says): one style for every picture, each picture with its id, each video with its id, what happens in it, its
   length and aspect ratio (a few minutes, 200 credits a second at 720p), each sound effect or music track with its id,
   prompt and length, each voiceover with its id, its exact text and its voice, and each AI Builder piece with its id,
   its full prompt and the size of its rect (30 credits and 8-12 minutes each). Price it with
   `genially_assets_ai_credits_estimate_get`. Then tell the user what will be made, in their words: each AI Builder
   piece (its mechanic, its texts and items, how it ends, how much of the slide it takes, its credits and minutes,
   and the wait, 8-12 minutes for all of them since they are made at the same time), each video (what moves in it, its seconds and its
   credits), each voiceover (its exact text and the kind of voice), the pictures and sounds as one line, and the total
   against their balance. Wait for their yes, then `genially_assets_generate`, and follow it with `genially_assets_get`
   until every asset is ready, with one line to the user as each piece is ready, not one per check. Ask again after
   the job's `retryAfterSeconds` (a minute while pieces are being made), never after a longer wait of your own (no
   `sleep` for the pieces' whole 8-12 minutes): write the deck between checks. Save the result:
   it has the real size of each picture. Look at the pictures before writing the deck; regenerating one that doesn't
   fit the style costs it again: say which and how much first.
5. **The deck.** `deck.js` in the working folder, from the plan, `deck.d.ts`, the contract and the asset result: the
   deck names every asset by its id, never by URL, and sets the genially's name with `gsRename` in the cover's
   function (until then the name follows the cover's text and loses its line breaks).
6. **Open the editor.** `genially_creation_manage` with `action: 'open'`, the `geniallyId`, the whole `deck` and the
   `surfaceVersion` (the first line of `deck.d.ts`). It checks the deck: if it comes back with problems, fix those
   lines and open again. Otherwise it returns the `runId`, the `assets` the deck uses by kind (`images` and `audios`:
   id → URL; `videos`: id → the team's video; `aibuilder`: id → the published piece), an `openUrl` that works once for
   5 minutes, and the `editorUrl`. Keep `runId`
   and `assets` in the working folder. In the browser:
   - **navigate** to `openUrl` (typed into the tab, never a click on a link: the editor refuses a link followed from
     another site). It lands on the editor of that genially, with `?ia-manage=true`, on a session that can only edit
     and save it. Never open it from a script (the browser's JavaScript tool, `location.href`, `fetch`, an iframe or
     `window.open`): the auth refuses a request made from another page, and a script that changes the page hangs
     until it times out. The link works only once: if opening it fails, call `open` again for a new one;
   - if it says the browser already has a Genially session (HTTP 409), that session is the user's own: navigate to
     `editorUrl` with `?ia-manage=true` instead;
   - wait for the runtime: `window.gsRuntime` is set once it has loaded, and the editor fires `gsRuntimeError` when it
     can't load it (`await new Promise((ok, ko) => { if (window.gsRuntime) return ok(); addEventListener('gsRuntimeReady',
     ok, { once: true }); addEventListener('gsRuntimeError', () => ko(new Error('no runtime')), { once: true }); })`). On
     an error, reload the tab once; if it fails again, tell the user the editor couldn't load what builds the genially
     and stop. Check that `gsRuntime.surfaceVersion` is the one on the first line of `deck.d.ts`; if not, tell the
     user the editor and this plugin are out of step and stop.
   If the link expired or was used, call `open` again: it replaces the run before.
7. **Build.** Paste `deck.js` as is into the browser's JS tool (it defines `window.AG`), then
   `await gsDeck.run({ assets })`. It answers within 45 s: while `state` is `running`, `await gsDeck.wait()` again.
   When it is `done`, read the log (`ok`/`error` per slide, then the links) and fix the deck for every `error`. To
   rebuild some slides: paste the new `deck.js` and `await gsDeck.run({ only: ['Name', …] })`; the assets stay.
   After a reload: wait for the runtime again, paste the deck again and give it the assets again.
8. **Videos and audio**, already in the deck: `await gsVideo(sid, VID.river, [x, y, w])` puts a video of the
   request on its slide (one side; the other follows its aspect ratio), from `window.__videos`.
   Music and voiceovers go on a native button in the genially's style that plays and pauses them:
   `gsButton(sid, rect, '♪  Music', style, { sound: SND.music, loop: true, volume: 25, playMode: 'playPause' })`
   (background music at about 20-30). `gsSound(ids, SND.door)` plays one on click, by the ids of the request, from
   `window.__audios`; a common sound from the library goes by its URL (`gsLibrarySound`). `gsAudio` puts the
   editor's player, a white card nothing restyles: only if the person wants to see the audio's time and scrub it. Details in
   [references/LESSONS.md](references/LESSONS.md#videos).
9. **AI Builder pieces**, already in the deck: each piece is an asset of the request (step 4), generated and
   published by the connector in several minutes; the deck puts it on its slide with
   `await gsAIBuilder(sid, PIECE.quiz, [x, y, w, h], { goTo: nextSlideId, sounds: { success: SND.win } })`, at the
   rect the request gave it, and fills its "continue" action and its sounds (an effect, music or a voiceover of the
   request). Its stock photos go with `images: { 'path.of.field': IMG.chest }`: the request's pictures in the style
   (the paths come from `AIB.images(sid)` once the piece is on a slide; put them in the deck so a rebuild keeps them). Its prompt carries everything, since
   nothing asks back: the style of the genially, the exact mechanic, the texts and items, the solution and scoring,
   what it does when finished, the language, and no stock photos, plus the guide's
   three asks: fit its size exactly, "continue" only from its button, end screen buttons that answer clicks
   ([LESSONS.md](references/LESSONS.md#ai-builder) says what failed without them). A piece to fix:
   change its prompt in the request and generate it again (same id): the connector asks for a change to the piece it
   made.
10. **Review in the preview**: the editor's own preview, the one of its Preview button. `await gsPreview(slideId)`
   opens it on that slide inside the editor tab and resolves when it is ready; `await gsPreview.go(otherId)` moves it
   with no reload; `gsPreview.close()` closes it. It shows the document as it is, unsaved changes included, and
   redraws on every edit: fix, `await gsPreview.ready()` (it resolves once the preview has painted the change) and
   look again, with no save and no reopening. `gsPreview.state().slideId` is the page it shows. Click, hover and screenshot in it as in
   any page. Windows open by clicking their trigger. On the
   editor canvas the pieces do not run; in the preview they do. `AIB.previewUrl(slideId)` in another tab is the
   saved, published-like version: use it once at the end (step 12), never by reloading the editor's tab.
   Play each piece to the end, as a student would, and check its "Continue" button. What usually fails:
   - stock photos that do not fit → `AIB.images(sid)` lists its image fields; add images of the request in the style
     and pass them as `gsAIBuilder`'s `images`;
   - a text, an option or an answer that is wrong: fix it in the piece's config (`setWidgetConfig`), free and at once;
   - layout that breaks on a correct answer, empty start screen, sound that does not play: change the piece's prompt
     in the request with the exact description of the failure, generate it again (tell the user what failed, and
     that the fix costs 30 credits and 8-12 minutes, before) and rebuild its slide;
   - impossible mazes and puzzles: really check them (in the escape room it was solved by reading the colours
     of the cells from a screenshot).
11. **Self-review of animations and windows**, always, before showing anything to the person:
   - `gsReview()` lists slides with no entrances, texts that pop in while the rest animates, slow or long
     sequences, animated backgrounds, more than one looping animation, overlapping texts, texts off the canvas or
     under the badge, texts with low contrast against the shape or the slide behind them (WCAG: 4.5:1, 3:1 from
     24 px), texts and clickable items covered by an image, a shape or a widget, window content outside its
     box, against its edge or under the close button, content slides with nothing to click, hover or play, more
     than 80 words in view besides the title, and audio players. A text over a photo is left to the screenshots. Fix and
     run it again until `ok` is true. If something is left on purpose (a text that overlaps a title by design),
     say which and why in the report.
   - In the editor's preview (`gsPreview`), open **every window** by clicking its trigger and take a screenshot: text cut off, a
     paragraph running past the box, the title glued to the edge, a close button lost on the box colour. Then
     watch a few slides enter (cover, one content slide, one game slide) and screenshot after the entrances end
     (about 2 s): nothing should jump, appear twice or arrive after the button.
12. **Full walkthrough** in the preview, from the cover to the end, following only what the user sees. Save first and
    do it once in another tab (`AIB.previewUrl`) to see what was really saved.
13. **Save and report the run.** `await gsSave()`. Then `genially_creation_manage` with `action: 'report'`, the
    `runId`, `state` `done` (or `failed` with why), and from `gsDeck.result()` the `log`, the `slides` and the
    `runtimeCommit`. Its `stale` lists slides with content the deck didn't build (a genially built before, with other
    slide names): ask the user before deleting them, and never in a genially of theirs (`keep`).
14. **Report to the user**: what is on each slide, which pieces, what was reviewed and what was not (the audio
    cannot be heard from here: say so), the automatic check of animations, contrast and windows: how many issues it
    found and that none is left, how many windows were opened and checked, and the editor link (the normal one, without `ia-manage`). Don't offer to publish (it isn't supported from here).
    Then `gsState.clear()`: the working values of this genially are no longer needed in the browser.

## Changing an existing genially

When the user wants to add to a genially they already have (new slides, a piece, sound, a quiz) or to redo some of its
slides, the flow above changes in these steps; the rest is the same.

1. **Which genially, and what to change.** Ask for its link (`…/editor/<id>`, the id is the last part). `open` only
   works on a genially they can edit; if it says it can't be edited, tell them and stop.
2. **Read it first.** Open the editor (step 6) with a deck that builds nothing yet:
   `window.AG = { run: async () => { window.__deckLog = ['done']; } };`. Send it to `open` only to get the link, and
   don't run it: the `open` with the real deck later replaces that run. Each `open` gives a session for that genially
   alone (a tab on another genially gets 403 until it is opened again). Then `gsOutline()` gives its name, size,
   navigation mode and each slide's name, title, background, texts, widgets and clickable items;
   `gsOutline({ items: true })` adds every item with its rect, each text's font, size and colour, and each native
   button's text and style. Write what it returns to `outline.json` in the working folder (the one with `plan.md`)
   with your file tool, and look at a few slides in the preview to see the rest of its style.
3. **The plan** (step 2) says, slide by slide: what is new and after which slide it goes, which of their slides are
   redone (rebuilding one empties it: only with their explicit yes, named one by one; one with no name or a name
   another slide shares can't be redone: ask them to rename it in the editor first), and that every other slide
   stays as it is. The new slides follow the genially's style: its backgrounds, fonts, colours, sizes and buttons
   from the outline, its layout from the screenshots. No `create_genially` and no `gsRename`, unless they ask.
4. **Its assets.** The pictures, audios and pieces of an earlier asset request of the genially are reused by their
   ids, like new ones: `open` gives the deck the ready ones it names. Their ids are in that request's `assets.json`,
   or in `genially_assets_get` with its `jobId`, if the working folder kept them. Nothing lists them without
   these. New ones go in a new asset request, as in step 4.
5. **The deck** builds only the new and the redone slides: `AG.run` draws only the deck's own slides, and `keep`
   (step 7) is what protects theirs. A new slide has a name the genially doesn't use and goes in its place with
   `L.slide(name, bg, { after: 'Their slide' })`; links to their slides go by their names, from `getSlides()`.
6. **Before building, a way back.** Save (`await gsSave()`) and note the latest saved version (`await gsVersions()`,
   the first one): the user can go back to it from the editor's version history. If the list is empty, there is no
   saved version to go back to: say so before building, and if anything of theirs is redone, suggest they duplicate
   the genially first from their panel.
7. **Build** with `keep`, the names of all their slides except the ones being redone (from the outline, empty names
   included): `await gsDeck.run({ assets, keep })`, and the same `keep` with `only`. `L.slide` then refuses to empty
   one of them, and no slide is deleted after the run, not even an empty one.
8. **Review and report** the new and redone slides, and the way in and out of them from the slides around them; in
   the report, the version noted in step 6 (or that there was none).

## Game templates that already work

- **Escape room**: cover → mission → map with stations (tooltip on each one) → station = scene + card +
  narration + piece that gives a digit → chest with code and diploma → end → review. "How to play?" button with
  a window, and a visible button to the chest on the map.
- **Presentation with pieces**: cover with audio → outline → sections with facts and one piece per block
  (anatomy with hotspots, comparator with sound, animated tour, mini-game) → final quiz → closing.
- **Notebook / lesson**: grid background, handwritten notes, sticky notes and tape; pieces that show a
  process in motion (phases of a construction, animated timeline).
