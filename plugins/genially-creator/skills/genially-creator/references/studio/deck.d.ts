// The deck surface, version 3: everything a deck.js may call, for a model writing one and for the checker that
// validates it. The contract around it (shape of a deck, the log, what is forbidden, the rules that make a genially
// look finished) comes with it.
//
// A deck runs inside the Genially editor with the genially-creator runtime loaded. It may use only what is declared
// here plus plain JavaScript (Math, JSON, Promise, requestAnimationFrame…): no network, no storage, no DOM. The assets
// (pictures, videos, audios, AI Builder pieces) are generated before by the Genially MCP's asset request; the deck
// places them by the id they have there.
//
// Units are canvas pixels. The canvas is the genially's size, which geniallyAPI.getGeniallySize() gives: lay everything
// out on it, never on a fixed height (a blank genially made by the Genially MCP is 1200 × 675 by default).
// A mobile genially (isMobile) is 360 × 640, and a page can scroll down past it (setSlideOverflowHeight).
// (0, 0) is its top-left corner. Every id is a string. Colours are hex ('#1F3A4D').

/** [x, y, width, height]. */
type GsRect = [x: number, y: number, width: number, height: number];
/** [x, y, width?, height?]: buttons and questions size themselves when width or height is left out. */
type GsLooseRect = [x: number, y: number, width?: number, height?: number];

/**
 * Entrance effects. For presentations and lessons: 'fade-in', 'fade-in-bottom' / '-left' / '-right' / '-top',
 * 'scale-in-center', 'slide-in-*'. 'bounce-in-*', 'swirl-*', 'roll-in-*', 'rotate*' only in games, one element at a
 * time.
 */
type GsEffect = 'fade-in' | 'fade-in-bottom' | 'fade-in-left' | 'fade-in-right' | 'fade-in-top' | 'scale-in-center' | (string & {});
/** Animation speed: vel1 0.5 s, vel2 1 s (the default here), vel3 2 s, vel4 3 s, vel5 4 s. */
type GsSpeed = 'vel1' | 'vel2' | 'vel3' | 'vel4' | 'vel5';
/** Entrance of an item as it is created: effect and delay in seconds (speed vel2). */
interface GsEntrance { fx?: GsEffect; delay?: number }

// ---------- L: drawing ----------

interface GsTextOptions extends GsEntrance {
  /** Font size in px. Default 20. */
  size?: number;
  /** A Google font family ('Nunito Sans'). Default 'Inter'. */
  font?: string;
  /** Bold, italic, underline and uppercase are for the whole text; inside a sentence, use `html`. */
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  uppercase?: boolean;
  /** Hex. */
  color?: string;
  align?: 'left' | 'center' | 'right' | 'justify';
  /**
   * Where the text sits in the rect's height. The editor fits the box to its text, so 'center' and 'bottom' move the
   * box itself, by its painted height, once the deck has run (gsDeck paints each slide for it); 'top' (default) leaves
   * it at y. Until then the box is at y.
   */
  valign?: 'top' | 'center' | 'bottom';
  /** A multiple of the size (1.4). */
  lineHeight?: number;
  /** A real list, one item per line of `text` (not lines starting with "•"). Takes no brand. */
  list?: 'ordered' | 'unordered';
  /**
   * `text` is HTML: <strong>, <em>, <u>, <br>, <p>, for a word in bold inside a sentence, and L.math(…) for a formula.
   * An <a href> is dropped (its words stay): a link goes on a whole item, with gsLink.
   */
  html?: boolean;
  /**
   * Brand Kit role, so whoever edits the genially can restyle every title or paragraph at once.
   * 'title' for slide titles, 'body' (or 'content') for the rest.
   */
  brand?: 'title' | 'title2' | 'subtitle' | 'body' | 'content';
}

