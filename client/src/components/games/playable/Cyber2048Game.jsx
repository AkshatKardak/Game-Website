import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { RotateCcw, Trophy, Zap, Award } from 'lucide-react';

export function Cyber2048Game({ game, onScoreSubmit }) {
  const [board, setBoard] = useState([
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ]);
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [startTime, setStartTime] = useState(Date.now());

  const initGame = () => {
    let newBoard = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    newBoard = addRandomTile(newBoard);
    newBoard = addRandomTile(newBoard);
    setBoard(newBoard);
    setScore(0);
    setGameOver(false);
    setGameWon(false);
    setStartTime(Date.now());
  };

  const addRandomTile = (currentBoard) => {
    const emptyCells = [];
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (currentBoard[r][c] === 0) emptyCells.push({ r, c });
      }
    }
    if (emptyCells.length === 0) return currentBoard;
    const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    const newBoard = currentBoard.map((row) => [...row]);
    newBoard[randomCell.r][randomCell.c] = Math.random() < 0.85 ? 2 : 4;
    return newBoard;
  };

  useEffect(() => {
    initGame();
  }, []);

  const slide = (row) => {
    let arr = row.filter((val) => val);
    let missing = 4 - arr.length;
    let zeros = Array(missing).fill(0);
    return arr.concat(zeros);
  };

  const combine = (row, currentScore) => {
    let gained = 0;
    for (let i = 0; i < 3; i++) {
      if (row[i] !== 0 && row[i] === row[i + 1]) {
        row[i] *= 2;
        gained += row[i];
        row[i + 1] = 0;
        if (row[i] === 2048) setGameWon(true);
      }
    }
    return { newRow: row, gained };
  };

  const moveLeft = () => {
    let newBoard = [];
    let gainedScore = 0;
    for (let i = 0; i < 4; i++) {
      let row = slide(board[i]);
      let { newRow, gained } = combine(row, score);
      newRow = slide(newRow);
      newBoard.push(newRow);
      gainedScore += gained;
    }
    finishMove(newBoard, gainedScore);
  };

  const moveRight = () => {
    let newBoard = [];
    let gainedScore = 0;
    for (let i = 0; i < 4; i++) {
      let row = board[i].slice().reverse();
      row = slide(row);
      let { newRow, gained } = combine(row, score);
      newRow = slide(newRow);
      newBoard.push(newRow.reverse());
      gainedScore += gained;
    }
    finishMove(newBoard, gainedScore);
  };

  const moveUp = () => {
    let newBoard = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    let gainedScore = 0;
    for (let c = 0; c < 4; c++) {
      let col = [board[0][c], board[1][c], board[2][c], board[3][c]];
      col = slide(col);
      let { newRow, gained } = combine(col, score);
      newRow = slide(newRow);
      for (let r = 0; r < 4; r++) {
        newBoard[r][c] = newRow[r];
      }
      gainedScore += gained;
    }
    finishMove(newBoard, gainedScore);
  };

  const moveDown = () => {
    let newBoard = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    let gainedScore = 0;
    for (let c = 0; c < 4; c++) {
      let col = [board[3][c], board[2][c], board[1][c], board[0][c]];
      col = slide(col);
      let { newRow, gained } = combine(col, score);
      newRow = slide(newRow);
      newBoard[3][c] = newRow[0];
      newBoard[2][c] = newRow[1];
      newBoard[1][c] = newRow[2];
      newBoard[0][c] = newRow[3];
      gainedScore += gained;
    }
    finishMove(newBoard, gainedScore);
  };

  const finishMove = (newBoard, gained) => {
    const isDifferent = JSON.stringify(newBoard) !== JSON.stringify(board);
    if (isDifferent) {
      const withRandom = addRandomTile(newBoard);
      const newScore = score + gained;
      setBoard(withRandom);
      setScore(newScore);
      if (newScore > bestScore) setBestScore(newScore);

      if (checkGameOver(withRandom)) {
        setGameOver(true);
        const duration = Math.round((Date.now() - startTime) / 1000);
        if (onScoreSubmit) {
          onScoreSubmit({
            gameId: game._id,
            score: newScore,
            duration,
            completed: false,
          });
        }
      }
    }
  };

  const checkGameOver = (b) => {
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (b[r][c] === 0) return false;
        if (c < 3 && b[r][c] === b[r][c + 1]) return false;
        if (r < 3 && b[r][c] === b[r + 1][c]) return false;
      }
    }
    return true;
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (gameOver) return;
      if (e.key === 'ArrowLeft' || e.key === 'a') {
        e.preventDefault();
        moveLeft();
      } else if (e.key === 'ArrowRight' || e.key === 'd') {
        e.preventDefault();
        moveRight();
      } else if (e.key === 'ArrowUp' || e.key === 'w') {
        e.preventDefault();
        moveUp();
      } else if (e.key === 'ArrowDown' || e.key === 's') {
        e.preventDefault();
        moveDown();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [board, score, gameOver]);

  const getTileStyles = (value) => {
    switch (value) {
      case 2:
        return 'bg-blue-950/60 text-cyan-300 border-cyan-500/30';
      case 4:
        return 'bg-purple-950/60 text-purple-300 border-purple-500/30';
      case 8:
        return 'bg-purple-900/70 text-purple-200 border-purple-500/60 shadow-[0_0_15px_rgba(139,92,246,0.3)]';
      case 16:
        return 'bg-pink-950/70 text-pink-300 border-pink-500/50 shadow-[0_0_15px_rgba(236,72,153,0.3)]';
      case 32:
        return 'bg-pink-900/80 text-pink-100 border-pink-500 shadow-[0_0_20px_rgba(236,72,153,0.5)]';
      case 64:
        return 'bg-cyan-900/80 text-cyan-100 border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.6)]';
      case 128:
        return 'bg-amber-900/80 text-amber-200 border-amber-400 font-bold shadow-[0_0_25px_rgba(245,158,11,0.6)]';
      case 256:
        return 'bg-amber-800 text-amber-100 border-amber-300 font-extrabold shadow-[0_0_30px_rgba(245,158,11,0.7)]';
      case 512:
      case 1024:
      case 2048:
        return 'bg-gradient-to-br from-gaming-purple via-gaming-pink to-gaming-cyan text-white border-white shadow-[0_0_35px_rgba(139,92,246,0.9)] animate-pulse';
      default:
        return 'bg-black/40 text-transparent border-white/5';
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-center rounded-2xl border-2 border-gaming-purple/40 bg-gaming-dark/95 p-6 shadow-2xl overflow-hidden max-w-xl mx-auto">
      {/* Header */}
      <div className="flex w-full items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-black font-orbitron text-transparent bg-clip-text bg-gradient-to-r from-gaming-purple to-cyan-400">
            CYBER 2048
          </h2>
          <p className="text-xs text-muted-foreground">Galactic Quantum Synthesis</p>
        </div>

        <div className="flex gap-3">
          <div className="bg-gaming-card border border-white/10 rounded-xl px-4 py-2 text-center">
            <div className="text-[10px] text-muted-foreground uppercase">SCORE</div>
            <div className="text-lg font-bold text-gaming-cyan font-orbitron">{score}</div>
          </div>
          <Button onClick={initGame} variant="outline" size="icon" className="h-12 w-12 rounded-xl">
            <RotateCcw className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Grid */}
      <div className="relative bg-black/60 p-4 rounded-2xl border border-white/10 shadow-2xl">
        <div className="grid grid-cols-4 gap-3 w-80 h-80 sm:w-96 sm:h-96">
          {board.map((row, r) =>
            row.map((val, c) => (
              <div
                key={`${r}-${c}`}
                className={`flex items-center justify-center rounded-xl border text-xl sm:text-2xl font-orbitron font-bold transition-all duration-200 ${getTileStyles(
                  val
                )}`}
              >
                {val > 0 ? val : ''}
              </div>
            ))
          )}
        </div>

        {/* Game Over Modal */}
        {gameOver && (
          <div className="absolute inset-0 bg-black/90 backdrop-blur-md rounded-2xl flex flex-col items-center justify-center p-6 text-center animate-in fade-in">
            <Trophy className="w-12 h-12 text-gaming-purple mb-2" />
            <h3 className="text-3xl font-bold font-orbitron text-white mb-1">SYNTHESIS COMPLETE</h3>
            <p className="text-sm text-muted-foreground mb-4">No more valid quantum cell moves.</p>
            <div className="text-3xl font-black text-gaming-cyan font-orbitron mb-6">{score} PTS</div>
            <Button onClick={initGame} className="bg-gaming-purple hover:bg-gaming-purple/90 font-orbitron px-6">
              <RotateCcw className="w-4 h-4 mr-2" />
              PLAY AGAIN
            </Button>
          </div>
        )}
      </div>

      <div className="text-xs text-muted-foreground mt-4 text-center">
        Use Arrow Keys or WASD to slide and merge dark matter isotopes.
      </div>
    </div>
  );
}

export default Cyber2048Game;
