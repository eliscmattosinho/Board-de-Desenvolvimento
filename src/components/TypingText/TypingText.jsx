import { useEffect, useState, useCallback } from "react";
import PropTypes from "prop-types";
import "./TypingText.css";

export default function TypingTitle({ text = "", speed = 150 }) {
  const [displayed, setDisplayed] = useState("");
  const [isComplete, setIsComplete] = useState(false);

  const typeCharacter = useCallback(
    (fullText, currentIndex) => {
      if (currentIndex <= fullText.length) {
        setDisplayed(fullText.slice(0, currentIndex));

        const timeout = setTimeout(() => {
          typeCharacter(fullText, currentIndex + 1);
        }, speed);

        return timeout;
      } else {
        setIsComplete(true);
      }
    },
    [speed]
  );

  useEffect(() => {
    setDisplayed("");
    setIsComplete(false);

    if (!text) return;

    const timeoutId = typeCharacter(text, 0);

    return () => clearTimeout(timeoutId);
  }, [text, typeCharacter]);

  return (
    <span className="typing-container" aria-label={text}>
      <span aria-hidden="true">{displayed}</span>
      <span
        className={`typing-cursor ${isComplete ? "finished" : ""}`}
        aria-hidden="true"
      />
    </span>
  );
}

TypingTitle.propTypes = {
  text: PropTypes.string,
  speed: PropTypes.number,
};
