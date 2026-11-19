# Building in the cloud browser

For a chat that has no browser of its own (a chat on the web or on a phone, a terminal with no browser tool). The
planning, the assets, the deck's rules and the review are the same as with a browser. What changes is where the deck
is kept and who drives the editor: the deck lives on Genially's servers in parts, and a browser of Genially's builds
it there. Nothing in that browser thinks: you plan, write, look at the pictures it sends back and fix.

Two tools of the Genially connector do it:

- `genially_studio_deck` keeps the deck: `put`, `patch`, `remove`, `get`.
- `genially_studio_browser` drives the editor: `open`, `build`, `wait`, `shot`, `tour`, `interact`, `eval`, `save`,
  `close`.

If the connector doesn't have them and you have no browser either, say so at the start and stop: there is no other
way to build.

## What it can't do yet

- **Add to a genially the user already has.** A build can't be told which of their slides to keep, so this way is
  only for a genially made for the occasion with `create_genially`. To change an existing one, a browser is needed.
- **Two geniallys at once.** Each person has one cloud browser: opening a second genially takes it from the first.
- **Hear anything.** Sound is placed and checked by the review, never heard: say so in the report.

## The deck, in parts

The deck is the same `deck.js` the contract describes, cut into files that are joined in name order:

| Part | What it holds |
|---|---|
| `00-head.js` | The opening `window.AG = (() => {`, the palette, the fonts, the asset ids, every helper, `links`, `R` and `add` |
| `NN-<slide>.js` | One slide: a single `add('<Name>', async () => { … });` |
| `99-tail.js` | `wire`, `run`, `return { run };` and the closing `})();` |

- A part's name is two digits, a hyphen, lowercase letters, digits or hyphens, and `.js`: `03-the-water-cycle.js`.
  The digits give the order of the slides.
- **Write each slide's name as a plain string in its `add('Name', …)`**, never built from a variable or a template
  with `${}`. The server reads the names from the code to know which part builds which slide; a name it can't read is
  a slide it can't rebuild alone, show or tour.
- **Everything shared goes in the head.** Colours, fonts, sizes and helpers live there, and a slide's part uses them:
  no literal colour or font in a slide. A change of style is one change in the head, and it rebuilds every slide.
  A fix made slide by slide is how a deck written in parts ends up with slides that don't look alike.
- Limits: 64 KB a part, 40 parts in one `put`, 120 parts and 2 MB in all.

`put` writes whole parts (new ones, or over the ones with the same name). Every answer of this tool says the deck's
slides in order and the `problems` that would stop it: a syntax error, something the contract forbids, a link to
a slide that doesn't exist, two slides with one name, each with its part and line. Fix them before opening. A write
lists only the parts it wrote, with the slides each one builds (`totalParts` says how many the deck has); `get`
lists them all.

`patch` fixes one part with exact replacements: `{ old, new }`, where `old` appears exactly once in the part. It is
all or nothing: if one replacement doesn't fit, none is made and the part stays as it was. Use it for every fix after
the first build; sending a part whole again costs far more.

`get` lists the parts, or reads one back with `part`. When you no longer have the head in view (a long conversation,
a lost context), read it before writing or fixing a slide.

## The flow

It replaces steps 6 to 13 of the skill. Steps 1 to 5 are the same, with the deck sent with `put` instead of written
to a file.

1. **Open.** `genially_studio_browser` with `action: 'open'`, the `geniallyId` and the `surfaceVersion` (the first
   line of the code block of `DECK_API.md`). There is no link to open and nothing to paste. It answers with the deck's
   problems when it can't be opened, most often an asset still being made: wait for `genially_assets_get` to say
   every asset is ready, then open again.
2. **Build.** `action: 'build'`. The first build draws every slide; later ones, only the slides whose parts changed
   (`only: ['Name']` to choose them, `all: true` for every one). It answers with the log (`ok` or `error` per
   slide), the review of the slides it drew, the page's errors and, when it drew only some slides, a picture of up to
   three of them. `unchanged` means no part changed since the last build.
   **After a change in the head, build without `only`.** A build with `only` draws the slides you name and leaves
   the rest as they were, drawn with the old head: the server remembers that, and the next build without `only`
   draws every slide again, however small the change that started it. That is not a failure. To change what every
   slide shares, change the head and let the build draw them all.
3. **Look.** `action: 'shot'` with a slide's name gives its picture as the editor's preview shows it, unsaved changes
   included. After a build of every slide, take a shot of each one: that build sends no pictures. After a build of
   some, also take a shot of two or three slides it didn't touch, to see that the new ones still match them.
