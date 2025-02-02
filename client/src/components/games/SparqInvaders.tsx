import { useRef, useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';

export function SparqInvaders() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameState, setGameState] = useState({
    currentScore: 0,
    highScore: parseInt(localStorage.getItem('sparqInvadersHighScore')) || 0,
    lives: 3,
    level: 1
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let gameLoop;

    // Game constants
    const PLAYER_SPEED = 5;
    const BULLET_SPEED = 7;
    const ENEMY_SPEED_BASE = 1;
    const ENEMY_DROP_DISTANCE = 20;

    // Game state
    let player = {
      x: canvas.width / 2 - 40,
      y: canvas.height - 80,
      width: 80,
      height: 80,
      speed: PLAYER_SPEED,
      canShoot: true
    };

    let bullets = [];
    let enemies = [];
    let particles = [];
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
    const createExplosion = (x, y, color) => {
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

    const handleKeyDown = (e) => {
      if (e.key === ' ') e.preventDefault();

      switch (e.key.toLowerCase()) {
        case 'a':
        case 'arrowleft':
          keys.left = true;
          break;
        case 'd':
        case 'arrowright':
          keys.right = true;
          break;
        case ' ':
          keys.space = true;
          break;
      }
    };

    const handleKeyUp = (e) => {
      switch (e.key.toLowerCase()) {
        case 'a':
        case 'arrowleft':
          keys.left = false;
          break;
        case 'd':
        case 'arrowright':
          keys.right = false;
          break;
        case ' ':
          keys.space = false;
          break;
      }
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

      // Update enemies with modified speed progression
      let touchedEdge = false;
      const currentLevelSpeed = ENEMY_SPEED_BASE * (1 + 0.15 * (gameState.level - 1));

      enemies.forEach(enemy => {
        enemy.x += enemy.direction * currentLevelSpeed;
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
            // Hit detected
            createExplosion(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2, '#ff0000');
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

      // Check game over
      if (enemies.some(enemy => enemy.y + enemy.height > player.y)) {
        gameOver();
      }

      // Check for level completion
      if (enemies.length === 0) {
        setGameState(prev => ({
          ...prev,
          level: prev.level + 1
        }));
        initEnemies();
      }

      updateParticles();
    };

    // Draw game
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Load and draw background image for start screen
      const bgImage = new Image();
      bgImage.onload = () => {
        if (!gameLoop) {
          ctx.save();
          ctx.globalAlpha = 0.3;
          ctx.drawImage(bgImage, 0, 0, canvas.width, canvas.height);
          ctx.restore();

          // Draw start screen text
          ctx.fillStyle = 'white';
          ctx.font = '24px "Chakra Petch"';
          ctx.textAlign = 'center';
          ctx.fillText('Press SPACE to Start', canvas.width / 2, canvas.height / 2);
          ctx.font = '16px "Chakra Petch"';
          ctx.fillText('Use A/D or Arrow Keys to Move', canvas.width / 2, canvas.height / 2 + 40);
          ctx.fillText('SPACE to Shoot', canvas.width / 2, canvas.height / 2 + 70);
        }
      };
      bgImage.src = '/bg_2.png';

      if (gameLoop) {
        // Draw player
        ctx.drawImage(playerImg, player.x, player.y, player.width, player.height);

        // Draw enemies
        enemies.forEach(enemy => {
          ctx.drawImage(enemy.img, enemy.x, enemy.y, enemy.width, enemy.height);
        });

        // Draw bullets
        ctx.fillStyle = '#ff0000';
        bullets.forEach(bullet => {
          ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
        });

        // Draw particles
        drawParticles();

        // Draw UI
        ctx.fillStyle = 'white';
        ctx.font = '16px "Chakra Petch"';
        ctx.textAlign = 'left';
        ctx.fillText(`Score: ${gameState.currentScore}`, 10, 25);
        ctx.fillText(`High Score: ${gameState.highScore}`, 10, 50);
        ctx.fillText(`Level: ${gameState.level}`, canvas.width - 100, 25);
      }
    };

    // Game loop
    const startGameLoop = () => {
      if (!gameLoop) {
        gameLoop = true;
        animate();
      }
    };

    const animate = () => {
      if (gameLoop) {
        update();
        draw();
        requestAnimationFrame(animate);
      }
    };

    // Start game when spacebar is pressed
    const handleStart = (e) => {
      if (e.code === 'Space' && !gameLoop) {
        startGameLoop();
      }
    };

    // Set up event listeners
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('keydown', handleStart);

    // Initial draw
    draw();

    // Cleanup
    return () => {
      gameLoop = false;
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('keydown', handleStart);
    };
  }, []);

  return (
    <Card className="w-full h-full bg-black flex items-center justify-center">
      <canvas
        ref={canvasRef}
        width={350}
        height={635}
        className="max-w-full h-auto"
        style={{ backgroundColor: 'black' }}
      />
    </Card>
  );
}