import { useRef, useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';

export function SparqInvaders() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameState, setGameState] = useState({
    currentScore: 0,
    highScore: parseInt(localStorage.getItem('sparqInvadersHighScore') || '0'),
    lives: 3,
    level: 1,
    isGameOver: false
  });
  const gameLoopRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

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
      speed: PLAYER_SPEED,
      canShoot: true
    };

    let bullets: Array<{x: number; y: number; width: number; height: number; speed: number}> = [];
    let enemies: Array<{
      x: number;
      y: number;
      width: number;
      height: number;
      img: HTMLImageElement;
      points: number;
      direction: number;
    }> = [];
    let particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      life: number;
      color: string;
    }> = [];
    let lastShot = 0;
    const SHOOT_COOLDOWN = 250;

    // Initialize game assets
    const playerImg = new Image();
    playerImg.src = '/game_hero.png';

    const enemyImages = Array.from({ length: 8 }, (_, i) => {
      const img = new Image();
      img.src = `/invader_${i + 1}.png`;
      return img;
    });

    // Initialize enemy formation
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
          const pointValue = (rows - row) * 100;
          enemies.push({
            x: startX + col * spacingX,
            y: startY + row * spacingY,
            width: 40,
            height: 40,
            img: enemyImages[Math.floor(row * 2 + Math.random() * 2)],
            points: pointValue,
            direction: 1
          });
        }
      }
    };

    // Particle system
    const createExplosion = (x: number, y: number, color: string) => {
      for (let i = 0; i < 15; i++) {
        particles.push({
          x,
          y,
          vx: (Math.random() - 0.5) * 8,
          vy: (Math.random() - 0.5) * 8,
          life: 1,
          color
        });
      }
    };

    // Update particles
    const updateParticles = () => {
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 0.02;
        if (p.life <= 0) particles.splice(i, 1);
      }
    };

    // Draw particles
    const drawParticles = () => {
      particles.forEach(p => {
        ctx.save();
        ctx.globalAlpha = p.life;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });
    };

    // Keyboard controls
    const keys = {
      left: false,
      right: false,
      space: false
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'a' || e.key === 'A' || e.key === 'ArrowLeft') keys.left = true;
      if (e.key === 'd' || e.key === 'D' || e.key === 'ArrowRight') keys.right = true;
      if (e.key === ' ') {
        e.preventDefault();
        keys.space = true;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'a' || e.key === 'A' || e.key === 'ArrowLeft') keys.left = false;
      if (e.key === 'd' || e.key === 'D' || e.key === 'ArrowRight') keys.right = false;
      if (e.key === ' ') keys.space = false;
    };

    // Game update logic
    const update = () => {
      // Player movement
      if (keys.left) {
        player.x = Math.max(0, player.x - player.speed);
      }
      if (keys.right) {
        player.x = Math.min(canvas.width - player.width, player.x + player.speed);
      }

      // Shooting
      const now = Date.now();
      if (keys.space && now - lastShot > SHOOT_COOLDOWN) {
        bullets.push({
          x: player.x + player.width / 2 - 2,
          y: player.y,
          width: 4,
          height: 10,
          speed: BULLET_SPEED
        });
        lastShot = now;
      }

      // Update bullets
      for (let i = bullets.length - 1; i >= 0; i--) {
        const bullet = bullets[i];
        bullet.y -= bullet.speed;
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
            createExplosion(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2, '#eb0028');
            bullets.splice(i, 1);
            enemies.splice(j, 1);
            setGameState(prev => {
              const newScore = prev.currentScore + enemy.points;
              const newHighScore = Math.max(prev.highScore, newScore);
              localStorage.setItem('sparqInvadersHighScore', newHighScore.toString());
              return {
                ...prev,
                currentScore: newScore,
                highScore: newHighScore
              };
            });
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

      updateParticles();
    };

    // Draw game
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw background
      ctx.fillStyle = 'black';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      if (!gameState.isGameOver) {
        // Draw player
        if (playerImg.complete) {
          ctx.drawImage(playerImg, player.x, player.y, player.width, player.height);
        }

        // Draw enemies
        enemies.forEach(enemy => {
          if (enemy.img.complete) {
            ctx.drawImage(enemy.img, enemy.x, enemy.y, enemy.width, enemy.height);
          }
        });

        // Draw bullets
        ctx.fillStyle = '#eb0028';
        bullets.forEach(bullet => {
          ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
        });

        // Draw particles
        drawParticles();

        // Draw UI
        ctx.fillStyle = 'white';
        ctx.font = '16px "Chakra Petch"';
        ctx.fillText(`Score: ${gameState.currentScore}`, 10, 25);
        ctx.fillText(`High Score: ${gameState.highScore}`, 10, 50);
        ctx.fillText(`Level: ${gameState.level}`, canvas.width - 100, 25);
        ctx.fillText(`Lives: ${gameState.lives}`, canvas.width - 100, 50);
      } else {
        // Draw game over screen
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'white';
        ctx.font = '32px "Chakra Petch"';
        ctx.textAlign = 'center';
        ctx.fillText('Game Over!', canvas.width / 2, canvas.height / 2);
        ctx.font = '20px "Chakra Petch"';
        ctx.fillText(`Final Score: ${gameState.currentScore}`, canvas.width / 2, canvas.height / 2 + 40);
        ctx.fillText('Press Space to Play Again', canvas.width / 2, canvas.height / 2 + 80);
      }
    };

    // Game loop
    const gameLoop = () => {
      if (!gameState.isGameOver) {
        update();
      }
      draw();
      gameLoopRef.current = requestAnimationFrame(gameLoop);
    };

    // Game over
    const gameOver = () => {
      setGameState(prev => ({ ...prev, isGameOver: true }));
    };

    // Start game
    const startGame = () => {
      setGameState({
        currentScore: 0,
        highScore: parseInt(localStorage.getItem('sparqInvadersHighScore') || '0'),
        lives: 3,
        level: 1,
        isGameOver: false
      });
      bullets = [];
      particles = [];
      initEnemies();
    };

    // Event listeners
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    document.addEventListener('keydown', (e: KeyboardEvent) => {
      if (e.key === ' ' && gameState.isGameOver) {
        startGame();
      }
    });

    // Initialize game
    startGame();
    gameLoop();

    // Cleanup
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, [gameState.isGameOver]); // Only re-run effect when game over state changes

  return (
    <Card className="w-full h-full bg-black flex items-center justify-center">
      <canvas
        ref={canvasRef}
        width={350}
        height={635}
        style={{ backgroundColor: 'black' }}
        className="max-w-full h-auto"
      />
    </Card>
  );
}