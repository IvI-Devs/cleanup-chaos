export let GameData: gameData = {
  globals: {
    gameWidth: 1280,
    gameHeight: 800,
    bgColor: "#ffffff",
    debug: false
  },

  preloader: {
    bgColor: "ffffff",
    image: "logo",
    imageX: 1280 / 2,
    imageY: 800 / 2,
    loadingText: "Loading...",
    loadingTextFont: "Pixelify Sans",
    loadingTextComplete: ">> Press a button to start <<",
    loadingTextY: 700,
    loadingBarColor: 0xff0000,
    loadingBarY: 630,
  },

  spritesheets: [
    // { name: "player", path: "assets/images/player.png", width: 82, height: 70, frames: 50 },
  ],
  images: [
    { name: "bootscreen-bg", path: "assets/images/backgrounds/bootscreen.svg" },
    { name: "bg-01", path: "assets/images/backgrounds/bg-01.svg" },
    { name: "bg-02", path: "assets/images/backgrounds/bg-02.svg" },
    { name: "bg-03", path: "assets/images/backgrounds/bg-03.svg" },

    { name: "hole-with-text", path: "assets/images/other/hole-with-text.png" },
  ],
  atlas: [],
  sounds: [
    /*{
      name: "music",
      paths: ["assets/sounds/intro.ogg", "assets/sounds/intro.m4a"],
      volume: 1,
      loop: true,
      frame: 1,
    }*/
  ],

  videos: [
    // { name: "video", path: "/assets/video/video.mp4" },
  ],
  audios: [
    /* {
      name: "sfx",
      jsonpath: "assets/sounds/sfx.json",
      paths: ["assets/sounds/sfx.ogg", "assets/sounds/sfx.m4a"],
      instances: 10,
    } */
  ],

  scripts: [],
  fonts: [{key:"ralewayRegular", path:"assets/fonts/raleway.regular.ttf",type:"truetype"}],
  webfonts: [{ key: 'Nosifer' }, { key: 'Roboto' }, { key: 'Press+Start+2P' }, { key: 'Rubik+Doodle+Shadow' }, { key: 'Rubik+Glitch' }, { key: 'Pixelify Sans' }],
  bitmapfonts: [],
};
