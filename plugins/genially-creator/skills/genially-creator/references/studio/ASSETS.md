# The asset request (version 1)

What the backend generates for a genially before its deck is written. It is the only part of the plan with a fixed
format, because code reads it: the backend generates and charges from it, and the deck is checked against what came
back. The rest of the plan (the design direction, the slides, their texts, the navigation) is agreed with the user in
prose and lives in the deck.

The Genially MCP tools take it and answer it:

| Tool | Input | Answer |
| --- | --- | --- |
| `genially_assets_ai_credits_estimate_get` | `{ geniallyId, request }` | [the estimate](#the-estimate) |
| `genially_assets_generate` | `{ geniallyId, request }` | [the job's result](#the-job-and-its-result), at once |
| `genially_assets_get` | `{ jobId }` | the job's result, checked again |

`geniallyId` is a genially the user can edit; the credits are its team's.

## The request

```json
{
  "version": 1,
  "style": { "description": "Watercolour children's storybook illustration…", "palette": ["#6B4423", "#2E86C1"], "mood": "…", "audience": "…", "avoid": "…" },
  "images": [
    { "id": "img_r7c2kq", "role": "cover", "prompt": "a river coming down from the mountains…", "size": "1280x800" },
    { "id": "img_9xm4ta", "role": "character", "prompt": "Drip, a little blue water droplet…", "size": "1024x1024" }
  ],
  "videos": [
    { "id": "vid_r1v3r0", "prompt": "a drop falls from a leaf into the river, the camera slowly moves closer, morning light…", "seconds": 5, "aspectRatio": "16:9" }
  ],
  "audios": [
    { "id": "aud_k3m9qz", "kind": "music", "prompt": "soft, calm piano, slow tempo…", "seconds": 30 },
    { "id": "aud_p2v8nd", "kind": "speech", "text": "Hi, I'm Drip. Will you help me get back to the sea?", "voice": "young_female" }
  ]
}
```

- **`style`**, one for every asset, so they read as one set; the backend adds it to every prompt.
  - `description` (required, 120 to 900 characters, about 300 is enough): the technique, lines and edges, textures,
    light, level of detail, how figures are drawn, the background. Specific enough that two pictures made apart look
    like the same illustrator made them.
  - `palette`: the genially's colours in hex, the same as the deck's.
  - `mood`, `audience`, and `avoid`: what no picture may have (text and watermarks are always avoided).
- **`images`**, each one with:
  - `id` (required): made up at random by whoever writes the request, `img_` and 6 to 12 letters or digits. Unique
    in the request, and kept when the picture is regenerated, so a deck already written still finds it.
  - `role` (required): `cover`, `background`, `illustration`, `character` or `object`. A cover and a background fill
    a slide; an illustration goes in a part of it; a character and an object are cut-outs.
  - `prompt` (required, 20 to 1600 characters): what it shows, the framing, where it leaves room for a text. Not the
    style: that is added.
  - `size` (required): `1280x800`, `800x1280` or `1024x1024`. What is asked for, not what comes out (below).
  - `transparent`: no background. Defaults to true for a character or an object, false for the rest.
  - `consistentWith`: the id of another image whose subject this one repeats (the same character in another pose),
    so the backend keeps them alike.
- **`audios`**, sound effects, music tracks and voiceovers, each one with:
  - `id` (required): made up at random like an image's, `aud_` and 6 to 12 letters or digits. Unique among every
    asset of the request, and kept when the audio is regenerated.
  - `kind` (required): `sound_effect` (a door, a bell, a cheer), `music` or `speech` (a voiceover).
  - A sound effect or music: `prompt` (required, 1 to 1000 characters), what it sounds like; for music, the genre,
    mood, instruments and tempo. The style is not added to it. And `seconds` (required): its length, 0.5 to 22 for a
    sound effect and 10 to 120 for music, charged by the started second.
  - A voiceover: `text` (required, 1 to 2000 characters), exactly what is said, in the language it is said in (any:
    the voice speaks the language of its text; punctuation sets the pauses), and `voice` (required), one of
    `narrator_female`, `narrator_male` (calm, for telling), `teacher_female`, `teacher_male` (clear, for explaining),
    `young_female`, `young_male` (lively), `elder_male` (warm, older), `host_female`, `host_male` (energetic, for
    games), `character_epic` (deep, dramatic), `narrator_female_en`, `narrator_male_en` (English accent). It is
    charged as text to speech, by its characters (5 credits plus 20 per 100 characters), and has no length to ask
    for. Tell the user its text and the kind of voice before generating it.

  The deck places them from `window.__audios` with `gsAudio` (a player) or `gsSound` (on click).
- **`aibuilder`**: AI Builder pieces, up to 6, each one:
  - `id` (required): made up at random like an image's, `aib_` and 6 to 12 letters or digits, unique in the request
    (`open` names a missing id of the deck by these prefixes: `img_`, `vid_`, `aud_`, `snd_`, `sfx_`, `mus_`, `aib_`);
  - `prompt` (required, up to 12000 characters): everything the piece needs, since nothing asks back. Write it in
    the blocks of "The prompt of an AI Builder piece", below (the piece of `examples/studio_tour/assets.json` is the
    model);
  - `width`, `height` (required): the size of the rect the deck gives it.

  Each one takes 8-12 minutes and 30 credits, and they are generated at the same time: tell the user, piece by
  piece, its mechanic, texts, ending and size, and the wait, before generating them. A changed prompt under the
  same id asks for a change to the piece made before. The deck inserts them from `window.__aibuilder` with
  `gsAIBuilder`.

  **The prompt of an AI Builder piece.** The AI Builder does what the prompt spells out and leaves out what it only
  implies: pieces asked for "a quiz" came back with no feedback, with their own title under the slide's and with
  11 px text. A piece is a component made for this genially, and not always a game: an animation, a diagram that
  moves, a simulation or a small tool are pieces too, and a game's blocks would turn them into one. Two things,
  each on its own, decide which blocks a prompt has, and the plan says both for every piece:

  - **Does it end?** A game or an activity ends. An animation or a tool does not: it works from the first moment
    and for as long as its slide is open.
  - **Does it have right and wrong?** A piece that has gives feedback and a score, and is practice or graded. One
    that has not (an animation, a tool, something to explore) has neither, and no mode.

  A game is yes and yes; an animation or a tool, no and no; a guided demonstration that finishes, yes and no; an
  exercise checked as you go that never ends, no and yes. The blocks, in this order, each with its heading:

  - **PIECE**, always: what it is, in one sentence, who uses it and what for.
  - **PRACTICE OR GRADED**, with right and wrong: the mode the user chose for this piece in the plan, never one you
    assume. Free practice: "This is free practice with no assessment: nothing is graded, recorded or reported.
    After a mistake the player keeps trying, and can play it again from the end screen as many times as they like."
    Graded: "This is a graded activity: its result is reported once." See what each one means below. **Without
    right and wrong**, this line in its place: "Nothing in this piece is right or wrong: nothing is asked, scored,
    graded, recorded or reported."
  - **START SCREEN**, when it ends: its title, one line of instructions and a start button, with their exact texts.
    No title that repeats the slide's: the slide already has it. **When it does not end**, this line in its place:
    "It has no start screen, no end screen and no continue button: it works from the first moment and for as long
    as it is on screen."
  - **GAME SCREEN**, always: every element, with every text in full and how many there are; what moves by itself;
    what can be dragged, clicked or typed; "the layout never changes size or position while it is used".
  - **FEEDBACK**, with right and wrong: what the player sees after a right move and after a wrong one, with the
    exact texts, and that it stays on screen until the player goes on.
  - **WHILE PLAYING**, with right and wrong: "After a wrong move the player goes on playing: [how: the card goes
    back, the check works again]. Nothing stays locked, disabled or greyed out after a mistake. No message says the
    answer was recorded or already given."
  - **END SCREEN**, when it ends: when it shows, its title, the message for each score band when it has a score,
    and exactly two buttons: "[Play again]", which starts the whole piece over, shuffled, and "[Continue]", which
    fires the continue action. Both always visible, whatever the score. (A graded piece: only "[Continue]".)
  - **SCORING**, with right and wrong: what counts as a point, the right answers, and that the score shown is the
    number of right answers at the last check.
  - **LOOK**, always: the palette in hex with what each colour is for, the shapes; no stock photos and no external
    images.
  - **TEXT**, always: "All text at least 16 px at this size. No text selection while dragging (user-select: none on
    cards, slots and labels). Words never break in the middle; a label that does not fit goes on two lines."
  - **FONTS**, always: one font field per role with its default, as the fonts can only be loaded from a field.
  - **SIZE**, always: "fills exactly W × H px and never grows, scrolls the page or changes size on any screen".
  - **ACTIONS**: the sound fields, left empty, always; when it ends, also a "continueAction" field, left empty:
    continue fires only from the end screen's button, which sits above everything else and answers clicks.
  - **LANGUAGE**, always: every text in the genially's language, and that no other text is added.

  **Practice or graded: what Genially does with each** (checked on real pieces and in the AI Builder's rules,
  10 Nov 2026). The AI Builder marks a piece as scoring when it has a right and a wrong answer, unless the prompt
  says in so many words that it is free practice with no assessment.
  - **A scoring piece** is an activity for Genially: its result is recorded, and the player hides its "Try again"
    and "Play again" buttons (the AI Builder makes them; an ordinary genially does not ask for them to show) and
    puts a bar over it when someone comes back ("You have already answered this question"). It is played once each
    time its slide is opened. Asking for a restart button, or paying for a change to add one, changes nothing.
  - **A free-practice piece** reports nothing, stays playable after an answer and keeps its restart buttons. It
    does not show in the results of the genially.

  **The user decides it, piece by piece, in the plan**, for every piece with right and wrong. Each one is shown
  there with the mode you propose and what it means in their words: practice (it can be played again as often as they like, and no result is kept) or graded
  (one try each time its slide is opened, and each person's result is kept). Propose graded when they asked for an
  exam, a test or results to look at, and practice for a lesson, a review, a game or an escape room; then ask
  whether to leave them so or change any, and build what they answer. Write each piece's mode in `plan.md`. There is
  no graded piece that can be played again: if they ask for both, say so and let them pick one. Changing the mode
  once the piece is made is making it again, at its price: say so before.
- **`videos`**, up to 6 clips without sound, each one with:
  - `id` (required): like an image's, `vid_` and 6 to 12 letters or digits, unique in the request;
  - `prompt` (required, 20 to 1000 characters): what happens, shot by shot if there is more than one: the subject,
    the action, the camera (still, a slow push in, a pan), the light and the look of the genially. The style is not
    added to it, and it shouldn't ask for text in the image;
  - `seconds` (required): its length, 2 to 20 whole seconds;
  - `aspectRatio` (required): `16:9` for a slide, `9:16` for a phone, `1:1`;
  - `resolution`: `720p` (the default) or `1080p`, which costs twice as much.

  They are made with the model the editor's video panel uses by default, take a few minutes each, and are charged by
  the second when they are delivered (200 credits a second at 720p, so a 5-second clip is 1,000). The deck inserts
  them from `window.__videos` with `gsVideo`; the user can regenerate one from the video panel.

What the image model gets for each picture is its `prompt`, then the style (`Style:`, `Palette:`, `Mood:`, `For:`
and `Avoid:`, with text, letters and watermarks always avoided). The two together take up to 2000 characters: a
request where any picture goes over is refused whole with `PROMPT_TOO_LONG`, naming the picture. A detailed prompt
makes a better picture, so keep the style tight and spend the room on the scene. The style is added to every picture
and wins over a look its prompt asks for ("neon night" came out in the genially's soft 3D): don't ask one picture for
another style.
`consistentWith` is not honoured by the backend yet: it is checked and kept, and the pictures are generated apart.

The same `id` sent again in another request is the same picture:

- ready or being generated with the same prompt, size, transparency and style: reused, and nothing is charged;
- changed in any of them, or failed before: generated again under the same `id`, with a new `generationId`, and
  charged again;
- being generated with something else: the whole request is refused with `IMAGE_PENDING`; wait for its job.

An audio follows the same rules with its kind, prompt and length (a voiceover, its text and voice), and one being
generated with something else refuses the request with `AUDIO_PENDING`; a video, with its prompt, length, aspect
ratio and resolution (`VIDEO_PENDING`); an AI Builder piece, with its prompt and size (`AI_BUILDER_PENDING`).

An `id` keeps its kind: sent again as another kind (an image's id for a music track, a sound effect's for music),
the whole request is refused with `ASSET_KIND_CHANGED` and nothing is generated. Give the new asset an id of its own.

## The estimate

Before generating, the request is priced with the same input. The answer:

```json
{
  "credits": 2172,
  "images": [
    { "id": "img_r7c2kq", "action": "generate", "credits": 530 },
    { "id": "img_9xm4ta", "action": "generate", "credits": 557 }
  ],
  "audios": [
    { "id": "aud_k3m9qz", "action": "generate", "credits": 60 },
    { "id": "aud_p2v8nd", "action": "generate", "credits": 25 }
  ],
  "videos": [
    { "id": "vid_r1v3r0", "action": "generate", "credits": 1000 }
  ],
  "aibuilder": [],
  "availableCredits": 12000,
  "pendingCredits": 0,
  "enough": true
}
```

- `credits`: what generating the request would charge now, the sum of its images, audios, videos and AI Builder
  pieces;
- one entry per image, audio, video and AI Builder piece of the request, in its order: `generate` (new, changed or
  failed before) with its price, or `reuse` (the same asset is already there) for 0. A cut-out costs the background
  removal on top; a sound effect or music costs per started second of its length (`studioAssets.soundPerSecond` of
  `ai_credits_get`), a voiceover by its characters, a video by its seconds at its resolution, and a piece the same
  whether it is new or a change;
- `availableCredits`: what the user can spend, the balance of the genially's team; `pendingCredits`: what the assets
  still being generated for the genially will charge;
- `enough`: whether `availableCredits − pendingCredits` covers `credits`. When it doesn't, generating fails whole with
  `INSUFFICIENT_CREDITS` and nothing is generated.

Show the user what will be generated (the guide's "Talking to the user"), the cost and the balance, and wait for their
go-ahead.

## The job and its result

The backend answers the request at once with a `jobId`. Asked for that `jobId`, it answers:

```json
{
  "jobId": "job_5d1f0a7c",
  "state": "done",
  "images": [
    { "id": "img_r7c2kq", "state": "ready", "url": "https://ai-image.genially.com/…/….png", "width": 1536, "height": 1024,
      "generationId": "gen_…", "model": "gpt-image-2-medium", "credits": 530 },
    { "id": "img_9xm4ta", "state": "ready", "url": "https://…", "width": 1024, "height": 1024, "transparent": true,
      "generationId": "gen_…", "model": "gpt-image-2-medium", "credits": 557 },
    { "id": "img_w2hz8d", "state": "failed", "reason": "INAPPROPRIATE_PROMPT" }
  ],
  "videos": [
    { "id": "vid_r1v3r0", "state": "ready", "url": "https://…/….mp4", "durationSeconds": 5, "aspectRatio": "16:9",
      "generationId": "…", "credits": 1000 }
  ],
  "audios": [
    { "id": "aud_k3m9qz", "state": "ready", "url": "https://…", "durationSeconds": 30, "generationId": "…", "credits": 60 },
    { "id": "aud_p2v8nd", "state": "ready", "url": "https://…", "generationId": "…", "credits": 25 }
  ],
  "aibuilder": []
}
```

- `state` of the job: `running` while any asset is `pending`, `done` when every one is `ready` or `failed`.
- `retryAfterSeconds`, only while `running`: when to ask for the job again, never later (no wait of your own for the
  whole job: work on the deck between checks). Each time, the pending assets are checked again; one still pending after 10 minutes fails with `TIMED_OUT`.
- One entry per image of the request, by the same `id`:
  - `state`: `pending`, `ready` or `failed`;
  - when `ready`, always `url` (public, https: what `window.__imgs` gets), `width` and `height`, and `generationId`;
  - when `failed`, always `reason`: `INAPPROPRIATE_PROMPT` when the prompt was refused, `TIMED_OUT`, `ERROR`;
  - `width` and `height` are the real ones: a `1280x800` request comes out 3:2 (1536 × 1024) from GPT Image and 16:9
    from flux, nanobanana or ideogram. The deck lays every picture out by them;
  - `transparent`: whether it really has no background. `false` on a cut-out means the background removal failed and
    the picture is a rectangle;
  - `generationId` identifies this generation of the picture; a regenerated picture keeps its `id` and gets a new
    one. `model` and `credits` say what made it and what it cost.
- One entry per audio of the request, by the same `id`, with the `state` of a picture: when `ready`, always `url`,
  `generationId` and `credits`, and `durationSeconds` (its length) except for a voiceover; when `failed`, always
  `reason`, `TIMED_OUT` or `ERROR`. A sound effect or a voiceover comes back `ready` in the answer to the request
  itself; music stays `pending` while it is
  made, and the job asks to come back in 60 seconds.
- One entry per video, by the same `id`: when `ready`, always `url` (the MP4, to look at it) and `generationId`, the
  team AI video that `window.__videos` gets and `gsVideo` inserts, with `durationSeconds`, `aspectRatio`, `model` and
  `credits`; when `failed`, `reason`.
- One entry per AI Builder piece, by the same `id`: when `ready`, `path`, the published widget that
  `window.__aibuilder` gets and `gsAIBuilder` inserts; when `failed`, `reason`.

## The deck against the result

`genially_creation_manage` (`open`) checks that every asset id the deck uses, of any kind, is a ready asset of the
job, and warns about each ready asset the deck never uses: it was generated and paid for anyway.
