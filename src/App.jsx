import { useEffect, useMemo, useRef, useState } from 'react'
import './App.css'
import Confetti from 'react-confetti'

const gameIcons = [
  "👽",
  "🎄",
  "🤣",
  "🌹",
  "👻",
  "🎶",
  "🎆",
  "🐭",
  "🍕"
];
function App() {
  const [pieces, setPices] = useState([]);

  let timeout = useRef();
  const isGameCompleted = useMemo(
    () => {
      if (pieces.length > 0 && pieces.every((piece) => piece.solved)) {
        return true;
      }
      return false;
    },
    [pieces])


  const startGame = () => {
    const duplicateGameIcons = [...gameIcons, ...gameIcons];
    const newGAmeIcons = []

    while (newGAmeIcons.length < gameIcons.length * 2) {
      const randomIndex = Math.floor(Math.random() * duplicateGameIcons.length);
      newGAmeIcons.push({
        emoji: duplicateGameIcons[randomIndex],
        flipped: false,
        solved: false,
        position: newGAmeIcons.length,
      });
      duplicateGameIcons.splice(randomIndex, 1);
    }

    setPices(newGAmeIcons)
  };

  useEffect(() => {
    startGame();
  }, []);


  const handleActive = (data) => {
    const flippedData = pieces.filter(data => data.flipped && !data.solved)
    if (flippedData.length === 2) return;
    const newPieces = pieces.map(piece => {
      if (piece.position === data.position) {
        piece.flipped = !piece.flipped;
      }
      return piece;
    });
    setPices(newPieces);
  };



  const gameLogicForFlipped = () => {
    const flippedData = pieces.filter(data => data.flipped && !data.solved);
    console.log(flippedData);
    if (flippedData.length === 2) {
      timeout.current = setTimeout(() => {
        if (flippedData[0].emoji === flippedData[1].emoji) {
          setPices(pieces.map(piece => {
            if (
              piece.position === flippedData[0].position ||
              piece.position === flippedData[1].position
            ) {
              piece.solved = true;
            }
            return piece;
          })
          );
        } else {



          setPices(pieces.map(piece => {
            if (
              piece.position === flippedData[0].position ||
              piece.position === flippedData[1].position
            ) {
              piece.flipped = false;
            }
            return piece;
          })
          );
        }
      }, 800);
    }
  };




  useEffect(() => {
    gameLogicForFlipped();

    return () => {
      clearTimeout(timeout.current);
    };

  }, [pieces]);





  return (
    <main >
      <h1>Memory Game in react</h1>
      <div className="container">
        {pieces.map((data, index) => (
          <div
            className={`flip-card ${data.flipped || data.flipped ? "active" : ""
              }`}
            key={index}
            onClick={() => handleActive(data)}
          >
            <div className="flip-card-inner">
              <div className="flip-card-front" />
              <div className="flip-card-back"> {data.emoji}  </div>
            </div>
          </div>
        ))}
      </div>

      {isGameCompleted && (
        <div className="game-completed">
          <h1>YOU WIN!!!</h1>
          <Confetti width={window.innerWidth} height={window.innerHeight}
          />
        </div>
      )}
    </main>
  )
}

export default App
