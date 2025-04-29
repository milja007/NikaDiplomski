// App.jsx
import React, { useMemo, useState } from "react";
import "./App.css";
import { quizItems } from "./data/data"; // Ensure this path is correct
import { Kategories } from "./data/data";
function App() {
  const [selected, setSelected] = useState({});
  // State to hold the calculated results
  const [calculatedScore, setCalculatedScore] = useState(null);
  const [displayedDenominator, setDisplayedDenominator] = useState(null);

  const totalPossibleNonRemovable = useMemo(
    () =>
      quizItems
        .filter((item) => !item.removable)
        .reduce((sum, item) => sum + (item.score > 0 ? item.score : 0), 0),
    []
  );

  const handleToggle = (id) => {
    setSelected((prev) => {
      const newState = { ...prev, [id]: !prev[id] };
      return newState;
    });

    setCalculatedScore(null);
    setDisplayedDenominator(null);
  };

  const calculateScore = () => {
    let currentScore = 0;

    let currentDenominator = totalPossibleNonRemovable;

    quizItems.forEach((item) => {
      const itemScore = item.score > 0 ? item.score : 0;

      if (selected[item.id]) {
        currentScore += itemScore;
        if (item.removable) {
          currentDenominator += itemScore;
        }
      }
    });

    setCalculatedScore(currentScore);
    setDisplayedDenominator(currentDenominator);
  };

  // const bonusPointsAchieved = useMemo(() => {
  //   if (calculatedScore === null) return 0;
  //   return quizItems.reduce((bonusSum, item) => {
  //     if (item.removable && selected[item.id]) {
  //       return bonusSum + (item.score > 0 ? item.score : 0);
  //     }
  //     return bonusSum;
  //   }, 0);
  // }, [selected, calculatedScore]);

  return (
    <div className="App">
      <h1>Event Sustainability Checklist</h1>
      <p>Check the Items your Event complies with:</p>
      <div className="quiz-container">
        {quizItems.map((item, index) => (
          <>
            {
              Kategories.filter(
                (categorie) => index === categorie.firstIndex
              ).map((categ) => (
                <h3>{categ.text}</h3>
              ))
              // .length > 0 && (
              //   <h2>mmmimim</h2>
              // )
            }
            <label className="quiz-item" key={item.id}>
              <span className="item-text">
                {index + 1}. {item.text}
                {item.removable && (
                  <span className="removable-tag"> (Optional)</span>
                )}
              </span>
              <span className="item-score">
                {item.score > 0 ? `${item.score} pts` : "No points"}
              </span>
              <input
                type="checkbox"
                checked={!!selected[item.id]}
                onChange={() => handleToggle(item.id)}
              />
            </label>
          </>
        ))}
      </div>
      <button className="submit-btn" onClick={calculateScore}>
        Calculate Score
      </button>

      {calculatedScore !== null && displayedDenominator !== null && (
        <div className="result">
          Your score: {calculatedScore} / {displayedDenominator}
        </div>
      )}
    </div>
  );
}

export default App;