interface GsLib {
  /**
   * Adds a slide at the end with that name and background colour and returns its id. Names are unique in a deck:
   * links find their target by name. If the slide exists, it is emptied and reused (same id, place and links).
   * after: the name of the slide it goes after, instead of the end (a new slide among an existing genially's). On an
   * existing genially, a slide of its own that gsDeck.run's keep names is never emptied: it throws instead.
   */
  slide(name: string, background: string, options?: { after?: string }): string;
  /**
   * A picture of the asset request as the slide's background: the editor covers the canvas with it, centred and
   * cropped, whatever its proportion, and nobody can drag it by accident. A full-slide picture goes here, not in L.P.
   */
  background(slideId: string, imageId: string): Promise<void>;
  /**
   * Text box. `\n` breaks the line. The editor fits the box's height to the text, taller or shorter than the rect's:
   * read the painted height with geniallyAPI.measureText after a frame before placing something under it.
   */
  T(slideId: string, rect: GsRect, text: string, options?: GsTextOptions): string;
  /**
   * Shape from SVG markup (L.rrect, L.circle… or your own). Your own SVG: every filled path carries
   * class="color1" style="fill:#000000" (only .color1 is painted, in `color`), and the viewBox has the proportion of
   * the rect, or the shape comes out with the viewBox's proportion and covers what is underneath.
   */
  S(slideId: string, svg: string, rect: GsRect, color: string, options?: GsEntrance): Promise<string>;
  /**
   * Picture by the id it has in the asset request: window.__imgs[id] is its URL, filled before the deck runs. The
   * picture is stretched to the rect, not cropped: give the rect the picture's own proportion, from the real width
   * and height the job's result gives it (they depend on the image model: a "1280x800" request comes out 3:2 from
   * GPT Image, 16:9 from others). For a full-slide picture use L.background.
   */
  P(slideId: string, imageId: string, rect: GsRect, frame?: 'img-rounded-square' | 'img-circle', options?: GsEntrance): Promise<string>;
  /**
   * Icon from the editor's library by search term. Hits carry no name and the first one is often off-topic ('sun'
   * and 'layers' return the same icon): when the meaning matters, draw an inline SVG with L.S instead. Throws
   * `no icon for "<term>"`.
   */
  icon(slideId: string, term: string, rect: GsRect, color: string): Promise<string>;
  /**
   * A math formula for a text with `html: true` (or gsTextEdit's `html`): the editor's own formula block, the "Formula"
   * text style, which keeps the LaTeX source (anyone can edit it in the text panel) and draws it. LaTeX as Temml reads
   * it ('x = \\frac{-b \\pm \\sqrt{b^2-4ac}}{2a}': in a JS string every backslash is doubled); one formula per call,
   * a block of its own, so it goes between paragraphs, never inside one:
   * `L.T(s, rect, '<p>The roots are</p>' + L.math('x = \\frac{-b \\pm \\sqrt{b^2-4ac}}{2a}'), { html: true, size: 32 })`.
   * A formula never wraps: the editor widens the box to fit one wider than the rect, so measure it before placing
   * something beside it. It carries no marks of its own (bold, a colour in a <span>): check its size, colour and
   * alignment in the preview. Never a formula drawn as an image or typed with Unicode (x², √): it can't be edited.
   */
  math(latex: string): string;
  /** SVG markup for L.S, one colour. */
  rrect(width: number, height: number, radius: number): string;
  circle(): string;
  check(): string;
  arrow(): string;
  quote(): string;
}
declare const L: GsLib;

/** What gsTextEdit changes: only the keys given. `text` or `html` replaces the words. */
interface GsTextChanges {
  text?: string;
  html?: string;
  size?: number;
  color?: string;
  font?: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  uppercase?: boolean;
  lineHeight?: number;
  align?: 'left' | 'center' | 'right' | 'justify';
  /** Stored, but it moves nothing: the box is fitted to its text. To centre it in a space, L.T's valign or move it. */
  valign?: 'top' | 'center' | 'bottom';
}
/**
 * Changes a text in place, keeping its role: a smaller size for a text that overflows after measureText, a word
 * changed. An unknown key throws.
 */
declare function gsTextEdit(itemId: string, changes: GsTextChanges): { id: string; changed: string[]; warnings: string[] };

// ---------- Animations ----------

/**
 * Entrance animation for one item or a row of them, one after the other: item k starts at delay + k·step seconds.
 * Returns how many items were animated.
 */
declare function gsAnimate(itemIds: string | string[], effect?: GsEffect, options?: { delay?: number; step?: number; duration?: GsSpeed }): number;

