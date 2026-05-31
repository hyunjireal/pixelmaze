/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useCallback } from "react";
import { TETROMINOES } from "../data";
import type { GameStatus, Position } from "../types";
import { sfx } from "../utils/audio";
import { Play, RotateCcw, ArrowDown, ArrowLeft, ArrowRight, ShieldAlert, Sliders } from "lucide-react";
import './TetrisGame.css';

interface TetrisGameProps {
  onLineClear: (linesCleared: number, lastClearedNames: string[]) => void;
  gameStatus: GameStatus;
  setGameStatus: (status: GameStatus) => void;
  totalLinesCleared: number;
  setTotalLinesCleared: React.Dispatch<React.SetStateAction<number>>;
  score: number;
  setScore: React.Dispatch<React.SetStateAction<number>>;
}

const BOARD_WIDTH = 10;
const BOARD_HEIGHT = 20;

// Grid cell interface
interface GridCell {
  filled: boolean;
  color: string;
  borderColor?: string;
  glowColor?: string;
  name?: string;
  completed?: boolean;
}

// Generate an empty board grid
const createEmptyBoard = (): GridCell[][] =>
  Array.from({ length: BOARD_HEIGHT }, () =>
    Array.from({ length: BOARD_WIDTH }, () => ({ filled: false, color: "" }))
  );

// Available pieces list
const PIECE_TYPES = ["I", "O", "T", "S", "Z", "J", "L"];

