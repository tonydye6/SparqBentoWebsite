import { useEffect, useRef, useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface GameObject {
  x: number;
  y: number;
  width: number;
  height: number;
  speed?: number;
}

interface Enemy extends GameObject {
  img: HTMLImageElement;
  direction: number;
  points: number;
  type: number;
}

interface GameState {
  isPlaying: boolean;
  hasStarted: boolean;
  level: number;
  lives: number;
  screenShake: number;
}

interface SoundEffects {
  shoot: HTMLAudioElement;
  explosion: HTMLAudioElement;
}

export function SparqInvaders() {
  const { toast } = useToast();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [gameState, setGameState] = useState<GameState>({
    isPlaying: false,
    hasStarted: false,
    level: 1,
    lives: 3,
    screenShake: 0
  });

  const CANVAS_WIDTH = 600;
  const CANVAS_HEIGHT = 935;
  const ENEMY_ROWS = 4;
  const ENEMY_COLS = 8;
  const ENEMY_PADDING = 60;
  const ENEMY_TOP_OFFSET = 50;

  const gameLoop = useRef<number>();
  const lastTime = useRef<number>(0);
  const pressedKeys = useRef<Set<string>>(new Set());
  const sounds = useRef<SoundEffects>();
  const assets = useRef<{
    player: HTMLImageElement | null;
    enemies: HTMLImageElement[];
  }>({ player: null, enemies: [] });

  const player = useRef<GameObject>({
    x: CANVAS_WIDTH / 2,
    y: CANVAS_HEIGHT - 80,
    width: 50,
    height: 50,
    speed: 5
  });

  const bullets = useRef<GameObject[]>([]);
  const enemies = useRef<Enemy[]>([]);
  const particles = useRef<GameObject[]>([]);

  const loadImage = (src: string): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        console.log(`Successfully loaded: ${src}`);
        resolve(img);
      };
      img.onerror = () => {
        console.error(`Failed to load image: ${src}`);
        reject(new Error(`Failed to load image: ${src}`));
      };
      img.src = `/images/${src}`;
    });
  };

  const generateBeepSound = (): HTMLAudioElement => {
    const audio = new AudioContext();
    const oscillator = audio.createOscillator();
    const gainNode = audio.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audio.destination);

    oscillator.type = 'square';
    oscillator.frequency.setValueAtTime(440, audio.currentTime);
    gainNode.gain.setValueAtTime(0.1, audio.currentTime);

    oscillator.start();
    gainNode.gain.exponentialRampToValueAtTime(0.01, audio.currentTime + 0.1);
    oscillator.stop(audio.currentTime + 0.1);

    return new Audio();
  };

  const initAssets = async () => {
    try {
      console.log('Starting asset loading...');
      const playerImg = await loadImage('game_hero.svg');
      console.log('Player ship loaded');

      const enemyPromises = [
        loadImage('invader_1.svg'),
        loadImage('invader_2.svg'),
        loadImage('invader_3.svg'),
        loadImage('invader_4.svg')
      ];

      const enemyImgs = await Promise.all(enemyPromises);
      console.log('All enemy images loaded');

      const shootSound = generateBeepSound();
      const explosionSound = generateBeepSound();

      assets.current = { 
        player: playerImg, 
        enemies: enemyImgs
      };
      sounds.current = { shoot: shootSound, explosion: explosionSound };

      console.log('Assets initialized:', assets.current);
      return true;
    } catch (error) {
      console.error('Failed to load game assets:', error);
      toast({
        title: "Asset Loading Error",
        description: "Please refresh the page to try again.",
        variant: "destructive"
      });

      const ctx = canvasRef.current?.getContext('2d');
      if (ctx) {
        ctx.fillStyle = 'white';
        ctx.font = '20px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Failed to load game assets', CANVAS_WIDTH/2, CANVAS_HEIGHT/2 - 20);
        ctx.fillText('Please refresh the page', CANVAS_WIDTH/2, CANVAS_HEIGHT/2 + 20);
      }
      return false;
    }
  };

  const initEnemies = () => {
    console.log('Initializing enemies...');
    enemies.current = [];
    for (let row = 0; row < ENEMY_ROWS; row++) {
      for (let col = 0; col < ENEMY_COLS; col++) {
        const enemyType = (row + Math.floor(col / 2)) % assets.current.enemies.length;
        enemies.current.push({
          x: col * ENEMY_PADDING + ENEMY_PADDING,
          y: row * ENEMY_PADDING + ENEMY_TOP_OFFSET,
          width: 40,
          height: 40,
          img: assets.current.enemies[enemyType],
          direction: 1,
          points: (ENEMY_ROWS - row) * 100 + (enemyType + 1) * 50,
          type: enemyType,
          speed: 1 + (gameState.level * 0.1)
        });
      }
    }
    console.log('Enemies initialized:', enemies.current.length);
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === ' ') {
      e.preventDefault();
    }
    if (!gameState.hasStarted) return;
    pressedKeys.current.add(e.key);
    if (e.key === ' ') {
      createBullet();
      sounds.current?.shoot.play().catch(console.error);
    }
  };

  const handleKeyUp = (e: KeyboardEvent) => {
    pressedKeys.current.delete(e.key);
  };

  const createBullet = () => {
    bullets.current.push({
      x: player.current.x + player.current.width / 2 - 2,
      y: player.current.y,
      width: 4,
      height: 10
    });
  };

  const updatePlayer = (deltaTime: number) => {
    const keys = pressedKeys.current;
    if (keys.has('ArrowLeft') || keys.has('a')) {
      player.current.x = Math.max(0, player.current.x - (player.current.speed || 0) * deltaTime * 200);
    }
    if (keys.has('ArrowRight') || keys.has('d')) {
      player.current.x = Math.min(
        CANVAS_WIDTH - player.current.width,
        player.current.x + (player.current.speed || 0) * deltaTime * 200
      );
    }
  };

  const updateBullets = (deltaTime: number) => {
    bullets.current.forEach((bullet, index) => {
      bullet.y -= 400 * deltaTime;
      if (bullet.y < 0) bullets.current.splice(index, 1);
    });
  };

  const updateEnemies = (deltaTime: number) => {
    let shouldChangeDirection = false;
    enemies.current.forEach(enemy => {
      enemy.x += enemy.direction * enemy.speed! * deltaTime * 100;
      if (enemy.x <= 0 || enemy.x + enemy.width >= CANVAS_WIDTH) {
        shouldChangeDirection = true;
      }
    });

    if (shouldChangeDirection) {
      enemies.current.forEach(enemy => {
        enemy.direction *= -1;
        enemy.y += 20;
      });
    }
  };

  const checkCollisions = () => {
    bullets.current.forEach((bullet, bulletIndex) => {
      enemies.current.forEach((enemy, enemyIndex) => {
        if (detectCollision(bullet, enemy)) {
          createExplosion(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2);
          bullets.current.splice(bulletIndex, 1);
          enemies.current.splice(enemyIndex, 1);
          sounds.current?.explosion.play().catch(console.error);
          setGameState(prev => ({ ...prev, screenShake: 1 }));
          setScore(prev => {
            const newScore = prev + enemy.points;
            if (newScore > highScore) {
              setHighScore(newScore);
              localStorage.setItem('sparqInvadersHighScore', newScore.toString());
            }
            return newScore;
          });
        }
      });
    });
  };

  const detectCollision = (a: GameObject, b: GameObject) => {
    return (
      a.x < b.x + b.width &&
      a.x + a.width > b.x &&
      a.y < b.y + b.height &&
      a.y + a.height > b.y
    );
  };

  const createExplosion = (x: number, y: number) => {
    for (let i = 0; i < 10; i++) {
      particles.current.push({
        x,
        y,
        width: 2,
        height: 2,
        speed: Math.random() * 3 + 1
      });
    }
  };

  const updateParticles = (deltaTime: number) => {
    particles.current = particles.current.filter(particle => {
      particle.y += particle.speed! * deltaTime * 100;
      return particle.y < CANVAS_HEIGHT;
    });
  };

  const startGame = async () => {
    console.log('Starting game...');
    const assetsLoaded = await initAssets();
    if (!assetsLoaded) {
      console.error('Failed to load assets');
      return;
    }

    console.log('Assets loaded, initializing game...');
    initEnemies();

    setGameState(prev => ({
      ...prev,
      hasStarted: true,
      isPlaying: true
    }));
    setScore(0);

    console.log('Game started');
  };

  const draw = (ctx: CanvasRenderingContext2D) => {
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    if (gameState.screenShake > 0) {
      const magnitude = gameState.screenShake * 5;
      ctx.save();
      ctx.translate(
        Math.random() * magnitude - magnitude / 2,
        Math.random() * magnitude - magnitude / 2
      );
      setGameState(prev => ({ ...prev, screenShake: prev.screenShake * 0.9 }));
    }

    const gradient = ctx.createLinearGradient(0, 0, 0, CANVAS_HEIGHT);
    gradient.addColorStop(0, '#000033');
    gradient.addColorStop(1, '#000066');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    if (!gameState.hasStarted) {
       ctx.fillStyle = '#ffffff';
       ctx.font = '48px Arial';
       ctx.textAlign = 'center';
       ctx.fillText('SPARQ INVADERS', CANVAS_WIDTH/2, CANVAS_HEIGHT/3);
       return;
    }

    if (assets.current.player) {
      console.log('Drawing player ship...');
      ctx.drawImage(
        assets.current.player,
        player.current.x,
        player.current.y,
        player.current.width,
        player.current.height
      );
    } else {
      console.log('Player ship asset not loaded');
    }

    ctx.fillStyle = '#ff0000';
    bullets.current.forEach(bullet => {
      ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
    });

    enemies.current.forEach(enemy => {
      ctx.drawImage(enemy.img, enemy.x, enemy.y, enemy.width, enemy.height);
    });

    ctx.fillStyle = '#ffff00';
    particles.current.forEach(particle => {
      ctx.fillRect(particle.x, particle.y, particle.width, particle.height);
    });

    ctx.fillStyle = '#ffffff';
    ctx.font = '20px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(`Score: ${score}`, 10, 30);
    ctx.fillText(`High Score: ${highScore}`, 10, 60);
    ctx.fillText(`Lives: ${gameState.lives}`, CANVAS_WIDTH - 100, 30);
    ctx.fillText(`Level: ${gameState.level}`, CANVAS_WIDTH - 100, 60);

    if (gameState.screenShake > 0) {
      ctx.restore();
    }
  };

  const gameUpdate = (timestamp: number) => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    const deltaTime = (timestamp - lastTime.current) / 1000;
    lastTime.current = timestamp;

    if (gameState.hasStarted && gameState.isPlaying) {
      updatePlayer(deltaTime);
      updateBullets(deltaTime);
      updateEnemies(deltaTime);
      updateParticles(deltaTime);
      checkCollisions();
    }

    draw(ctx);
    gameLoop.current = requestAnimationFrame(gameUpdate);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;

    const init = async () => {
      document.addEventListener('keydown', handleKeyDown);
      document.addEventListener('keyup', handleKeyUp);
      requestAnimationFrame(gameUpdate);
    };

    init();

    const savedHighScore = localStorage.getItem('sparqInvadersHighScore');
    if (savedHighScore) {
      setHighScore(parseInt(savedHighScore, 10));
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
      if (gameLoop.current) {
        cancelAnimationFrame(gameLoop.current);
      }
    };
  }, []);

  return (
    <Card className="w-[600px] h-[1035px] flex flex-col items-center justify-center bg-gray-900 p-4">
      <canvas
        ref={canvasRef}
        className="border border-gray-700 rounded-lg"
        tabIndex={0}
      />
      <div className="h-[100px] mt-4 flex flex-col items-center justify-center">
        {!gameState.hasStarted && (
          <Button 
            onClick={startGame}
            className="mb-4 bg-primary hover:bg-primary/90 text-white"
          >
            Start Game
          </Button>
        )}
        <p className="text-white">Use Arrow Keys or A/D to move</p>
        <p className="text-white">Space to shoot</p>
      </div>
    </Card>
  );
}