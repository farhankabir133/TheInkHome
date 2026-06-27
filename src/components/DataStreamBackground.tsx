import React, { useRef, useEffect } from 'react';

class SymbolClass {
  x: number;
  y: number;
  value: string;
  speed: number;
  isFirst: boolean;
  opacity: number;
  characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789{}[]()</>|*&^%$#@!~?;:=+-_';

  constructor(x: number, y: number, speed: number, isFirst: boolean) {
    this.x = x;
    this.y = y;
    this.speed = speed;
    this.isFirst = isFirst;
    this.value = this.getRandomChar();
    this.opacity = 1;
  }

  getRandomChar() {
    return this.characters[Math.floor(Math.random() * this.characters.length)];
  }

  draw(context: CanvasRenderingContext2D, currentHue: number, mouseX: number, mouseY: number, mouseRadius: number) {
    const dx = this.x - mouseX;
    const dy = this.y - mouseY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < mouseRadius) {
      const opacity = 1 - (distance / mouseRadius);
      context.fillStyle = `rgba(220, 255, 255, ${opacity})`;
      context.shadowBlur = 10;
      context.shadowColor = `rgba(150, 255, 255, ${opacity})`;
    } else if (this.isFirst) {
      context.fillStyle = `hsl(${currentHue}, 90%, 85%)`;
      context.shadowBlur = 8;
      context.shadowColor = `hsl(${currentHue}, 90%, 85%)`;
    } else {
      context.fillStyle = `hsla(${currentHue}, 100%, 65%, ${this.opacity})`;
      context.shadowBlur = 0;
    }

    context.fillText(this.value, this.x, this.y);

    if (Math.random() > 0.98) {
      this.value = this.getRandomChar();
    }
  }
}

class StreamClass {
  symbols: SymbolClass[] = [];
  totalSymbols: number;
  speed: number;
  x: number;
  y: number;
  angle: number;

  constructor(canvasWidth: number, canvasHeight: number) {
    this.totalSymbols = Math.round(Math.random() * 20 + 5);
    this.speed = Math.random() * 2 + 1;
    this.angle = (Math.PI / 4) + (Math.random() * 0.4 - 0.2);

    this.x = Math.random() * canvasWidth * 2 - canvasWidth;
    this.y = Math.random() * canvasHeight * 2 - canvasHeight;
    this.generateSymbols();
  }

  generateSymbols() {
    let y = 0;
    for (let i = 0; i < this.totalSymbols; i++) {
      this.symbols.push(new SymbolClass(0, y, this.speed, i === 0));
      y -= 20;
    }
  }

  updateAndDraw(context: CanvasRenderingContext2D, canvasWidth: number, canvasHeight: number, currentHue: number, mouseX: number, mouseY: number, mouseRadius: number) {
    this.x += Math.cos(this.angle) * this.speed;
    this.y += Math.sin(this.angle) * this.speed;

    if (this.x > canvasWidth + 50 || this.y > canvasHeight + 50 || this.x < -50 || this.y < -50) {
      this.x = Math.random() * canvasWidth - canvasWidth;
      this.y = Math.random() * canvasHeight;
    }

    context.save();
    context.translate(this.x, this.y);
    context.rotate(this.angle);

    this.symbols.forEach((symbol, index) => {
      symbol.opacity = 1 - (index / this.totalSymbols) * 0.95;
      symbol.draw(context, currentHue, mouseX, mouseY, mouseRadius);
    });
    context.restore();
  }
}

const DataStreamBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouse = useRef({ x: 0, y: 0, radius: 100 });
  const hue = useRef(0);
  const streamsRef = useRef<StreamClass[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const streamCount = 100;

    const init = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      ctx.fillStyle = '#050505';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      streamsRef.current = [];
      for (let i = 0; i < streamCount; i++) {
        streamsRef.current.push(new StreamClass(canvas.width, canvas.height));
      }
    };

    let animationFrameId: number;

    const animate = () => {
      ctx.fillStyle = 'rgba(5, 5, 5, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.font = '16px monospace';

      hue.current = (hue.current + 0.5) % 360;

      streamsRef.current.forEach(stream => 
        stream.updateAndDraw(ctx, canvas.width, canvas.height, hue.current, mouse.current.x, mouse.current.y, mouse.current.radius)
      );

      animationFrameId = requestAnimationFrame(animate);
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
    };

    init();
    animate();

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 w-full h-full pointer-events-none z-[0]" />;
};

export default DataStreamBackground;