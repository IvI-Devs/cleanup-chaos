export let GameInfo = {
  title: "Cleanup Chaos",
  version: "1.0.0",
  authors: ["pH@nto.m", "p1x3lc4t", "Z3n0x", "T1g3r", "pAKo3549", "A.P."],
  description: "...",
  credits: [
      "Designed by: P4K0, A.P.",
      "Developed by: pH@ntom, p1x3lc4t, Z3n0x, T1g3r",
      "Music by: pH@nto.m, T1g3r",
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
      items: {"Music": true, "Sound Effects": false},
      font: "Pixelify Sans",
      align: 'center',
      fontSize: 50
    },

    trash: {
      bottle: 45,
      pizzaCarton: 75,
      can: 30
    },

    powerUps: {
      shield: 5000,
      speed: 5000,
    }

};