4. **Fix and build again**, with `patch`, until the log has no `error` and the review's `errors` are gone (or you can
   say why one is left on purpose).
5. **Save.** `action: 'save'`. Save after every build that came out right, not only at the end: see "When the
   browser goes" below.
6. **Play it.** `tour` plays one slide of the saved genially as a person would (it opens its windows, hovers its
   tooltips, turns its cards, answers its questions) and says what it found, with pictures. `interact` clicks, hovers
   or presses keys where you say. Both play what was saved: they refuse (`SAVE_FIRST`) while something is not. Tour
   every slide that has something to open, and the cover and the end.
   - A step of the tour with `settled: false` was pictured while its window or tooltip was still coming in: look at
     it again with `interact` and a `waitMs`.
   - **A tooltip on a native button shows at the slide's top-left corner in these pictures**, not by its button.
     That is how the cloud browser's view places it, not how the genially is: in the user's own browser it sits by
     the button. Check that it shows and reads well, and leave it on the button: don't move it to a text or a shape
     for this (a chat did, on 19 Nov 2026, and redrew every "+" button for nothing).
   - The tour doesn't play a question whose answers are put in order: it lists it under `byHand`. Say in the report
     that it was not played.
   - A video shows its first frame, black with its play button, in every picture: that is not a failure. Like sound,
     it can't be checked from here: say so.
7. **Close.** `action: 'close'` stops the browser and reports the run: done when everything was saved, stopped when
   something was not. There is no `report` to send in this mode. Always close; a run left open is ended by itself
   after about half an hour, as stopped if anything was unsaved. When it reports the run done, its `thumbnail` says
   whether the picture of the genially's card was asked for: `requested`, it shows up in their panel in a few
   minutes; `failed`, the editor makes it the next time someone opens the genially, changes the cover and leaves.

Then report to the user as the skill's last step says, with the `editorUrl` the answers give.

## Answers that are not finished

Every call answers within about 20 seconds, done or not. A build of thirty slides takes under a minute; AI Builder
pieces and a first open take longer.

| `state` | What it means | What to do |
|---|---|---|
| `done` | Finished | Read `result` and the pictures |
| `running`, `starting` | Not finished yet | Call `action: 'wait'` with its `opId` after `retryAfterSeconds`, as many times as it takes |
| `unchanged` | A build with nothing new | Nothing, or `all: true` |
| `not_run` | The deck has `problems` | Fix them and call it again |
| `failed` | It didn't work | `problem.message` says what to do next |

A `wait` for an operation that already ended gives its answer again: if an answer never reached you, ask for it
before doing the work again.

## Tools inside the editor

`action: 'eval'` runs JavaScript in the editor: the body of an async function, whose `return` comes back (cut at
20,000 characters). It is for what the deck can't do and the skill does in the browser's console: `gsOutline()` and
`gsInspect('Name')` to read what was built, `AIB.images(slideId)` for a piece's picture fields, a piece's config, and
deleting the slides a build lists as `stale` (slides in the genially that the deck no longer builds) once the user
agrees. A script counts as a change: save after it.

`interact` takes its positions in the pixels of the pictures `tour` and `interact` send (the slide as shown, about
1024 wide), not in the genially's own size.

## When the browser goes

The cloud browser stops by itself after ten minutes without a call. What was not saved is lost; the genially is as
it was last saved. A call then answers that the genially is no longer open: `open` again and `build`, which draws
every slide again from the deck on the server (nothing of the deck is lost). The same when a save says someone else
changed the genially.

So: save after each good build, and don't leave a build unsaved while you wait for the user.

| `problem.code` | What happened | What to do |
|---|---|---|
| `EDITOR_NOT_OPEN`, `BROWSER_NOT_RUNNING`, `EDITOR_LOST` | The browser stopped or was closed | `open`, then `build` |
| `SAVE_FIRST` | A tour or an interaction with changes not saved | `save`, then call it again |
| `EDITOR_BUSY` | An earlier build is still working | Wait a minute and call it again |
| `BUILD_FAILED` | The deck didn't run to the end | Fix what the log says and `build` |
| `SAVE_NOT_CONFIRMED` | The editor didn't confirm the save | `save` again; on a conflict, `open` again |
| `DECK_CHANGED` | The deck changed before a build reached the browser | `build` again |
| `STALE_OP`, `REOPENED` | The genially was opened again meanwhile | Call it again: it works on the new open |
| `CLOUD_BROWSER_LIMIT` | The person used up their day of the cloud browser | `save`, then `close` (both still work); tell them it can go on tomorrow, or in a browser of their own |
| `CLOUD_BROWSER_UNAVAILABLE` | There is no cloud browser here | A browser of your own is needed |