// ---------- Buttons and links ----------

/** Native button style. Colours in hex: a var(--genially-…) colour throws (it can render transparent). */
interface GsButtonStyle {
  /** A round button: shape 'pill', a one-character text and width equal to height. */
  shape?: 'pill' | 'rounded' | 'square';
  defaultColor?: string;
  hoverColor?: string;
  textColor?: string;
  fontFamily?: string;
  bold?: boolean;
  italic?: boolean;
  showBorder?: boolean;
  borderColor?: string;
  showIcon?: boolean;
  icon?: { icon: string; filled: boolean };
  iconColor?: string;
  iconOnRight?: boolean;
  /** false keeps the colour of a button already clicked (map stations, hotspots). */
  showVisitedState?: boolean;
  visitedColor?: string;
}

/** Draws the content of a window. `rect` is the window's real box: lay everything out from it, never from fixed numbers. */
type GsPopupFill = (popupId: string, parts: { box: string; close: string; rect: GsRect }) => void | Promise<void>;
interface GsPopupOptions {
  /** Box colour, hex. Default white. */
  box?: string;
  /** Frame around the box, hex. */
  frame?: string | null;
  /** Close button colour, hex: never the colour of the box. */
  closeColor?: string | null;
  closeAt?: [x: number, y: number] | null;
  replace?: boolean;
  /** Default: the slide's name and the trigger's label. */
  name?: string | null;
}

/**
 * Native button. It widens to fit its text past the width given: one near the right edge can run off the canvas,
 * so place it by its right edge once created (`right - geniallyAPI.getItem(id).size.width`), and line a row up from
 * the right. Height defaults to 60. With `action`, the button gets that one action; if the action can't be set, no
 * button is left and it throws.
 */
declare function gsButton(slideId: string, rect: GsLooseRect, text: string, style: GsButtonStyle | undefined, action: { popup: GsPopupFill } & GsPopupOptions): Promise<{ id: string; popupId: string }>;
declare function gsButton(slideId: string, rect: GsLooseRect, text: string, style?: GsButtonStyle, action?: { goTo: string } | { link: string; newTab?: boolean } | ({ sound: string } & GsSoundOptions)): Promise<string>;

/**
 * Click → slide, by slide id or a relative target. Setting it twice on an item throws: pass { replace: true }.
 * Returns how many items were linked.
 */
declare function gsGoTo(itemIds: string | string[], slideId: string | 'nextPage' | 'previousPage' | 'firstPage' | 'lastPage' | 'back', options?: { replace?: boolean }): number;
/** Opens a web page (a bare domain gets https://; http:// is refused). Throws on an account that can't add links (unverified). */
declare function gsLink(itemIds: string | string[], url: string, options?: { newTab?: boolean; replace?: boolean }): number;

// ---------- Windows, tooltips, reveals ----------

/**
 * A window opened by clicking any of itemIds, filled by `fill`; resolves to the window's id. The close button sits on
 * the box's top-right corner, half outside: keep the content clear of that corner. A window can't be cloned: to have
 * two alike, build two. On a mobile genially it is a sheet from below, the canvas's whole width from y 119, without
 * `frame`.
 */
declare function gsPopup(itemIds: string | string[], fill: GsPopupFill, options?: GsPopupOptions): Promise<string>;
/** The box a new window will have on this canvas, before any exists. */
declare function gsPopupBox(): GsRect;
/** Your own close button inside a window. It can't share its click with another action. */
declare function gsCloseButton(itemIds: string | string[], options?: { replace?: boolean }): number;
/** Hover tooltip with a title and a line of text; it adds to the item's click. Colours in hex. */
declare function gsTooltip(itemIds: string | string[], title: string, text: string, options?: { bg?: string; ink?: string; accent?: string; titleFont?: string; bodyFont?: string; replace?: boolean }): number;
/** Shows, hides or toggles targets when sourceId is clicked (or hovered). An item can't show or hide itself. */
declare function gsReveal(sourceId: string, targetIds: string | string[], options?: { mode?: 'show' | 'hide' | 'toggle'; event?: 'click' | 'hover'; replace?: boolean }): number;
/**
 * A native flip card: each click on the card shows its back, and the next one hides it. Put the front's items, then the
 * back's at the same rect (above them); a transparent layer over the card toggles the back (grouped when it is several
 * items), which starts hidden. The layer takes the card's clicks: the front can't have actions of its own. gsReveal
 * alone turns a card one way only. Returns the layer's id and the back's (its group).
 */
