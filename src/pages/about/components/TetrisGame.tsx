/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useCallback } from "react";
import { TETROMINOES } from "../data";
import type { GameStatus, Position } from "../types";
import { sfx } from "../utils/audio";
import { Play, RotateCcw, ArrowDown, ArrowLeft, Zap, Trophy, ShieldAlert, Sparkles, Sliders } from "lucide-react";

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

  // Smart cheat button: fills a row except for 1 cell to make standard play easier!
  const activateRowAssist = () => {
    if (gameStatus !== "PLAYING") return;
    sfx.playUnlock();
    setBoard((prev) => {
      const nextBoard = prev.map((row) => row.map((cell) => ({ ...cell })));
      // Find the lowest empty row
      let targetRowIndex = BOARD_HEIGHT - 1;
      for (let r = BOARD_HEIGHT - 1; r >= 0; r--) {
        const rowSample = nextBoard[r];
        const isPartiallyFilled = rowSample.some(c => c.filled);
        const isNotFull = !rowSample.every(c => c.filled);
        if (!isPartiallyFilled || isNotFull) {
          targetRowIndex = r;
          break;
        }
      }

      // Fill this whole row with glow blocks except for column 4 (empty gap!)
      const assistColors = ["bg-cyan-500", "bg-purple-500", "bg-emerald-500", "bg-rose-500", "bg-yellow-500"];
      for (let c = 0; c < BOARD_WIDTH; c++) {
        if (c !== 4) {
          const randColor = assistColors[Math.floor(Math.random() * assistColors.length)];
          nextBoard[targetRowIndex][c] = {
            filled: true,
            color: randColor,
            borderColor: "border-white/40",
            glowColor: "shadow-white/20",
            name: "Assist Block"
          };
        } else {
          nextBoard[targetRowIndex][c] = { filled: false, color: "" };
        }
      }
      return nextBoard;
    });
  };

  // Instant Line Clear Cheat - immediately clears a simulated line to speed up unlocking
  const forceLineClearUnlock = () => {
    sfx.playClear();
    setTotalLinesCleared((prev) => {
      const newTotals = prev + 1;
      setLevel(Math.floor(newTotals / 3) + 1);
      return newTotals;
    });
    setScore((prev) => prev + 150);
    // Notify clear with dummy names
    onLineClear(1, ["디버그 찬스", "Figma", "React.js"]);
  };

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

  return (
    <div className="flex flex-col items-center bg-zinc-950/90 border-4 border-zinc-800 p-4 rounded-3xl shadow-2xl relative overflow-hidden backdrop-blur-md max-w-sm w-full mx-auto" id="tetris-cabinet">
      {/* Visual Glitch/Scanlines overlay for authentic arcade console feel */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:16px_16px] opacity-20"></div>

      {/* Header arcade light branding */}
      <div className="flex justify-between items-center w-full mb-3 pb-2 border-b-2 border-zinc-850 z-10">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-white animate-pulse shadow-[0_0_8px_rgba(255,255,255,0.8)]"></span>
          <span className="font-mono text-xs text-zinc-400 font-bold tracking-widest uppercase">
            ARCADE CABINET v1.99
          </span>
        </div>
        
        <div className="flex gap-2.5" />
      </div>

      {/* Score and Stats Top Bar */}
      <div className="grid grid-cols-3 gap-2 w-full mb-3 text-center">
        <div className="bg-zinc-900/90 border border-zinc-850 p-1.5 rounded-xl">
          <p className="font-mono text-[9px] text-zinc-500 leading-none mb-1">LINES</p>
          <p className="font-mono text-base font-bold text-white leading-none">{totalLinesCleared}</p>
        </div>
        <div className="bg-zinc-900/90 border border-zinc-850 p-1.5 rounded-xl relative overflow-hidden">
          <p className="font-mono text-[9px] text-zinc-500 leading-none mb-1">SCORE</p>
          <p className="font-mono text-base font-bold text-zinc-100 leading-none">{score}</p>
        </div>
        <div className="bg-zinc-900/90 border border-zinc-850 p-1.5 rounded-xl">
          <p className="font-mono text-[9px] text-zinc-500 leading-none mb-1">SPEED</p>
          <p className="font-mono text-base font-bold text-zinc-300 leading-none">Lv.{level}</p>
        </div>
      </div>

      {/* Main Screen containing Grid and Next Piece */}
      <div className="flex gap-3 w-full justify-center relative">
        {/* The 10x20 Tetris Grid Container */}
        <div 
          className="relative bg-zinc-950 border-2 border-zinc-850 rounded-lg overflow-hidden flex-1 aspect-[1/2] shadow-inner shadow-black/90 flex items-stretch"
          style={{ width: "220px", maxHeight: "440px" }}
          id="tetris-screen"
        >
          {/* Neon Grid gridlines */}
          <div className="absolute inset-0 grid grid-cols-10 grid-rows-20 pointer-events-none opacity-[0.06]">
            {Array.from({ length: 200 }).map((_, i) => (
              <div key={i} className="border-[0.5px] border-white"></div>
            ))}
          </div>

          <div className="flex-1 grid grid-cols-10 grid-rows-20 p-[1px] gap-[1px]">
            {renderGrid.map((row, rIdx) =>
              row.map((cell, cIdx) => (
                <div
                  key={`${rIdx}-${cIdx}`}
                  className={`relative rounded-[3px] transition-all duration-300 flex items-center justify-center ${
                    cell.completed
                      ? "bg-white border border-neutral-150 shadow-[inset_0_0_15px_rgba(255,255,255,1),0_0_12px_rgba(255,255,255,0.7)] opacity-100 animate-pulse"
                      : cell.filled
                      ? `${cell.color} border-2 ${cell.borderColor} ${cell.glowColor} `
                      : "bg-zinc-950/40 border border-zinc-900/30"
                  }`}
                  style={{
                    boxShadow: cell.completed
                      ? "inset 0 2px 6px rgba(255,255,255,1), 0 0 14px rgba(255,255,255,0.8)"
                      : cell.filled
                      ? "inset 0 2px 4px rgba(255,255,255,0.4), 0 0 4px rgba(0,0,0,0.5)"
                      : undefined,
                  }}
                >
                  {/* Subtle retro pixel center dot on placed grid */}
                  {cell.completed ? (
                    <div className="w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_8px_rgba(255,255,255,1)]"></div>
                  ) : cell.filled ? (
                    <div className="w-1 h-1 bg-white/40 rounded-full"></div>
                  ) : null}
                </div>
              ))
            )}
          </div>

          {/* Interactive Screen Overlay State */}
          {gameStatus === "BEFORE_START" && (
            <div className="absolute inset-0 bg-zinc-950/95 flex flex-col items-center justify-center p-4 text-center z-20 backdrop-blur-sm animate-fade-in">
              <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-full mb-3 animate-pulse">
                <Sliders className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-mono text-base font-semibold text-white tracking-tight mb-2">
                테트리스 포트폴리오
              </h3>
              <p className="font-mono text-[10px] text-zinc-400 max-w-[150px] mb-4 leading-normal">
                블록을 쌓아 가로줄을 완성하면 나의 스킬과 장점 카드가 해제됩니다!
              </p>
              <button
                onClick={startGame}
                className="w-full max-w-[160px] py-2 px-4 rounded-xl font-mono text-xs font-bold text-zinc-950 bg-white hover:bg-zinc-200 active:scale-95 shadow-[0_0_15px_rgba(255,255,255,0.25)] transition cursor-pointer flex items-center justify-center gap-2"
                id="btn-play-tetris"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                게임 시작하기
              </button>
            </div>
          )}

          {gameStatus === "GAME_OVER" && (
            <div className="absolute inset-0 bg-black/95 flex flex-col items-center justify-center p-4 text-center z-20 backdrop-blur-sm">
              <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-full mb-2">
                <ShieldAlert className="w-7 h-7 text-zinc-400 animate-bounce" />
              </div>
              <h3 className="font-mono text-sm font-bold text-white tracking-widest uppercase mb-1">
                GAME OVER
              </h3>
              <p className="font-mono text-[10px] text-zinc-400 max-w-[155px] mb-3 leading-tight">
                다시 시작하거나 오른쪽 "치트키 해금" 버튼들을 눌러 편하게 프로필을 열어보세요!
              </p>
              <button
                onClick={startGame}
                className="w-full max-w-[140px] py-1.5 px-3 rounded-lg font-mono text-xs font-bold text-black bg-white hover:bg-zinc-200 active:scale-95 transition flex items-center justify-center gap-1 cursor-pointer border border-zinc-300"
                id="btn-restart"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                다시 플레이
              </button>
            </div>
          )}

          {gameStatus === "PAUSED" && (
            <div className="absolute inset-0 bg-zinc-950/90 flex flex-col items-center justify-center p-4 text-center z-20 backdrop-blur-sm">
              <h3 className="font-mono text-lg font-bold text-white tracking-widest leading-none mb-2 shadow-sm">
                PAUSED
              </h3>
              <button
                onClick={() => setGameStatus("PLAYING")}
                className="py-1.5 px-4 rounded bg-white hover:bg-zinc-200 text-black text-xs font-mono font-bold transition"
                id="btn-resume"
              >
                계속 진행
              </button>
            </div>
          )}
        </div>

        {/* Right Info Tray (Next Piece & Custom Block Metadata) */}
        <div className="w-[85px] flex flex-col gap-2.5">
          {/* Next Piece Display */}
          <div className="bg-zinc-900/95 border border-zinc-850 p-2 rounded-xl text-center relative overflow-hidden">
            <h4 className="font-mono text-[9px] text-zinc-500 uppercase leading-none mb-2 tracking-wider">NEXT</h4>
            
            <div className="h-12 flex items-center justify-center relative bg-zinc-950 rounded-md p-1 border border-zinc-900/80">
              {gameStatus === "PLAYING" && (
                <div className="grid gap-[2px]" style={{
                  gridTemplateColumns: `repeat(${TETROMINOES[nextPieceType].matrix[0].length}, minmax(0, 1fr))`
                }}>
                  {TETROMINOES[nextPieceType].matrix.map((row, rIdx) =>
                    row.map((cell, cIdx) => (
                      <div
                        key={`next-${rIdx}-${cIdx}`}
                        className={`w-2.5 h-2.5 rounded-[1px] ${
                          cell ? `${TETROMINOES[nextPieceType].color} border border-white/20` : "bg-transparent"
                        }`}
                      />
                    ))
                  )}
                </div>
              )}
              {gameStatus !== "PLAYING" && <span className="text-zinc-700 font-mono text-xs">--</span>}
            </div>
            
            {/* Show what skill this piece represents */}
            {gameStatus === "PLAYING" && (
              <div className="mt-2 pt-1 border-t border-zinc-800">
                <span className="font-mono text-[9px] text-white font-semibold leading-none block line-clamp-2">
                  {TETROMINOES[nextPieceType].name}
                </span>
                <span className="font-mono text-[8px] text-zinc-400 block leading-tight mt-0.5">
                  해금 예정
                </span>
              </div>
            )}
          </div>

          {/* Active Piece Status Card */}
          <div className="bg-zinc-900/95 border border-zinc-850 p-2 rounded-xl text-center flex-1 flex flex-col justify-between">
            <div>
              <h4 className="font-mono text-[8px] text-zinc-500 uppercase leading-tight mb-1">낙하 중인 스킬</h4>
              {gameStatus === "PLAYING" && currentPiece ? (
                <div className="p-1 rounded bg-zinc-950 border border-zinc-850/80">
                  <span className="font-mono text-[10px] text-white font-extrabold block truncate">
                    {currentPiece.name}
                  </span>
                  <span className="font-mono text-[7px] text-zinc-400 block mt-0.5">
                    {currentPiece.type === "I" || currentPiece.type === "T" || currentPiece.type === "S" ? "🛠️ 개발 스킬" : "🎨 디자인 스킬"}
                  </span>
                </div>
              ) : (
                <span className="text-zinc-600 font-mono text-[10px] block my-2">-</span>
              )}
            </div>

            {/* AI Autoplayer Toggle Button */}
            <div className="pt-2 border-t border-zinc-850">
              <button
                onClick={toggleAutoPlay}
                disabled={gameStatus !== "PLAYING"}
                className={`w-full py-1 px-1 rounded-lg font-mono text-[8px] font-bold tracking-tight uppercase flex items-center justify-center gap-1 transition-all ${
                  isAutoPlay
                    ? "bg-white hover:bg-zinc-200 text-black shadow-[0_0_8px_rgba(255,255,255,0.4)] cursor-pointer"
                    : "bg-zinc-800 hover:bg-zinc-700 text-zinc-400 disabled:opacity-40 cursor-pointer text-center border border-zinc-700"
                }`}
                id="btn-autoplay"
              >
                <Zap className={`w-2.5 h-2.5 ${isAutoPlay ? "text-amber-500 fill-amber-500 animate-pulse" : ""}`} />
                {isAutoPlay ? "AI 주행 중" : "AI 자동완성"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Retro Controller Pad (Visual Keyboard Overlay for Game cabinet interactivity) */}
      <div className="w-full mt-3 pt-2.5 border-t border-zinc-800 grid grid-cols-5 gap-1.5" id="controls-panel">
        <button
          onClick={moveLeft}
          disabled={gameStatus !== "PLAYING" || isAutoPlay}
          className="p-1.5 rounded-xl border border-zinc-700 bg-zinc-900 hover:bg-zinc-800 active:scale-95 transition flex items-center justify-center text-zinc-300 disabled:opacity-40"
          title="왼쪽 이동"
          id="btn-move-left"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>

        <button
          onClick={rotatePiece}
          disabled={gameStatus !== "PLAYING" || isAutoPlay}
          className="p-1.5 rounded-xl border border-zinc-700 bg-zinc-900 hover:bg-zinc-800 active:scale-95 transition flex items-center justify-center text-zinc-300 disabled:opacity-40 col-span-1"
          title="회전"
          id="btn-rotate"
        >
          <RotateCcw className="w-4 h-4 text-white" />
        </button>

        <button
          onClick={moveDown}
          disabled={gameStatus !== "PLAYING" || isAutoPlay}
          className="p-1.5 rounded-xl border border-zinc-700 bg-zinc-900 hover:bg-zinc-800 active:scale-95 transition flex items-center justify-center text-zinc-300 disabled:opacity-40"
          title="아래 이동"
          id="btn-move-down"
        >
          <ArrowDown className="w-4 h-4" />
        </button>

        <button
          onClick={hardDrop}
          disabled={gameStatus !== "PLAYING" || isAutoPlay}
          className="col-span-2 px-2.5 py-1.5 rounded-xl border-2 border-dashed border-zinc-700 bg-zinc-900/30 hover:bg-zinc-800/40 active:scale-95 transition flex items-center justify-center font-mono text-[9px] font-extrabold text-white tracking-wider disabled:opacity-40 text-center uppercase"
          title="즉시 수직 낙하"
          id="btn-hard-drop"
        >
          HARD DROP
        </button>
      </div>

      {/* Recruiter Cheat / Quality-of-Life Helper Row */}
      <div className="w-full mt-2.5 pt-2 border-t border-zinc-800 flex justify-between gap-1.5">
        <button
          onClick={activateRowAssist}
          disabled={gameStatus !== "PLAYING"}
          className="flex-1 py-1 px-1 rounded-lg border border-zinc-850 bg-zinc-900 hover:bg-zinc-800 active:scale-95 transition font-mono text-[8px] text-zinc-400 hover:text-white disabled:opacity-30 cursor-pointer flex items-center justify-center gap-1"
          title="줄을 거의 빈틈없이 채워줍니다"
          id="btn-cheat-fill"
        >
          <Sparkles className="w-2.5 h-2.5 text-zinc-400" />
          한 줄 채워주기
        </button>

        <button
          onClick={forceLineClearUnlock}
          className="flex-1 py-1 px-1 rounded-lg border border-zinc-800 bg-zinc-900 hover:bg-zinc-800 active:scale-95 transition font-mono text-[8px] text-zinc-300 hover:text-white cursor-pointer flex items-center justify-center gap-1"
          title="즉시 가상으로 한 줄을 터뜨려 포트폴리오 섹션을 해금합니다"
          id="btn-cheat-unlock"
          style={{ cursor: "pointer" }}
        >
          <Trophy className="w-2.5 h-2.5 text-zinc-400" />
          치트키: 즉시 줄 제거
        </button>
      </div>
    </div>
  );
}
