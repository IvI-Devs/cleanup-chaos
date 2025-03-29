type Trash = {
  [key: string]: number;
};

type Level = {
  name: string;
  asteroidsGenerationDelay: number;
  trashGenerationDelay: number;
  powerUpsGenerationDelay: number;
  trash?: Trash;
};


export let GameInfo = {
  title: "Cleanup Chaos",
  version: "1.0.0",
  authors: ["pH@nto.m", "p1x3lc4t", "Z3n0x", "T1g3r", "pAKo3549", "A.P."],
  description: "...",
  credits: [
      "Designed by: P4K0, pH@ntom, A.P., Z3n0x",
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
      items: {"Music": true, "Sound Effects": true},
      font: "Pixelify Sans",
      align: 'center',
      fontSize: 50
    },

    powerUpsGenerationDelay: 7500,
    powerUps: {
      shield: 2500,
      boost: 3000,
      doublePoints: 5000,
    },

    levels: [
      {
        name: "Arcade",
        background: "bg-01",
        asteroidsGenerationDelay: 1500,
        trashGenerationDelay: 1500,
        powerUpsGenerationDelay: 5000,
        trash: {
          bottle: 45,
          pizzaCarton: 75,
          can: 30
        }
      },
      {
        name: "Zona Contaminata",
        background: "bg-05",
        asteroidsGenerationDelay: 1500,
        trashGenerationDelay: 1500,
        powerUpsGenerationDelay: 5000,
        trash: {
          nebula: 47,
          sprayBottle: 84,
          fuel: 100
        }
      },
      {
        name: "Corrente della distruzione",
        background: "bg-06",
        asteroidsGenerationDelay: 1000,
        trashGenerationDelay: 1000,
        powerUpsGenerationDelay: 7500,
        trash: {
          computer: 75,
          floppy: 25,
          disc: 15
        }
      },
      {
        name: "Flusso insensato",
        background: "bg-07",
        asteroidsGenerationDelay: 750,
        trashGenerationDelay: 750,
        powerUpsGenerationDelay: 10000,
        trash: {
          shuttle: 150,
          battery: 25,
          computer: 75,
          floppy: 25,
          disc: 15,
          nebula: 47,
          sprayBottle: 84,
          fuel: 100
        }
      },
    ]

};