declare function gsFlip(frontIds: string | string[], backIds: string | string[]): Promise<{ layer: string; back: string }>;
/** Confetti, fireworks… on click or hover. */
declare function gsEffect(itemIds: string | string[], effect?: 'confetti' | 'fireworks' | 'claps' | 'rain' | 'heart' | 'balloons' | 'brokenHeart' | 'face' | 'poison' | 'thumbsdown', options?: { event?: 'click' | 'hover'; replace?: boolean }): number;

// ---------- Navigation and courses ----------

/**
 * How the genially is navigated: 'standard' (arrows), 'video' (pages advance on their own, `seconds` each: one
 * number, or by slide name, 1 to 180), 'microsite' (no arrows: links only) or 'course'. On editors without it throws.
 */
declare function gsNavigation(mode: 'standard' | 'video' | 'microsite' | 'course', options?: { loop?: boolean; seconds?: number | Record<string, number> }): Promise<unknown>;
/**
 * Makes the genially a course: its sections in order, each with its slides by name (each slide a lesson, unless it
 * `continues` the one before), and the menu. Turns course mode on. Call it after every slide exists, and put every
 * slide in a section: one left out joins the last section.
 */
declare function gsCourse(course: {
  sections: { name: string; slides: string[] }[];
  continues?: string[];
  menu?: { title?: string | null; navigation?: 'free' | 'sequential'; numberLessons?: boolean; showSearch?: boolean; initialState?: 'open' | 'collapsed'; appearance?: 'brand' | 'creation' | 'light' | 'dark' };
}): Promise<unknown>;

// ---------- Native questions ----------

interface GsAnswer {
  /** Up to 200 characters (60 for shortAnswer). */
  text?: string;
  /** singleChoice, multipleChoice, imageSelection. */
  correct?: boolean;
  /** imageSelection, imageSurvey: a picture of the request, window.__imgs[imageId]. */
  imageUrl?: string;
  altText?: string;
}
interface GsQuestionContent {
  question?: string;
  /**
   * singleChoice / multipleChoice: { text, correct } items (a bare string is a wrong answer). shortAnswer: the
   * accepted answers as strings. sort: the items in the right order.
   */
  answers?: (string | GsAnswer)[];
  /** trueFalse: whether the statement is true. */
  correct?: boolean;
  /** trueFalse: the two answer texts in the genially's language (['Verdadero', 'Falso']), or they show in English. */
  answerTexts?: [string, string];
  /** fillInTheBlanks: 'El agua hierve a [[100]] grados'. There are no distractors: use singleChoice for that. */
  text?: string;
  settings?: {
    randomOrder?: boolean;
    /** false sends on the first click; only where one click is the answer (singleChoice, trueFalse…). */
    sendButton?: boolean;
    /** The send button's text in the genially's language, up to 20 characters. */
    buttonText?: string | null;
  };
  /** Up to 300 characters each. */
  feedback?: { correct?: string; incorrect?: string; message?: string };
}
type GsQuestionType = 'singleChoice' | 'multipleChoice' | 'trueFalse' | 'imageSelection' | 'sort' | 'fillInTheBlanks' | 'shortAnswer' | 'openAnswer' | 'survey' | 'imageSurvey';

/**
 * Native question, no credits. It draws its own background: no card behind it, and give it the full rect or it takes
 * a default height (about 480) that won't match what is next to it; a button below it must not cover its own send
 * button. A sort question shows four rows in 480 px: leave the height out, or give at least 184 + 69 × items. One
 * question per slide or per window: a quiz of five is five buttons, each opening a window with one question. A
 * misspelt field throws. Style it with geniallyAPI.updateActivityAppearance; a shortAnswer question keeps its
 * creation font in its text, so write the question again with gsQuestionEdit after styling it. openAnswer, survey and
 * imageSurvey are premium.
 */
