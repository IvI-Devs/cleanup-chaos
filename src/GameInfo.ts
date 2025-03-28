export let GameInfo = {
  title: "Cleanup Chaos",
  version: "1.0.0",
  authors: ["pH@nto.m", "p1x3lc4t", "Z3n0x", "T1g3r", "pAKo3549", "A.P."],
  description: "...",
  credits: [
      "Designed by: P4K0, A.P., Z3n0x",
      "Developed by: pH@ntom, p1x3lc4t",
      "Music by: P4K0, T1g3r",
  ],

    default: {
      font: "Pixelify Sans",
    },

    gameTitle: {
      text: "Guardians of the Void: Cleanup Chaos",
      font: "Pixelify Sans",
      align: 'center',
      fontSize: 100,
    },

    menu: {
      items: ["Start Game", "Options", "Credits", "Exit"],
      font: "Pixelify Sans",
      align: 'center',
      fontSize: 50,
    },

    options: {
      items: {"Music": true, "Sound Effects": false, "Game Mode": true},
      font: "Pixelify Sans",
      align: 'center',
      fontSize: 50
    },

    trash: {
      bottle: 45,
      pizzaCarton: 75,
      can: 30
    },

    powerUpsGenerationDelay: 7500,
    powerUps: {
      shield: 2500,
      boost: 3000,
      doublePoints: 5000,
    }

};
