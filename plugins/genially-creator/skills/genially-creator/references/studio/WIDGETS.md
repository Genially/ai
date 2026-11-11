# Components (gsWidget)

Generated, do not edit. Every component of the editor's Components panel, by category, then the config fields of each one under its key. Read only the sections of the components you use.

A component keeps the proportions of its default content, and what doesn't fit is cut inside it with no error: more list items, sections, players or cards than the default, a longer text or a bigger keypad came out clipped (seen in list, accordion, extendablePanels, wordSorter, letterBoard, calculator, scoreboard, calendar, rating, bubbleMap, grid, gradient, rotaryBanner). Give it about as much content as its default, or room for more, and look at every one in the preview's screenshot.

- compositions: list (Interactive Section List), grid (Concept Cards), extendablePanels (Elastic Responsive Accordion Cards), retroBlock (Aesthetic Card Composer), minimalBlock (Aesthetic Card Composer), darkBlock (Aesthetic Card Composer), multipageBlock (Blog Slider), rotaryBanner (Infinite Marquee & Slider), dynamicTimeline (Horizontal Narrative Timeline), gradientBackground (Abstract Background Generator), holographicCard (Holographic Card), cardCarousel (Interactive Product Cards), accordion (Modern Accordion with Dividers), loupeGallery (Interactive Portfolio Grid), parallaxGrid (Interactive Destination Grid), folders (Filing Cabinet), progressBoard (Progress Tracker & Modules)
- galleries: carousels, mosaics, comparisons, slidingCarousel (Interactive Asymmetric Carousel), roundCarousel (3D Round Carousel), mask (Image Mask Tool), unpixelator (Image Depixelator), mobileMockup (Automatic Image Viewer), computerMockup (Automatic Image Viewer), imageTrail (Hidden Image Explosion & Custom Cursor)
- activities: findThePair, puzzle (Image Jigsaw Puzzle Widget), wordSearch (Word Search Puzzle), wordSorter (Word Classifier), mathOperations (Math Challenge Widget), hangmanGame (Hangman Game Widget), letterBoard (Hangman Game), wordle (Customizable wordle), wordWheel (Customizable Alphabet Game), revealAnswers (Flashcards), matchConcepts (Match concepts), arrangeInOrder (Arrange in order), spotTheDifference (Spot the Differences with Timer), simonSays (Simon Says Game Widget), secretCode (Access Code Input), swipeAndScore (Swipe and hit), locateInImage (Locate in image)
- timeAndNavigation: timer, stopwatch, countdownToDate (no config), progressBar, navigationMenu
- tools: calculator (Advanced Calculator), qrGenerator (QR Code Generator), scoreboard (Score Counter Widget), calendar (Interactive Monthly Calendar), rating (Rating), noteWall (Interactive Sticky Notes Board), postIt (Interactive Sticky Note)
- textsWithEffect: typewriter (Text Reveal), roller (Pro Text Animations), circularShape (Custom Shaped Text), wavyShape (Custom Shaped Text), gradient (Animated Gradient Text), wordCloud (Interactive Word Cloud), dialog (Speech Bubble Generator), cloudDialog (Speech Bubble Generator)
- games: dice (no config), coin (no config), randomize (no config), wheel (Interactive Roulette), magicBall (Magic 8-Ball Widget), pinata (Interactive Piñata), scratchAndWin (Scratch and Win), bingo (Interactive Bingo)
- chartsAndData: guidePyramid (Hierarchical Pyramid), fluidPercentage (Percentage Fill Widget), bubbleMap (Animated Blob Chart), radarChart (Dynamic Orbital Mind Map), hamburgerChart (Interactive Sandwich Diagram)

## list

### Interactive Section List (@saruman/interactiveSectionList)

- sectionTitle: textInput (Title); default "Secciones del Proyecto"
- articles: list (Section)
- articles[].title: textInput (Title); default "Nombre de la Sección"
- articles[].description: textArea (Description); default "Una breve descripción del contenido o los objetivos de esta sección específica."
- articles[].image: image (Image)
- articles[].action: action (Click action); optional
- imagePosition: 'left' | 'right' (Image position); default "left"
- highlightColor: colorInput (Highlight color); default "#F5F5F5"
- highlightBarColor: colorInput (Highlight bar color); default "#121212"
- mainTitleFont: fontFamily (Main title font); default "Unbounded"
- mainTitleFontSize: textInput (Main title font size (px)); default "32"
- mainTitleColor: colorInput (Main title color); default "#121212"
- sectionTitleFont: fontFamily (Section titles font); default "Unbounded"
- sectionTitleFontSize: textInput (Section titles font size (px)); default "22"
- sectionTitleColor: colorInput (Section titles color); default "#121212"
- sectionTitleHoverColor: colorInput (Section titles hover color); default "#000000"
- descriptionFont: fontFamily (Descriptions font); default "DM Sans"
- descriptionFontSize: textInput (Descriptions font size (px)); default "16"
- descriptionColor: colorInput (Descriptions color); default "#404040"
- descriptionHoverColor: colorInput (Descriptions hover color); default "#121212"

## grid

### Concept Cards (@saruman/bentoBox)

- cards: list (Card)
- cards[].cardNumber: textInput (Identifier); default "01"
- cards[].cardTitle: textInput (Title); default "Concept Title"
- cards[].cardDescription: textArea (Description); default "Short description of the concept."
- cards[].glowStart: colorInput (Glow Color 1); default "#6C29FF"
- cards[].glowEnd: colorInput (Glow Color 2); default "#F73C69"
- cards[].action: action (Click Action); optional
- titleFont: fontFamily (Title Font); default "Unbounded"
- titleColor: colorInput (Title color); default "#ffffff"
- identifierFont: fontFamily (Identifier Font); default "Unbounded"
- bodyFont: fontFamily (Description Font); default "DM Sans"
- bodyColor: colorInput (Description color); default "#d1d5db"
- lightMode: 'dark' | 'light' (Display mode); default "dark"
- bgStart: colorInput (Gradient Background Color 1); default "#111827", only when lightMode == "dark"
- bgMiddle: colorInput (Gradient Background Color 2); default "#581c87", only when lightMode == "dark"
- bgEnd: colorInput (Gradient Background Color 3); default "#000000", only when lightMode == "dark"

## extendablePanels

### Elastic Responsive Accordion Cards (@saruman/extendablePanels)

- cards: list (Cards); min 1, max 8
- cards[].image: image (Card Image)
- cards[].title: textInput (Title); default "Card Title", up to 40 characters
- cards[].description: textInput (Description); default "Short card description goes here.", up to 100 characters
- cards[].onClickAction: action (Click Action); optional
- widgetHeight: textInput (Widget Height); default "400px"
- titleFont: fontFamily (Title Font); default "Arial"
- descFont: fontFamily (Description Font); default "Arial"

## retroBlock

### Aesthetic Card Composer (@saruman/cardComposition)

- cardList: list (Composition); min 1, max 10
- cardList[].title: textInput (Title); default "Título de la Tarjeta"
- cardList[].body: textArea (Body Text); default "Descripción detallada del contenido de la tarjeta."
- cardList[].image: image (Image)
- cardList[].buttonText: textInput (Button Text); default "Ver más"
- cardList[].buttonAction: action (Button Action); optional
- hoverBtnEffect: 'scale' | 'shadow' | 'color' (Button Hover Effect); default "scale"
- hoverImgEffect: 'zoom' | 'grayscale' | 'perspective' (Image Hover Effect); default "zoom"
- globalLayout: 'vertical' | 'horizontal' | 'centered' | 'overlaid' (Layout Composition); default "vertical"
- globalStyle: 'minimalist' | 'glassmorphism' | 'brutalist' | 'retro' | 'dark' | '3d' (Aesthetic Style); default "minimalist"
- titleFont: fontFamily (Title Font); default "Montserrat"
- bodyFont: fontFamily (Body Font); default "Open Sans"
- bgColor: colorInput (Background Color (Container)); default "#ffffff"
- accentColor: colorInput (Accent Color); default "#8b7355"
- titleColor: colorInput (Title Color); default "#333333"
- bodyColor: colorInput (Text Color); default "#333333"
- btnColor: colorInput (Button Color); default "#000000"
- btnTextColor: colorInput (Button Text Color); default "#ffffff"
- navBgColor: colorInput (Navigation Button Color); default "#ffffff"
- navIconColor: colorInput (Navigation Icon Color); default "#333333"

## minimalBlock

### Aesthetic Card Composer (@saruman/cardComposition)

- cardList: list (Composition); min 1, max 10
- cardList[].title: textInput (Title); default "Título de la Tarjeta"
- cardList[].body: textArea (Body Text); default "Descripción detallada del contenido de la tarjeta."
- cardList[].image: image (Image)
- cardList[].buttonText: textInput (Button Text); default "Ver más"
- cardList[].buttonAction: action (Button Action); optional
- hoverBtnEffect: 'scale' | 'shadow' | 'color' (Button Hover Effect); default "scale"
- hoverImgEffect: 'zoom' | 'grayscale' | 'perspective' (Image Hover Effect); default "zoom"
- globalLayout: 'vertical' | 'horizontal' | 'centered' | 'overlaid' (Layout Composition); default "vertical"
- globalStyle: 'minimalist' | 'glassmorphism' | 'brutalist' | 'retro' | 'dark' | '3d' (Aesthetic Style); default "minimalist"
- titleFont: fontFamily (Title Font); default "Montserrat"
- bodyFont: fontFamily (Body Font); default "Open Sans"
- bgColor: colorInput (Background Color (Container)); default "#ffffff"
- accentColor: colorInput (Accent Color); default "#8b7355"
- titleColor: colorInput (Title Color); default "#333333"
- bodyColor: colorInput (Text Color); default "#333333"
- btnColor: colorInput (Button Color); default "#000000"
- btnTextColor: colorInput (Button Text Color); default "#ffffff"
- navBgColor: colorInput (Navigation Button Color); default "#ffffff"
- navIconColor: colorInput (Navigation Icon Color); default "#333333"

## darkBlock

### Aesthetic Card Composer (@saruman/cardComposition)

- cardList: list (Composition); min 1, max 10
- cardList[].title: textInput (Title); default "Título de la Tarjeta"
- cardList[].body: textArea (Body Text); default "Descripción detallada del contenido de la tarjeta."
- cardList[].image: image (Image)
- cardList[].buttonText: textInput (Button Text); default "Ver más"
- cardList[].buttonAction: action (Button Action); optional
- hoverBtnEffect: 'scale' | 'shadow' | 'color' (Button Hover Effect); default "scale"
- hoverImgEffect: 'zoom' | 'grayscale' | 'perspective' (Image Hover Effect); default "zoom"
- globalLayout: 'vertical' | 'horizontal' | 'centered' | 'overlaid' (Layout Composition); default "vertical"
- globalStyle: 'minimalist' | 'glassmorphism' | 'brutalist' | 'retro' | 'dark' | '3d' (Aesthetic Style); default "minimalist"
- titleFont: fontFamily (Title Font); default "Montserrat"
- bodyFont: fontFamily (Body Font); default "Open Sans"
- bgColor: colorInput (Background Color (Container)); default "#ffffff"
- accentColor: colorInput (Accent Color); default "#8b7355"
- titleColor: colorInput (Title Color); default "#333333"
- bodyColor: colorInput (Text Color); default "#333333"
- btnColor: colorInput (Button Color); default "#000000"
- btnTextColor: colorInput (Button Text Color); default "#ffffff"
- navBgColor: colorInput (Navigation Button Color); default "#ffffff"
- navIconColor: colorInput (Navigation Icon Color); default "#333333"

## multipageBlock

The local editor's Components panel had none (gsWidget threw "variant 0; it has 0").

### Blog Slider (@saruman/blogSlider)

- slides: list (Slide)
- slides[].image: image (Image)
- slides[].subtitle: textInput (Subtitle); default "26 December 2024"
- slides[].title: textInput (Title); default "New Article"
- slides[].description: textArea (Description); default "Write a brief summary of your blog post here to engage your readers."
- slides[].buttonLabel: textInput (Button Text); default "READ MORE"
- slides[].buttonAction: action (Button Action); optional
- titleColor: colorInput (Title Color); default "#0d0925"
- titleFont: fontFamily (Title Font); default "Fira Sans"
- subtitleColor: colorInput (Subtitle Color); default "#7b7992"
- descriptionColor: colorInput (Description Color); default "#4e4a67"
- subtitleDescriptionFont: fontFamily (Subtitle and Description Font); default "Fira Sans"
- buttonBgColor: colorInput (Button Fill Color); default "#fd3838"
- buttonTextColor: colorInput (Button Text Color); default "#ffffff"
- buttonFont: fontFamily (Button Font); default "Fira Sans"
- imageMask: switch (Gradient color on image); default true
- imageColor1: colorInput (Image Gradient Color 1); default "#fe8a39", only when imageMask != false
- imageColor2: colorInput (Image Gradient Color 2); default "#fd6038", only when imageMask != false
- imageColor3: colorInput (Image Gradient Color 3); default "#fd3838", only when imageMask != false
- gradientBackground: switch (Gradient background color); default true
- backgroundColorStart: colorInput (Background Gradient Start); default "#FFE53B", only when gradientBackground != false
- primaryColor: colorInput (Primary Gradient Color); default "#fe8a39", only when gradientBackground != false
- secondaryColor: colorInput (Secondary Gradient Color); default "#fd3838", only when gradientBackground != false
- cardBackgroundColor: colorInput (Slide Background Color); default "#ffffff"
- activePaginationColor: colorInput (Current Slide Color); default "#fd3838"
- inactivePaginationColor: colorInput (Inactive Slide Color); default "#062744"

