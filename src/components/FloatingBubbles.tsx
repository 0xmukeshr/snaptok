import React, { useEffect, useRef } from 'react';

interface Bubble {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  color: string;
}

const FloatingBubbles: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const bubblesRef = useRef<Bubble[]>([]);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      initBubbles();
    };

    const initBubbles = () => {
      const bubbleCount = 20;
      const bubbles: Bubble[] = [];
      const colors = ['#4F46E5', '#7C3AED', '#EC4899', '#F59E0B', '#10B981'];

      for (let i = 0; i < bubbleCount; i++) {
        bubbles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 30 + 10,
          speedX: (Math.random() - 0.5) * 1,
          speedY: (Math.random() - 0.5) * 1,
          color: colors[Math.floor(Math.random() * colors.length)]
        });
      }

      bubblesRef.current = bubbles;
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      bubblesRef.current.forEach(bubble => {
        // Update position
        bubble.x += bubble.speedX;
        bubble.y += bubble.speedY;
        
        // Bounce off walls
        if (bubble.x < 0 || bubble.x > canvas.width) bubble.speedX *= -1;
        if (bubble.y < 0 || bubble.y > canvas.height) bubble.speedY *= -1;
        
        // Draw bubble
        ctx.beginPath();
        ctx.arc(bubble.x, bubble.y, bubble.size, 0, Math.PI * 2);
        ctx.fillStyle = bubble.color + '33'; // Add transparency
        ctx.fill();
        ctx.strokeStyle = bubble.color;
        ctx.stroke();
      });
      
      animationRef.current = requestAnimationFrame(animate);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="absolute inset-0 w-full h-full -z-10"
    />
  );
};

export default FloatingBubbles;