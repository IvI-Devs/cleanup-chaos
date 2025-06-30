# Guardians of the Void: Cleanup Chaos

![](https://img.shields.io/github/last-commit/IvI-Devs/cleanup-chaos?&style=for-the-badge&color=8272a4&logoColor=D9E0EE&labelColor=292324)
![](https://img.shields.io/github/stars/IvI-Devs/cleanup-chaos?style=for-the-badge&logo=polestar&color=FFB1C8&logoColor=D9E0EE&labelColor=292324)
![](https://img.shields.io/github/repo-size/IvI-Devs/cleanup-chaos?color=CAC992&label=SIZE&logo=files&style=for-the-badge&logoColor=D9E0EE&labelColor=292324)

**Guardians of the Void: Cleanup Chaos** is an exciting 2D space game built with Phaser 3 and TypeScript. Navigate through asteroid fields, collect space debris, and clean up the cosmos while avoiding dangerous obstacles. Features both story-driven levels and endless arcade mode!

## 🚀 Features

• **Responsive Fullscreen Gaming**: Optimized for all screen sizes with automatic scaling  
• **Two Game Modes**: Story-driven level progression and challenging arcade mode  
• **Power-Up System**: Collect shields, speed boosts, and double points to enhance gameplay  
• **Progressive Difficulty**: Multiple levels with increasing challenges and obstacles  
• **Audio Experience**: Immersive sound effects and background music  
• **Local Storage**: Save your progress and high scores automatically  
• **Intuitive Controls**: Keyboard controls (WASD/Arrow keys) with smooth ship movement  

## 🎮 The Game

Guardians of the Void puts you in control of a space cleanup vessel tasked with collecting debris while navigating through dangerous asteroid fields. The game combines action-packed gameplay with environmental themes, challenging players to clean up space while surviving increasingly difficult obstacles.

### How to Play

• **Movement**: Use WASD keys or arrow keys to navigate your ship  
• **Objective**: Collect space debris (trash) to earn points  
• **Avoid**: Asteroids that will damage your ship  
• **Power-ups**: Collect special items for temporary abilities:
  - 🛡️ **Shield**: Temporary invulnerability  
  - ⚡ **Speed Boost**: Increased movement speed (hold SPACE to activate)  
  - 💎 **Double Points**: Earn twice the score for collected items  
  - ❤️ **Heart**: Restore health  
• **Pause**: Press ESC to pause the game  
• **Lives**: You have 3 hearts - lose them all and it's game over!  

### Game Modes

• **Story Mode**: Progress through carefully designed levels with specific objectives  
• **Arcade Mode**: Endless gameplay with increasing difficulty for high score challenges  

## 🌐 Technologies Used

• **Phaser 3**: Powerful HTML5 game framework for 2D game development  
• **TypeScript**: Type-safe JavaScript for robust game logic  
• **Webpack**: Module bundler for efficient asset management and building  
• **SCSS**: Advanced CSS preprocessing for responsive styling  
• **HTML5 Canvas**: Hardware-accelerated graphics rendering  

## 🛠️ Development

### Prerequisites

- [Node.js](https://nodejs.org/) (>= 12)
- [npm](https://www.npmjs.com/) or [pnpm](https://pnpm.io/)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/IvI-Devs/cleanup-chaos.git
cd cleanup-chaos
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Build for production:
```bash
npm run build
```

5. Serve the built game:
```bash
npm run serve
```

6. Check deployment:
```bash
npm run check-deployment
```

### Project Structure

```
cleanup-chaos/
├── src/
│   ├── scenes/          # Game scenes (Menu, Game, Credits, etc.)
│   ├── assets/          # Game assets (images, sounds, music)
│   ├── scss/            # Stylesheets
│   ├── GameData.ts      # Game configuration
│   ├── GameInfo.ts      # Game metadata
│   └── index.ts         # Main game entry point
├── dist/                # Built game files
├── webpack/             # Webpack configuration
└── deployment-check.js  # Build verification script
```

## 🎯 Game Features

### Visual Elements
- **Dynamic Backgrounds**: Multiple space environments
- **Particle Effects**: Smooth animations and visual feedback
- **Responsive UI**: Scales perfectly on any screen size
- **Ship Damage States**: Visual representation of ship health

### Audio System
- **Background Music**: Immersive space soundtracks
- **Sound Effects**: Detailed audio feedback for all actions
- **Audio Controls**: Toggle music and sound effects independently

### Progression System
- **Level Unlock**: Complete levels to unlock new challenges
- **High Score Tracking**: Local storage of best performances
- **Achievement System**: Track your progress through the game

## 👥 Credits

- **Design**: [P4K0](https://github.com/Pako3549), [pH@ntom](https://github.com/antodeev), [A.P.](https://youtu.be/xvFZjo5PgG0?si=ZXlZYL7QkCGWbESW), [Z3n0x](https://github.com/Zenox19)
- **Development**: [pH@ntom](https://github.com/antodeev), [p1x3lc4t](https://github.com/gkkconan), [P4K0](https://github.com/Pako3549)
- **Music**: [P4K0](https://github.com/Pako3549), [T1g3r](https://github.com/Luigirau)

## 📄 License

This project is open-source and available under the GPL-3.0 License. See the [LICENSE](LICENSE) file for more details.

## 🔗 Links

- [Play the Game](https://ivi-devs.itch.io/cleanup-chaos)
- [Report Issues](https://github.com/IvI-Devs/cleanup-chaos/issues)
- [Contribute](https://github.com/IvI-Devs/cleanup-chaos/pulls)

---

**Ready to become a Guardian of the Void? Start your cleanup mission today!** 🚀✨
