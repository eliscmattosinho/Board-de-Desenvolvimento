import PropTypes from "prop-types";
import { useEffect, useState, useRef } from "react";
import "./TypingText.css";

export default function TypingTitle({ text = "", speed = 200 }) {
  const [displayed, setDisplayed] = useState("");
  const indexRef = useRef(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    setDisplayed("");
    indexRef.current = 0;

    if (intervalRef.current) clearInterval(intervalRef.current);

    if (!text) return;

    intervalRef.current = setInterval(() => {
      setDisplayed(prev => text.slice(0, prev.length + 1));
      indexRef.current++;

      if (indexRef.current >= text.length && intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }, speed);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [text, speed]);

  return (
    <span>
      {displayed}
      <span className="typing-cursor"></span>
    </span>
  );
}

// @TODO use TS
TypingTitle.propTypes = {
  text: PropTypes.string,
  speed: PropTypes.number,
};
