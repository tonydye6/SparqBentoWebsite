import { useEffect, useRef } from "react";

interface SpaceInvadersProps {
  width?: number;
  height?: number;
}

export function SpaceInvaders({ width = 350, height = 500 }: SpaceInvadersProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameStateRef = useRef({
    player: { x: 150, y: 450, width: 50, height: 50, speed: 5 },
    bullets: [] as { x: number, y: number, width: number, height: number }[],
    enemies: [] as { x: number, y: number, width: number, height: number, img: HTMLImageElement, direction: number }[],
    assets: {
      player: new Image(),
      enemies: [] as HTMLImageElement[],
      loaded: false,
      totalImages: 5, // player + 4 enemy types
      loadedImages: 0
    },
    keys: {
      left: false,
      right: false,
      space: false
    }
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const gameState = gameStateRef.current;

    // Asset loading with promises
    function loadImage(src: string): Promise<HTMLImageElement> {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
          gameState.assets.loadedImages++;
          resolve(img);
        };
        img.onerror = reject;
        img.src = src;
      });
    }

    // Load all assets
    Promise.all([
      loadImage('/game_hero.png'),
      loadImage('/invader_1.png'),
      loadImage('/invader_2.png'),
      loadImage('/invader_3.png'),
      loadImage('/invader_4.png')
    ]).then(([playerImg, ...enemyImages]) => {
      gameState.assets.player = playerImg;
      gameState.assets.enemies = enemyImages;
      gameState.assets.loaded = true;

      // Initialize enemies after images are loaded
      for (let i = 0; i < 5; i++) {
        for (let j = 0; j < 3; j++) {
          gameState.enemies.push({
            x: i * 60 + 20,
            y: j * 60 + 20,
            width: 40,
            height: 40,
            img: gameState.assets.enemies[j % gameState.assets.enemies.length],
            direction: Math.random() > 0.5 ? 1 : -1
          });
        }
      }
    }).catch(error => {
      console.error('Error loading game assets:', error);
    });

    // Event listeners
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'a') gameState.keys.left = true;
      if (e.key === 'ArrowRight' || e.key === 'd') gameState.keys.right = true;
      if (e.key === ' ') {
        e.preventDefault();
        if (!gameState.keys.space) {
          gameState.bullets.push({
            x: gameState.player.x + gameState.player.width / 2 - 2,
            y: gameState.player.y,
            width: 4,
            height: 10
          });
        }
        gameState.keys.space = true;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'a') gameState.keys.left = false;
      if (e.key === 'ArrowRight' || e.key === 'd') gameState.keys.right = false;
      if (e.key === ' ') gameState.keys.space = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    // Game loop
    function gameLoop() {
      if (!canvas || !ctx || !gameState.assets.loaded) {
        requestAnimationFrame(gameLoop);
        return;
      }

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update player position
      if (gameState.keys.left) {
        gameState.player.x = Math.max(0, gameState.player.x - gameState.player.speed);
      }
      if (gameState.keys.right) {
        gameState.player.x = Math.min(
          canvas.width - gameState.player.width,
          gameState.player.x + gameState.player.speed
        );
      }

      // Draw player
      ctx.drawImage(
        gameState.assets.player,
        gameState.player.x,
        gameState.player.y,
        gameState.player.width,
        gameState.player.height
      );

      // Update and draw bullets
      gameState.bullets = gameState.bullets.filter(bullet => {
        bullet.y -= 5;
        ctx.fillStyle = 'red';
        ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);

        // Check collision with enemies
        gameState.enemies = gameState.enemies.filter(enemy => {
          const hit = (
            bullet.x < enemy.x + enemy.width &&
            bullet.x + bullet.width > enemy.x &&
            bullet.y < enemy.y + enemy.height &&
            bullet.y + bullet.height > enemy.y
          );
          return !hit;
        });

        return bullet.y > 0;
      });

      // Update and draw enemies
      gameState.enemies.forEach(enemy => {
        enemy.x += enemy.direction;
        if (enemy.x <= 0 || enemy.x + enemy.width >= canvas.width) {
          enemy.direction *= -1;
          enemy.y += 20;
        }
        ctx.drawImage(enemy.img, enemy.x, enemy.y, enemy.width, enemy.height);
      });

      requestAnimationFrame(gameLoop);
    }

    gameLoop();

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className="rounded-lg"
      tabIndex={0}
      style={{ background: 'rgba(0, 0, 0, 0.3)' }}
    />
  );
}