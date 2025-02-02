
import { useRef, useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';

interface GameState {
  currentScore: number;
  highScore: number;
  lives: number;
  level: number;
  isRunning: boolean;
}

export function SparqInvaders() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameState, setGameState] = useState<GameState>({
    currentScore: 0,
    highScore: parseInt(localStorage.getItem('sparqInvadersHighScore') || '0'),
    lives: 3,
    level: 1,
    isRunning: false
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    // Game constants
    const PLAYER_SPEED = 5;
    const BULLET_SPEED = 7;
    const ENEMY_SPEED_BASE = 1;
    const ENEMY_DROP_DISTANCE = 20;

    // Game state
    const player = {
      x: canvas.width / 2 - 40,
      y: canvas.height - 80,
      width: 80,
      height: 80,
      speed: PLAYER_SPEED
    };

    let bullets: any[] = [];
    let enemies: any[] = [];
    let lastShot = 0;
    const SHOOT_COOLDOWN = 250;

    // Initialize game assets
    const playerImg = new Image();
    playerImg.src = '/game_hero.png';

    const enemyImages = Array.from({length: 8}, (_, i) => {
      const img = new Image();
      img.src = `/invader_${i + 1}.png`;
      return img;
    });

    const initEnemies = () => {
      enemies = [];
      const rows = 4;
      const cols = 8;
      const startX = 30;
      const startY = 50;
      const spacingX = (canvas.width - 2 * startX) / (cols - 1);
      const spacingY = 50;

      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          enemies.push({
            x: startX + col * spacingX,
            y: startY + row * spacingY,
            width: 40,
            height: 40,
            img: enemyImages[Math.floor(row * 2 + Math.random() * 2)],
            points: (4 - row) * 100,
            direction: 1
          });
        }
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = 'black';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      if (!gameState.isRunning) {
        ctx.fillStyle = 'white';
        ctx.font = '24px Chakra Petch';
        ctx.textAlign = 'center';
        ctx.fillText('Press SPACE to Start', canvas.width / 2, canvas.height / 2);
        return;
      }

      ctx.drawImage(playerImg, player.x, player.y, player.width, player.height);

      enemies.forEach(enemy => {
        ctx.drawImage(enemy.img, enemy.x, enemy.y, enemy.width, enemy.height);
      });

      ctx.fillStyle = '#eb0028';
      bullets.forEach(bullet => {
        ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
      });

      // Draw UI
      ctx.fillStyle = 'white';
      ctx.font = '16px Chakra Petch';
      ctx.textAlign = 'left';
      ctx.fillText(`Score: ${gameState.currentScore}`, 10, 25);
      ctx.fillText(`High Score: ${gameState.highScore}`, 10, 50);
      ctx.fillText(`Level: ${gameState.level}`, canvas.width - 100, 25);
      ctx.fillText(`Lives: ${gameState.lives}`, canvas.width - 100, 50);
    };

    const update = () => {
      if (!gameState.isRunning) return;

      // Update bullets
      for (let i = bullets.length - 1; i >= 0; i--) {
        const bullet = bullets[i];
        bullet.y -= BULLET_SPEED;
        if (bullet.y + bullet.height < 0) {
          bullets.splice(i, 1);
        }
      }

      // Update enemies
      let touchedEdge = false;
      enemies.forEach(enemy => {
        enemy.x += enemy.direction * (ENEMY_SPEED_BASE * (1 + 0.1 * (gameState.level - 1)));
        if (enemy.x <= 0 || enemy.x + enemy.width >= canvas.width) {
          touchedEdge = true;
        }
      });

      if (touchedEdge) {
        enemies.forEach(enemy => {
          enemy.direction *= -1;
          enemy.y += ENEMY_DROP_DISTANCE;
        });
      }

      // Check collisions
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
            setGameState(prev => ({
              ...prev,
              currentScore: prev.currentScore + enemy.points
            }));
            break;
          }
        }
      }

      // Check for level completion
      if (enemies.length === 0) {
        setGameState(prev => ({
          ...prev,
          level: prev.level + 1
        }));
        initEnemies();
      }

      // Check for game over
      enemies.forEach(enemy => {
        if (enemy.y + enemy.height > player.y) {
          gameOver();
        }
      });
    };

    const gameLoop = () => {
      update();
      draw();
      animationFrameId = requestAnimationFrame(gameLoop);
    };

    const gameOver = () => {
      setGameState(prev => {
        const finalScore = prev.currentScore;
        if (finalScore > prev.highScore) {
          localStorage.setItem('sparqInvadersHighScore', finalScore.toString());
          return {
            ...prev,
            highScore: finalScore,
            isRunning: false
          };
        }
        return { ...prev, isRunning: false };
      });
    };

    const startGame = () => {
      setGameState(prev => ({
        ...prev,
        currentScore: 0,
        lives: 3,
        level: 1,
        isRunning: true
      }));
      bullets = [];
      initEnemies();
    };

    const keys = {
      left: false,
      right: false,
      space: false
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'a' || e.key === 'A') keys.left = true;
      if (e.key === 'd' || e.key === 'D') keys.right = true;
      if (e.key === ' ') {
        if (!gameState.isRunning) {
          startGame();
        }
        keys.space = true;
      }
      e.preventDefault();
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'a' || e.key === 'A') keys.left = false;
      if (e.key === 'd' || e.key === 'D') keys.right = false;
      if (e.key === ' ') keys.space = false;
      e.preventDefault();
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    // Start the game loop
    gameLoop();

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      cancelAnimationFrame(animationFrameId);
    };
  }, [gameState.isRunning, gameState.level, gameState.currentScore]);

  return (
    <Card className="w-full h-full bg-black flex items-center justify-center">
      <canvas 
        ref={canvasRef} 
        width={350} 
        height={635} 
        style={{ backgroundColor: 'black' }}
      />
    </Card>
  );
}