declare function gsQuestion(slideId: string, spec: GsQuestionContent & { type: GsQuestionType }, rect: GsLooseRect): string;
/** Changes a question's content in place; only the fields given change. */
declare function gsQuestionEdit(itemId: string, content: GsQuestionContent): boolean;

// ---------- Components panel ----------

/** In a widget's config, where its field is an action. */
/** sound: an audio of the asset request by its id (an effect, music or a voiceover: window.__audios), or a URL. */
type GsWidgetAction = { goTo: string | 'nextPage' | 'previousPage' | 'firstPage' | 'lastPage' | 'back' } | { sound: string; name?: string; loop?: boolean };

/**
 * A ready-made component of the editor's Components panel (a timer, a roulette, an animated text, a word search…),
 * filled with `config`; resolves to the id of what was inserted (the widget, or the group it comes in). It keeps its
 * proportions and fits inside the rect: give a width and leave the height out (an animated text given 560 × 120
 * came out 193 wide), then check that its height doesn't run off the canvas. WIDGETS.md lists the keys by category,
 * and its section of each key (## wheel) gives that component's fields: config takes those paths, a list as an array of items
 * ({ articles: [{ title, description }] }), an image as the id of a picture of the asset request (window.__imgs) or a
 * URL, a font as its name, an action as a GsWidgetAction (its sound: an audio of the request, a voiceover too),
 * values in the type the default has ("32", not 32). Fields left out keep the component's own, actions included
 * (the roulette's segments play a sound) and pictures too (the holographic card keeps a banana emoji as its icon and a
 * violet overlay over its background): fill every image field the slide shows. The ones listed as "no config" (the
 * dice, the coin…) only go in as they come. A field it hasn't got throws, and nothing is left.
 */
declare function gsWidget(slideId: string, key: string, rect: GsLooseRect, config?: Record<string, unknown>, options?: { variant?: number }): Promise<string>;

// ---------- The editor's library ----------

/** Where gsPlace looks: the Components or the Resources panel, a category of it, and the search, like the panel. */
interface GsLibrarySpec {
  panel?: 'components' | 'resources';
  /**
   * Components: 'compositions', 'galleries', 'activities', 'timeAndNavigation', 'tools', 'textsWithEffect', 'games',
   * 'chartsAndData'. Resources: 'images', 'gifs', 'sounds', 'shapes', 'silhouettes', 'connectors', 'buttons',
   * 'markers', 'social', 'buttonsWithText', 'stickers', 'icons', 'illustrations', 'characters', 'characters3d',
   * 'charts', 'tables', 'diagrams', 'dataTablesGraphs', 'processesTimelines'.
   */
  category?: string;
  query?: string;
  /** The pick-th available entry of the results (0 by default). */
  pick?: number;
  kind?: string;
}
/**
 * A ready-made piece of the editor's library, as is, with no credits: a dice, a timer, a chart, an illustration, a
 * sticker… For a Components panel widget whose fields you set, gsWidget. Returns the ids of the top-level items it
 * created. Throws `gsPlace: nothing available for …`.
 */
declare function gsPlace(slideId: string, spec: GsLibrarySpec | string, rect: GsLooseRect): Promise<string[]>;
/**
 * A sound of the editor's library by search ('bell', 'applause'), with no credits: its URL goes to gsSound or gsAudio.
 * For a sound made to measure, ask for it in the asset request. maxSeconds leaves out longer ones: give it for an
 * effect ('pop' found a 27-second pop song). Check `duration` before using one. Throws `gsLibrarySound: no sound for "…"`.
 */
declare function gsLibrarySound(query: string, options?: { pick?: number; maxSeconds?: number }): Promise<{ url: string; name: string; duration: number }>;

