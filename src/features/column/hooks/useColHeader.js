import { useState, useEffect, useRef } from "react";

export function useColHeader(isTouch) {
    const [hovered, setHovered] = useState(false);
    const containerRef = useRef(null);

    useEffect(() => {
        if (!isTouch || !hovered) return;

        const handleClickOutside = (e) => {
            if (containerRef.current && !containerRef.current.contains(e.target)) {
                setHovered(false);
            }
        };

        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
    }, [hovered, isTouch]);

    const hoverProps = {
        ref: containerRef,
        onMouseEnter: () => !isTouch && setHovered(true),
        onMouseLeave: () => !isTouch && setHovered(false),
        onClick: () => isTouch && setHovered((prev) => !prev),
    };

    return { hovered, hoverProps };
}
