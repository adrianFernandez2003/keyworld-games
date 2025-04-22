"use client";
import React, { useEffect, useState } from 'react';
import { getHighScores } from '../../hooks/useTetris';

function HighScores() {
  const [highScores, setHighScores] = useState<number[]>([]);

  useEffect(() => {
    const scores = getHighScores().slice(0, 10);
    setHighScores(scores);
  }, []);

  return (
    <div className="high-scores">
      <h2>High Scores</h2>
      {highScores.length === 0 ? (
        <p>No high scores yet!</p>
      ) : (
        <ol className="high-scores-list">
          {highScores.map((score: number, index: number) => (
            <li key={index} className="high-score-item">
              {score}
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}

export default HighScores;