## rotaryBanner

### Infinite Marquee & Slider (@saruman/marquee-slider)

- items: list (Content Items); min 1, max 20
- items[].type: 'text' | 'image' (Item Type); default "text"
- items[].textContent: textInput (Text); default "Your message here"
- items[].imageContent: image (Image); optional
- items[].itemAction: action (Click Action); optional
- backgroundColor: colorInput (Background Color); default "#ffffff"
- textColor: colorInput (Text Color); default "#1a1a1a"
- fontFamily: fontFamily (Font); default "Montserrat"
- fontSize: textInput (Font Size (px)); default "24"
- itemSpacing: textInput (Spacing between items (px)); default "30"
- endMargin: textInput (End-of-sequence margin (px)); default "0"
- speed: textInput (Auto Speed / Duration); default "10"
- direction: 'forward' | 'backward' (Movement Direction); default "forward"
- pauseOnHover: switch (Pause on Hover); default true

## dynamicTimeline

### Horizontal Narrative Timeline (@saruman/sliding-timeline)

- timelineEntries: list (Timeline Event); min 1, max 10
- timelineEntries[].date: textInput (Date / Year); default "YEAR"
- timelineEntries[].image: image (Card Image)
- timelineEntries[].imageFit: switch (Fit image); default false, optional
- timelineEntries[].description: textInput (Short Description); default "Brief description of the event."
- timelineEntries[].cardBackgroundColor: colorInput (Card Background Color); default "#FFFFFF"
- timelineEntries[].cardTextColor: colorInput (Card Text Color); default "#121212"
- timelineEntries[].action: action (Click Action); optional
- mainTitle: textInput (Main Title); default "HISTORICAL JOURNEY"
- headerFont: fontFamily (Title Font); default "Unbounded"
- subtitle: textArea (Subtitle)
- bodyFont: fontFamily (Body Font); default "DM Sans"
- accentColor: colorInput (Accent Color); default "#6C29FF"
- backgroundColor: colorInput (Background Color); default "#FFFFFF"
- titleColor: colorInput (Title Color); default "#121212"
- textColor: colorInput (Text Color); default "#121212"

## gradientBackground

### Abstract Background Generator (@saruman/gradientBackground)

- gradientType: 'linear' | 'radial' | 'mesh' | 'aurora' (Gradient Type); default "mesh"
- colorStops: list (Gradient Colors); min 2, max 6
- colorStops[].color: colorInput (Color Stop); default "#6C29FF"
- patternSize: 'small' | 'medium' | 'large' (Pattern Size); default "medium"
- motionStyle: 'none' | 'flow' | 'breathing' | 'wave' | 'current' | 'aurora' (Motion Style); default "flow"
- animationSpeed: 'slow' | 'medium' | 'fast' (Animation Speed); default "medium"
- pointerReaction: 'soft' | 'medium' | 'strong' (Pointer Reaction); default "medium"
- specialPointerEnabled: switch (Special Pointer); default false
- specialPointerColor: colorInput (Special Pointer Color); default "#ffffff", only when specialPointerEnabled
- noiseToggle: 'true' | 'false' (Enable Texture); default "true"
- noiseIntensity: textInput (Grain Intensity (%)); default "20", only when noiseToggle == "true"

## holographicCard

Left out, forefrontImage keeps its own icon (a banana emoji) and the background a violet overlay: give it an icon of the request, and the overlay a colour of the genially. Portrait at 320 wide it cut its button off; square at about 350 it fitted.

### Holographic Card (@saruman/holographicCard)

- cardText: textInput (Title); default "HOLO CARD FRONT", up to 50 characters
- descriptionFront: textArea (Description); default "Haz clic para girar y descubrir el reverso."
- backgroundImage: image (Background Image); optional
- showButtonFront: switch (Show button); default true
- buttonTextFront: textInput (Button Text); default "VER MÁS", only when showButtonFront
- hasBack: switch (Convert to flipcard); default true
- titleBack: textInput (Title); default "SURPRISE CONTENT", up to 50 characters, only when hasBack
- descriptionBack: textArea (Description); only when hasBack
- backgroundImageBack: image (Background Image); optional, only when hasBack
- showButtonBack: switch (Show button); default true, only when hasBack
- buttonTextBack: textInput (Button Text); default "SABER MÁS", only when hasBack && showButtonBack
- buttonActionFront: action (Front Button Action); optional
- buttonActionBack: action (Back Button Action); optional
- cardShape: 'vertical' | 'horizontal' | 'square' (Style); default "vertical"
- borderRadius: textInput (Corner Radius (px)); default "16"
- showHoverEffect: switch (Show holographic effect); default true
- fontFamily: fontFamily (Title Font); default "Unbounded"
- titleColorFront: colorInput (Title Font Color); default "#121212"
- titleFontSizeFront: textInput (Title Size (pt)); default "28"
- fontFamilyBody: fontFamily (Description Font); default "DM Sans"
- bodyColorFront: colorInput (Description Font Color); default "#121212"
- bodyFontSizeFront: textInput (Description Size (pt)); default "16"
- overlayColorFront: colorInput (Overlay Color); default "#FFFFFF"
- overlayOpacityFront: textInput (Overlay Opacity (%)); default "20"
- forefrontImage: image (Icon); optional
- fontFamilyButtonFront: fontFamily (Button Font); default "DM Sans", only when showButtonFront
- buttonFontSizeFront: textInput (Button Size (pt)); default "16", only when showButtonFront
- buttonColorFront: colorInput (Button Color); default "#6C29FF", only when showButtonFront
- buttonTextColorFront: colorInput (Button Text Color); default "#FFFFFF", only when showButtonFront
- buttonBorderRadiusFront: textInput (Button Corner Radius); default "12", only when showButtonFront
- fontFamilyBack: fontFamily (Title Font); default "Unbounded"
- titleColorBack: colorInput (Title Font Color); default "#121212"
- titleFontSizeBack: textInput (Title Size (pt)); default "28"
- fontFamilyBodyBack: fontFamily (Description Font); default "DM Sans"
- bodyColorBack: colorInput (Description Font Color); default "#121212"
- bodyFontSizeBack: textInput (Description Size (pt)); default "16"
- overlayColorBack: colorInput (Overlay Color); default "#FFFFFF"
- overlayOpacityBack: textInput (Overlay Opacity (%)); default "20"
- forefrontImageBack: image (Icon); optional
- fontFamilyButtonBack: fontFamily (Button Font); default "DM Sans", only when showButtonBack
- buttonFontSizeBack: textInput (Button Size (pt)); default "16", only when showButtonBack
- buttonColorBack: colorInput (Button Color); default "#6C29FF", only when showButtonBack
- buttonTextColorBack: colorInput (Button Text Color); default "#FFFFFF", only when showButtonBack
- buttonBorderRadiusBack: textInput (Button Corner Radius); default "12", only when showButtonBack
- showFlipIcon: switch (Show icon); default true, only when hasBack
- flipIconColor: colorInput (Icon fill color); default "#121212", only when hasBack && showFlipIcon
- flipIconPosition: 'top-left' | 'top-right' | 'top-center' | 'bottom-left' | 'bottom-right' | 'bottom-center' (Position); default "bottom-right", only when hasBack && showFlipIcon

## cardCarousel

At 720 wide its texts covered the posters and it ran off the right edge (displayMode compact did not help): give it the full width of the slide, or draw the cards. Its "ANTERIOR / SIGUIENTE" are fixed in Spanish.

### Interactive Product Cards (@saruman/coloredCardCarousel)

- productList: list (Card List); min 1, max 10
- productList[].poster: image (Image); optional
- productList[].collection: textInput (Highlighted text); default "Exclusive Edition"
- productList[].title: textInput (Title); default "Modern Product"
- productList[].price: textInput (Subtitle); default "Starting at $99"
- productList[].buttonText: textInput (Button text); default "View more"
- productList[].bgColorStart: colorInput (Gradient Start Color); default "#ffffff", optional, only when displayMode != "compact"
- productList[].bgColorEnd: colorInput (Gradient End Color); default "#eeeeee", optional, only when displayMode != "compact"
- productList[].clickAction: action (Click Action); optional
- prevButtonText: textInput (Previous button text); default "Previous"
- nextButtonText: textInput (Next button text); default "Next"
- displayMode: 'expanded' | 'compact' (Display mode); default "expanded"
- showNavButtons: switch (Show navigation buttons); default true
- titleFontFamily: fontFamily (Title font); default "Unbounded"
- titleTextColor: colorInput (Titles color); default "#121212", optional
- titleAlignment: 'left' | 'center' | 'right' (Title alignment); default "left"
- subtitleFontFamily: fontFamily (Subtitle font); default "DM Sans"
- priceColor: colorInput (Subtitle color); default "#F73C69", optional
- subtitleAlignment: 'left' | 'center' | 'right' (Subtitle alignment); default "left"
- collectionFontFamily: fontFamily (Highlighted text font); default "DM Sans"
- collectionTextColor: colorInput (Highlighted text color); default "#6C29FF", optional
- collectionAlignment: 'left' | 'center' | 'right' (Highlighted text alignment); default "left"
- buttonFontFamily: fontFamily (Button font); default "Unbounded"
- buttonFontColor: colorInput (Button font color); default "#ffffff", optional
- buttonActiveColor: colorInput (Active button color); default "#6C29FF", optional
- buttonInactiveColor: colorInput (Inactive button color); default "#121212", optional, only when displayMode != "compact"
- navButtonFontFamily: fontFamily (Navigation button font); default "Unbounded", only when showNavButtons && displayMode != "expanded"
- navButtonFontColor: colorInput (Navigation button font color); default "#121212", optional, only when showNavButtons && displayMode != "expanded"
- navButtonLineColor: colorInput (Navigation button line color); default "#D1D1D1", optional, only when showNavButtons

## accordion

### Modern Accordion with Dividers (@saruman/accordion)

- sections: list (Section); min 2, max 12
- sections[].questionText: textInput (Title); default "Título de la sección"
- sections[].sectionIcon: image (Icon); optional
- sections[].explanation: textArea (Description); default "Escribe aquí el contenido detallado que se mostrará al desplegar la sección."
- sections[].action: action (Action on click); optional
- expansionMode: switch (Expand all at once); default false
- textAlignment: 'left' | 'center' | 'right' (Alignment); default "left"
- showSectionIcons: switch (Show Section Icons); default true
- sectionBgColor: colorInput (Section Background Color); default "transparent"
- hoverColor: colorInput (Hover Background Color); default "#F8FAFC"
- headerFont: fontFamily (Title Font); default "Unbounded"
- headerFontSize: textInput (Title Font Size (px)); default "24"
- headerTextColor: colorInput (Title Font Color); default "#121212"
- contentFont: fontFamily (Description Font); default "DM Sans"
- contentFontSize: textInput (Description Font Size (px)); default "16"
- contentTextColor: colorInput (Description Font Color); default "#4B4B4B"
- dividerColor: colorInput (Divider Color); default "#E2E8F0"
- dividerThickness: textInput (Divider Thickness (px)); default "1"
- verticalMargin: textInput (Vertical Margin (px)); default "24"
- horizontalMargin: textInput (Horizontal Margin (px)); default "0"
- showChevron: switch (Show Arrow Icon); default true
- chevronColor: colorInput (Arrow Color); default "#6C29FF", only when showChevron

## loupeGallery

### Interactive Portfolio Grid (@saruman/lensGallery)

- project_items: list (Item)
- project_items[].title: textInput (Title); default "Project Name"
- project_items[].description: textArea (Description (visible on hover)); default ""
- project_items[].image_url: image (Image)
- project_items[].clickAction: action (Click Interaction); optional
- columns_desktop: '2' | '3' | '4' (Number of Columns); default "3"
- item_border_radius: textInput (Item Radius (px)); default "8"
- item_fill_color: colorInput (Item Fill Color); default "#1E1E1E"
- accent_color: colorInput (Accent Color); default "#6C29FF"
- image_overlay_enabled: switch (Add Overlay on Image); default false
- image_overlay_opacity: numberInput (Opacity (%)); default 40, min 0, max 100, only when image_overlay_enabled
- image_overlay_color: colorInput (Overlay Color); default "#000000", only when image_overlay_enabled
- dark_bg_color: colorInput (Background Color); default "#121212"
- circle_radius: textInput (Hover Circle Radius (px)); default "150"
- transition_speed: textInput (Transition Speed (ms)); default "250"
- titleFontFamily: fontFamily (Title Font); default "Unbounded"
- title_color: colorInput (Titles Color); default "#FFFFFF"
- masked_text_color: colorInput (Titles Color (Hover)); default "#FFFFFF"
- bodyFontFamily: fontFamily (Description Font); default "DM Sans"
- description_color: colorInput (Descriptions Color (Hover)); default "#E5E5E5"

