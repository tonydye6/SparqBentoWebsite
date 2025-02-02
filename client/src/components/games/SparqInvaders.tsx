
import { useEffect, useRef, useState } from 'react';
import { Card } from '@/components/ui/card';

export function SparqInvaders() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [currentScore, setCurrentScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [lives, setLives] = useState(3);
  const lastShotTimeRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const PLAYER_SPEED = 5;
    const SHOT_COOLDOWN = 250;

    // Game state
    const player = { x: canvas.width / 2 - 40, y: canvas.height - 100, width: 80, height: 80, speed: PLAYER_SPEED };
    const bullets: Array<{ x: number, y: number, width: number, height: number }> = [];
    const enemies: Array<{ x: number, y: number, width: number, height: number, img: HTMLImageElement, dx: number, points: number }> = [];
    let playerImg: HTMLImageElement;
    let animationFrameId: number;

    // Image loader promise
    const loadImage = (src: string): Promise<HTMLImageElement> => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = src;
        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
      });
    };

    const initGame = async () => {
      try {
        playerImg = await loadImage('/game_hero.png');
        
        // Load enemy images for each row
        const row1Images = await Promise.all([
          loadImage('/invader_1.png'),
          loadImage('/invader_2.png')
        ]);
        const row2Images = await Promise.all([
          loadImage('/invader_3.png'),
          loadImage('/invader_4.png')
        ]);
        const row3Images = await Promise.all([
          loadImage('/invader_5.png'),
          loadImage('/invader_6.png')
        ]);
        const row4Images = await Promise.all([
          loadImage('/invader_7.png'),
          loadImage('/invader_8.png')
        ]);

        // Create enemy formation
        const rows = 4;
        const cols = 8;
        const offsetX = 30;
        const offsetY = 50;
        const spacingX = 60;
        const spacingY = 50;

        for (let r = 0; r < rows; r++) {
          let rowImages;
          let points;

          switch(r) {
            case 0:
              rowImages = row1Images;
              points = 300;
              break;
            case 1:
              rowImages = row2Images;
              points = 200;
              break;
            case 2:
              rowImages = row3Images;
              points = 150;
              break;
            case 3:
              rowImages = row4Images;
              points = 100;
              break;
            default:
              rowImages = row4Images;
              points = 100;
          }

          for (let c = 0; c < cols; c++) {
            enemies.push({
              x: offsetX + c * spacingX,
              y: offsetY + r * spacingY,
              width: 40,
              height: 40,
              img: rowImages[c % 2],
              dx: 1,
              points
            });
          }
        }
        gameLoop();
      } catch (error) {
        console.error('Error loading game assets:', error);
      }
    };

    const gameLoop = () => {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw the player
      ctx.drawImage(playerImg, player.x, player.y, player.width, player.height);

      // Update and draw bullets
      for (let i = bullets.length - 1; i >= 0; i--) {
        const bullet = bullets[i];
        bullet.y -= 5;
        ctx.fillStyle = 'red';
        ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
        if (bullet.y + bullet.height < 0) {
          bullets.splice(i, 1);
        }
      }

      // Update and draw enemies
      enemies.forEach((enemy) => {
        enemy.x += enemy.dx;
        if (enemy.x <= 0 || enemy.x + enemy.width >= canvas.width) {
          enemy.dx *= -1;
          enemy.y += 20;
        }
        ctx.drawImage(enemy.img, enemy.x, enemy.y, enemy.width, enemy.height);

        // Check for enemy reaching bottom
        if (enemy.y + enemy.height > player.y) {
          setLives(prev => Math.max(0, prev - 1));
          enemies.length = 0; // Reset enemies
          if (lives <= 1) {
            setHighScore(prev => Math.max(prev, currentScore));
            setCurrentScore(0);
          }
        }
      });

      // Collision detection
      for (let i = bullets.length - 1; i >= 0; i--) {
        const bullet = bullets[i];
        for (let j = enemies.length - 1; j >= 0; j--) {
          const enemy = enemies[j];
          if (
            bullet.x < enemy.x + enemy.width &&
            bullet.x + bullet.width > enemy.x &&
            bullet.y < enemy.y + enemy.height &&
            bullet.y + bullet.height > enemy.y
          ) {
            bullets.splice(i, 1);
            enemies.splice(j, 1);
            setCurrentScore(prev => prev + enemy.points);
            break;
          }
        }
      }

      // Draw UI
      ctx.fillStyle = 'white';
      ctx.font = '16px Arial';
      ctx.fillText(`Score: ${currentScore}`, 10, 20);
      ctx.fillText(`High Score: ${highScore}`, 10, 40);
      ctx.fillText(`Lives: ${lives}`, canvas.width - 70, 20);

      if (lives > 0) {
        animationFrameId = requestAnimationFrame(gameLoop);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.key === 'ArrowLeft' || e.key === 'a') && player.x > 0) {
        player.x = Math.max(0, player.x - player.speed);
      }
      if ((e.key === 'ArrowRight' || e.key === 'd') && player.x < canvas.width - player.width) {
        player.x = Math.min(canvas.width - player.width, player.x + player.speed);
      }
      if (e.key === ' ') {
        const currentTime = Date.now();
        if (currentTime - lastShotTimeRef.current >= SHOT_COOLDOWN) {
          bullets.push({
            x: player.x + player.width / 2 - 2,
            y: player.y,
            width: 4,
            height: 10
          });
          lastShotTimeRef.current = currentTime;
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    initGame();

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      cancelAnimationFrame(animationFrameId);
    };
  }, [currentScore, highScore, lives]);

  return (
    <div className="relative">
      <canvas ref={canvasRef} width={350} height={635} style={{ backgroundColor: 'black' }} />
      {lives === 0 && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-center">
          <h2 className="text-2xl mb-4">Game Over</h2>
          <button 
            className="px-4 py-2 bg-red-500 rounded"
            onClick={() => {
              setLives(3);
              setCurrentScore(0);
            }}
          >
            Play Again
          </button>
        </div>
      )}
    </div>
  );
}
