import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export default function TypingAnimation({ text, duration = 90, className }) {
  const [displayedText, setDisplayedText] = useState("");
  const [i, setI] = useState(0);

  useEffect(() => {
    const typingEffect = setInterval(() => {
      if (i < text.length) {
        setDisplayedText(text.substring(0, i + 1));
        setI(i + 1);
      } else {
        clearInterval(typingEffect);
      }
    }, duration);

    return () => {
      clearInterval(typingEffect);
    };
  }, [duration, i]);

  return (
    <h1 className={cn("font-display text-center drop-shadow-sm", className)}>
      {displayedText ? displayedText : text}
    </h1>
  );
}