## parallaxGrid

At 708 wide it showed one huge card with a scroll: give it the full width of the slide, or draw the cards.

### Interactive Destination Grid (@saruman/parallaxGrid)

- cardList: list (Destinations); min 1, max 32
- cardList[].cityName: textInput (City Name); default "Barcelona"
- cardList[].cardDescription: textArea (Description); default "Descubre este destino."
- cardList[].cardImage: image (Background Image)
- cardList[].clickAction: action (Interactivity); optional
- columnsCount: '1' | '2' | '3' | '4' (Number of Columns); default "4"
- cardOrientation: 'vertical' | 'horizontal' (Card Orientation); default "vertical"
- cardBorderRadius: textInput (Card Border Radius (px)); default "16"
- cardShadow: switch (Card Shadow); default true
- parallaxIntensity: textInput (Parallax Intensity); default "100"
- overlayColor: colorInput (Hover Overlay Color); default "#EB7498", optional
- backgroundColor: colorInput (Grid Background Color); default "#304056", optional
- textPosition: 'top' | 'center' | 'bottom' (Position); default "bottom"
- textAlign: 'left' | 'right' | 'center' (Alignment); default "left"
- titleFontFamily: fontFamily (Title Font); default "Unbounded"
- titleFontSize: textInput (Title Font Size (px)); default "24"
- titleColor: colorInput (Title Color); default "#FFFFFF", optional
- titleHoverColor: colorInput (Title Hover Color); default "#EB7498", optional
- titleShowOnHover: switch (Show Only on Hover); default false
- bodyFontFamily: fontFamily (Body Font); default "DM Sans"
- descriptionFontSize: textInput (Description Font Size (px)); default "14"
- descriptionColor: colorInput (Description Color); default "#E5E5E5", optional
- descriptionHoverColor: colorInput (Description Hover Color); default "#FFFFFF", optional
- descriptionShowOnHover: switch (Show Only on Hover); default true

## folders

### Filing Cabinet (@saruman/filingCabinet)

- folders: list (Folder); min 2, max 6
- folders[].title: textInput (Title); default "Nueva carpeta"
- folders[].layout: 'stacked' | 'imageLeft' | 'imageRight' (Layout); default "stacked"
- folders[].prefix: textInput (Tab indicator); default ""
- folders[].tabOffset: numberInput (Tab position (%)); default 0, min 0, max 40
- folders[].text: textArea (Description); default "Escribe aquí la descripción de la carpeta."
- folders[].image: image (Image); optional
- folders[].ctaText: textInput (Button text); default ""
- folders[].ctaAction: action (Button click interactivity); optional
- onOpenAction: action (Add interactivity when a folder is opened); optional
- allOpenedAction: action (Add interactivity when all folders are opened); optional
- borderWidth: numberInput (Border thickness (px)); default 1, min 0, max 8
- activeBgColor: colorInput (Background color); default "#f4f0e8"
- activeBorderColor: colorInput (Border color); default "#2f2a24"
- tabColor: colorInput (Background color); default "#ffffff"
- borderColor: colorInput (Border color); default "#dcd7cf"
- titleFontActive: fontFamily (Titles); default "Poppins"
- activeTitleColor: colorInput (Titles color); default "#2f2a24"
- indicatorFontActive: fontFamily (Indicators); default "Poppins"
- activeIndicatorColor: colorInput (Indicators color); default "#b07d2b"
- descFontActive: fontFamily (Descriptions); default "Inter"
- activeDescColor: colorInput (Descriptions color); default "#1c1b19"
- titleFontInactive: fontFamily (Titles); default "Poppins"
- titleColor: colorInput (Titles color); default "#1c1b19"
- indicatorFontInactive: fontFamily (Indicators); default "Poppins"
- indicatorColor: colorInput (Indicators color); default "#6f6b64"
- btnFont: fontFamily (Buttons font); default "Poppins"
- btnBgColor: colorInput (Button fill color); default "#2f2a24"
- btnTextColor: colorInput (Button text color); default "#ffffff"

## progressBoard

Its "REINICIAR" is fixed in Spanish. With three cards the third was cut at the right.

### Progress Tracker & Modules (@saruman/progressModules)

- progressLabel: textInput (Progress Bar Title); default "ESTADO DEL PROGRESO"
- gridCards: list (Modules); min 1, max 12
- gridCards[].cardNumber: textInput (Number); default "01", up to 3 characters
- gridCards[].showCardImage: 'show' | 'hide' (Show Image); default "show"
- gridCards[].cardImage: image (Module Image); optional
- gridCards[].cardOverlayColor: colorInput (Fill Color); default "#000000"
- gridCards[].cardOverlayOpacity: textInput (Opacity (%)); default "30"
- gridCards[].cardTitle: textInput (Title); default "TÍTULO DEL MÓDULO"
- gridCards[].cardDescription: textArea (Description); default "Escribe aquí la descripción de este módulo."
- gridCards[].cardAction: action (Card Action); optional
- resetButtonText: textInput (Reset button text); default "Reset"
- completedLabel: textInput (Completed message); default "COMPLETED!"
- incompleteLabel: textInput (Incomplete message); default "INCOMPLETE!"
- onCompletedAction: action (Action when all modules are marked); optional
- moduleStructure: 'above' | 'below' | 'center' (Text Location); default "below"
- textAlignment: 'left' | 'center' | 'right' (Text Alignment); default "left"
- layout: 'horizontal' | 'vertical' | 'grid' (General Layout); default "grid"
- borderRadius: textInput (Module Corner Radius (px)); default "16"
- numberFont: fontFamily (Numbers Font); default "Unbounded"
- numberTextColor: colorInput (Number Color); default "#6C29FF"
- titleFont: fontFamily (Titles Font); default "Unbounded"
- titleTextColor: colorInput (Title Color); default "#121212"
- descriptionFont: fontFamily (Descriptions Font); default "DM Sans"
- descriptionTextColor: colorInput (Description Color); default "#121212"
- statusLabelFont: fontFamily (Title Font); default "DM Sans"
- statusLabelSize: numberInput (Title Size (px)); default 16, min 8, max 100
- statusLabelTextColor: colorInput (Title Color); default "#121212"
- showResetButton: switch (Show Reset Button); default true
- resetButtonFillColor: colorInput (Reset Button Fill Color); default "#6C29FF", only when showResetButton
- resetButtonTextColor: colorInput (Reset Button Text Color); default "#FFFFFF", only when showResetButton
- barFillColor: colorInput (Bar Fill Color); default "#6C29FF"
- barBgColor: colorInput (Bar Background Color); default "#E0E0E0"
- barHeight: textInput (Bar Thickness (px)); default "12"
- barRadius: numberInput (Bar Corner Radius (px)); default 20, min 0, max 100

## carousels

### @genially/gallery (@genially/gallery)

- slideList: list; min 3, max 30
- slideList[].image: image
- slideList[].title: textInput; default ""
- galleryType: 'slider3d' | 'slider3dMobile' | 'thumbnailDesktopVertical' | 'thumbnailMobileHorizontal' | 'singleSliderDesktopHorizontal' | 'singleSliderMobileHorizontal' | 'reelSliderDesktopHorizontal' | 'reelSliderMobileHorizontal'; default "slider3d"
- showControls: switch; default true
- autoplay: switch; default false
- fit: switch; default false, only when $withFitOption
- showAlternativeTextButton: switch; default false

## mosaics

### @genially/mosaic (@genially/mosaic)

- slideList: list; min 4, max 4
- slideList[].image: image
- slideList[].title: textInput; default ""
- mosaicType: 'gridStaticDesktop' | 'gridStaticMobile' | 'gridFluidDesktop' | 'gridFluidMobile'; default "gridStaticDesktop"
- showAlternativeTextButton: switch; default false

## comparisons

### @genially/juxtapose (@genially/juxtapose)

- slideList: list; min 2, max 2
- slideList[].image: image
- slideList[].title: textInput; default ""
- variant: 'horizontal' | 'vertical'; default "vertical"
- showAlternativeTextButton: switch; default false

## slidingCarousel

### Interactive Asymmetric Carousel (@saruman/imageSlider)

- gridItems: list (Media Items (Max 24)); min 1, max 24
- gridItems[].title: textInput (Item Title); default "Nuevo Medio"
- gridItems[].mediaType: 'image' | 'video' (Media Type); default "image"
- gridItems[].image: image (Image)
- gridItems[].videoUrl: textInput (Video URL); default ""
- gridItems[].clickAction: action (On Click Action); optional
- displacementIntensity: 'low' | 'medium' | 'high' (Displacement Intensity); default "medium"
- contractionScale: '1.0' | '0.75' | '0.5' (Contraction Animation); default "0.75"
- videoBehavior: switch (Play Videos on Hover); default false
- headerFont: fontFamily (Title Font); default "Unbounded"
- titleColor: colorInput (Title Color); default "#FFFFFF"
- gridBgColor: colorInput (Canvas Background Color); default "#FFFFFF"
- borderRadius: textInput (Corner Rounding (px)); default "16"
- asymmetryOffset: switch (Asymmetric Rows); default true
- useCustomCursor: switch (Custom Cursor); default true
- cursorImage: image (Cursor Image); optional, only when useCustomCursor
- cursorSize: textInput (Cursor Size (px)); default "32", only when useCustomCursor
- rotationSpeed: '30' | '20' | '10' (Rotation Speed); default "20"

## roundCarousel

### 3D Round Carousel (@saruman/roundCarousel)

- items: list (Image); min 4, max 12
- items[].image: image (Image); optional
- items[].title: textInput (Title (optional)); default ""
- items[].description: textArea (Text (optional)); default ""
- items[].action: action (Add action); optional
- items[].buttonText: textInput (Button text); default ""
- actionButtonText: textInput (Default button text); default "Learn more"
- autoRotate: switch (Auto-rotate); default true
- rotationSpeed: 'slow' | 'medium' | 'fast' (Rotation speed); default "medium", only when autoRotate
- rotationDirection: switch (Rotate to the right); default false, only when autoRotate
- dragEnabled: switch (Allow drag and scroll); default true
- showControls: switch (Show play/pause control); default true
- backgroundColor: colorInput (Widget background color); default "#0F172A"
- imageShape: 'horizontal' | 'square' | 'vertical' (Image shape); default "horizontal"
- imageFit: switch (Fit image); default true
- tilt: 'none' | 'soft' | 'strong' (Cylinder tilt); default "soft"
- cardRadius: numberInput (Card corner radius (px)); default 14, min 0, max 48
- cardShadow: switch (Card shadow); default true
- cardTitleFont: fontFamily (Title font); default "DM Sans"
- cardTitleColor: colorInput (Title color); default "#FFFFFF"
- cardTitleSize: numberInput (Title size (px)); default 16, min 12, max 48
- cardTitlePosition: 'bottom' | 'center' (Title position); default "bottom"
- overlayColor: colorInput (Overlay color); default "#000000"
- overlayOpacity: numberInput (Overlay opacity (%)); default 0, min 0, max 100
- modalBgColor: colorInput (Window background color); default "#FFFFFF"
- contentAlign: 'left' | 'center' | 'right' (Content alignment); default "left"
- titleFont: fontFamily (Title font); default "DM Sans"
- titleColor: colorInput (Title color); default "#0F172A"
- descFont: fontFamily (Description font); default "DM Sans"
- descColor: colorInput (Description color); default "#334155"
- buttonFont: fontFamily (Button font); default "DM Sans"
- buttonBgColor: colorInput (Button fill color); default "#4F46E5"
- buttonTextColor: colorInput (Button text color); default "#FFFFFF"
- controlBgColor: colorInput (Background color); default "#0F172A", only when showControls
- controlIconColor: colorInput (Icon color); default "#FFFFFF", only when showControls

## mask

### Image Mask Tool (@saruman/imageMask)

- imageSource: image (Image)
- imageFit: 'cover' | 'contain' (Image Fit); default "cover"
- maskShape: 'oval' | 'triangle' | 'trapezoid' | 'rhombus' | 'spiked-circle' | 'cloud' | 'hexagon' | 'heart' | 'star' | 'side-curved' | 'top-curved' | 'custom' (Mask Shape); default "heart"
- customPath: textArea (Custom SVG Path); up to 2000 characters, only when maskShape == "custom"
- showBorder: switch (Show Border); default false
- borderColor: colorInput (Border Color); default "#6C29FF", only when showBorder
- borderThickness: textInput (Border Thickness (px)); default "4", only when showBorder
- clickAction: action (Click Action); optional
- clickAnimation: 'none' | 'pulse' (Click Animation); default "none"

## unpixelator

### Image Depixelator (@saruman/depixelator)

- imageToDepixelate: image (Image to Depixelate)
- pixelSize: textInput (Pixel Size); default "50"
- depixelationMode: 'time' | 'clicks' (Depixelation Mode); default "time"
- timeDuration: textInput (Duration (seconds)); default "5", only when depixelationMode == "time"
- clickSteps: textInput (Number of Clicks); default "10", only when depixelationMode == "clicks"
- completionAction: action (Action on Completion); optional

## mobileMockup

### Automatic Image Viewer (@saruman/devices)