/** A card of gsFlipCards. image: a picture of the asset request by its id, or a URL. Colours: hex, 'var(--genially-primary)' or { documentColor }. */
interface GsFlipCard {
  front: { title: string; text: string; image?: string | null };
  back?: { text: string };
  frontColor?: string | { documentColor: 'primary' | 'secondary' | 'tertiary' };
  backColor?: string | { documentColor: 'primary' | 'secondary' | 'tertiary' };
  /** The texts are near black: white on a dark face. */
  frontTextColor?: string;
  backTextColor?: string;
}
/**
 * The editor's own flip card, which turns over from its corner button (a click on the face only tilts it). Variants:
 * 0 vertical { image, title, text } / back { text }; 1 a stack of three of those, no back (a swipe shows the next);
 * 2 horizontal { title, text } / back { text }; 3 a stack of three of those. Left out, the cards given choose it. A
 * row of cards is one call each. Every text must be given ('' removes it, image: null the picture). Give only the
 * width: 240 → 382 high, 340 → 204. Resolves to the container's id and the ids of the texts and pictures.
 */
declare function gsFlipCards(slideId: string, rect: GsLooseRect, cards: GsFlipCard[], options?: { variant?: 0 | 1 | 2 | 3 }): Promise<{
  id: string;
  cards: { front: { title?: string; text?: string; image?: string }; back: { text?: string } }[];
}>;

// ---------- Audio ----------

/**
 * The editor's player on a slide, a white card with the audio's title and time that nothing restyles: an audio of
 * the asset request by its id (window.__audios), or a URL (gsLibrarySound). rect [x, y, size?] (50 by default).
 * Only where the person wants to see the time and scrub it: music or a voiceover goes on a gsButton with
 * `{ sound, playMode: 'playPause' }`, in the genially's style, and gsReview flags a player. Background music under a
 * narration goes at volume 20-30. Returns the player's id. Throws `no audio "<id>"` for an id that isn't a ready audio.
 */
declare function gsAudio(slideId: string, audio: string, rect: [x: number, y: number, size?: number], name?: string, options?: { volume?: number; loop?: boolean }): Promise<string>;
/** Plays an audio (its id in window.__audios, or a URL) on click, or on hover. Returns how many items got it. */
declare function gsSound(itemIds: string | string[], audio: string, options?: GsSoundOptions): number;
/** How gsSound (and a gsButton with `{ sound }`) plays an audio. */
interface GsSoundOptions { name?: string; loop?: boolean; playMode?: 'playPause' | 'play' | 'playStop' | 'playRestart' | 'stop'; volume?: number; event?: 'click' | 'hover'; replace?: boolean }

// ---------- Videos ----------

/**
 * A video of the asset request (window.__videos), already generated, put on the slide as the video panel does (poster,
 * length; the user can regenerate it there). rect [x, y, width?, height?]: give one side and the other follows the
 * video's aspect ratio; neither, the panel's size. Returns the item's id. Throws `no video "<id>"` for one that isn't
 * ready.
 */
declare function gsVideo(slideId: string, videoId: string, rect: [x: number, y: number, width?: number, height?: number]): Promise<string>;

// ---------- AI Builder pieces ----------

/**
 * An AI Builder piece of the asset request (window.__aibuilder), already generated and published, put on the slide at
 * rect, which should be the size the request gave it. config is laid over the piece's own field by field, as gsWidget's
 * (its texts, options and answers: the free way to fix one): what it leaves out stays, a list item keeps the fields it
 * doesn't give (its image), an image field takes an image id or URL, and a key the piece hasn't got throws with the
 * ones it has (the piece is removed). goTo: the slide its "continue" or "finish" action goes to (only its continue button when it has one: a piece's
 * completion fires as soon as it is solved, before its end screen), or 'nextPage' (also
 * 'previousPage', 'firstPage', 'lastPage', 'back'), which needs no id: a slide the deck builds later has none yet; sounds: by action name
 * ('success', 'win', 'chest|open'; the first pattern that matches a field wins; a failure's field only takes a key
 * that names a failure, 'fail|wrong'), an audio of the request by its id (an
 * effect, music or a voiceover) or a URL, played when it fires. images: by the path of an image field of the piece
 * ('zones.0.image', 'chestImage'), a picture of the request by its id or a URL, in place of the stock photo the AI
 * Builder put there; a path the piece hasn't got throws with the ones it has, and the piece is removed. Returns the
 * item's id. Throws `no AI Builder piece "<id>"` for one that isn't ready.
 */
