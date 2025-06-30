import "phaser";
// scenes
import MainMenuScene from "./scenes/MainMenuScene";
import Preloader from "./scenes/Preloader";
import GameOverScene from "./scenes/GameOverScene";
import GameScene from "./scenes/GameScene";
import OptionsScene from "./scenes/OptionsScene";
import CreditsScene from "./scenes/CreditsScene";
import ExitScene from "./scenes/ExitScene";
import LevelSelectScene from "./scenes/LevelSelectScene";
import MinimapOverlay from "./scenes/MinimapOverlay";
import PauseScene from "./scenes/PauseScene";
import { GameData } from "./GameData"; // global game data


window.addEventListener("load", () => {
  const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.WEBGL,
    backgroundColor: GameData.globals.bgColor,
    parent: "my-game",
    scale: {
      mode: Phaser.Scale.RESIZE,
      autoCenter: Phaser.Scale.CENTER_BOTH,
      width: window.innerWidth,
      height: window.innerHeight,
    },
    scene: [
      MainMenuScene,
      Preloader,
      GameScene,
      GameOverScene,
      OptionsScene,
      CreditsScene,
      ExitScene,
      MinimapOverlay,
      PauseScene,
      LevelSelectScene
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
  
  // Handle window resize
  window.addEventListener('resize', () => {
    game.scale.resize(window.innerWidth, window.innerHeight);
  });
});