- deviceType: 'laptop' | 'smartphone' | 'tablet' | 'monitor' | 'tv' (Device Preset); default "laptop"
- viewAngle: 'frontal' | 'angled' (View Perspective); default "frontal"
- screenImage: image (Image)
- imageFit: 'cover' | 'contain' (Image Fit); default "cover"
- clickAction: action (Action on click); optional

## computerMockup

### Automatic Image Viewer (@saruman/devices)

- deviceType: 'laptop' | 'smartphone' | 'tablet' | 'monitor' | 'tv' (Device Preset); default "laptop"
- viewAngle: 'frontal' | 'angled' (View Perspective); default "frontal"
- screenImage: image (Image)
- imageFit: 'cover' | 'contain' (Image Fit); default "cover"
- clickAction: action (Action on click); optional

## imageTrail

### Hidden Image Explosion & Custom Cursor (@saruman/image-explosion)

- imagePool: list (Image); min 1, max 20
- imagePool[].img: image (Image)
- clickFeedback: 'ripple' | 'burst' | 'scale' (On-Click Effect); default "ripple"
- explosionSpeed: '800' | '500' | '300' (Explosion speed); default "500"
- clickAction: action (Action on Click); optional
- imageShape: 'original' | 'square' | 'circle' (Shape); default "square"
- imageSize: textInput (Image size (max. 300 px)); default "120"
- borderRadius: textInput (Image radius (px)); default "14"
- imageBgColor: colorInput (Image background color); default "transparent", optional
- showShadow: switch (Show shadow); default true
- accentColor: colorInput (Accent Color); default "#EF713F"
- customCursorEnabled: switch (Use custom cursor); default true
- cursorImage: image (Cursor Image); optional, only when customCursorEnabled
- cursorSize: '32' | '48' | '64' (Cursor Size); default "48", only when customCursorEnabled

## findThePair

### @genially/find-the-pair (@genially/find-the-pair)

- itemList: list; min 4, max 10
- itemList[].image: image
- itemList[].title: textInput; default ""
- itemList[].audio: action; optional
- itemList[].imagePair: image
- itemList[].titlePair: textInput; default ""
- itemList[].audioPair: action; optional
- coverImage: image
- identicalImages: switch; default false
- fitImages: switch; default false
- numRows: 'auto' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8'; default "auto"
- onEndAction: action; optional
- showAlternativeTextButton: switch; default false

## puzzle

### Image Jigsaw Puzzle Widget (@saruman/jigsaw)

- puzzleImage: image (Puzzle Image)
- gridSize: '2' | '3' | '4' | '5' (Puzzle Grid Size); default "3"
- selectionColor: colorInput (Selection Color); default "#6B29FF"
- showReloadButton: switch (Show Reload Button); default false
- reloadButtonColor: colorInput (Button Background Color); default "#6B29FF", only when showReloadButton
- reloadButtonTextColor: colorInput (Button Text Color); default "#ffffff", only when showReloadButton
- completionActionDelayTime: textInput (Completion Action Delay (seconds)); default "0", optional
- completionAction: action (On Puzzle Completion); optional
- correctMoveAction: action (On Correct Move); optional
- incorrectMoveAction: action (On Incorrect Move); optional
- pieceSelectAction: action (On Piece Selection); optional
- correctPieceClickAction: action (On Correct Piece Click); optional

## wordSearch

### Word Search Puzzle (@saruman/wordsPuzzle)

- boardSize: '10' | '15' | '20' | '25' (Puzzle Board Size); default "15"
- difficulty: 'easy' | 'medium' | 'hard' (Difficulty Level); default "medium"
- isWordListVisible: switch (Display Word List); default true
- gridFontFamily: fontFamily (Font Family); default "Arial"
- wordsFontFamily: fontFamily (Font Family for Word List); default "Arial"
- foundWordColor: colorInput (Highlight Color for Found Words); default "#FFD700"
- selectionHighlightColor: colorInput (Selection Highlight Color); default "rgba(108, 41, 255, 0.2)"
- boardBackgroundColor: colorInput (Board Background Color); default "#FFFFFF"
- gridLineColor: colorInput (Grid Line Color); default "#b9b9b9"
- gridTextColor: colorInput (Text Color); default "#121212"
- wordsToFind: list (Words to Find); min 1, max 20
- wordsToFind[].word: textInput (Word); default ""
- wordsToFind[].onFoundAction: action (Action on Word Found); optional
- onCompletionAction: action (Action on Puzzle Completion); optional

## wordSorter

### Word Classifier (@saruman/wordsClassifier)

- gameMode: 'returnIncorrect' | 'resetAll' (Game Mode); default "returnIncorrect"
- maxAttempts: textInput (Maximum Attempts); default "3", up to 1 characters
- backgroundColor: colorInput (Word Background Color); default "#FFFFFF"
- correctColor: colorInput (Correct Word Background Color); default "#4CAF50"
- incorrectColor: colorInput (Incorrect Word Background Color); default "#F44336"
- textColor: colorInput (Text Color); default "#121212"
- fontFamily: fontFamily (Font Family); default "Arial"
- boxesBorderColor: colorInput (Boxes Border Color); default "#CCCCCC"
- selectionColor: colorInput (Selection Color); default "#2196F3"
- buttonBackgroundColor: colorInput (Buttons Color); default "#2196F3"
- buttonTextColor: colorInput (Buttons Text Color); default "#FFFFFF"
- categories: list (Categories); min 2, max 4
- categories[].categoryName: textInput (Category Name); default "", up to 50 characters
- wordsToClassify: list (Words to Classify); min 4, max 24
- wordsToClassify[].wordText: textInput (Word); default "", up to 100 characters
- wordsToClassify[].correctCategoryName: textInput (Correct Category); default "Category 1", up to 50 characters
- validateButtonText: textInput (Validate Button Text); default "Validate"
- resetButtonText: textInput (Reset Button Text); default "Reset All"
- attemptsLeftPrefix: textInput (Attempts Left Prefix); default "Attempts left: "
- attemptsLeftSuffix: textInput (Attempts Left Suffix); default ""
- onGameCompleteSuccessAction: action (On Game Success); optional
- onGameCompleteFailureAction: action (On Game Failure); optional

## mathOperations

### Math Challenge Widget (@saruman/mathsCalculations)

- operationType: 'addition' | 'subtraction' | 'multiplication' | 'division' | 'mixed' (Type of Operation); default "addition"
- difficultyLevel: 'easy' | 'medium' | 'hard' (Difficulty Level); default "easy"
- numberOfQuestions: textInput (Number of Questions per Round); default "5", up to 3 characters
- fontFamily: fontFamily (Font Family); default "Arial"
- questionFontSize: textInput (Font Size (px)); default "32", up to 2 characters
- startBtnText: textInput (Start Button Text); default "Start!"
- submitBtnText: textInput (Submit Button Text); default "Submit!"
- nextBtnText: textInput (Next Button Text); default "Next"
- restartBtnText: textInput (Restart Button Text); default "Restart"
- pleaseEnterNumberText: textInput (Enter Number Prompt Text); default "Please enter a number."
- correctAnswerWasText: textInput (Correct Answer Reveal Text); default "The correct answer was"
- roundCompleteTitle: textInput (Round Complete Title); default "Round Complete!"
- finalScorePrefix: textInput (Final Score Prefix); default "You got"
- finalScoreSuffix: textInput (Final Score Suffix); default "correct."
- primaryColor: colorInput (Primary Accent Color); default "#6c29ff"
- backgroundColor: colorInput (Widget Background Color); default "#fffff00"
- onRoundCompleteAction: action (Action on Round Completion); optional
- onRestartAction: action (Action on Restart (Optional)); optional
- onCorrectAnswerAction: action (Action on Correct Answer (Optional)); optional
- onIncorrectAnswerAction: action (Action on Incorrect Answer (Optional)); optional
- onNewQuestionAction: action (Action on New Question (Optional)); optional

## hangmanGame

keyboardPosition 'top' with layoutOrientation 'horizontal' showed only the gallows, no keyboard or word.

### Hangman Game Widget (@saruman/hangman-v2)

- word: textInput (Word to Guess); default "GENIALLY"
- keyboardPosition: 'bottom' | 'top' | 'right' | 'left' (Keyboard Position); default "bottom"
- showMistakesCounter: switch (Show Mistakes Counter); default true
- mistakesLabelPrefix: textInput (Mistakes Counter Prefix); default "Mistakes: ", only when showMistakesCounter
- mistakesLabelSuffix: textInput (Mistakes Counter Suffix); default "", only when showMistakesCounter
- winAction: action (Action on win); optional
- loseAction: action (Action on lose); optional
- mistakeActions: action (Action on mistake); optional
- hangmanSize: 'large' | 'medium' | 'small' (Hangman Size); default "large"
- maxMistakes: '6' | '7' | '8' | '9' | '10' (Number of Attempts); default "6"
- keyboardLanguage: 'standard' | 'es' | 'pt' | 'de' | 'fr' | 'he' (Keyboard Language); default "standard"
- layoutOrientation: 'vertical' | 'horizontal' (Layout Orientation); default "vertical"
- letterPlaceholder: textInput (Unguessed Letter Placeholder); default "_", up to 1 characters
- fontFamily: fontFamily (Font Family); default "Arial"
- buttonBorderRadius: textInput (Keyboard Corner Radius); default "50px"
- textColor: colorInput (Text Color); default "#333333"
- keyboardButtonBgColor: colorInput (Keyboard Button Color); default "#6f2eff"
- keyboardButtonTextColor: colorInput (Keyboard Button Text Color); default "#ffffff"
- correctGuessColor: colorInput (Correct Guess Color); default "#4CAF50"
- hangmanColor: colorInput (Hangman Color); default "#333333"
- incorrectGuessColor: colorInput (Incorrect Guess Color); default "#F44336"

## letterBoard

### Hangman Game (@saruman/password)

- phrase: textInput (Secret word or phrase); default "GENIALLY IS AWESOME", up to 60 characters
- hint: textInput (Hint or Category); default "Interactive content tool"
- showHint: 'yes' | 'no' (Display hint); default "yes"
- language: 'en' | 'es' (Keyboard Layout); default "en"
- maxAttempts: textInput (Max Mistakes Allowed); default "6"
- hintFont: fontFamily (Hint Font); default "Roboto"
- hintColor: colorInput (Hint Color (Text & Icon)); default "#666666"
- gameFont: fontFamily (General Text Font); default "Roboto"
- backgroundColor: colorInput (Background Color); default "#ffffff"
- primaryColor: colorInput (Primary Color (Keys)); default "#4a90e2"
- hitColor: colorInput (Success Color); default "#2ecc71"
- missColor: colorInput (Failure Color); default "#e74c3c"
- cellHiddenColor: colorInput (Hidden Cell Background); default "#e0e0e0"
- remainingAttemptsColor: colorInput (Remaining attempts color); default "#f1c40f"
- failedAttemptsColor: colorInput (Failed attempts color); default "#bdc3c7"
- winAction: action (When user wins); optional
- loseAction: action (When user loses); optional
- hitAction: action (Action on correct letter); optional
- missAction: action (Action on wrong letter); optional

## wordle

Its keyboard has Ñ: a Spanish layout, whatever the language of the genially.

### Customizable wordle (@saruman/wordle)

- gameTitle: textInput (Game title); default "WORDLE"
- targetWord: textInput (Secret word); default "GENIALLY", up to 10 characters
- maxAttempts: textInput (Number of attempts); default "6"
- useNativeKeyboard: switch (Use device keyboard); default false
- enterKeyText: textInput (Enter key text); default "ENTER", up to 10 characters
- correctColor: colorInput (Correct letter); default "#22c55e"
- presentColor: colorInput (Present letter); default "#eab308"
- absentColor: colorInput (Absent letter); default "#64748b"
- primaryBgColor: colorInput (Background color); default "#0f172a"
- boxBgColor: colorInput (Box background color); default "#1e293b"
- boxBorderColor: colorInput (Box border color); default "#475569"
- activeBoxBorderColor: colorInput (Active box border); default "#3b82f6"
- titleTextColor: colorInput (Title text color); default "#f8fafc"
- keyTextColor: colorInput (Key text color); default "#f8fafc"
- keyBgColor: colorInput (Key background color); default "#1e293b"
- gameFont: fontFamily (Font family); default "Montserrat"
- onWinAction: action (Action on Win); optional
- onLoseAction: action (Action on Lose); optional

## wordWheel

Its "Aciertos" is fixed in Spanish.

### Customizable Alphabet Game (@saruman/wordWheelQuiz)

