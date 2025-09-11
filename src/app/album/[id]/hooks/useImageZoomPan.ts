import { useState, useEffect, useRef } from "react";

/**
 * Кастомный хук для управления зумом и панорамированием (перемещением) изображения.
 *
 * Возможности:
 * - Масштабирование изображения колесом мыши или кнопками (от 100% до 200%).
 * - Перетаскивание изображения при увеличении > 100%.
 * - Автоматическое ограничение смещений по краям контейнера.
 * - Сброс смещения при возврате масштаба к 100%.
 *
 * @returns {Object} Объект с состоянием и обработчиками событий:
 *   - `currentZoom` (number): Текущее значение зума в процентах (100 = исходный размер).
 *   - `xOffset` (number): Текущее смещение изображения по оси X в пикселях.
 *   - `yOffset` (number): Текущее смещение изображения по оси Y в пикселях.
 *   - `targetXOffset` (number): Целевое смещение изображения по оси X в пикселях.
 *   - `targetYOffset` (number): Целевое смещение изображения по оси Y в пикселях.
 *   - `isDragging` (boolean): Флаг, указывающий, активно ли перетаскивание изображения.
 *   - `startX` (number): Начальная координата X мыши при начале перетаскивания.
 *   - `startY` (number): Начальная координата Y мыши при начале перетаскивания.
 *   - `handleZoomIn` (function): Увеличивает зум на 10% (максимум 200%).
 *   - `handleZoomOut` (function): Уменьшает зум на 10% (минимум 100%).
 *   - `handleWheel` (function): Обработчик события прокрутки колеса мыши для зума.
 *   - `handleMouseDown` (function): Обработчик начала перетаскивания изображения.
 *   - `handleMouseMove` (function): Обработчик движения мыши для обновления целевого смещения.
 *   - `handleMouseUp` (function): Обработчик окончания перетаскивания.
 *   - `handleMouseLeave` (function): Обработчик выхода курсора за пределы области.
 *   - `handleContextMenu` (function): Отключает контекстное меню при правом клике.
 *   - `onDragStart` (function): Отключает стандартное перетаскивание изображения.
 *   - `imageRef` (RefObject<HTMLImageElement>): Реф для доступа к элементу изображения.
 *   - `containerRef` (RefObject<HTMLDivElement>): Реф для доступа к контейнеру photoArea.
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

  const containerRef = useRef<HTMLDivElement | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);

  /**
   * Ограничивает смещения изображения, чтобы оно не выходило за границы контейнера.
   * Работает с учётом object-fit: contain (т.е. картинка может быть меньше контейнера).
   */
  const clampOffsets = (x: number, y: number) => {
    if (!containerRef.current || !imageRef.current) return { x, y };

    const containerRect = containerRef.current.getBoundingClientRect();
    const containerWidth = containerRect.width;
    const containerHeight = containerRect.height;

    const naturalWidth = imageRef.current.naturalWidth;
    const naturalHeight = imageRef.current.naturalHeight;

    const imageRatio = naturalWidth / naturalHeight;
    const containerRatio = containerWidth / containerHeight;

    let fittedWidth: number;
    let fittedHeight: number;

    if (imageRatio > containerRatio) {
      /** картинка ограничена по ширине контейнера */
      fittedWidth = containerWidth;
      fittedHeight = containerWidth / imageRatio;
    } else {
      /** картинка ограничена по высоте контейнера */
      fittedHeight = containerHeight;
      fittedWidth = containerHeight * imageRatio;
    }

    /** масштабируем под текущий зум */
    const scaledWidth = (fittedWidth * currentZoom) / 100;
    const scaledHeight = (fittedHeight * currentZoom) / 100;

    const maxX = Math.max(0, (scaledWidth - containerWidth) / 2);
    const maxY = Math.max(0, (scaledHeight - containerHeight) / 2);

    return {
      x: Math.min(maxX, Math.max(-maxX, x)),
      y: Math.min(maxY, Math.max(-maxY, y)),
    };
  };

  const handleZoomIn = () => {
    setCurrentZoom((prev) => Math.min(prev + 10, 200));
  };

  /** Уменьшение масштаба (до 100%). При возврате в 100% сбрасываются смещения */
  const handleZoomOut = () => {
    setCurrentZoom((prev) => {
      const newZoom = Math.max(prev - 10, 100);
      if (newZoom <= 100) {
        setXOffset(0);
        setYOffset(0);
        setTargetXOffset(0);
        setTargetYOffset(0);
      }
      return newZoom;
    });
  };

  /** Зум колесиком мыши */
  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.deltaY < 0) handleZoomIn();
    else if (e.deltaY > 0) handleZoomOut();
  };

  /** Начало перетаскивания */
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (currentZoom > 100) {
      e.preventDefault();
      setIsDragging(true);
      setStartX(e.clientX - targetXOffset);
      setStartY(e.clientY - targetYOffset);
    }
  };

  /** Движение мыши при перетаскивании */
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isDragging && currentZoom > 100) {
      let newX = e.clientX - startX;
      let newY = e.clientY - startY;
      const clamped = clampOffsets(newX, newY);
      setTargetXOffset(clamped.x);
      setTargetYOffset(clamped.y);
    }
  };

  /** Завершение перетаскивания */
  const handleMouseUp = () => setIsDragging(false);
  const handleMouseLeave = () => setIsDragging(false);

  /** Отключение контекстного меню */
  const handleContextMenu = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  /** Анимация перемещения */
  const animate = () => {
    setXOffset((prev) => {
      const newX = prev + (targetXOffset - prev) * 0.1;
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
    containerRef,
    imageRef,
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
