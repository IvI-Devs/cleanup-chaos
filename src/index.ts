import "phaser";
// scenes
import Boot from "./scenes/Boot";
import Hud from "./scenes/Hud";
import Preloader from "./scenes/Preloader";
import GamePlay from "./scenes/GamePlay";
import GameOver from "./scenes/GameOver";
import Intro from "./scenes/Intro";
import Options from "./scenes/screens/options";
import Credits from "./scenes/screens/credits";
import Exit from "./scenes/easter\ eggs/exit";
import Levels from "./scenes/screens/Levels";
import Minimap from "./scenes/Minimap";
import PauseMenu from "./scenes/PauseMenu";
import { GameData } from "./GameData"; // global game data


window.addEventListener("load", () => {
  const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.WEBGL,
    backgroundColor: GameData.globals.bgColor,
    parent: "my-game",
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
      width: GameData.globals.gameWidth,
      height: GameData.globals.gameHeight,
    },
    scene: [
      Boot,
      Hud,
      Preloader,
      Intro,
      GamePlay,
      GameOver,
      Options,
      Credits,
      Exit,
      Minimap,
      PauseMenu,
      Levels
    ],
    physics: {
      default: "arcade",
      arcade: { debug: GameData.globals.debug, }
    },
    input: {
      activePointers: 2,
      keyboard: true,
    },
    render: {
      pixelArt: false,
      antialias: true,
    },
  };

  const game = new Phaser.Game(config); // game initializing according to configs
});