- welcomeMessage: textInput (Welcome Message); default "¡Bienvenido al desafío del Rosco!"
- timeLimitSeconds: textInput (Time Limit (seconds)); default "180"
- startButtonText: textInput (Start Button Text); default "EMPEZAR"
- allowedHints: switch (Enable Hints); default true
- hintPenaltySeconds: textInput (Hint Time Penalty (seconds)); default "10", only when allowedHints
- headerFont: fontFamily (Typography); default "Montserrat"
- bgColor: colorInput (Main Background Color); default "#1a2a6c"
- primaryColor: colorInput (Letter Wheel Primary Color); default "#fdbb2d"
- letterColor: colorInput (Letter Wheel Text Color); default "#ffffff"
- successColor: colorInput (Correct Answer Background); default "#28a745"
- errorColor: colorInput (Wrong Answer Background); default "#dc3545"
- popupBgColor: colorInput (Popup Background); default "#ffffff"
- popupTitleColor: colorInput (Title Text Color); default "#1a2a6c"
- popupTextColor: colorInput (Body Text Color); default "#444444"
- popupButtonBgColor: colorInput (Button Background); default "#fdbb2d"
- popupButtonTextColor: colorInput (Button Text Color); default "#ffffff"
- popupInteractiveColor: colorInput (Interactive/Hover Color); default "#00d2ff"
- popupInputTextColor: colorInput (Input Text Color); default "#444444"
- questions: list (Word); min 1, max 27
- questions[].letter: textInput (Letter); default "A", up to 1 characters
- questions[].type: 'starts' | 'contains' (Condition); default "starts"
- questions[].word: textInput (Correct Word); default ""
- questions[].definition: textArea (Definition); default ""
- editGameTexts: switch (Edit game texts); default false
- startsWithLabel: textInput ("Starts with" clue); default "STARTS WITH", only when editGameTexts
- containsLabel: textInput ("Contains" clue); default "CONTAINS", only when editGameTexts
- answerPlaceholder: textInput (Answer placeholder); default "Answer...", only when editGameTexts
- submitButtonText: textInput (Submit button text); default "SUBMIT", only when editGameTexts
- skipButtonText: textInput (Skip button text); default "SKIP", only when editGameTexts
- hintActivatedLabel: textInput (Hint used label); default "HINT ON", only when editGameTexts
- successMessage: textInput (Correct answer message); default "Correct!", only when editGameTexts
- failureMessage: textInput (Wrong answer message); default "Wrong!", only when editGameTexts
- scoreLabel: textInput (Score counter); default "Correct: {count}", only when editGameTexts
- streakLabel: textInput (Streak label); default "Streak:", only when editGameTexts
- frozenTimeText: textInput (Frozen time message); default "TIME FROZEN", only when editGameTexts
- gameOverTitle: textInput (Game over title); default "GAME OVER!", only when editGameTexts
- correctAnswersLabel: textInput (Final score label); default "correct", only when editGameTexts
- retryButtonText: textInput (Retry button text); default "TRY AGAIN", only when editGameTexts
- onSuccessAction: action (Action on correct answer); optional
- onFailureAction: action (Action on wrong answer); optional
- onFinish: action (Action when game ends); optional

## revealAnswers

Not a flip card: each card runs a 4-second countdown and asks "Knew it / Didn't know". For cards that turn over on a click, draw them (two faces and a showHide interaction).

### Flashcards (@saruman/flashcards)

- cards: list (Card)
- cards[].front: textArea (Front); default "Question", up to 200 characters
- cards[].back: textArea (Back); default "Answer", up to 100 characters
- cards[].hint: textArea (Hint (optional)); default "", up to 80 characters
- cards[].explanation: textArea (Message after flipping (optional)); default "", up to 500 characters
- cards[].frontImage: image (Front image (optional)); optional
- cards[].backImage: image (Back image (optional)); optional
- shuffleCards: switch (Show random order); default false
- enableTimer: switch (Add timer); default false
- timeLimit: timeInput (milliseconds); min 1000, max 300000, only when enableTimer
- enableSuddenDeath: switch (Number of allowed errors); default false
- suddenDeathErrors: numberInput; default 3, min 1, max 50, only when enableSuddenDeath
- fontFamily: fontFamily (Font); default "Inter"
- frontBgColor: colorInput (Background color); default "#6750A4"
- frontTextColor: colorInput (Text color); default "#FFFFFF"
- backBgColor: colorInput (Background color); default "#EFF6FF"
- backTextColor: colorInput (Text color); default "#1E40AF"
- correctColor: colorInput (Background color); default "#25A782"
- correctTextColor: colorInput (Text color); default "#FFFFFF"
- knewItLabel: textInput (Button text); default "I knew it!", up to 20 characters
- incorrectColor: colorInput (Background color); default "#D83F55"
- incorrectTextColor: colorInput (Text color); default "#FFFFFF"
- didntKnowLabel: textInput (Button text); default "Didn't know", up to 20 characters
- skipColor: colorInput (Background color); default "#F9FAFB"
- skipTextColor: colorInput (Text color); default "#6B7280"
- skipLabel: textInput (Button text); default "Skip", up to 20 characters
- containerBgColor: colorInput (Background color); default "#F9FAFB"
- cardBorderRadius: numberInput (Corner radius (px)); default 16, min 0, max 100
- continueButtonText: textInput (Continue button text); default "Continue"
- restartButtonText: textInput (Restart button text); default "Restart"
- reviewErrorsButtonText: textInput (Review errors button text); default "Review Errors"
- feedbackCorrect: textInput (Title when the answer was known); default "Correct!"
- feedbackKeepLearning: textInput (Title when the answer was not known); default "Keep Learning"
- feedbackTimesUp: textInput (Title when time runs out); default "Time's up!"
- wellDoneMessage: textInput (Message when the answer was known); default "Well done!"
- keepStudyingMessage: textInput (Message when the answer was not known); default "Keep studying to master this concept."
- timeLabel: textInput (Timer label); default "Time"
- hintLabel: textInput (Hint label); default "Hint"
- noHintMessage: textInput (Message for a card without hint); default "No hint available."
- streakLabel: textInput (Streak label); default "Streak"
- errorsLabel: textInput (Errors label); default "Errors"
- noErrorsMessage: textInput (Message for an empty error list); default "No errors yet."
- sessionCompleteTitle: textInput (Summary title); default "Session Complete!"
- correctLabel: textInput (Correct answers label); default "Correct"
- bestStreakLabel: textInput (Best streak label); default "Best Streak"
- totalTimeLabel: textInput (Total time label); default "Total Time"
- gameOverTitle: textInput (Game over title); default "Game Over"
- gameOverMessage: textArea (Game over message)

## matchConcepts

### Match concepts (@saruman/conceptRelations)

- questionText: textInput; default "Write a statement so that different concepts can be matched"
- lockedMessage: textInput; default "You can no longer complete this activity"
- wordPairs: list (Pair); min 1
- wordPairs[].word1: textInput (Concept A); default "Write concept A here"
- wordPairs[].word2: textInput (Concept B); default "Write concept B here"
- enableTimer: switch (Add timer); default false
- timerDuration: timeInput (milliseconds); min 1000, max 300000, only when enableTimer
- fontFamily: fontFamily; default "Inter"
- fontSize: numberInput (Text size); default 16, min 0, max 100
- color: colorInput (Text color); default "#121212"
- containerColor: colorInput (Background color); default "#ffffff"
- selectionColor: colorInput (Color on selection); default "#009996"
- correctLineColor: colorInput (“Correct” border color); default "#28a745"
- incorrectLineColor: colorInput (“Incorrect” border color); default "#dc3545"
- defaultLineColor: colorInput (Line color); default "#6c757d"

## arrangeInOrder

### Arrange in order (@saruman/card-sorter)

- questionText: textInput (Statement); default "Sort the cards from left to right", up to 1000 characters
- subtitleText: textInput (Description); default "When finished, click Validate", up to 200 characters
- validateButtonText: textInput (Validate button text); default "Validate", up to 60 characters
- cards: list (Card); min 2, max 8
- cards[].text: textInput (Text); default "Card text", up to 60 characters
- cards[].image: image (Image (optional)); optional
- enableTimer: switch (Add timer); default false
- timeLimit: timeInput (milliseconds); min 1000, max 300000, only when enableTimer
- fontFamily: fontFamily; default "DM Sans"
- cardBgColor: colorInput (Background color); default "#FFFFFF"
- cardTextColor: colorInput (Text color); default "#121212"
- cardBorderRadius: numberInput (Corner radius (px)); default 16, min 0, max 40
- containerBgColor: colorInput (Background color); default ""
- textColor: colorInput (Text color); default "#121212"
- accentColor: colorInput (Button color); default "#6C29FF"
- validateButtonTextColor: colorInput (Button text color); default "#FFFFFF"

## spotTheDifference

Not usable from a deck: each difference's position is a coordinate a deck can't set, so none can be found. Layout 'vertical' came out as two thin strips.

### Spot the Differences with Timer (@saruman/spotTheDifferences)

- imageLeft: image (Original image (Left/Top))
- imageRight: image (Modified image (Right/Bottom))
- layout: 'horizontal' | 'vertical' (Image layout); default "horizontal"
- differences: list (List of Differences)
- differences[].position: coordinateInput (Position)
- differences[].size: textInput (Area size); default "10"
- differences[].interactivity: action (Action when found); optional
- timerSeconds: timeInput (milliseconds) (Countdown time); min 1000, max 300000, only when showTimer
- enableUrgencyEffects: switch (Highlight last seconds); default true, only when showTimer
- timePenalty: textInput (Time penalty on failure (seconds)); default "5", only when showTimer
- winAction: action (Action when all found); optional
- errorAction: action (Action on mistake); optional
- failureAction: action (Action on timer end); optional, only when showTimer
- markerColor: colorInput (Difference indicator color); default "#32CD32"
- fontFamily: fontFamily (Text font); default "Inter"
- showTimer: switch (Show timer); default true
- timerIconColor: colorInput (Icon color); default "#FFFFFF", only when showTimer
- timerBgColor: colorInput (Fill color); default "#000000", only when showTimer
- timerBorderColor: colorInput (Border color); default "#FFFFFF", only when showTimer
- timerTextColor: colorInput (Digit color); default "#FFFFFF", only when showTimer
- timerWarningColor: colorInput (Warning color for last seconds); default "#FF0000", only when showTimer
- timerBorderWidth: textInput (Border thickness (px)); default "2", only when showTimer
- timerBorderRadius: textInput (Corner radius (px)); default "8", only when showTimer
- showCounter: switch (Show scoreboard); default true
- counterBgColor: colorInput (Fill color); default "#222222", only when showCounter
- counterTextColor: colorInput (Text color); default "#FFFFFF", only when showCounter
- counterSuccessFlashColor: colorInput (Flash color on success); default "#32CD32", only when showCounter
- counterBorderRadius: textInput (Corner radius (px)); default "20", only when showCounter

## simonSays

### Simon Says Game Widget (@saruman/simon)

- textFont: fontFamily (Font Family); default "Source Sans Pro"
- stepsToWin: textInput (Steps to Win); default "10"
- winAction: action (Action on Win); optional
- loseAction: action (Action on Lose); optional
- roundLabelText: textInput (Round Label Text); default "Round"
- pressStartText: textInput (Initial Status Message); default "Press Start to Play!"
- watchCarefullyText: textInput (Watch Sequence Status); default "Watch carefully!"
- generatingSequenceText: textInput (Generating Sequence Status); default "Generating sequence..."
- yourTurnText: textInput (Player Turn Status); default "Your turn!"
- gameOverMessageText: textInput (Game Over Message); default "Game Over!"
- winMessageText: textInput (Win Game Message); default "You Win!"
- primaryColor: colorInput (Primary color); default "#6c29ff"
- secondaryColor: colorInput (Secondary color); default "#121212"
- button1Color: colorInput (Button 1 Color); default "#ff515d"
- button1SoundAction: action (Button 1 Sound); optional
- button2Color: colorInput (Button 2 Color); default "#29f29f"
- button2SoundAction: action (Button 2 Sound); optional
- button3Color: colorInput (Button 3 Color); default "#42b1fc"
- button3SoundAction: action (Button 3 Sound); optional
- button4Color: colorInput (Button 4 Color); default "#fac645"
- button4SoundAction: action (Button 4 Sound); optional

## secretCode

### Access Code Input (@saruman/secretCode)

- onCorrectCodeAction: action (Action on Correct Code); optional
- onIncorrectCodeAction: action (Action on Incorrect Code); optional
- correctAccessCode: textInput (Correct Access Code); default "12345", up to 20 characters
- otherCorrectAccessCodes: list (Other Correct Access Codes); min 0, max 10
- otherCorrectAccessCodes[].code: textInput (Access Code); default "", up to 20 characters
- promptMessage: textInput (Prompt Message); default "Enter the access code:"
- inputPlaceholder: textInput (Input Field Placeholder); default "Enter code"
- buttonLabel: textInput (Button Label); default "Unlock", up to 15 characters
- widgetBackgroundColor: colorInput (Widget Background Color); default "#00000000"
- inputBackgroundColor: colorInput (Input Field Background Color); default "#dde6ec"
- textColor: colorInput (Main Text Color); default "#000000"
- buttonBackgroundColor: colorInput (Button Background Color); default "#6c29ff"
- buttonTextColor: colorInput (Button Text Color); default "#ffffff"
- fontFamily: fontFamily (Font Family); default "Arial"
- fontSize: textInput (Font Size); default "1.5rem"
- inputBorderRadius: textInput (Input Field Border Radius); default "38px"
- buttonBorderRadius: textInput (Button Border Radius); default "38px"

## swipeAndScore

Its feedback icons are gallery fields a deck can't set.

### Swipe and hit (@saruman/swipe-true-false)