export default function TetrisGame({
  onLineClear,
  gameStatus,
  setGameStatus,
  totalLinesCleared,
  setTotalLinesCleared,
  score,
  setScore,
}: TetrisGameProps) {
  const [board, setBoard] = useState<GridCell[][]>(createEmptyBoard());
  const [currentPiece, setCurrentPiece] = useState<{
    matrix: number[][];
    color: string;
    borderColor: string;
    glowColor: string;
    name: string;
    type: string;
    pos: Position;
  } | null>(null);

  const [nextPieceType, setNextPieceType] = useState<string>("I");
  const [level, setLevel] = useState<number>(1);
  const [isAutoPlay, setIsAutoPlay] = useState<boolean>(false);

  // References to keep game loop fresh without stale state
  const gameIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const autoPlayIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Get random tetromino key
  const getRandomPieceType = useCallback(() => {
    const idx = Math.floor(Math.random() * PIECE_TYPES.length);
    return PIECE_TYPES[idx];
  }, []);

  // Switch on AutoPlay simulation
  const toggleAutoPlay = () => {
    sfx.playRotate();
    setIsAutoPlay((prev) => !prev);
  };

  // Collision detection logic
  const checkCollision = useCallback(
    (
      matrix: number[][],
      pos: Position,
      currentBoard: GridCell[][]
    ): boolean => {
      for (let r = 0; r < matrix.length; r++) {
        for (let c = 0; c < matrix[r].length; c++) {
          if (matrix[r][c]) {
            const nextX = pos.x + c;
            const nextY = pos.y + r;

            // Boundary checks
            if (
              nextX < 0 ||
              nextX >= BOARD_WIDTH ||
              nextY >= BOARD_HEIGHT
            ) {
              return true;
            }

            // Stiff block collisions
            if (nextY >= 0 && currentBoard[nextY][nextX].filled) {
              return true;
            }
          }
        }
      }
      return false;
    },
    []
  );

  // Autopilot Target Selection solver for ANY tetromino matrix on a given board
  const findBestMoveForPiece = useCallback(
    (matrix: number[][], currentBoard: GridCell[][]) => {
      let bestScore = -Infinity;
      let targetX = 0;
      let targetMatrix = matrix;

      let rotationMatrix = matrix;
      for (let rot = 0; rot < 4; rot++) {
        if (rot > 0) {
          const N = rotationMatrix.length;
          const rotated = Array.from({ length: N }, () => Array(N).fill(0));
          for (let r = 0; r < N; r++) {
            for (let c = 0; c < N; c++) {
              rotated[c][N - 1 - r] = rotationMatrix[r][c];
            }
          }
          rotationMatrix = rotated;
        }

        // Test horizontal offsets with padding bounds
        for (let x = -2; x < BOARD_WIDTH + 2; x++) {
          const pos = { x, y: 0 };
          if (checkCollision(rotationMatrix, pos, currentBoard)) continue;

          // Find land pos
          let testY = 0;
          while (!checkCollision(rotationMatrix, { x, y: testY + 1 }, currentBoard)) {
            testY++;
          }

          let linesCleared = 0;
          let holesCreated = 0;

          // Check which rows are already completed on the current board
          const rowAlreadyCompleted = Array.from({ length: BOARD_HEIGHT }, (_, br) =>
            currentBoard[br].every((cell) => cell.completed)
          );

          const rowFillCounts = Array(BOARD_HEIGHT).fill(0);
          for (let br = 0; br < BOARD_HEIGHT; br++) {
            for (let bc = 0; bc < BOARD_WIDTH; bc++) {
              if (currentBoard[br][bc].filled) {
                rowFillCounts[br]++;
              }
            }
          }

          // Add simulated piece
          for (let pr = 0; pr < rotationMatrix.length; pr++) {
            for (let pc = 0; pc < rotationMatrix[pr].length; pc++) {
              if (rotationMatrix[pr][pc]) {
                const by = testY + pr;
                if (by >= 0 && by < BOARD_HEIGHT) {
                  rowFillCounts[by]++;
                }
              }
            }
          }

          rowFillCounts.forEach((count, br) => {
            if (count === BOARD_WIDTH && !rowAlreadyCompleted[br]) linesCleared++;
          });

          // Build temporary simulated board to check heights & gaps
          const simGrid = currentBoard.map((row) => row.map((cell) => cell.filled));
          for (let pr = 0; pr < rotationMatrix.length; pr++) {
            for (let pc = 0; pc < rotationMatrix[pr].length; pc++) {
              if (rotationMatrix[pr][pc]) {
                const by = testY + pr;
                const bx = x + pc;
                if (by >= 0 && by < BOARD_HEIGHT && bx >= 0 && bx < BOARD_WIDTH) {
                  simGrid[by][bx] = true;
                }
              }
            }
          }

          // Calculate height details
          const heightMap = Array(BOARD_WIDTH).fill(0);
          for (let c = 0; c < BOARD_WIDTH; c++) {
            let colHeight = 0;
            for (let r = 0; r < BOARD_HEIGHT; r++) {
              if (simGrid[r][c]) {
                colHeight = BOARD_HEIGHT - r;
                break;
              }
            }
            heightMap[c] = colHeight;
          }

          // Gap bumpiness calculation
          let bumpiness = 0;
          for (let c = 0; c < BOARD_WIDTH - 1; c++) {
            bumpiness += Math.abs(heightMap[c] - heightMap[c + 1]);
          }

          // Block holes calculation
          for (let c = 0; c < BOARD_WIDTH; c++) {
            let foundBlock = false;
            for (let r = 0; r < BOARD_HEIGHT; r++) {
              if (simGrid[r][c]) {
                foundBlock = true;
              } else if (foundBlock && !simGrid[r][c]) {
                holesCreated++;
              }
            }
          }

          // STEEP HEIGHT PENALTY to satisfy constraint of not piling up above 3 lines!
          let severeHeightPenalty = 0;
          for (const h of heightMap) {
            if (h > 2) {
              severeHeightPenalty += (h - 2) * 50000; // Giant cost
            } else {
              severeHeightPenalty += h * 25; // Normal gentle cost
            }
          }

          // Objective function
          const score =
            linesCleared * 200000 -
            holesCreated * 12000 -
            bumpiness * 150 -
            severeHeightPenalty +
            testY * 40;

          if (score > bestScore) {
            bestScore = score;
            targetX = x;
            targetMatrix = rotationMatrix;
          }
        }
      }

      return { targetX, targetMatrix };
    },
    [checkCollision]
  );

  // Scans all 7 basic Tetromino pieces and returns the one that produces the absolute cleanest, lowest state
  const getBestPieceTypeForBoard = useCallback(
    (currentBoard: GridCell[][]) => {
      let bestType = "I";
      let bestScore = -Infinity;

      for (const type of PIECE_TYPES) {
        const pData = TETROMINOES[type];
        const { targetX, targetMatrix } = findBestMoveForPiece(pData.matrix, currentBoard);

        // Land finding
        let testY = 0;
        while (!checkCollision(targetMatrix, { x: targetX, y: testY + 1 }, currentBoard)) {
          testY++;
        }

        let linesCleared = 0;
        let holesCreated = 0;

        // Check which rows are already completed on the current board
        const rowAlreadyCompleted = Array.from({ length: BOARD_HEIGHT }, (_, br) =>
          currentBoard[br].every((cell) => cell.completed)
        );

        const rowFillCounts = Array(BOARD_HEIGHT).fill(0);
        for (let br = 0; br < BOARD_HEIGHT; br++) {
          for (let bc = 0; bc < BOARD_WIDTH; bc++) {
            if (currentBoard[br][bc].filled) rowFillCounts[br]++;
          }
        }

        for (let pr = 0; pr < targetMatrix.length; pr++) {
          for (let pc = 0; pc < targetMatrix[pr].length; pc++) {
            if (targetMatrix[pr][pc]) {
              const by = testY + pr;
              if (by >= 0 && by < BOARD_HEIGHT) {
                rowFillCounts[by]++;
              }
            }
          }
        }

        rowFillCounts.forEach((count, br) => {
          if (count === BOARD_WIDTH && !rowAlreadyCompleted[br]) linesCleared++;
        });

        const simGrid = currentBoard.map((row) => row.map((cell) => cell.filled));
        for (let pr = 0; pr < targetMatrix.length; pr++) {
          for (let pc = 0; pc < targetMatrix[pr].length; pc++) {
            if (targetMatrix[pr][pc]) {
              const by = testY + pr;
              const bx = targetX + pc;
              if (by >= 0 && by < BOARD_HEIGHT && bx >= 0 && bx < BOARD_WIDTH) {
                simGrid[by][bx] = true;
              }
            }
          }
        }

        const heightMap = Array(BOARD_WIDTH).fill(0);
        for (let c = 0; c < BOARD_WIDTH; c++) {
          let colHeight = 0;
          for (let r = 0; r < BOARD_HEIGHT; r++) {
            if (simGrid[r][c]) {
              colHeight = BOARD_HEIGHT - r;
              break;
            }
          }
          heightMap[c] = colHeight;
        }

        for (let c = 0; c < BOARD_WIDTH; c++) {
          let foundBlock = false;
          for (let r = 0; r < BOARD_HEIGHT; r++) {
            if (simGrid[r][c]) {
              foundBlock = true;
            } else if (foundBlock && !simGrid[r][c]) {
              holesCreated++;
            }
          }
        }

        let bumpiness = 0;
        for (let c = 0; c < BOARD_WIDTH - 1; c++) {
          bumpiness += Math.abs(heightMap[c] - heightMap[c + 1]);
        }

        // Severe high stacks penalty
        let severeHeightPenalty = 0;
        for (const h of heightMap) {
          if (h > 2) {
            severeHeightPenalty += (h - 2) * 50000;
          } else {
            severeHeightPenalty += h * 25;
          }
        }

        const score =
          linesCleared * 200000 -
          holesCreated * 12000 -
          bumpiness * 150 -
          severeHeightPenalty +
          testY * 40;

        if (score > bestScore) {
          bestScore = score;
          bestType = type;
        }
      }

      return bestType;
    },
    [checkCollision, findBestMoveForPiece]
  );

  // Spawns the current piece using NextPiece and regenerates the next one
  const spawnPiece = useCallback(
    (currentBoard: GridCell[][]) => {
      // IF AUTOPLAY IS ACTIVE, override piece to be the single best fit choice!
      let activePieceType = nextPieceType;
      if (isAutoPlay) {
        activePieceType = getBestPieceTypeForBoard(currentBoard);
      }

      const pData = TETROMINOES[activePieceType];
      
      // Select the NEXT upcoming piece
      let nextType = getRandomPieceType();
      if (isAutoPlay) {
        // Evaluate the optimal piece that would match next board state sequence
        nextType = getBestPieceTypeForBoard(currentBoard);
      }
      setNextPieceType(nextType);

      // Center horizontally, start at top
      const matrix = pData.matrix;
      const startX = Math.floor((BOARD_WIDTH - matrix[0].length) / 2);
      const startY = 0;

      const newPiece = {
        matrix: matrix,
        color: pData.color,
        borderColor: pData.border,
        glowColor: pData.glow,
        name: pData.name,
        type: activePieceType,
        pos: { x: startX, y: startY },
      };

      // Check for immediate game over
      if (checkCollision(newPiece.matrix, newPiece.pos, currentBoard)) {
        setGameStatus("GAME_OVER");
        sfx.playGameOver();
        setIsAutoPlay(false);
        if (gameIntervalRef.current) clearInterval(gameIntervalRef.current);
      } else {
        setCurrentPiece(newPiece);
      }
    },
    [nextPieceType, getRandomPieceType, checkCollision, setGameStatus, isAutoPlay, getBestPieceTypeForBoard]
  );

  // Starts/resets a fresh game with quick start overrides
  const startGame = () => {
    sfx.playUnlock();
    setBoard(createEmptyBoard());
    setScore(0);
    setLevel(1);
    setTotalLinesCleared(0);
    setGameStatus("PLAYING");

    const initialBoard = createEmptyBoard();
    const firstType = isAutoPlay ? getBestPieceTypeForBoard(initialBoard) : getRandomPieceType();
    const initialNext = isAutoPlay ? getBestPieceTypeForBoard(initialBoard) : getRandomPieceType();
    
    const pData = TETROMINOES[firstType];
    const matrix = pData.matrix;
    const startX = Math.floor((BOARD_WIDTH - matrix[0].length) / 2);

    setCurrentPiece({
      matrix: matrix,
      color: pData.color,
      borderColor: pData.border,
      glowColor: pData.glow,
      name: pData.name,
      type: firstType,
      pos: { x: startX, y: 0 },
    });
    setNextPieceType(initialNext);
  };

  // Merge fallen block into the grid and inspect for line clears
  const lockPiece = useCallback(() => {
    if (!currentPiece) return;

    setBoard((prevBoard) => {
      // 1. Double check collision again or merge
      const newBoard = prevBoard.map((row) => row.map((cell) => ({ ...cell })));

      for (let r = 0; r < currentPiece.matrix.length; r++) {
        for (let c = 0; c < currentPiece.matrix[r].length; c++) {
          if (currentPiece.matrix[r][c]) {
            const boardY = currentPiece.pos.y + r;
            const boardX = currentPiece.pos.x + c;

            if (boardY >= 0 && boardY < BOARD_HEIGHT && boardX >= 0 && boardX < BOARD_WIDTH) {
              newBoard[boardY][boardX] = {
                filled: true,
                color: currentPiece.color,
                borderColor: currentPiece.borderColor,
                glowColor: currentPiece.glowColor,
                name: currentPiece.name,
              };
            }
          }
        }
      }

      // 2. Discover completed/cleared rows
      let rowsClearedThisTurn = 0;
      const clearedRowNames: string[] = [];
      const finalBoard = newBoard.map((row) => {
        const isFull = row.every((cell) => cell.filled);
        const alreadyCompleted = row.every((cell) => cell.completed);

        if (isFull && !alreadyCompleted) {
          rowsClearedThisTurn++;
          // Extract block names from full row to showcase cleared skills
          row.forEach((cell) => {
            if (cell.name && !clearedRowNames.includes(cell.name)) {
              clearedRowNames.push(cell.name);
            }
          });
          // Mark all cells in this completed row as completed, but don't delete it!
          return row.map((cell) => ({
            ...cell,
            completed: true,
          }));
        }
        return row;
      });

      // 3. Score calculation & state update
      if (rowsClearedThisTurn > 0) {
        setScore((prev) => prev + rowsClearedThisTurn * 100 * level);
        setTotalLinesCleared((prev) => {
          const newTotals = prev + rowsClearedThisTurn;
          // Level up rules
          setLevel(Math.floor(newTotals / 3) + 1);
          return newTotals;
        });

        // Notify client side wrapper
        onLineClear(rowsClearedThisTurn, clearedRowNames);
        sfx.playClear();
      } else {
        sfx.playDrop();
      }

      // 4. Continue spawning blocks
      setTimeout(() => spawnPiece(finalBoard), 0);

      return finalBoard;
    });

    setCurrentPiece(null);
  }, [currentPiece, level, spawnPiece, setScore, setTotalLinesCleared, onLineClear]);

  // Actions
  const moveLeft = useCallback(() => {
    if (gameStatus !== "PLAYING" || !currentPiece) return;
    const nextPos = { ...currentPiece.pos, x: currentPiece.pos.x - 1 };
    if (!checkCollision(currentPiece.matrix, nextPos, board)) {
      setCurrentPiece({ ...currentPiece, pos: nextPos });
      sfx.playMove();
    }
  }, [currentPiece, board, checkCollision, gameStatus]);

  const moveRight = useCallback(() => {
    if (gameStatus !== "PLAYING" || !currentPiece) return;
    const nextPos = { ...currentPiece.pos, x: currentPiece.pos.x + 1 };
    if (!checkCollision(currentPiece.matrix, nextPos, board)) {
      setCurrentPiece({ ...currentPiece, pos: nextPos });
      sfx.playMove();
    }
  }, [currentPiece, board, checkCollision, gameStatus]);

  const moveDown = useCallback(() => {
    if (gameStatus !== "PLAYING" || !currentPiece) return;
    const nextPos = { ...currentPiece.pos, y: currentPiece.pos.y + 1 };
    if (!checkCollision(currentPiece.matrix, nextPos, board)) {
      setCurrentPiece({ ...currentPiece, pos: nextPos });
    } else {
      lockPiece();
    }
  }, [currentPiece, board, checkCollision, gameStatus, lockPiece]);

  // Hard drop direct to bottom
  const hardDrop = useCallback(() => {
    if (gameStatus !== "PLAYING" || !currentPiece) return;
    let finalY = currentPiece.pos.y;
    while (!checkCollision(currentPiece.matrix, { x: currentPiece.pos.x, y: finalY + 1 }, board)) {
      finalY++;
    }
    setCurrentPiece((prev) => {
      if (!prev) return null;
      return { ...prev, pos: { x: prev.pos.x, y: finalY } };
    });
    // Trigger lock next frame
    setTimeout(lockPiece, 0);
  }, [currentPiece, board, checkCollision, gameStatus, lockPiece]);

  // Rotate clockwise
  const rotatePiece = useCallback(() => {
    if (gameStatus !== "PLAYING" || !currentPiece) return;
    const matrix = currentPiece.matrix;
    const N = matrix.length;
    
    // Transpose and reverse rows
    const rotated = Array.from({ length: N }, () => Array(N).fill(0));
    for (let r = 0; r < N; r++) {
      for (let c = 0; c < N; c++) {
        rotated[c][N - 1 - r] = matrix[r][c];
      }
    }

    // Try normal rotate, if fails, wall-kick (adjust x offset left/right slightly)
    const finalPos = { ...currentPiece.pos };
    const kicks = [0, -1, 1, -2, 2];
    let rotatedSuccess = false;

    for (const kick of kicks) {
      finalPos.x = currentPiece.pos.x + kick;
      if (!checkCollision(rotated, finalPos, board)) {
        rotatedSuccess = true;
        break;
      }
    }

    if (rotatedSuccess) {
      setCurrentPiece({ ...currentPiece, matrix: rotated, pos: finalPos });
      sfx.playRotate();
    }
  }, [currentPiece, board, checkCollision, gameStatus]);

  // ----------------------------------------------------
  // Autoplay Smart Assistant Solver Heuristic
  // ----------------------------------------------------
  useEffect(() => {
    if (!isAutoPlay || gameStatus !== "PLAYING" || !currentPiece) return;

    // Calculate best column and rotation using the highly optimized simulation solver
    const solveBestMove = () => {
      const { targetX, targetMatrix } = findBestMoveForPiece(currentPiece.matrix, board);

      // 1. ROTATE FIRST to prevent getting blocked/colliding mid-descent!
      const currentMatrixJSON = JSON.stringify(currentPiece.matrix);
      const targetMatrixJSON = JSON.stringify(targetMatrix);

      if (currentMatrixJSON !== targetMatrixJSON) {
        setCurrentPiece((prev) => {
          if (!prev) return null;
          // Apply horizontal wall kick checks during rotation to ensure seamless rotation
          const finalPos = { ...prev.pos };
          const kicks = [0, -1, 1, -2, 2];
          let kickSuccess = false;
          for (const kick of kicks) {
            finalPos.x = prev.pos.x + kick;
            if (!checkCollision(targetMatrix, finalPos, board)) {
              kickSuccess = true;
              break;
            }
          }
          if (kickSuccess) {
            sfx.playRotate();
            return { ...prev, matrix: targetMatrix, pos: finalPos };
          }
          return prev;
        });
        return; // Prioritize completing rotation step first
      }

      // 2. SLIDE INTERACTIVELY LEFT OR RIGHT TO TARGET
      if (currentPiece.pos.x < targetX) {
        const nextPos = { ...currentPiece.pos, x: currentPiece.pos.x + 1 };
        if (!checkCollision(currentPiece.matrix, nextPos, board)) {
          setCurrentPiece((prev) => (prev ? { ...prev, pos: nextPos } : null));
          sfx.playMove();
        }
      } else if (currentPiece.pos.x > targetX) {
        const nextPos = { ...currentPiece.pos, x: currentPiece.pos.x - 1 };
        if (!checkCollision(currentPiece.matrix, nextPos, board)) {
          setCurrentPiece((prev) => (prev ? { ...prev, pos: nextPos } : null));
          sfx.playMove();
        }
      } else {
        // Alignment complete! Soft drop cleanly to land
        moveDown();
      }
    };

    // Auto solver ticks slightly faster for action preview
    const autoPlayDelay = 120;
    autoPlayIntervalRef.current = setInterval(solveBestMove, autoPlayDelay);

    return () => {
      if (autoPlayIntervalRef.current) clearInterval(autoPlayIntervalRef.current);
    };
  }, [isAutoPlay, currentPiece, board, gameStatus, checkCollision, moveDown, findBestMoveForPiece]);

  // Keyboard controls listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameStatus !== "PLAYING" || isAutoPlay) return;

      switch (e.key) {
        case "ArrowLeft":
          e.preventDefault();
          moveLeft();
          break;
        case "ArrowRight":
          e.preventDefault();
          moveRight();
          break;
        case "ArrowDown":
          e.preventDefault();
          moveDown();
          break;
        case "ArrowUp":
          e.preventDefault();
          rotatePiece();
          break;
        case " ": // Space
          e.preventDefault();
          hardDrop();
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [moveLeft, moveRight, moveDown, rotatePiece, hardDrop, gameStatus, isAutoPlay]);

  // Main game tick loop
  useEffect(() => {
    if (gameStatus !== "PLAYING" || isAutoPlay) {
      if (gameIntervalRef.current) clearInterval(gameIntervalRef.current);
      return;
    }

    // Dynamic speed based on gameplay level
    const speed = Math.max(100, 850 - (level - 1) * 110);
    gameIntervalRef.current = setInterval(() => {
      moveDown();
    }, speed);

    return () => {
      if (gameIntervalRef.current) clearInterval(gameIntervalRef.current);
    };
  }, [gameStatus, isAutoPlay, level, moveDown]);

  // Draw current grid merged with the active falling piece
  const getRenderGrid = () => {
    const render = board.map((row) => row.map((cell) => ({ ...cell })));

    if (currentPiece) {
      const { matrix, color, borderColor, glowColor, name } = currentPiece;
      for (let r = 0; r < matrix.length; r++) {
        for (let c = 0; c < matrix[r].length; c++) {
          if (matrix[r][c]) {
            const y = currentPiece.pos.y + r;
            const x = currentPiece.pos.x + c;

            if (y >= 0 && y < BOARD_HEIGHT && x >= 0 && x < BOARD_WIDTH) {
              render[y][x] = {
                filled: true,
                color,
                borderColor,
                glowColor,
                name,
              };
            }
          }
        }
      }
    }
    return render;
  };

  const renderGrid = getRenderGrid();

  // 셀 스타일 헬퍼 — 3D 블록 효과
  const getCellStyle = (cell: GridCell): React.CSSProperties => {
    if (cell.completed) {
      return {
        background: 'linear-gradient(135deg, #fff 0%, #f0ede8 100%)',
        boxShadow: 'inset 0 1px 3px rgba(255,255,255,0.9), 0 0 6px rgba(255,255,255,0.5)',
        border: '1px solid #e0ddd8',
      }
    }
    if (cell.filled) {
      let top = '#e8e4de', mid = '#d4cfc8', bot = '#c4bfb8'
      const c = cell.color
      if (c.includes('white') || c.includes('neutral-100'))
        [top, mid, bot] = ['#f0ede8', '#e2ddd8', '#d2cdc8']
      else if (c.includes('neutral-300') || c.includes('slate-300'))
        [top, mid, bot] = ['#dedad4', '#cec9c2', '#bebab2']
      else if (c.includes('zinc-4') || c.includes('neutral-4'))
        [top, mid, bot] = ['#d0cbc4', '#c0bbb4', '#b0aba4']
      else if (c.includes('stone-5') || c.includes('neutral-5'))
        [top, mid, bot] = ['#c8c3bc', '#b8b3ac', '#a8a39c']
      return {
        background: `linear-gradient(150deg, ${top} 0%, ${mid} 50%, ${bot} 100%)`,
        boxShadow: `inset 2px 2px 3px rgba(255,255,255,0.65), inset -1px -1px 2px rgba(0,0,0,0.14)`,
        border: '1px solid rgba(190,185,178,0.5)',
      }
    }
    return {
      background: '#f5f3f0',
      border: '1px solid #eae7e2',
    }
  }

  const isPlaying = gameStatus === "PLAYING"

  return (
    <div className="tg_cabinet" id="tetris-cabinet">

      {/* ── 메인 게임 영역 ── */}
      <div className="tg_game_area">

        {/* 왼쪽: 스탯 */}
        <div className="tg_stats">
          <div className="tg_stat_item">
            <p className="tg_stat_label">SCORE</p>
            <p className="tg_stat_value">{score.toLocaleString()}</p>
          </div>
          <div className="tg_stat_item">
            <p className="tg_stat_label">LINES</p>
            <p className="tg_stat_value">{totalLinesCleared}</p>
          </div>
          <div className="tg_stat_item">
            <p className="tg_stat_label">LEVEL</p>
            <p className="tg_stat_value">{level}</p>
          </div>
          <div className="tg_stat_item">
            <p className="tg_stat_label">SPEED</p>
            <p className="tg_stat_value">Lv.{level}</p>
            <div className="tg_speed_dots">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <span
                  key={i}
                  className={`tg_speed_dot${i <= level ? ' tg_speed_dot_active' : ''}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* 중앙: 보드 */}
        <div className="tg_board_wrap">
          <div className="tg_board" id="tetris-screen">
            {renderGrid.map((row, rIdx) =>
              row.map((cell, cIdx) => (
                <div
                  key={`${rIdx}-${cIdx}`}
                  className={`tg_cell${cell.completed ? ' tg_cell_completed' : cell.filled ? ' tg_cell_filled' : ' tg_cell_empty'}`}
                  style={getCellStyle(cell)}
                />
              ))
            )}
          </div>

          {/* 시작 전 오버레이 */}
          {gameStatus === "BEFORE_START" && (
            <div className="tg_overlay" id="overlay-start">
              <div className="tg_overlay_icon">
                <Sliders className="w-5 h-5" />
              </div>
              <p className="tg_overlay_title">테트리스 포트폴리오</p>
              <p className="tg_overlay_desc">
                블록을 쌓아 가로줄을 완성하면<br />스킬 카드가 해제됩니다!
              </p>
              <button onClick={startGame} className="tg_overlay_btn" id="btn-play-tetris">
                <Play className="w-3.5 h-3.5 fill-current" />
                게임 시작하기
              </button>
            </div>
          )}

          {/* 게임 오버 오버레이 */}
          {gameStatus === "GAME_OVER" && (
            <div className="tg_overlay" id="overlay-gameover">
              <div className="tg_overlay_icon">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <p className="tg_overlay_title">GAME OVER</p>
              <p className="tg_overlay_desc">
                다시 시작하거나 아래<br />치트키를 사용해 보세요.
              </p>
              <button onClick={startGame} className="tg_overlay_btn" id="btn-restart">
                <RotateCcw className="w-3.5 h-3.5" />
                다시 플레이
              </button>
            </div>
          )}

          {/* 일시정지 오버레이 */}
          {gameStatus === "PAUSED" && (
            <div className="tg_overlay" id="overlay-paused">
              <p className="tg_overlay_title">PAUSED</p>
              <button onClick={() => setGameStatus("PLAYING")} className="tg_overlay_btn_sub" id="btn-resume">
                계속 진행
              </button>
            </div>
          )}
        </div>

        {/* 오른쪽: NEXT / HOLD / AI ASSIST */}
        <div className="tg_side">
          {/* NEXT */}
          <div className="tg_side_panel">
            <p className="tg_side_label">NEXT</p>
            <div className="tg_preview_box">
              {isPlaying ? (
                <div
                  className="tg_preview_grid"
                  style={{
                    gridTemplateColumns: `repeat(${TETROMINOES[nextPieceType].matrix[0].length}, 10px)`,
                  }}
                >
                  {TETROMINOES[nextPieceType].matrix.map((row, rIdx) =>
                    row.map((cell, cIdx) => (
                      <div
                        key={`next-${rIdx}-${cIdx}`}
                        className="tg_preview_cell"
                        style={cell ? {
                          background: 'linear-gradient(135deg, #e8e4de 0%, #d0cbc4 100%)',
                          boxShadow: 'inset 1px 1px 2px rgba(255,255,255,0.6)',
                          border: '1px solid rgba(190,185,178,0.4)',
                        } : { background: 'transparent' }}
                      />
                    ))
                  )}
                </div>
              ) : (
                <span className="tg_preview_empty">--</span>
              )}
            </div>
          </div>

          {/* HOLD */}
          <div className="tg_side_panel">
            <p className="tg_side_label">HOLD</p>
            <div className="tg_preview_box">
              <span className="tg_preview_empty">--</span>
            </div>
          </div>

          {/* AI ASSIST */}
          <div className="tg_ai_panel">
            <p className="tg_side_label">AI ASSIST</p>
            <button
              onClick={toggleAutoPlay}
              disabled={!isPlaying}
              className={`tg_ai_toggle${isAutoPlay ? ' tg_ai_toggle_on' : ''}`}
              id="btn-autoplay"
            >
              {isAutoPlay ? 'ON' : 'OFF'}
            </button>
          </div>
        </div>
      </div>

      {/* ── 컨트롤 버튼 ── */}
      <div className="tg_controls" id="controls-panel">
        <button onClick={moveLeft}    disabled={!isPlaying || isAutoPlay} className="tg_btn" title="왼쪽" id="btn-move-left">
          <ArrowLeft  className="w-4 h-4" />
        </button>
        <button onClick={rotatePiece} disabled={!isPlaying || isAutoPlay} className="tg_btn" title="회전" id="btn-rotate">
          <RotateCcw  className="w-4 h-4" />
        </button>
        <button onClick={moveDown}    disabled={!isPlaying || isAutoPlay} className="tg_btn" title="아래" id="btn-move-down">
          <ArrowDown  className="w-4 h-4" />
        </button>
        <button onClick={moveRight}   disabled={!isPlaying || isAutoPlay} className="tg_btn" title="오른쪽" id="btn-move-right">
          <ArrowRight className="w-4 h-4" />
        </button>
        <button onClick={hardDrop}    disabled={!isPlaying || isAutoPlay} className="tg_btn_hard" title="하드드롭" id="btn-hard-drop">
          HARD<br />DROP
        </button>
      </div>

      {/* ── 푸터 바 ── */}
      <div className="tg_footer">
        <button
          className="tg_footer_btn"
          onClick={() => isPlaying ? setGameStatus("PAUSED") : (gameStatus === "PAUSED" ? setGameStatus("PLAYING") : undefined)}
          id="btn-pause"
        >
          P PAUSE
        </button>
        <span className="tg_footer_hint">
          CLEAR {4 - Math.min(totalLinesCleared, 4)} MORE LINES TO UNLOCK
        </span>
        <button className="tg_footer_btn" onClick={startGame} id="btn-reset">
          X RESET
        </button>
      </div>

    </div>
  );
}
