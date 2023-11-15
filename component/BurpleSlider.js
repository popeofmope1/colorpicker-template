import React, { useState } from "react";

const BurpleSlider = () => {
  const [burple, setBurple] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [reange, setReange] = useState(0);
  const [colorBlocks, setColorBlocks] = useState([]);
  const [message, setMessage] = useState("What is Burple");
  const [generatedText, setGeneratedText] = useState("");
  const [uniqueIdentifier, setUniqueIdentifier] = useState(""); // State to store the unique identifier

  // Added state for blue, blink, and light pieen colors
  const [blueColor, setBlueColor] = useState(255);
  const [blinkColor, setBlinkColor] = useState(0);
  const [lightPieenColor, setLightPieenColor] = useState(222);

  const handleChange = (event) => {
    if (isSubmitted) {
      if (message === "What is Blue") {
        setBlueColor(event.target.value);
      } else if (message === "What is Blink") {
        setBlinkColor(event.target.value);
      } else if (message === "What is Light Pieen") {
        setLightPieenColor(event.target.value);
      } else {
        setReange(event.target.value);
      }
    } else {
      setBurple(event.target.value);
    }
  };

  const getBackgroundColor = () => {
    if (isSubmitted) {
      if (message === "What is Blue") {
        return `rgb(0, ${blueColor}, 255)`;
      } else if (message === "What is Blink") {
        const r = 255 - blinkColor;
        const b = 77 + (178 * blinkColor) / 255;
        return `rgb(${r}, 0, ${b})`;
      } else if (message === "What is Light Pieen") {
        const r = 225;
        const g = lightPieenColor;
        return `rgb(${r}, ${g}, 225)`;
      } else {
        return `rgb(255, ${reange}, 0)`;
      }
    } else {
      return `rgb(${burple}, 0, 255)`;
    }
  };

  const handleSubmit = async () => {
    const newColorBlock = getBackgroundColor();

    // Check if the color is not already present in colorBlocks
    if (!colorBlocks.includes(newColorBlock)) {
      setColorBlocks([...colorBlocks, newColorBlock]);
    }

    // Send the RGB values to the server and receive a unique identifier
    const response = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        rgbValues: colorBlocks,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      setUniqueIdentifier(data.uniqueIdentifier);
    }

    // Update the message to guide the user to adjust a different color on the next submission.
    if (message === "What is Burple") {
      setMessage("What is Reange");
    } else if (message === "What is Reange") {
      setMessage("What is Blue");
    } else if (message === "What is Blue") {
      setMessage("What is Blink");
    } else if (message === "What is Blink") {
      setMessage("What is Light Pieen");
    }

    // Set isSubmitted to true.
    setIsSubmitted(true);
  };

  const handleBack = () => {
    setIsSubmitted(false);
    setUniqueIdentifier(""); // Reset the unique identifier when going back
  };

  const handleGenerate = () => {
    // Generate the text content with RGB values
    const textContent = colorBlocks.map((block) => `RGB Value: ${block}`).join("\n");
    setGeneratedText(textContent);
  };

  const getButtons = () => {
    return (
      <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}>
        <p style={{ color: "white", textAlign: "center", fontWeight: "bold", fontSize: "1.5rem" }}>{message}?</p>
        <button type="button" onClick={handleBack} style={{ marginRight: "10px" }}>Back</button>
        <button type="submit" onClick={handleSubmit}>Submit</button>
        <button type="button" onClick={handleGenerate} style={{ marginLeft: "10px" }}>Generate</button>
      </div>
    );
  };

  return (
    <div className="main" style={{ backgroundColor: getBackgroundColor(), marginTop: "90px", marginBottom: "0px" }}>
      {getButtons()}
      <input
        type="range"
        id="burpleSlider"
        min="0"
        max="255"
        value={isSubmitted ? (message === "What is Blue" ? blueColor : message === "What is Blink" ? blinkColor : message === "What is Light Pieen" ? lightPieenColor : reange) : burple}
        onChange={handleChange}
      />
      <div style={{ display: "flex", flexDirection: "row", justifyContent: "center" }}>
        {colorBlocks.map((block, index) => (
          <div key={index} style={{ backgroundColor: block, width: 100, height: 100, border: "1px solid black", margin: "5px" }}>
            <p style={{ textAlign: "center" }}>RGB Value: {block}</p>
          </div>
        ))}
      </div>
      <div style={{ marginTop: "20px" }}>
        <textarea
          readOnly
          rows="5"
          cols="30"
          value={generatedText}
          style={{ display: "block", margin: "auto" }}
        />
      </div>
      {uniqueIdentifier && (
        <div style={{ marginTop: "20px", color: "white", textAlign: "center", fontWeight: "bold" }}>
          Your Unique Identifier: {uniqueIdentifier}
        </div>
      )}
    </div>
  );
};

export default BurpleSlider;