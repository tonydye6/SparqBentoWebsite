import { useEffect, useRef, useState } from 'react';
import { Card } from '@/components/ui/card';

interface Enemy {
  x: number;
  y: number;
  width: number;
  height: number;
  img: HTMLImageElement;
  dx: number;
  points: number;
  row: number;
}

export function SparqInvaders() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [currentScore, setCurrentScore] = useState(0);
  const [highScore, setHighScore] = useState(() => Number(localStorage.getItem('sparqHighScore')) || 0);
  const [level, setLevel] = useState(1);
  const [lives, setLives] = useState(3);
  const [gameState, setGameState] = useState<'playing' | 'gameOver' | 'levelComplete'>('playing');
  const lastShotTimeRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const player = {
      x: canvas.width / 2 - 30,
      y: canvas.height - 100,
      width: 60,
      height: 60,
      speed: 5
    };

    const bullets: Array<{ x: number; y: number; width: number; height: number }> = [];
    const enemies: Enemy[] = [];
    let playerImg: HTMLImageElement;
    let animationFrameId: number;

    const loadImage = (src: string): Promise<HTMLImageElement> => {
      return new Promise((resolve) => {
        const img = new Image();
        img.src = src;
        img.onload = () => resolve(img);
      });
    };

    const createEnemies = async () => {
      const enemyImages = await Promise.all([
        loadImage('/invader_1.png'), loadImage('/invader_2.png'),
        loadImage('/invader_3.png'), loadImage('/invader_4.png'),
        loadImage('/invader_5.png'), loadImage('/invader_6.png'),
        loadImage('/invader_7.png'), loadImage('/invader_8.png')
      ]);

      const rows = 4;
      const cols = 8;
      const offsetX = 30;
      const offsetY = 50;
      const spacingX = 60;
      const spacingY = 50;
      const pointsPerRow = [300, 200, 150, 100];

      for (let r = 0; r < rows; r++) {
        const imgIndex = r * 2;
        for (let c = 0; c < cols; c++) {
          enemies.push({
            x: offsetX + c * spacingX,
            y: offsetY + r * spacingY,
            width: 40,
            height: 40,
            img: enemyImages[imgIndex + (c % 2)],
            dx: 2 * (1 + (level - 1) * 0.15),
            points: pointsPerRow[r],
            row: r
          });
        }
      }
    };

    const gameLoop = () => {
      if (!ctx || !canvas || gameState !== 'playing') return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (playerImg) {
        ctx.drawImage(playerImg, player.x, player.y, player.width, player.height);
      }

      // Update and draw bullets
      for (let i = bullets.length - 1; i >= 0; i--) {
        const bullet = bullets[i];
        bullet.y -= 10;
        ctx.fillStyle = '#ff0000';
        ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
        if (bullet.y < 0) bullets.splice(i, 1);
      }

      // Update enemy formation
      let formationShouldReverse = false;
      enemies.forEach(enemy => {
        if (enemy.x <= 0 || enemy.x + enemy.width >= canvas.width) {
          formationShouldReverse = true;
        }
      });

      if (formationShouldReverse) {
        enemies.forEach(enemy => {
          enemy.dx *= -1;
          enemy.y += 20;
        });
      }

      // Move and draw enemies
      enemies.forEach(enemy => {
        enemy.x += enemy.dx;
        ctx.drawImage(enemy.img, enemy.x, enemy.y, enemy.width, enemy.height);

        if (enemy.y + enemy.height > player.y) {
          setLives(0);
          setGameState('gameOver');
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
            setCurrentScore(prev => prev + enemy.points);
            enemies.splice(j, 1);
            bullets.splice(i, 1);
            break;
          }
        }
      }

      // Draw UI
      ctx.fillStyle = 'white';
      ctx.font = '16px Arial';
      ctx.fillText(`Score: ${currentScore}`, 10, 20);
      ctx.fillText(`High Score: ${highScore}`, 10, 40);
      ctx.fillText(`Level: ${level}`, canvas.width - 80, 20);
      ctx.fillText(`Lives: ${lives}`, canvas.width - 80, 40);

      // Check victory condition
      if (enemies.length === 0) {
        setLevel(l => l + 1);
        setGameState('levelComplete');
        createEnemies();
      }

      animationFrameId = requestAnimationFrame(gameLoop);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowLeft', 'ArrowRight', 'a', 'd', ' '].includes(e.key)) {
        e.preventDefault();
      }

      if ((e.key === 'ArrowLeft' || e.key === 'a') && gameState === 'playing') {
        player.x = Math.max(player.x - player.speed, 0);
      }
      if ((e.key === 'ArrowRight' || e.key === 'd') && gameState === 'playing') {
        player.x = Math.min(player.x + player.speed, canvas.width - player.width);
      }
      if (e.key === ' ' && gameState === 'playing') {
        const currentTime = Date.now();
        if (currentTime - lastShotTimeRef.current >= 250) {
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

    const initGame = async () => {
      playerImg = await loadImage('/game_hero.png');
      await createEnemies();
      gameLoop();
    };

    document.addEventListener('keydown', handleKeyDown);
    initGame();

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      cancelAnimationFrame(animationFrameId);
    };
  }, [level, lives, gameState, currentScore, highScore]);

  useEffect(() => {
    if (currentScore > highScore) {
      setHighScore(currentScore);
      localStorage.setItem('sparqHighScore', currentScore.toString());
    }
  }, [currentScore, highScore]);

  return (
    <Card className="w-full h-full bg-black flex items-center justify-center">
      <div className="relative" style={{ width: '350px', height: '635px' }}>
        <canvas 
          ref={canvasRef} 
          width={350} 
          height={635} 
          style={{ backgroundColor: 'black' }}
        />
        {gameState === 'gameOver' && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-70">
            <div className="text-white text-center">
              <h2 className="text-3xl mb-4">Game Over!</h2>
              <p className="mb-2">Final Score: {currentScore}</p>
              <button 
                className="px-4 py-2 bg-red-600 rounded"
                onClick={() => window.location.reload()}
              >
                Play Again
              </button>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}