- cards: list (Card)
- cards[].questionText: textInput (Question); default "", up to 60 characters
- cards[].cardImage: image (Image)
- cards[].correctOption: 'left' | 'right' (Correct Option); default "right"
- labelLeft: textInput (Left label (False)); default "Falso", up to 20 characters
- labelRight: textInput (Right label (True)); default "Verdadero", up to 20 characters
- resultPercentLabel: textInput (Score label); default "Score", up to 30 characters
- resultAnsweredLabel: textInput (Answered cards label); default "Answered", up to 30 characters
- resultCorrectLabel: textInput (Correct answers label); default "Correct", up to 30 characters
- resultIncorrectLabel: textInput (Incorrect answers label); default "Incorrect", up to 30 characters
- enableTimer: switch (Add timer); default false
- timeLimit: timeInput (milliseconds); min 1000, max 300000, only when enableTimer
- widgetBgColor: colorInput (Background color); default "#f0f2f5"
- mainFont: fontFamily (Font); default "DM Sans"
- fontSize: numberInput (Font size); default 20, min 16, max 24
- textColor: colorInput (Text color); default "#121212"
- accentColor: colorInput (Progress color); default "#6C29FF"
- cardBgColor: colorInput (Gradient color); default "#FFFFFF"
- btnLeftColor: colorInput (False button icon color); default "#F73C69"
- btnLeftBgColor: colorInput (False button background); default "#FFFFFF"
- btnRightColor: colorInput (True button icon color); default "#15803d"
- btnRightBgColor: colorInput (True button background); default "#FFFFFF"
- feedbackCorrectColor: colorInput (Color); default "#C8FE53"
- feedbackCorrectIcon: galleryIcon (Icon)
- feedbackCorrectTextColor: colorInput (Text color); default "#121212"
- feedbackCorrectText: textInput (Text); default "¡Correcto!", up to 30 characters
- feedbackIncorrectColor: colorInput (Color); default "#F73C69"
- feedbackIncorrectIcon: galleryIcon (Icon)
- feedbackIncorrectTextColor: colorInput (Text color); default "#121212"
- feedbackIncorrectText: textInput (Text); default "¡Incorrecto!", up to 30 characters
- resultBgColor: colorInput (Background color); default "#f0f2f5"
- resultCardBgColor: colorInput (Card background); default "#FFFFFF"
- resultLabelColor: colorInput (Label color); default "#121212"
- resultCorrectColor: colorInput (Correct value color); default "#1a9e5c"
- resultIncorrectColor: colorInput (Incorrect value color); default "#F73C69"

## locateInImage

### Locate in image (@saruman/locate-in-image)

- gameMechanic: 'tocar' | 'arrastrar' | 'orden' | 'dibujar' (Answer type); default "tocar"
- showZones: switch (Show zones); default true
- tagsPosition: 'top' | 'bottom' (Label position); default "top"
- questionText: textInput (Question); default "Identify the main components of the engine."
- backgroundImageUrl: image (Image)
- interactiveZones: list (Zone); min 1, max 20
- interactiveZones[].zoneLabel: textInput (Label); default ""
- interactiveZones[].coordinates: coordinateInput (Position)
- interactiveZones[].detectionRadius: textInput (Size (px)); default "40"
- successTitle: textInput (Success title); default "Well done!", up to 60 characters
- failureTitle: textInput (Failure title); default "Game over!", up to 60 characters
- successMessage: textInput (Correct answer message); default "Excellent! You correctly identified the component."
- failureMessage: textInput (Incorrect answer message); default "Almost... Try checking the part again."
- onCompletedAction: action (Action on success); optional
- onFailAction: action (Action on failure); optional
- titleFont: fontFamily (Title font); default "Unbounded-Bold"
- bodyFont: fontFamily (Text font); default "DM Sans"
- primaryColor: colorInput (Main color); default "#6C29FF"
- successColor: colorInput (Correct answer color); default "#C8FE53"
- errorColor: colorInput (Incorrect answer color); default "#EF713F"
- zoneColor: colorInput (Zone color); default "#FFFFFF"
- backgroundColor: colorInput (Background color); default "transparent"
- textColor: colorInput (Text color); default "#121212"

## timer

### @genially/timer (@genially/timer)

- initialTime: timeInput (milliseconds); min 0, max 5999000
- showControls: switch; default false
- automaticStart: switch; default false
- variant: 'crono' | 'sand' | 'progress-bar' | 'akihabara' | 'retro' | 'standard' | 'minimal' | 'animated-gradient' | 'sliding_numbers' | 'flip-clock' | 'modern_sand'; default "standard"
- onEndAction: action; optional
- slidesToDisplay: slideSelector; only when showSlideSelector
- color: colorInput (Text and SVG color); default ""
- backgroundColor: colorInput (Background color); default ""
- fontFamily: fontFamily (Font family)
- showSlideSelector: switch (Show slide selector); default true
- disableShowAndHideInteractivities: switch (Disable show/hide interactivities); default true

## stopwatch

### @genially/chronometer (@genially/chronometer)

- automaticStart: switch; default true
- variant: 'crono' | 'sand' | 'progress-bar' | 'akihabara' | 'retro' | 'standard' | 'minimal' | 'animated-gradient' | 'sliding_numbers' | 'flip-clock' | 'modern_sand'; default "standard"
- slidesToDisplay: slideSelector; only when showSlideSelector
- showSlideSelector: switch (Show slide selector); default true

## countdownToDate

