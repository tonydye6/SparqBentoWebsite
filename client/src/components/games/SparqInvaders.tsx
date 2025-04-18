import { useRef, useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';

export function SparqInvaders() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [displayScore, setDisplayScore] = useState({ current: 0, high: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Create gradient background
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#1a1b26');
    gradient.addColorStop(1, '#16161e');

    let isGameActive = true;
    let animationFrameId: number;
    let gameStarted = false;

    // Game state
    const gameState = {
      score: 0,
      highScore: parseInt(localStorage.getItem('sparqInvadersHighScore') || '0'),
      level: 1,
      lives: 3,
      isGameOver: false
    };

    // Game constants
    const PLAYER_SPEED = 5;
    const BULLET_SPEED = 7;
    const ENEMY_SPEED = 0.25;
    const SHOOT_COOLDOWN = 250;

    // Game objects
    const player = {
      x: canvas.width / 2 - 50,
      y: canvas.height - 120,
      width: 100,
      height: 100,
      speed: PLAYER_SPEED
    };

    let lastShootTime = 0;
    let bullets: { x: number; y: number; width: number; height: number }[] = [];
    let enemies: {
      x: number;
      y: number;
      width: number;
      height: number;
      img: HTMLImageElement;
      points: number;
      direction: number;
      speed: number;
      movementPattern: any;
      initialY: number;
    }[] = [];
    let particles: {
      x: number;
      y: number;
      vx: number;
      vy: number;
      life: number;
      color: string;
    }[] = [];
    let scorePopups: {
      value: number;
      x: number;
      y: number;
      life: number;
    }[] = [];

    // Load images
    const playerImage = new Image();
    playerImage.src = '/game_hero.png';

    const enemyImages = Array.from({ length: 8 }, (_, i) => {
      const img = new Image();
      img.src = `/invader_${i + 1}.png`;
      return img;
    });

    // Draw grid background
    function drawGrid() {
      ctx.strokeStyle = 'rgba(235, 0, 40, 0.25)';
      ctx.lineWidth = 1.5;
      ctx.shadowColor = 'rgba(235, 0, 40, 0.3)';
      ctx.shadowBlur = 5;

      // Vertical lines
      for (let x = 0; x < canvas.width; x += 20) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }

      // Horizontal lines
      for (let y = 0; y < canvas.height; y += 20) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      ctx.shadowBlur = 0;
    }

    function createExplosion(x: number, y: number, color: string) {
      for (let i = 0; i < 15; i++) {
        particles.push({
          x,
          y,
          vx: (Math.random() - 0.5) * 8,
          vy: (Math.random() - 0.5) * 8,
          life: 1,
          color: `rgba(235, 0, 40, ${Math.random() * 0.5 + 0.5})`
        });
      }
    }

    function createScorePopup(x: number, y: number, value: number) {
      scorePopups.push({
        value,
        x,
        y,
        life: 1
      });
    }

    function updateParticles() {
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 0.02;
        if (p.life <= 0) particles.splice(i, 1);
      }
    }

    function updateScorePopups() {
      for (let i = scorePopups.length - 1; i >= 0; i--) {
        const popup = scorePopups[i];
        popup.y -= 1;
        popup.life -= 0.02;
        if (popup.life <= 0) scorePopups.splice(i, 1);
      }
    }
    
    const MOVEMENT_PATTERNS = {
      HORIZONTAL: (enemy: any, time: number) => {
        return { dx: enemy.direction * enemy.speed, dy: 0 };
      },
      WAVE: (enemy: any, time: number) => {
        const amplitude = 30;
        const frequency = 0.02;
        const dy = Math.cos(time * frequency) * 0.5;
        return { dx: enemy.direction * enemy.speed * 0.8, dy };
      },
      DIAGONAL: (enemy: any, time: number) => {
        const amplitude = 20;
        const frequency = 0.015;
        const dy = Math.sin(time * frequency) * 0.3;
        return { dx: enemy.direction * enemy.speed * 1.2, dy };
      },
      ZIGZAG: (enemy: any, time: number) => {
        const zigzagTime = Math.floor(time / 60) % 2;
        const dy = zigzagTime === 0 ? 0.5 : -0.5;
        return { dx: enemy.direction * enemy.speed * (zigzagTime === 0 ? 1 : -1), dy };
      }
    };

    // Add enemy type definitions and modified enemy creation logic
    interface EnemyType {
      points: number;
      speed: number;
      imageIndex: number;
      probability: number;
      movementPattern: any;
    }

    const ENEMY_TYPES: { [key: string]: EnemyType } = {
      BASIC: {
        points: 100,
        speed: 1,
        imageIndex: 0,
        probability: 0.4,
        movementPattern: MOVEMENT_PATTERNS.HORIZONTAL
      },
      FAST: {
        points: 150,
        speed: 1.5,
        imageIndex: 1,
        probability: 0.3,
        movementPattern: MOVEMENT_PATTERNS.DIAGONAL
      },
      TANK: {
        points: 200,
        speed: 0.8,
        imageIndex: 2,
        probability: 0.2,
        movementPattern: MOVEMENT_PATTERNS.WAVE
      },
      ELITE: {
        points: 300,
        speed: 1.2,
        imageIndex: 3,
        probability: 0.1,
        movementPattern: MOVEMENT_PATTERNS.ZIGZAG
      }
    };
      let gameTime = 0;

    // Update the createEnemies function with enemy type selection
    function createEnemies() {
      const rows = 4;
      const cols = 8;
      const padding = 20;
      const startX = padding;
      const startY = 50;
      const width = 30;
      const height = 30;
      const spacing = (canvas.width - 2 * padding - cols * width) / (cols - 1);

      enemies = [];

      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          // Determine enemy type based on probabilities and row position
          const rand = Math.random();
          let selectedType: EnemyType;
          let cumulative = 0;

          // Higher rows have better chance for stronger enemies
          const rowMultiplier = (rows - row) / rows;

          for (const type of Object.values(ENEMY_TYPES)) {
            cumulative += type.probability * rowMultiplier;
            if (rand <= cumulative) {
              selectedType = type;
              break;
            }
          }

          // Fallback to basic type if no selection was made
          if (!selectedType) {
            selectedType = ENEMY_TYPES.BASIC;
          }

          enemies.push({
            x: startX + col * (width + spacing),
            y: startY + row * 40,
            width,
            height,
            img: enemyImages[selectedType.imageIndex],
            points: selectedType.points,
            direction: 1,
            speed: selectedType.speed,
            movementPattern: selectedType.movementPattern,
            initialY: startY + row * 40
          });
        }
      }
    }

    const keys = {
      left: false,
      right: false,
      space: false
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === ' ') e.preventDefault();

      if (!gameStarted) {
        gameStarted = true;
        return;
      }

      if (gameState.isGameOver && e.key === ' ') {
        resetGame();
        return;
      }

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

    const handleKeyUp = (e: KeyboardEvent) => {
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

    function shoot() {
      const now = Date.now();
      if (now - lastShootTime >= SHOOT_COOLDOWN) {
        bullets.push({
          x: player.x + player.width / 2 - 2,
          y: player.y,
          width: 4,
          height: 10
        });
        lastShootTime = now;
      }
    }

    function updateGame() {
      if (gameState.isGameOver) return;

      // Player movement
      if (keys.left) {
        player.x = Math.max(0, player.x - player.speed);
      }
      if (keys.right) {
        player.x = Math.min(canvas.width - player.width, player.x + player.speed);
      }
      if (keys.space) {
        shoot();
      }
      gameTime++;

      // Update bullets
      for (let i = bullets.length - 1; i >= 0; i--) {
        const bullet = bullets[i];
        bullet.y -= BULLET_SPEED;
        if (bullet.y < 0) bullets.splice(i, 1);
      }

      let touchedEdge = false;
      const currentLevelSpeed = ENEMY_SPEED * (1 + 0.15 * (gameState.level - 1));

      enemies.forEach(enemy => {
        // Calculate movement based on pattern
        const movement = enemy.movementPattern(enemy, gameTime);

        // Update position
        enemy.x += movement.dx * currentLevelSpeed;
        enemy.y += movement.dy;

        // Check boundaries
        if (enemy.x <= 0 || enemy.x + enemy.width >= canvas.width) {
          touchedEdge = true;
        }

        // Limit vertical movement range
        const maxVerticalDeviation = 30;
        if (Math.abs(enemy.y - enemy.initialY) > maxVerticalDeviation) {
          enemy.y = enemy.initialY + (maxVerticalDeviation * Math.sign(enemy.y - enemy.initialY));
        }
      });

      // If any enemy touches the edge, move all enemies down
      if (touchedEdge) {
        enemies.forEach(enemy => {
          enemy.direction *= -1;
          enemy.y += 20;  // Move down
          enemy.initialY += 20;  // Update the baseline for pattern movement
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
            createExplosion(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2, '#eb0028');
            createScorePopup(enemy.x + enemy.width / 2, enemy.y, enemy.points);
            bullets.splice(i, 1);
            enemies.splice(j, 1);
            gameState.score += enemy.points;
            gameState.highScore = Math.max(gameState.highScore, gameState.score);
            localStorage.setItem('sparqInvadersHighScore', gameState.highScore.toString());
            setDisplayScore({ current: gameState.score, high: gameState.highScore });
            break;
          }
        }
      }

      // Check for enemy collision with player or reaching bottom
      for (let i = enemies.length - 1; i >= 0; i--) {
        const enemy = enemies[i];
        if (
          enemy.y + enemy.height > player.y ||
          (enemy.x < player.x + player.width &&
            enemy.x + enemy.width > player.x &&
            enemy.y < player.y + player.height &&
            enemy.y + enemy.height > player.y)
        ) {
          gameState.lives--;
          createExplosion(player.x + player.width / 2, player.y + player.height / 2, '#eb0028');
          if (gameState.lives <= 0) {
            gameOver();
          } else {
            // Reset enemy positions if player still has lives
            enemies.forEach(e => {
              e.y = e.y - 100;
            });
          }
        }
      }

      // Check level complete
      if (enemies.length === 0) {
        gameState.level++;
        createEnemies();
      }

      updateParticles();
      updateScorePopups();
    }

    function drawGame() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw background
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      drawGrid();

      if (!gameStarted) {
        // Draw start screen
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.shadowColor = 'rgba(235, 0, 40, 0.8)';
        ctx.shadowBlur = 15;

        ctx.font = 'bold 24px "Chakra Petch"';
        ctx.fillText('SPARQ INVADERS', canvas.width / 2, canvas.height / 2 - 40);

        ctx.font = 'bold 18px "Chakra Petch"';
        ctx.fillText('Press SPACE to Start', canvas.width / 2, canvas.height / 2 + 10);

        ctx.font = '16px "Chakra Petch"';
        ctx.fillText('Use A/D or Arrow Keys to Move', canvas.width / 2, canvas.height / 2 + 50);
        ctx.fillText('SPACE to Shoot', canvas.width / 2, canvas.height / 2 + 80);

        ctx.shadowBlur = 0;
        return;
      }

      if (!gameState.isGameOver) {
        // Draw player with glow effect
        ctx.shadowColor = 'rgba(235, 0, 40, 0.5)';
        ctx.shadowBlur = 20;
        ctx.drawImage(playerImage, player.x, player.y, player.width, player.height);
        ctx.shadowBlur = 0;

        // Draw enemies
        enemies.forEach(enemy => {
          ctx.drawImage(enemy.img, enemy.x, enemy.y, enemy.width, enemy.height);
        });

        // Draw bullets with glow effect
        ctx.shadowColor = 'rgba(235, 0, 40, 0.8)';
        ctx.shadowBlur = 10;
        ctx.fillStyle = '#ff3366';

        bullets.forEach(bullet => {
          ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
        });

         // Draw particles with glow
        particles.forEach(p => {
          ctx.globalAlpha = p.life;
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
          ctx.fill();
        });
        ctx.globalAlpha = 1;
        ctx.shadowBlur = 0;

        // Draw score popups with enhanced visibility
        ctx.font = 'bold 16px "Chakra Petch"';
        ctx.fillStyle = '#ffffff';
        ctx.shadowColor = 'rgba(235, 0, 40, 0.8)';
        ctx.shadowBlur = 10;
        scorePopups.forEach(popup => {
          ctx.globalAlpha = popup.life;
          ctx.fillText(`+${popup.value}`, popup.x, popup.y);
        });
        ctx.globalAlpha = 1;
        ctx.shadowBlur = 0;

        // Draw HUD
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 16px "Chakra Petch"';
        ctx.textAlign = 'left';
        ctx.shadowColor = 'rgba(235, 0, 40, 0.5)';
        ctx.shadowBlur = 10;
        ctx.fillText(`Score: ${gameState.score}`, 10, 25);
        ctx.fillText(`High Score: ${gameState.highScore}`, 10, 50);
        ctx.fillText(`Level: ${gameState.level}`, canvas.width - 100, 25);
        ctx.fillText(`Lives: ${gameState.lives}`, canvas.width - 100, 50);
        ctx.shadowBlur = 0;
      } else {
        // Draw game over screen
        ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.shadowColor = 'rgba(235, 0, 40, 0.8)';
        ctx.shadowBlur = 15;

        ctx.font = 'bold 32px "Chakra Petch"';
        ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 2 - 40);

        ctx.font = 'bold 24px "Chakra Petch"';
        ctx.fillText(`Score: ${gameState.score}`, canvas.width / 2, canvas.height / 2 + 10);
        ctx.fillText(`High Score: ${gameState.highScore}`, canvas.width / 2, canvas.height / 2 + 40);

        ctx.font = '20px "Chakra Petch"';
        ctx.fillText('Press SPACE to Play Again', canvas.width / 2, canvas.height / 2 + 90);

        ctx.shadowBlur = 0;
      }
    }

    function gameLoop() {
      if (!isGameActive) return;

      updateGame();
      drawGame();
      animationFrameId = requestAnimationFrame(gameLoop);
    }

    function gameOver() {
      gameState.isGameOver = true;
      setDisplayScore({ current: gameState.score, high: gameState.highScore });
    }

    function resetGame() {
      gameState.score = 0;
      gameState.level = 1;
      gameState.lives = 3;
      gameState.isGameOver = false;
      player.x = canvas.width / 2 - player.width / 2;
      bullets = [];
      particles = [];
      scorePopups = [];
      createEnemies();
      setDisplayScore({ current: 0, high: gameState.highScore });
    }

    // Set up event listeners
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    // Initialize game
    createEnemies();
    gameLoop();

    // Cleanup
    return () => {
      isGameActive = false;
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, []);

  return (
    <Card className="w-full h-full bg-carbon flex items-center justify-center relative overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-40" 
        style={{ 
          backgroundImage: 'url("/bg3.png")',
          filter: 'brightness(0.5) contrast(1.2)'
        }} 
      />
      <canvas
        ref={canvasRef}
        width={350}
        height={635}
        className="max-w-full h-auto relative z-10"
        style={{ 
          backgroundColor: 'rgba(0,0,0,0.85)',
          boxShadow: '0 0 30px rgba(235, 0, 40, 0.2)',
          border: '1px solid rgba(235, 0, 40, 0.4)',
          borderRadius: '8px'
        }}
      />
    </Card>
  );
}