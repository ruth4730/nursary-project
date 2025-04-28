import { Search } from "lucide-react";
import { useRef, useEffect } from "react";
import "./Styles.css"
export default function SearchBox({ text, setText }) {
  const inputRef = useRef(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = "auto";
      inputRef.current.style.height = `${inputRef.current.scrollHeight}px`;
    }
  }, [text]);

  return (
    <div className="search-box">
      <textarea
        ref={inputRef}
        placeholder="חפש צמח"
        className="search-input"
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={1}
      />
      <button className="search-button">
        <Search className="search-icon" />
      </button>
    </div>
  );
}
