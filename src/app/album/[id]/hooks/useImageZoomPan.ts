import { useState, useEffect, useRef } from "react";

/**
 * Кастомный хук для управления зумом и перемещением изображения.
 * Предоставляет функционал для масштабирования изображения с помощью колесика мыши
 * и перемещения при увеличении (> 100%) с помощью перетаскивания мышью.
 *
 * @returns {Object} Объект с состоянием и обработчиками событий:
 *   - `currentZoom` (number): Текущее значение зума в процентах (100 = исходный размер).
 *   - `xOffset` (number): Текущее смещение изображения по оси X в пикселях.
 *   - `yOffset` (number): Текущее смещение изображения по оси Y в пикселях.
 *   - `handleZoomIn` (function): Увеличивает зум на 10% (максимум 200%).
 *   - `handleZoomOut` (function): Уменьшает зум на 10% (минимум 80%).
 *   - `handleWheel` (function): Обработчик события прокрутки колеса мыши для зума.
 *   - `handleMouseDown` (function): Обработчик начала перетаскивания изображения.
 *   - `handleMouseMove` (function): Обработчик движения мыши для обновления целевого смещения.
 *   - `handleMouseUp` (function): Обработчик окончания перетаскивания.
 *   - `handleMouseLeave` (function): Обработчик выхода курсора за пределы области.
 *   - `handleContextMenu` (function): Отключает контекстное меню при правом клике.
 *   - `onDragStart` (function): Отключает стандартное перетаскивание изображения.
 */

export const useImageZoomPan = () => {
  const [currentZoom, setCurrentZoom] = useState(100);
  const [xOffset, setXOffset] = useState(0);
  const [yOffset, setYOffset] = useState(0);
  const [targetXOffset, setTargetXOffset] = useState(0);
  const [targetYOffset, setTargetYOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);
  const animationFrameRef = useRef<number | null>(null);

  const handleZoomIn = () => {
    setCurrentZoom((prev) => Math.min(prev + 10, 200));
  };

  const handleZoomOut = () => {
    setCurrentZoom((prev) => Math.max(prev - 10, 80));
    // Сброс смещения при уменьшении до базового масштаба
    if (currentZoom <= 100) {
      setXOffset(0);
      setYOffset(0);
      setTargetXOffset(0);
      setTargetYOffset(0);
    }
  };

  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.deltaY < 0) {
      handleZoomIn();
    } else if (e.deltaY > 0) {
      handleZoomOut();
    }
  };

  // Начало перетаскивания
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (currentZoom > 100) {
      e.preventDefault();
      setIsDragging(true);
      setStartX(e.clientX - targetXOffset);
      setStartY(e.clientY - targetYOffset);
    }
  };

  // Перемещение
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isDragging && currentZoom > 100) {
      const newTargetX = e.clientX - startX;
      const newTargetY = e.clientY - startY;
      setTargetXOffset(newTargetX);
      setTargetYOffset(newTargetY);
    }
  };

  // Окончание перетаскивания
  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Предотвращение перетаскивания при клике вне изображения
  const handleMouseLeave = () => {
    if (isDragging) setIsDragging(false);
  };

  const handleContextMenu = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  // Анимация смещения
  const animate = () => {
    setXOffset((prev) => {
      const newX = prev + (targetXOffset - prev) * 0.1; // Коэффициент затухания 0.1 для плавности
      return Math.abs(targetXOffset - newX) < 0.1 ? targetXOffset : newX;
    });
    setYOffset((prev) => {
      const newY = prev + (targetYOffset - prev) * 0.1;
      return Math.abs(targetYOffset - newY) < 0.1 ? targetYOffset : newY;
    });

    if (isDragging || Math.abs(targetXOffset - xOffset) > 0.1 || Math.abs(targetYOffset - yOffset) > 0.1) {
      animationFrameRef.current = requestAnimationFrame(animate);
    }
  };

  useEffect(() => {
    if (isDragging || Math.abs(targetXOffset - xOffset) > 0.1 || Math.abs(targetYOffset - yOffset) > 0.1) {
      animationFrameRef.current = requestAnimationFrame(animate);
    }
    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [isDragging, targetXOffset, targetYOffset]);

  return {
    currentZoom,
    xOffset,
    yOffset,
    handleZoomIn,
    handleZoomOut,
    handleWheel,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleMouseLeave,
    handleContextMenu,
    onDragStart: (e: React.DragEvent<HTMLDivElement>) => e.preventDefault(),
  };
};