declare function gsAIBuilder(slideId: string, pieceId: string, rect: GsRect, options?: { config?: Record<string, unknown>; goTo?: string | 'nextPage' | 'previousPage' | 'firstPage' | 'lastPage' | 'back'; sounds?: Record<string, string | { audio: string; volume?: number }>; images?: Record<string, string> }): Promise<string>;

// ---------- The genially ----------

/**
 * The genially's name. Until a deck sets it, the name follows the cover's text and joins its lines without a space
 * ("El misterio delciclo del agua"): set it in the cover's function.
 */
declare function gsRename(name: string): Promise<number>;

// ---------- geniallyAPI: the part a deck may call ----------

interface GsItemInfo {
  id: string;
  slideId: string;
  type: string;
  name: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  rotation: number;
  opacity: number;
  visible: boolean;
}
interface GsSlideInfo { id: string; index: number; name: string; isPopup: boolean; isHidden: boolean }

interface GsGeniallyAPI {
  getGeniallySize(): { width: number; height: number; isMobile: boolean };
  /**
   * Mobile only: the page scrolls down to `height` (its whole length, at least the canvas height); null removes the
   * scroll. Lay the page out down to that height.
   */
  setSlideOverflowHeight(slideId: string, height: number | null): boolean;
  /** Slides and windows, in order. A deck finds its link targets here, by name. */
  getSlides(): GsSlideInfo[];
  /** Position and real size of an item (a native button's final width, for instance). null if there is none. */
  getItem(itemId: string): GsItemInfo | null;
  /** Painted size of a text. Wait a frame after creating or changing it (two requestAnimationFrame) before measuring. */
  measureText(itemId: string): { width: number; height: number; source: 'rendered' | 'estimated' } | null;
  updateItemPosition(itemId: string, x: number, y: number): boolean;
  updateItemLayout(itemId: string, changes: { position?: { x: number; y: number }; size?: { width: number; height: number }; rotation?: number | null; opacity?: number | null }): unknown;
  /** 0 to 1. */
  updateItemOpacity(itemId: string, opacity: number): boolean;
  updateItemRotation(itemId: string, degrees: number): boolean;
  /** 'in' for an entrance, 'continuous' for a looping one (pulsate-bck, float-vert, heartbeat). */
  setItemAnimation(itemId: string, type: 'in' | 'continuous', effect: GsEffect, duration?: GsSpeed, delaySeconds?: number): boolean;
  /**
   * A shape and the text on it that must act as one (a station on a map): group them and link the group. Grouping
   * clears the children's animations: animate the group's id, after grouping.
   */
  groupItems(itemIds: string[]): string;
  reorderItem(itemId: string, order: 'front' | 'forward' | 'backwards' | 'back'): boolean;
  /**
   * Colours and fonts of a native question, merged with what it has, e.g.
   * { general: { BackgroundColor, ShowBackground: true }, question: { FontColor, FontFamily: { Name } },
   *   button: { ButtonColor, FontColor } }. A section the question type doesn't have throws.
   */
  updateActivityAppearance(itemId: string, appearance: { general?: Record<string, unknown>; question?: Record<string, unknown>; answer?: Record<string, unknown>; button?: Record<string, unknown>; feedback?: Record<string, unknown>; timer?: Record<string, unknown>; instructions?: Record<string, unknown>; result?: Record<string, unknown>; text?: Record<string, unknown> }): boolean;
}

// ---------- The deck itself ----------

/** What a deck defines: window.AG. */
interface GsDeck {
  /** Builds the slides named (all of them when names is left out), then links them; the contract fixes its log. */
  run(names?: string[]): Promise<void>;
}

interface Window {
  geniallyAPI: GsGeniallyAPI;
  /** Image id → URL of the ready images of the asset request, filled before the deck runs. The deck names ids (L.P). */
  __imgs: Record<string, string>;
  /** Audio id → URL of the ready audios (sound effects, music, voiceovers) of the asset request (gsAudio, gsSound). */
  __audios: Record<string, string>;
  /** Video id → the team AI video of the ready videos of the asset request, which gsVideo inserts. */
  __videos: Record<string, string>;
  /** Piece id → the published widget path of the ready AI Builder pieces of the asset request (gsAIBuilder). */
  __aibuilder: Record<string, string>;
  __deckLog: string[];
  AG: GsDeck;
}
