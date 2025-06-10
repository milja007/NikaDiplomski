import React, { useState, useMemo } from "react";
import { jsPDF } from "jspdf"; // Import jsPDF for PDF generation
import { saveAs } from "file-saver";
import "./App.css";
import { quizItems } from "./data/data"; // Ensure this path is correct
import { Kategories } from "./data/data";

function App() {
  const [selected, setSelected] = useState({});
  const [calculatedScore, setCalculatedScore] = useState(null);
  const [displayedDenominator, setDisplayedDenominator] = useState(null);

  // Calculate total possible score excluding removable items
  const totalPossibleNonRemovable = useMemo(
    () =>
      quizItems
        .filter((item) => !item.removable)
        .reduce((sum, item) => sum + (item.score > 0 ? item.score : 0), 0),
    []
  );

  // Toggle selection of quiz item
  const handleToggle = (id) => {
    setSelected((prev) => {
      const newState = { ...prev, [id]: !prev[id] };
      return newState;
    });
    setCalculatedScore(null);
    setDisplayedDenominator(null);
  };

  // Calculate total score
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

  const generatePDF = () => {
    const doc = new jsPDF();

    // Title and metadata
    doc.setFont("helvetica");
    doc.setFontSize(16);
    doc.text("Checklist", 20, 20);

    doc.setFontSize(12);
    doc.text(`Date: ${new Date().toLocaleString()}`, 20, 30);
    doc.text(
      `Total Score: ${calculatedScore} / ${displayedDenominator}`,
      20,
      40
    );

    let yOffset = 50; // Set the initial offset for the first item

    // Max width to ensure text fits within the PDF page
    const maxWidth = 180; // Adjust this value based on your layout

    // Consistent gap between lines (you can adjust this value)
    const lineHeight = 10; // Adjusted for better spacing

    quizItems.forEach((item, index) => {
      if (selected[item.id]) {
        // Concatenate the sentence number and the item text
        let text = `${index + 1}. ${item.text} - ${item.score} pts`;

        // Split the text into multiple lines if needed, based on maxWidth
        const textLines = doc.splitTextToSize(text, maxWidth); // Automatically splits text into multiple lines

        // Add each line of text to the PDF
        textLines.forEach((line) => {
          doc.text(line, 20, yOffset);
          yOffset += lineHeight; // Increase Y offset after each line
        });
      }
    });

    // Save the PDF
    doc.save("Checklist.pdf");
  };

  const downloadExcel = () => {
    // Preuzimanje postojeće Excel datoteke iz public direktorija
    fetch("/Full_Sustainability_Checklist.xlsx")
      .then((response) => response.blob())
      .then((blob) => {
        saveAs(blob, "Full_Sustainability_Checklist.xlsx");
      })
      .catch((error) => {
        console.error("Greška pri preuzimanju Excel datoteke:", error);
      });
  };

  return (
    <div className="App">
      <h1>Event Sustainability Checklist</h1>
      <h3>How to Use This Checklist</h3>
      <br />
      <p>
        Each item on the checklist contributes to your sustainability score.
        There are two types of items:
      </p>
      <ul>
        <li>
          Mandatory items are always included in your final score. They are
          selected to align with key EU sustainability goals.
        </li>
        <li>
          Value-Added items can increase your final score if completed, but are
          not required. If they are not fulfilled, they are simply not counted.
        </li>
      </ul>
      <p>
        Some actions have multiple levels. You only select and score the level
        you have actually achieved.
      </p>

      <p>
        To successfully complete the checklist, you must reach a minimum score
        based on Mandatory items. Value-Added items can raise your score further
        but do not impact the minimum requirement.
      </p>

      <div className="download-section">
        <h3>
          The downloadable excel file checklist for continuance and offline use:
        </h3>
        <button className="download-excel-btn" onClick={downloadExcel}>
          Download
        </button>
      </div>

      <div className="quiz-container">
        {quizItems.map((item, index) => (
          <div key={item.id}>
            {Kategories.filter(
              (categorie) => index === categorie.firstIndex
            ).map((categ) => (
              <h3 key={categ.id}>{categ.text}</h3>
            ))}
            <label className="quiz-item">
              <span className="item-text">
                {index + 1}. {item.text}
                {item.removable && (
                  <span className="removable-tag"> (Value-added)</span>
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
          </div>
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

      {calculatedScore !== null && displayedDenominator !== null && (
        <button className="download-btn" onClick={generatePDF}>
          Download Results (PDF)
        </button>
      )}
    </div>
  );
}

export default App;

// // App.jsx
// import React, { useMemo, useState } from "react";
// import "./App.css";
// import { quizItems } from "./data/data"; // Ensure this path is correct
// import { Kategories } from "./data/data";
// function App() {
//   const [selected, setSelected] = useState({});
//   // State to hold the calculated results
//   const [calculatedScore, setCalculatedScore] = useState(null);
//   const [displayedDenominator, setDisplayedDenominator] = useState(null);

//   const totalPossibleNonRemovable = useMemo(
//     () =>
//       quizItems
//         .filter((item) => !item.removable)
//         .reduce((sum, item) => sum + (item.score > 0 ? item.score : 0), 0),
//     []
//   );

//   const handleToggle = (id) => {
//     setSelected((prev) => {
//       const newState = { ...prev, [id]: !prev[id] };
//       return newState;
//     });

//     setCalculatedScore(null);
//     setDisplayedDenominator(null);
//   };

//   const calculateScore = () => {
//     let currentScore = 0;

//     let currentDenominator = totalPossibleNonRemovable;

//     quizItems.forEach((item) => {
//       const itemScore = item.score > 0 ? item.score : 0;

//       if (selected[item.id]) {
//         currentScore += itemScore;
//         if (item.removable) {
//           currentDenominator += itemScore;
//         }
//       }
//     });

//     setCalculatedScore(currentScore);
//     setDisplayedDenominator(currentDenominator);
//   };

//   // const bonusPointsAchieved = useMemo(() => {
//   //   if (calculatedScore === null) return 0;
//   //   return quizItems.reduce((bonusSum, item) => {
//   //     if (item.removable && selected[item.id]) {
//   //       return bonusSum + (item.score > 0 ? item.score : 0);
//   //     }
//   //     return bonusSum;
//   //   }, 0);
//   // }, [selected, calculatedScore]);

//   return (
//     <div className="App">
//       <h1>Event Sustainability Checklist</h1>
//       <p>Check the Items your Event complies with:</p>
//       <div className="quiz-container">
//         {quizItems.map((item, index) => (
//           <>
//             {
//               Kategories.filter(
//                 (categorie) => index === categorie.firstIndex
//               ).map((categ) => (
//                 <h3 key={categ.id}>{categ.text}</h3>
//               ))
//               // .length > 0 && (
//               //   <h2>mmmimim</h2>
//               // )
//             }
//             <label className="quiz-item" key={item.id}>
//               <span className="item-text" key={item.id}>
//                 {index + 1}. {item.text}
//                 {item.removable && (
//                   <span className="removable-tag"> (Value-added)</span>
//                 )}
//               </span>
//               <span className="item-score">
//                 {item.score > 0 ? `${item.score} pts` : "No points"}
//               </span>
//               <input
//                 type="checkbox"
//                 checked={!!selected[item.id]}
//                 onChange={() => handleToggle(item.id)}
//               />
//             </label>
//           </>
//         ))}
//       </div>
//       <button className="submit-btn" onClick={calculateScore}>
//         Calculate Score
//       </button>

//       {calculatedScore !== null && displayedDenominator !== null && (
//         <div className="result">
//           Your score: {calculatedScore} / {displayedDenominator}
//         </div>
//       )}
//     </div>
//   );
// }

// export default App;
