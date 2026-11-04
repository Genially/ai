# Editor API facts that save mistakes

What `geniallyAPI` (version 4) does that is easy to get wrong when writing `deck.js` or calling it by hand. Read it
before writing the deck.

- **The runtime needs geniallyAPI version 4** (`MS.apiInfo()` → `{ version, methods, features }`; `inpage.js` refuses
  an older editor). Version 4 has `updateText`, `updateItemLayout`, `getItems`, a deadline on `saveNow`, `slideId` +
  ids on creation, true/false texts, question settings and button text, question calls that throw on misspelt
  fields, buttons whose width is final at once, AI Builder edits that keep their actions, and transparent images that
  report a failed removal.
- Every `create*` takes `slideId` and returns the new item's id (`createImageFromFile` / `createAudioFromFile`:
  `{ url, itemId }`): no `selectSlide` before creating.
- **One call per text**: `geniallyAPI.updateText(id, { content: { format: 'plain' | 'html', value },
  role, style: { fontFamily, fontSize, color, bold, italic, underline, uppercase, lineHeight, horizontalAlign,
  verticalAlign } })` applies content, then the role, then the style, as one undo step, whole or not at all. It
  returns `{ id, changed, warnings }`: read `warnings` (a role reset the line height, the text grows and may cover
  what is below). `null` resets a style value. Same for geometry: `updateItemLayout(id, { position, size, rotation,
  opacity, locked })`.
- **Reading a slide**: `geniallyAPI.getItems({ slideIds: [sid], fields: ['type', 'rect', 'text'] })`
  gives the items with only those fields, texts with their role and style in the shape `updateText` takes, in one
  call instead of `getSlideItems` plus one `getTextItemDetails` per text. It returns a page, not an array:
  `{ items, nextCursor }`, 200 items at most (`limit`). Iterate `.items`, and while `nextCursor` is not `null` call
  again with `cursor: nextCursor`.
- **Questions**: `gsQuestion` works in a window as on a slide (pass the popup's id). Their colours and fonts go
  through `geniallyAPI.updateActivityAppearance(id, { general, question, answer, button, … })`: recipe and the
  pattern for a quiz of several questions in [LESSONS.md](LESSONS.md#native-questions).
- **Deleting slides**: `geniallyAPI.deleteSlides(ids)` throws, deleting nothing, if an id is a popup that some slide
  opens. Pass the slides that open the popups, not the popups: they go with them (filter with `!s.isPopup` from
  `getSlides()`). On editors with `deleteSlides.popupsWithParent`, a popup whose parent slide is in the same call is
  accepted too.
- **Links**: an item holds one interactivity of each type, and setting the same type again throws. To change a link,
  pass `{ replace: true }` to the helper (`gsGoTo(ids, slideId, { replace: true })`, also `gsTooltip`, `gsPopup`,
  `gsSound`, `gsLink`, `gsReveal`, `gsEffect`, `gsCloseButton`). Check what each item does with
  `geniallyAPI.getItemInteractivities(id)` (`[{ eventType, actionType, props }]`), not with the preview's aria labels.
- **Groups**: `geniallyAPI.groupItems(ids)` returns the group's id and `ungroupItem(groupId)` its children's ids. One
  interactivity on the group covers every child.
- **Placing under a title**: `geniallyAPI.measureText(titleId)` gives `{ width, height, source }` (the painted height
  when `source` is `'rendered'`). Put the next element at `title.y + height + gap` instead of guessing the line count.
  After `updateTextContent`, wait a frame before measuring.
- **Text roles**: every text needs one, so the person can restyle all titles or all paragraphs at once from the
  editor's styles panel. `createText({ …, slideId, format: 'plain', role: 'title' | 'title2' |
  'subtitle' | 'paragraph' | 'list', list: 'ordered' | 'unordered' })` creates it with the role's Brand Kit style
  and label, and `fontSize`, `color`, `fontFamily` override the kit (`L.T` does this). `updateText(id, { role })`
  changes it and applies the kit's style, size included. `updateTextBrandStyle(id, 'title_1' | 'title_2' |
  'subtitle' | 'content')` only sets the label.
- **Layer order**: `reorderItem(id, 'front' | 'forward' | 'backwards' | 'back')` works on any slide and keeps the
  selection. Where the editor has `setItemsOrder(ids)`, it sets the exact order of sibling items, back to front, in
  one call and one undo step (siblings left out stay behind the list; transversal items are ordered apart).
- **Saving**: `gsSave(ms)` returns `status`: `'saved'`, `'conflict'` or `'blocked'` (stop and
  tell the person), `'pending'`, or `'timedOut'`. A timeout means the save is still going: call `gsSave()` again
  later to read it, never force a save. On an editor with `save.requestTimeout` (contract v5), `gsSave` waits for a
  save already running instead of starting another; `stuck: true` means reload the editor, and `unauthorized: true`
  means the server refused the save (stop and tell the person).
- **Volume**: on editors with `audio.volume`, `gsSound(ids, audio, { volume })`, `gsAudio(sid, audio, rect, name,
  { volume, loop })` and `AIB.wire(…, { sounds: { success: { url, volume } } })` take
  0-100. Sound actions default to 100 and players to 50; background music under a narration goes at about 20-30. On
  older editors the option is ignored: everything plays at those defaults.

