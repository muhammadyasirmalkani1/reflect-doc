"use client"

import type React from "react"

import { useState, useEffect, useRef, useCallback } from "react"

interface Position {
  x: number
  y: number
}

interface Size {
  width: number
  height: number
}

interface UseDraggableOptions {
  initialPosition?: Position
  initialSize?: Size
  minSize?: Size
  maxSize?: Size
  bounds?: "window" | "parent"
  disabled?: boolean
}

export function useDraggable({
  initialPosition = { x: 0, y: 0 },
  initialSize = { width: 400, height: 600 },
  minSize = { width: 320, height: 400 },
  maxSize = { width: 800, height: 800 },
  bounds = "window",
  disabled = false,
}: UseDraggableOptions = {}) {
  const [position, setPosition] = useState<Position>(initialPosition)
  const [size, setSize] = useState<Size>(initialSize)
  const [isDragging, setIsDragging] = useState(false)
  const [isResizing, setIsResizing] = useState(false)
  const [dragStart, setDragStart] = useState<Position>({ x: 0, y: 0 })
  const [resizeStart, setResizeStart] = useState<{ pos: Position; size: Size }>({
    pos: { x: 0, y: 0 },
    size: { width: 0, height: 0 },
  })

  const elementRef = useRef<HTMLDivElement>(null)

  const constrainPosition = useCallback(
    (pos: Position): Position => {
      if (bounds === "window") {
        const maxX = window.innerWidth - size.width
        const maxY = window.innerHeight - size.height
        return {
          x: Math.max(0, Math.min(pos.x, maxX)),
          y: Math.max(0, Math.min(pos.y, maxY)),
        }
      }
      return pos
    },
    [bounds, size],
  )

  const constrainSize = useCallback(
    (newSize: Size): Size => {
      return {
        width: Math.max(minSize.width, Math.min(newSize.width, maxSize.width)),
        height: Math.max(minSize.height, Math.min(newSize.height, maxSize.height)),
      }
    },
    [minSize, maxSize],
  )

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (disabled) return

      e.preventDefault()
      setIsDragging(true)
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      })
    },
    [disabled, position],
  )

  const handleResizeMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (disabled) return

      e.preventDefault()
      e.stopPropagation()
      setIsResizing(true)
      setResizeStart({
        pos: { x: e.clientX, y: e.clientY },
        size: { ...size },
      })
    },
    [disabled, size],
  )

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (isDragging && !disabled) {
        const newPosition = constrainPosition({
          x: e.clientX - dragStart.x,
          y: e.clientY - dragStart.y,
        })
        setPosition(newPosition)
      }

      if (isResizing && !disabled) {
        const deltaX = e.clientX - resizeStart.pos.x
        const deltaY = e.clientY - resizeStart.pos.y

        const newSize = constrainSize({
          width: resizeStart.size.width + deltaX,
          height: resizeStart.size.height + deltaY,
        })

        setSize(newSize)
      }
    },
    [isDragging, isResizing, disabled, dragStart, resizeStart, constrainPosition, constrainSize],
  )

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
    setIsResizing(false)
  }, [])

  useEffect(() => {
    if (isDragging || isResizing) {
      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)
      document.body.style.userSelect = "none"
      document.body.style.cursor = isDragging ? "grabbing" : "nw-resize"

      return () => {
        document.removeEventListener("mousemove", handleMouseMove)
        document.removeEventListener("mouseup", handleMouseUp)
        document.body.style.userSelect = ""
        document.body.style.cursor = ""
      }
    }
  }, [isDragging, isResizing, handleMouseMove, handleMouseUp])

  // Auto-position on window resize
  useEffect(() => {
    const handleWindowResize = () => {
      setPosition((prev) => constrainPosition(prev))
    }

    window.addEventListener("resize", handleWindowResize)
    return () => window.removeEventListener("resize", handleWindowResize)
  }, [constrainPosition])

  const resetPosition = useCallback(() => {
    setPosition(initialPosition)
    setSize(initialSize)
  }, [initialPosition, initialSize])

  const centerPosition = useCallback(() => {
    const centerX = (window.innerWidth - size.width) / 2
    const centerY = (window.innerHeight - size.height) / 2
    setPosition({ x: centerX, y: centerY })
  }, [size])

  return {
    elementRef,
    position,
    size,
    isDragging,
    isResizing,
    setPosition,
    setSize,
    handleMouseDown,
    handleResizeMouseDown,
    resetPosition,
    centerPosition,
    style: {
      position: "fixed" as const,
      left: position.x,
      top: position.y,
      width: size.width,
      height: size.height,
      zIndex: 1000,
      cursor: isDragging ? "grabbing" : "default",
    },
  }
}
