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
    loadingBarColor: 0xffffff,
    loadingBarY: 630,
  },

  spritesheets: [
    // { name: "player", path: "assets/images/player.png", width: 82, height: 70, frames: 50 },
  ],
  images: [
    { name: "bootscreen-bg", path: "assets/images/backgrounds/bootscreen.svg" },
    { name: "bg-example", path: "assets/images/backgrounds/example.jpg" },
    { name: "bg-01", path: "assets/images/backgrounds/bg-01.svg" },
    { name: "bg-02", path: "assets/images/backgrounds/bg-02.svg" },
    { name: "bg-03", path: "assets/images/backgrounds/bg-03.svg" },
    { name: "bg-04", path: "assets/images/backgrounds/bg-04.svg" },
    // { name: "bg-05", path: "assets/images/backgrounds/bg-05.svg" },
    { name: "bg-01-wider", path: "assets/images/backgrounds/bg-01-wider.png" },
    { name: "bg-05-wider", path: "assets/images/backgrounds/bg-05-wider.png" },
    { name: "bg-06-wider", path: "assets/images/backgrounds/bg-06-wider.png" },
    { name: "bg-07-wider", path: "assets/images/backgrounds/bg-07-wider.png" },

    { name: "hole-with-text", path: "assets/images/other/hole-with-text.png" },
    { name: "pixel-art-rectangle-3", path: "assets/images/other/pixel-art-rectangle-3.svg" },
    { name: "flag", path: "assets/images/other/flag.svg" },

    { name: "ship-base", path: "assets/images/ships/base.svg" },
    { name: "ship-slight-damage", path: "assets/images/ships/slight-damage.svg" },
    { name: "ship-damaged", path: "assets/images/ships/damaged.svg" },
    { name: "ship-base-shielded", path: "assets/images/ships/base-shielded.svg" },
    { name: "ship-slight-damage-shielded", path: "assets/images/ships/slight-damage-shielded.svg" },
    { name: "ship-damaged-shielded", path: "assets/images/ships/damaged-shielded.svg" },

    { name: "asteroid-base", path: "assets/images/asteroids/png/base.png" },
    { name: "asteroid", path: "assets/images/asteroids/asteroid.svg" },

    { name: "heart-white", path: "assets/images/hearts/white.svg" },

    { name: "bottle", path: "assets/images/trash/bottle.svg" },
    { name: "can", path: "assets/images/trash/can.svg" },
    { name: "tin", path: "assets/images/trash/tin.svg" },
    { name: "pizzaCarton", path: "assets/images/trash/pizza-carton.svg" },
    { name: "brokenMug", path: "assets/images/trash/broken-mug.svg" },
    { name: "glassBottle", path: "assets/images/trash/glass-bottle.svg" },
    { name: "tinStone", path: "assets/images/trash/tin-stone.svg" },

    { name: "nebula", path: "assets/images/trash/nebula.svg" },
    { name: "sprayBottle", path: "assets/images/trash/spray-bottle.svg" },
    { name: "fuel", path: "assets/images/trash/fuel.svg" },

    { name: "computer", path: "assets/images/trash/computer.svg" },
    { name: "floppy", path: "assets/images/trash/floppy.svg" },
    { name: "disc", path: "assets/images/trash/disc.svg" },

    { name: "shuttle", path: "assets/images/trash/shuttle.svg" },
    { name: "battery", path: "assets/images/trash/battery.svg" },

    { name: "powerUp-shield", path: "assets/images/power-ups/shield.svg" },
    { name: "powerUp-boost", path: "assets/images/power-ups/boost.svg" },
    { name: "powerUp-doublePoints", path: "assets/images/power-ups/double-points.svg" },


  ],
  atlas: [],
  sounds: [
    { name: "pickup", paths: ["assets/sounds/pickup.mp3"] },
    { name: "shield", paths: ["assets/sounds/shield.wav"] },
    { name: "boost", paths: ["assets/sounds/boost.mp3"] },
    { name: "doublePoints", paths: ["assets/sounds/doublePoints.wav"] },
    { name: "death", paths: ["assets/sounds/explosion.mp3"] },
    { name: "arcadeMusic", paths: ["assets/music/arcade.mp3"], },
    { name: "easterEggMusic", paths: ["assets/music/easterEgg.mp3"], },
    { name: "creditsMusic", paths: ["assets/music/credits.mp3"], },
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