No config: it goes in as it comes (its settings are on a group, which a deck can't change yet). 6 variants (options.variant).

## progressBar

It shows on every slide of the genially, not only the one it is put on: the slides it shows on (slidesToDisplay) are a field a deck can't set.

### @genially/progress-bar (@genially/progress-bar)

- slidesToDisplay: slideSelector; only when showSlideSelector
- onEndAction: action; optional
- variant: 'minimal-light' | 'minimal-dark' | 'glassmorphism' | 'circle' | 'glow-effect-light' | 'glow-effect-dark'; default "minimal-light"
- barGradientColor1: colorInput; default "rgba(252,81,63,1)", only when variant == "glassmorphism"
- barGradientColor2: colorInput; default "rgba(245,178,61,1)", only when variant == "glassmorphism"
- barGradientColor3: colorInput; default "rgba(146,226,68,1)", only when variant == "glassmorphism"
- barColor: colorInput; default "rgba(18,18,18,1)", only when !variant == "glassmorphism"
- backgroundColor: colorInput; default "rgba(232,230,240,1)", only when !variant == "glow-effect-light" or variant == "glow-effect-dark"
- showPercentage: switch; default true
- textColor: colorInput; default "rgba(18,18,18,1)", only when showPercentage
- showSlideSelector: switch (Show slide selector); default true

## navigationMenu

It shows on every slide of the genially, not only the one it is put on: the slides it shows on (slidesToDisplay) are a field a deck can't set. Its colours are style fields a deck can't set either, and its labels are in Spanish ("Primera página"). Its items only go to slides ({ goTo }): a sound made the editor throw on every later slide change.

### @genially/menu (@genially/menu)

- menuItems: list; max 12
- menuItems[].menuItemName: textInput; default "", up to 25 characters
- menuItems[].menuItemAction: action; optional
- menuItems[].backgroundColor: style (Background color); default "rgb(208, 208, 208)"
- menuItems[].textColor: style (Text color); default "rgb(255, 255, 255)"
- slidesToDisplay: slideSelector; only when showSlideSelector
- menuType: 'horizontalMenu' | 'hamburgerMenu'; default "horizontalMenu"
- menuTheme: 'dark' | 'light'; default "dark"
- showAlternativeTextButton: switch; default false
- backgroundColor: style (Background color); default "rgba(0, 0, 0, 0.70)"
- hamburgerIconColor: style (Hamburger icon color); default "rgb(255, 255, 255)"
- showSlideSelector: switch (Show slide selector); default true

## calculator

### Advanced Calculator (@saruman/calculator)

- widgetTitle: textInput (Widget title); default "Calculadora"
- errorMessage: textInput (Error message); default "Error", up to 20 characters
- memoryClearedMessage: textInput (Memory cleared message); default "Memory Cleared"
- scientificMode: switch (Scientific Calculator Mode); default false
- enableInteractivity: switch (Enable interactivity by result); default false
- conditionalTriggers: list (Configure Triggers); only when enableInteractivity
- conditionalTriggers[].targetValue: textInput (Value); default "100"
- conditionalTriggers[].action: action (Action); optional
- bodyBackgroundColor: colorInput (Background color); default "#1a202c"
- mainDisplayBackgroundColor: colorInput (Display color); default "#000000"
- mainDisplayText: colorInput (Display text color); default "#ffffff"
- historyFontColor: colorInput (History Font Color); default "#9ca3af"
- titleFontColor: colorInput (Title Font Color); default "#ffffff"
- numberButtonColor: colorInput (Number buttons); default "#4a5568"
- numberButtonFontColor: colorInput (Number Button Font Color); default "#ffffff"
- operatorButtonColor: colorInput (Operator buttons); default "#f6ad55"
- operatorButtonFontColor: colorInput (Operator Font Color); default "#ffffff"
- scientificButtonColor: colorInput (Scientific button background color); default "#4c51bf", only when scientificMode
- scientificButtonFontColor: colorInput (Scientific button font color); default "#ffffff", only when scientificMode
- degFontColor: colorInput (DEG Font Color); default "#ffffff", only when scientificMode
- degBackgroundColor: colorInput (DEG Background Color); default "#6c29ff", only when scientificMode
- radFontColor: colorInput (RAD Font Color); default "#ffffff", only when scientificMode
- radBackgroundColor: colorInput (RAD Background Color); default "#6c29ff", only when scientificMode
- keypadFontFamily: fontFamily (Keypad Font); default "Arial"
- resultFontFamily: fontFamily (Result Font); default "Arial"

## qrGenerator

### QR Code Generator (@saruman/qrcode)

- qrContent: textArea (Content for QR Code); default "https://www.genially.com"
- qrColor: colorInput (QR Code Color); default "#000000"
- backgroundColor: colorInput (Background Color); default "#FFFFFF"
- level: 'L' | 'M' | 'Q' | 'H' (Error Correction Level); default "L"

## scoreboard

### Score Counter Widget (@saruman/scoreCounter)

- players: list (Players or Teams); min 1, max 8
- players[].playerName: textInput (Player/Team Name); default "", up to 30 characters
- players[].initialScore: textInput (Initial Score); default "0"
- players[].playerCardColor: colorInput (Card Background Color); default "#2a14b7"
- players[].textColor: colorInput (Text Color); default "#dbdbff"
- players[].buttonBgColor: colorInput (Score Button Color); default "#b2e185"
- players[].buttonTextColor: colorInput (Score Button Text Color); default "#2a14b7"
- leaderBadgeText: textInput (Leader Badge Text); default "🏆 Leader"
- messageTextColor: colorInput (Message Text Color); default "#2a14b7"
- fontFamily: fontFamily (Select Font Style); default "Arial"
- buttonBorderRadius: textInput (Buttons Corner Roundness); default "4rem"
- resetButtonText: textInput (Reset Button Text); default "Reset All Scores"
- resetButtonColor: colorInput (Reset Button Background Color); default "#dbdbff"
- resetButtonTextColor: colorInput (Reset Button Text Color); default "#2a14b7"
- areMessagesVisible: switch (Display Messages); default true
- initialMessage: textInput (Initial Message); default "No clear leader yet!", only when areMessagesVisible
- winPointPrefix: textInput (Win Point Prefix Message); default "🏆 ", only when areMessagesVisible
- winPointSuffix: textInput (Win Point Suffix Message); default " scores 1 point!", only when areMessagesVisible
- losePointPrefix: textInput (Lose Point Prefix Message); default "❌ ", only when areMessagesVisible
- losePointSuffix: textInput (Lose Point Suffix Message); default " loses 1 point!", only when areMessagesVisible
- tiedPrefix: textInput (Tied Prefix Message); default "🤝 There is a tie at ", only when areMessagesVisible
- tiedSuffix: textInput (Tied Suffix Message); default " point(s)!", only when areMessagesVisible
- onResetAction: action (Action on Reset); optional
- onLeaderChangeAction: action (Action on Leader Change); optional
- onPlayerScoreChangeAction: action (Action on Any Score Change); optional

## calendar

### Interactive Monthly Calendar (@saruman/glassmorphismCalendar)

- selectedMonth: '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | '11' | '12' (Select Month); default "1"
- selectedYear: '2024' | '2025' | '2026' | '2027' (Select Year); default "2025"
- weekStartFormat: 'monday' | 'sunday' (Week Starts On); default "monday"
- mainBackgroundColor: colorInput (Main Background); default "#FFFFFF"
- titleTextColor: colorInput (Title Color); default "#212121"
- weekdayHeaderBgColor: colorInput (Header Background); default "#F5F5F5"
- weekdayHeaderTextColor: colorInput (Header Text Color); default "#757575"
- dayNumberFontFamily: fontFamily (Font Family); default "Arial"
- dayNumberColor: colorInput (Text Color); default "#333333"
- defaultCellBackgroundColor: colorInput (Standard Day Background); default "#FFFFFF"
- weekendCellBackgroundColor: colorInput (Weekend Background); default "#FAFAFA"
- interactivityDotColor: colorInput (Indicator Dot Color); default "#673AB7"
- specificDayActions: list (Interactive Days)
- specificDayActions[].date: textInput (Date (DD-MM)); default "15-01"
- specificDayActions[].action: action (Action); optional
- holidayCellHighlightColor: colorInput (Holiday Highlight Color); default "#FFCDD2"
- holidays: list (Holiday List)
- holidays[].date: textInput (Date (DD-MM)); default "01-01"

## rating

### Rating (@saruman/rating)

- questionText: textInput (Question); default "How was your experience?"
- subtitleText: textArea (Description); default "Ex: Your answers help us improve"
- iconMode: 'stars' | 'thumbsUp' | 'faceEmojis' | 'customImage' (Styles); default "stars"
- customIconImage: image; optional, only when iconMode == "customImage"
- ratingScale: '3' | '5' | '10' (Rating scale); default "5"
- titleFontFamily: fontFamily; default "Inter"
- titleFontSize: numberInput (Font size (px)); default 16, min 0, max 100
- titleColor: colorInput (Text color); default "#121212"
- titleFontWeight: '400' | '700' (Text weight); default "700"
- subtitleFontFamily: fontFamily; default "Inter"
- subtitleFontSize: numberInput (Font size (px)); default 16, min 0, max 100
- subtitleColor: colorInput (Text color); default "#555555"
- subtitleFontWeight: '400' | '700' (Text weight); default "400"
- starSize: numberInput (Size (px)); default 48, min 0, max 124
- filledColor: colorInput (Color on selection); default "#FBBF24"
- emptyColor: colorInput (Color); default "#767676"
- hoverColor: colorInput (Hover color); default "#FBBF24"
- starSpacing: numberInput (Space between icons (px)); default 12, min 0, max 64
- containerBgColor: colorInput (Background color); default "#FFFFFF"
- containerBorderRadius: numberInput (Corner radius (px)); default 16, min 0, max 64
- borderThickness: numberInput (Border width (px)); default 1, min 0, max 48
- borderStyle: 'solid' | 'dashed' | 'dotted' (Border style); default "solid"
- borderColor: colorInput (Border Color); default "#E5E7EB"
- alignment: 'flex-start' | 'center' | 'flex-end' (Layout); default "center"
- showShadow: switch (Enable shadow); default true
- shadowColor: colorInput (Shadow color); default "#00000020", only when showShadow == true
- shadowBlur: numberInput (Shadow blur); default 20, min 0, max 64, only when showShadow == true

## noteWall

### Interactive Sticky Notes Board (@saruman/stickyNotes)

- whiteboardBackgroundColor: colorInput (Board Background); default "#F5F5F5"
- whiteboardTitle: textInput (Board Title); default "My Collaborative Board"
- whiteboardTitleFont: fontFamily (Title Font); default "Arial"
- whiteboardTitleColor: colorInput (Title Color); default "#333333"
- whiteboardTitleSize: '18px' | '24px' | '32px' | '48px' (Title Size); default "24px"
- whiteboardTitleHorizontalAlign: 'left' | 'center' | 'right' (Horizontal Alignment); default "center"
- whiteboardTitleVerticalAlign: 'top' | 'bottom' (Vertical Alignment); default "top"
- notePalette: list (Note colors); min 5, max 5
- notePalette[].color: colorInput (Swatch); default "#CCCCCC"
- addButtonBackgroundColor: colorInput (Button Color); default "#000000"
- showAddButton: 'true' | 'false' (Visibility); default "true"
- addButtonLabel: textInput (Button Label); default "Add Note"
- addButtonVerticalAlign: 'top' | 'bottom' (Vertical Alignment); default "bottom"
- addButtonHorizontalAlign: 'left' | 'center' | 'right' (Horizontal Alignment); default "right"
- defaultNoteText: textInput (Default Placeholder); default "Write something..."
- allowMultimedia: 'true' | 'false' (Allow Images); default "true"
- initialNotesList: list (Initial Notes)
- initialNotesList[].content: textArea (Message Body); default "Sample text"
- initialNotesList[].backgroundColor: colorInput (Background Color); default "#FFF445"
- initialNotesList[].image: image (Image); optional

## postIt

### Interactive Sticky Note (@saruman/postIt)

- titleText: textInput (Title); default "Quick Reminder", up to 50 characters
- bodyText: textArea (Body text)
- titleFont: fontFamily (Title font); default "Unbounded"
- bodyFont: fontFamily (Body font); default "DM Sans"
- noteColor: colorInput (Note color); default "#EF713F"
- textColor: colorInput (Text color); default "#121212"
- pinColor: colorInput (Pin color); default "#F73C69"
- tapeColor: colorInput (Adhesive tape color); default "#6C29FF"
- accessory: 'none' | 'pin' | 'tape' (Decorative element); default "pin"
- rotation: textInput (Rotation angle); default "-2"
- onClickAction: action (On click action); optional
- animationDuration: textInput (Animation duration (ms)); default "700"

## typewriter

It keeps its proportions: given 560 × 120 it came out 193 wide, and in a 1120 box 209 × 130, which broke the words ("This tex / t was ty"). Give a width, leave the height out and check it.

### Text Reveal (@saruman/machineEffectWriting)

- textContent: textArea (Text to reveal)
- fontFamily: fontFamily (Font family); default "Roboto"
- fontSize: textInput (Font size (px)); default "32"
- lineHeight: textInput (Line height); default "1.4"
- textColor: colorInput (Text color); default "#1A1A1A"
- backgroundColor: colorInput (Background color); default "#FFFFFF"
- alignment: 'left' | 'center' | 'right' | 'justify' (Alignment); default "center"
- revealMode: 'letter' | 'word' | 'line' (Reveal mode); default "word"
- effectType: 'none' | 'fade' | 'fade-slide' (Transition effect); default "fade-slide"
- speed: textInput (Speed (delay per unit in seconds)); default "0.05"
- initialDelay: textInput (Initial delay (seconds)); default "0.5"
- clickAction: action (Click action); optional

## roller

It keeps its proportions and centres its line in the box it is given, over whatever is below: give it a box of its own, the height of one line.

### Pro Text Animations (@saruman/dinamicTexts)

- fontFamily: fontFamily (Font family); default "Inter"
- fontSize: textInput (Font size (px)); default "48"
- textColor: colorInput (Text color); default "#1A1A1B"
- textAlign: 'left' | 'center' | 'right' (Alignment); default "center"
- staticText: textArea (Static text); default "We build"
- animatedItems: list (Animated phrases / words)
- animatedItems[].text: textInput (Text); default "New item"
- animationType: 'typing' | 'gradual-spacing' | 'word-rotate' | 'magic-text' (Animation type); default "word-rotate"
- duration: textInput (Duration (seconds)); default "0.5"
- delay: textInput (Interval / Delay (seconds)); default "2"
- easing: 'linear' | 'ease-in' | 'ease-out' | 'ease-in-out' (Easing function); default "ease-in-out"
- startTracking: textInput (Start tracking (Spacing)); default "-0.5em"
- loopTransition: 'slide-up' | 'slide-down' | 'fade' (Loop transition style); default "slide-up"
- sweepAngle: textInput (Sweep angle (Magic Text)); default "45"
- clickAction: action (Action on click); optional

## circularShape

### Custom Shaped Text (@saruman/text-path)

- textContent: textArea (Text); default "CREA EXPERIENCIAS INTERACTIVAS ÚNICAS", up to 200 characters
- shapeMode: 'circular' | 'wavy' (Text Shape); default "circular"
- waveCount: textInput (Number of waves); default "3", only when shapeMode == "wavy"
- clickAction: action (Click Action); optional
- clickAnimation: switch (Click Feedback Animation); default false
- backgroundColor: colorInput (Background Color); default "#ffffff00"
- fontFamily: fontFamily (Font); default "Unbounded"
- fontWeight: 'normal' | 'bold' (Font Weight); default "bold"
- textColor: colorInput (Text Color); default "#121212"
- fontSize: textInput (Font Size (px)); default "32"
- letterSpacing: textInput (Letter Spacing); default "5"
- textAlignment: 'start' | 'middle' | 'end' (Alignment); default "middle"
- animationEnabled: switch (Enable Animation); default true
- animationSpeed: textInput (Animation Speed); default "5", only when animationEnabled
- orbitDirection: 'normal' | 'reverse' (Orbit Direction); default "normal", only when animationEnabled && shapeMode == "circular"

## wavyShape

### Custom Shaped Text (@saruman/text-path)

- textContent: textArea (Text); default "CREA EXPERIENCIAS INTERACTIVAS ÚNICAS", up to 200 characters
- shapeMode: 'circular' | 'wavy' (Text Shape); default "circular"
- waveCount: textInput (Number of waves); default "3", only when shapeMode == "wavy"
- clickAction: action (Click Action); optional
- clickAnimation: switch (Click Feedback Animation); default false
- backgroundColor: colorInput (Background Color); default "#ffffff00"
- fontFamily: fontFamily (Font); default "Unbounded"
- fontWeight: 'normal' | 'bold' (Font Weight); default "bold"
- textColor: colorInput (Text Color); default "#121212"
- fontSize: textInput (Font Size (px)); default "32"
- letterSpacing: textInput (Letter Spacing); default "5"
- textAlignment: 'start' | 'middle' | 'end' (Alignment); default "middle"
- animationEnabled: switch (Enable Animation); default true
- animationSpeed: textInput (Animation Speed); default "5", only when animationEnabled
- orbitDirection: 'normal' | 'reverse' (Orbit Direction); default "normal", only when animationEnabled && shapeMode == "circular"

## gradient

It keeps its proportions and centres its line in the box it is given, over whatever is below: give it a box of its own, the height of one line.

### Animated Gradient Text (@saruman/gradientText)

- textContent: textInput (Text content); default "GRADIENT"
- fontFamily: fontFamily (Font family); default "Unbounded"
- fontWeight: 'normal' | 'bold' (Font weight); default "bold"
- fontSize: textInput (Font size (px)); default "80"
- letterSpacing: textInput (Letter spacing (px)); default "0"
- textAlign: 'left' | 'center' | 'right' (Alignment); default "center"
- onClickAction: action (Click action); optional
- clickAnimation: 'none' | 'pulse' | 'scale' (Click animation); default "pulse"
- gradientType: 'linear' | 'radial' (Type); default "linear"
- animationDuration: textInput (Animation speed (s)); default "4"
- gradientColors: list (Gradient colors); min 2, max 6
- gradientColors[].color: colorInput (Color); default "#6C29FF"

## wordCloud

### Interactive Word Cloud (@saruman/wordCloud)

- words: list (Word); min 1, max 20
- words[].word: textInput (Word); default "New Word", up to 20 characters
- words[].weight: 'small' | 'medium' | 'large' (Importance); default "medium"
- words[].action: action (Click Interactivity); optional
- accentColor: colorInput (Accent Color); default "#6C29FF"
- alwaysAccent: switch (Highlight on hover); default false
- wordColor: colorInput (Word Color); default "#121212"
- structuralFont: fontFamily (Cloud Words Font); default "Unbounded"
- motionSpeed: 'low' | 'medium' | 'high' (Floating Speed); default "medium"

## dialog

### Speech Bubble Generator (@saruman/speechBubble)

- bubbleText: textArea (Bubble text); default "Hello! I automatically resize to fit your thoughts. Type something here!"
- fontFamily: fontFamily (Font family); default "DM Sans"
- fontSize: textInput (Font size (px)); default "18"
- textColor: colorInput (Text color); default "#121212"
- textAlign: 'left' | 'center' | 'right' (Alignment); default "center"
- bubbleStyle: 'speech' | 'thinking' (Bubble style); default "speech"
- tailPosition: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'left' | 'right' | 'none' (Tail position); default "bottom-left"
- padding: textInput (Internal padding (px)); default "24"
- bubbleColor: colorInput (Bubble color); default "#FFFFFF"
- borderColor: colorInput (Border color); default "#6C29FF"
- borderWidth: textInput (Border thickness (px)); default "3"
- showShadow: switch (Apply shadow); default true
- onClickAction: action (Click action (optional)); optional

## cloudDialog

### Speech Bubble Generator (@saruman/speechBubble)

- bubbleText: textArea (Bubble text); default "Hello! I automatically resize to fit your thoughts. Type something here!"
- fontFamily: fontFamily (Font family); default "DM Sans"
- fontSize: textInput (Font size (px)); default "18"
- textColor: colorInput (Text color); default "#121212"
- textAlign: 'left' | 'center' | 'right' (Alignment); default "center"
- bubbleStyle: 'speech' | 'thinking' (Bubble style); default "speech"
- tailPosition: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'left' | 'right' | 'none' (Tail position); default "bottom-left"
- padding: textInput (Internal padding (px)); default "24"
- bubbleColor: colorInput (Bubble color); default "#FFFFFF"
- borderColor: colorInput (Border color); default "#6C29FF"
- borderWidth: textInput (Border thickness (px)); default "3"
- showShadow: switch (Apply shadow); default true
- onClickAction: action (Click action (optional)); optional

## dice

No config: it goes in as it comes (its settings are on a group, which a deck can't change yet). 5 variants (options.variant).

## coin

No config: it goes in as it comes (its settings are on a group, which a deck can't change yet). 3 variants (options.variant).

## randomize

No config: it goes in as it comes (its settings are on a group, which a deck can't change yet). 5 variants (options.variant).

## wheel

### Interactive Roulette (@saruman/imageLabelWheel)

- centerLabel: textInput (Core Text); default "¡GIRA!", up to 10 characters, only when showCore == true
- centerImage: image (Core Image); optional, only when showCore == true
- coreImageOpacity: textInput (Core Image Opacity (%)); default "100", only when showCore == true
- segments: list (Segment); min 2, max 20
- segments[].questionText: textInput (Label); default "PREMIO", up to 60 characters
- segments[].color: colorInput (Background Color); default "#6C29FF"
- segments[].textColor: colorInput (Text Color); default "#FFFFFF"
- segments[].segmentImage: image (Image (Optional)); optional
- segments[].imageOpacity: textInput (Image Opacity (%)); default "100"
- segments[].segmentAction: action (Action on Win); optional
- soundEnabled: switch (Sound on Spin); default true
- allowRepeats: switch (Allow Repeats); default true
- showCore: switch (Show Core); default true
- coreSize: 'small' | 'medium' | 'large' (Core Size); default "medium", only when showCore == true
- centerFontFamily: fontFamily (Core Font); default "Unbounded", only when showCore == true
- coreBackgroundColor: colorInput (Core Background Color); default "#6C29FF", only when showCore == true
- coreTextColor: colorInput (Core Text Color); default "#FFFFFF", only when showCore == true
- labelSize: 'large' | 'medium' | 'small' (Segment Font Size); default "medium"
- labelFontFamily: fontFamily (Segment Font); default "DM Sans"
- separatorLineColor: colorInput (Separator Line Color); default "#121212"
- separatorLineThickness: textInput (Separator Line Thickness (px)); default "2"
- pointerColor: colorInput (Pointer Color); default "#6C29FF"
- pointerSize: textInput (Pointer Size (px)); default "40"

## magicBall

### Magic 8-Ball Widget (@saruman/8ball)

- triangleColor: colorInput (Answer Shape Color); default "#0061FF"
- answerTextColor: colorInput (Answer Text Color); default "#F7F3E1"
- askMePromptText: textInput (Prompt Text); default "Ask me", up to 30 characters
- textFontFamily: fontFamily (Text Font Family); default "VT323"
- numberFontFamily: fontFamily (Number Font Family); default "Climate Crisis"
- answers: list (Customizable Answers); min 1
- answers[].answerText: textInput (Answer); default "", up to 68 characters
- answers[].isActive: 'true' | 'false' (Is Active?); default "true"
- answers[].actionOnSelect: action (Action for this answer (Optional)); optional
- revealAnswerAction: action (Action on Any Answer Reveal (Optional)); optional

## pinata

### Interactive Piñata (@saruman/pinata)

- rewardImage: image (Hidden Reward Image); optional
- imageProgressionMode: 'single' | 'multiple' (Image Progression Mode); default "single"
- pinataImageInitialState: image (Piñata Image); optional
- pinataImageHitState: image (Piñata Image in Hit State); optional, only when imageProgressionMode == "multiple"
- pinataImageBrokenState: image (Piñata Image in Almost Broken State); optional, only when imageProgressionMode == "multiple"
- hitsToBreak: textInput (Clicks to Break Piñata); default "5", up to 3 characters
- shakeAnimation: 'shake' | 'bounce' | 'swing' | 'vibrate' (Shake Animation); default "shake"
- isButtonVisible: switch (Display Button); default true
- buttonPrefixText: textInput (Prefix Text); default "Clicks left:", only when isButtonVisible
- buttonSuffixText: textInput (Suffix Text); default "", only when isButtonVisible
- buttonFont: fontFamily (Font); default "Source Sans Pro", only when isButtonVisible
- buttonColor: colorInput (Background Color); default "#6c29ff", only when isButtonVisible
- textColor: colorInput (Text Color); default "#ffffff", only when isButtonVisible
- onPinataHitSoundAction: action (Sound on Piñata Hit); optional
- onPinataHitAction: action (Action on Piñata Hit); optional
- onPinataBreakSoundAction: action (Sound on Piñata Break); optional
- onPinataBreakAction: action (Action on Piñata Break); optional

## scratchAndWin

### Scratch and Win (@saruman/scratchAndWin)

- prizeImage: image (Revealed Image)
- customCursor: image (Custom Scraper Image (Cursor)); optional
- brushSize: textInput (Brush Size (px)); default "45"
- scratchColor: colorInput (Scratch Layer Color); default "#A9A9A9"
- revealThreshold: textInput (Reveal Threshold (%)); default "60"
- onRevealAction: action (Action when revealed); optional

## bingo

### Interactive Bingo (@saruman/bingo)

- numberOfBalls: textInput (Number of balls (1-99)); default "75"
- mainNumberColor: colorInput (Main number color); default "#dbdbff"
- drawnNumbersListColor: colorInput (Drawn numbers list color); default "#dbdbff"
- buttonBackgroundColor: colorInput (Button background color); default "#b2e084"
- buttonTextColor: colorInput (Button text color); default "#2a14b7"
- scrollBarColor: colorInput (Scroll bar color); default "#b2e084"
- fontFamily: fontFamily (Font Family); default "Arial"
- buttonBorderRadius: textInput (Button border radius); default "9999px"
- mainDisplayOverlayColor: colorInput (Main number display overlay color); default "#2a14b7"
- drawnNumbersOverlayColor: colorInput (Drawn numbers list overlay color); default "#2a14b7"
- initialGamePhrase: textInput (Initial game phrase); default "Ready to play!"
- drawBallPhrase: textInput (Phrase for drawing a ball); default "New number in play!"
- allBallsDrawnPhrase: textInput (Phrase for empty drum); default "The drum is empty!"
- resetGamePhrase: textInput (Phrase for game reset); default "Drum reset, starting again!"
- drawBallButtonText: textInput (Draw Ball button text); default "Draw Ball"
- resetGameButtonText: textInput (Reset Game button text); default "Reset Game"
- drawnNumbersTitle: textInput (Drawn numbers list title); default "Numbers Already Drawn"
- noNumbersYetMessage: textInput (No numbers yet message); default "No numbers have been drawn yet."
- noMoreNumbersMessage: textInput (No more numbers message); default "End"
- onAllBallsDrawnAction: action (Action when all balls drawn); optional
- onGameResetAction: action (Action when game reset); optional

## guidePyramid

### Hierarchical Pyramid (@saruman/hierarchicalPyramid)

- pyramidLevels: list (Levels); min 1, max 10
- pyramidLevels[].title: textInput (Level Title); default "Título del nivel", up to 60 characters
- pyramidLevels[].description: textArea (Description); default "Información detallada sobre este nivel de la pirámide."
- pyramidLevels[].alignment: 'left' | 'right' (Text Alignment); default "left"
- pyramidLevels[].titleColor: colorInput (Title Color); default "#121212"
- pyramidLevels[].descriptionColor: colorInput (Description Color); default "#121212"
- pyramidLevels[].icon: image (Level Icon)
- pyramidLevels[].containerColor: colorInput (Icon Container Color); default "#6C29FF"
- pyramidLevels[].containerSize: textInput (Icon Container Size (px)); default "64"
- pyramidLevels[].colorFront: colorInput (Pyramid Front Color); default "#FFFFFF"
- pyramidLevels[].colorSide: colorInput (Pyramid Side Color); default "#E0E0E0"
- pyramidLevels[].action: action (Interactivity); optional
- entranceAnimation: 'assemble' | 'buildup' | 'cascade' | 'pileup' (Entrance Animation); default "assemble"
- orientation: 'right' | 'left' (Orientation); default "right"
- titleFontFamily: fontFamily (Title Typography); default "Unbounded"
- bodyFontFamily: fontFamily (General Typography); default "DM Sans"
- studioBackground: colorInput (Background Color); default "#FFFFFF"
- accentColor: colorInput (Accent Color); default "#6C29FF"

## fluidPercentage

### Percentage Fill Widget (@saruman/animatedPercentage)

- shapeType: 'circle' | 'square' | 'teardrop' | 'heart' | 'star' | 'diamond' (Select Shape); default "circle"
- fillPercentage: textInput (Fill Percentage (0-100)); default "75", up to 3 characters
- fillColor: colorInput (Fill Color); default "#6C29FF"
- emptyColor: colorInput (Background Color); default "#F4F4F4"
- textFontFamily: fontFamily (Number Font); default "Unbounded"
- textColor: colorInput (Number Color); default "#121212"
- textSize: 'small' | 'medium' | 'large' | 'extraLarge' (Number Size); default "medium"
- animationType: 'linear' | 'ease-out' (Animation Timing); default "ease-out"
- onClickAction: action (On Click Action); optional
- onFillComplete: action (On Fill Complete Action); optional

## bubbleMap

### Animated Blob Chart (@saruman/bubble-chart)

- chartTitle: textInput (Chart Title); default "Distribución de Resultados"
- bubbles: list (Data Categories); min 1, max 12
- bubbles[].name: textInput (Name); default "Categoría"
- bubbles[].value: textInput (Value (%)); default "50"
- bubbles[].color: colorInput (Bubble Color); default "#EF713F"
- bubbles[].textColor: colorInput (Label Color); default "#FFFFFF"
- bubbles[].action: action (Click Action); optional
- titleFont: fontFamily (Chart Title Typography); default "Unbounded"
- categoryFont: fontFamily (Category and Legend Typography); default "DM Sans"
- percentageFont: fontFamily (Percentage Typography); default "DM Sans"
- visualStyle: 'flat' | '3d' (Visual Style); default "3d"
- showLegend: switch (Show Legend); default true
- backgroundColor: colorInput (Background Color); default "#FFFFFF"
- mainTextColor: colorInput (Global Text Color); default "#121212"
- accentColor: colorInput (Accent Color); default "#6C29FF"

## radarChart

### Dynamic Orbital Mind Map (@saruman/dynamicOrbitalMindMap)

- canvasBgColor: colorInput (Background color); default "#f8fafc"
- orbitAnimation: 'none' | 'gentle' | 'active' (Orbital effect); default "gentle"
- lineStyle: 'dashed' | 'solid' (Line type); default "dashed"
- font: fontFamily (Typography); default "Inter"
- hubTitle: textInput (Core title); default "STRATEGY"
- hubTitleColor: colorInput (Text color); default "#ffffff"
- hubColor: colorInput (Core color); default "#1e293b"
- hubIcon: image (Core image); optional
- hubShape: 'circle' | 'square' | 'rounded-square' (Core shape); default "circle"
- hubSize: 'small' | 'medium' | 'large' (Core size); default "medium"
- hubAction: action (Click action); optional
- nodes: list (Branch)
- nodes[].title: textInput (Title); default "New Branch"
- nodes[].nodeTextColor: colorInput (Text color); default "#ffffff"
- nodes[].nodeBgColor: colorInput (Background color); default "#4f46e5"
- nodes[].nodeShape: 'circle' | 'square' | 'oval' | 'triangle' | 'rectangle' (Shape); default "circle"
- nodes[].nodeSize: 'small' | 'medium' | 'large' (Size); default "medium"
- nodes[].icon: image (Branch image); optional
- nodes[].action: action (Click action); optional

## hamburgerChart

### Interactive Sandwich Diagram (@saruman/hamburgerDiagram)

- mainTitle: textInput (Title); default "La Estructura Perfecta"
- subtitle: textInput (Subtitle); default "Organiza tus ideas paso a paso"
- topBunLabel: textInput (Title); default "INTRODUCCIÓN"
- topBunDescription: textArea (Description); default "Presenta tu idea principal o concepto inicial de forma clara."
- bottomBunLabel: textInput (Title); default "CONCLUSIÓN"
- bottomBunDescription: textArea (Description); default "Resume los puntos clave y reafirma tu idea principal de una forma nueva."
- middleLayers: list (Intermediate Layers); min 1, max 6
- middleLayers[].title: textInput (Title); default "NIVEL DETALLE"
- middleLayers[].description: textArea (Description); default "Añade aquí evidencia, ejemplos o información adicional."
- middleLayers[].color: colorInput (Fill Color); default "#6C29FF"
- middleLayers[].action: action (Interactive Action); optional
- enableSounds: switch (Hover Sounds); default true
- enableHoverAnim: switch (Hover Animation); default true
- fontFamily: fontFamily (Title Font); default "Unbounded"
- mainTitleColor: colorInput (Title Color); default "#121212"
- subtitleFont: fontFamily (Subtitle Font); default "DM Sans"
- subtitleColor: colorInput (Subtitle Color); default "#444444"
- bunTitleFont: fontFamily (Title Font); default "Unbounded"
- bunTitleColor: colorInput (Title Color); default "#121212"
- bunDescriptionFont: fontFamily (Subtitle Font); default "DM Sans"
- bunDescriptionColor: colorInput (Subtitle Color); default "#4A4A4A"
- bunColor: colorInput (Fill Color); default "#EF713F"
- layerTitleFont: fontFamily (Title Font); default "Unbounded"
- layerTitleColor: colorInput (Title Color); default "#FFFFFF"
- layerDescriptionFont: fontFamily (Subtitle Font); default "DM Sans"
- layerDescriptionColor: colorInput (Subtitle Color); default "#FFFFFF"
