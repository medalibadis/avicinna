import { useEffect, useRef } from 'react';

interface Point {
  x: number;
  y: number;
}

function isPointInTriangle(p: Point, a: Point, b: Point, c: Point): boolean {
  const area = 0.5 * (-b.y * c.x + a.y * (-b.x + c.x) + a.x * (b.y - c.y) + b.x * c.y);
  const s =
    (1 / (2 * area)) * (a.y * c.x - a.x * c.y + (c.y - a.y) * p.x + (a.x - c.x) * p.y);
  const t =
    (1 / (2 * area)) * (a.x * b.y - a.y * b.x + (a.y - b.y) * p.x + (b.x - a.x) * p.y);
  return s > 0 && t > 0 && 1 - s - t > 0;
}

export function useSafeTriangle(
  submenuRef: React.RefObject<HTMLElement | null>,
  onClose: () => void,
  isOpen: boolean
) {
  const lastMousePos = useRef<Point>({ x: 0, y: 0 });
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleMouseMove = (e: MouseEvent) => {
      const currentPos: Point = { x: e.clientX, y: e.clientY };
      const submenu = submenuRef.current;

      if (submenu) {
        const rect = submenu.getBoundingClientRect();
        const topCorner: Point = { x: rect.left, y: rect.top };
        const bottomCorner: Point = { x: rect.left, y: rect.bottom };

        // If cursor is inside the safe triangle heading toward the submenu, hold open
        if (isPointInTriangle(currentPos, lastMousePos.current, topCorner, bottomCorner)) {
          if (timeoutRef.current) clearTimeout(timeoutRef.current);
          timeoutRef.current = setTimeout(onClose, 280);
          lastMousePos.current = currentPos;
          return;
        }
      }
      lastMousePos.current = currentPos;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [isOpen, submenuRef, onClose]);
}
