import { useEffect, useState, useRef } from "react";
import { createPortal } from "react-dom";
import { useScreen } from "@context/ScreenContext";
import "./TooltipPortal.css";

export default function TooltipPortal() {
  const { isTouch } = useScreen();

  if (isTouch) return null;

  const tooltipRef = useRef(null);
  const activeElement = useRef(null);
  const observerRef = useRef(null);

  const [tooltip, setTooltip] = useState({
    text: "",
    x: 0,
    y: 0,
    position: "bottom",
    arrowOffset: 0,
    visible: false
  });

  const hideTimeout = useRef(null);

  // --- throttle genérico ---
  const throttle = (fn, delay) => {
    let last = 0;
    let timeout;
    return (...args) => {
      const now = Date.now();
      const remaining = delay - (now - last);
      if (remaining <= 0) {
        last = now;
        fn(...args);
      } else {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
          last = Date.now();
          fn(...args);
        }, remaining);
      }
    };
  };

  // --- posicionamento ---
  const updateTooltipPosition = () => {
    const el = activeElement.current;
    const tooltipEl = tooltipRef.current;

    if (!el || !tooltipEl) return;

    const rect = el.getBoundingClientRect();

    const prevVis = tooltipEl.style.visibility;
    const prevDisp = tooltipEl.style.display;

    tooltipEl.style.visibility = "hidden";
    tooltipEl.style.display = "block";

    const tRect = tooltipEl.getBoundingClientRect();

    tooltipEl.style.visibility = prevVis;
    tooltipEl.style.display = prevDisp;

    const idealX = rect.left + rect.width / 2;
    let x = idealX;

    let y = rect.bottom + 8;
    let position = "bottom";

    if (y + tRect.height > window.innerHeight) {
      y = rect.top - tRect.height - 8;
      position = "top";
    }

    const half = tRect.width / 2;
    if (x - half < 0) x = half + 8;
    if (x + half > window.innerWidth)
      x = window.innerWidth - half - 8;

    const arrowOffset = idealX - x;

    setTooltip((t) => ({
      ...t,
      x,
      y,
      position,
      arrowOffset
    }));
  };

  // quando aparece, força nova medição
  useEffect(() => {
    if (tooltip.visible) {
      requestAnimationFrame(() => {
        updateTooltipPosition();
      });
    }
  }, [tooltip.visible]);

  useEffect(() => {
    const throttledUpdate = throttle(updateTooltipPosition, 80);

    const showTooltip = (el) => {
      const text = el.getAttribute("data-tooltip");
      activeElement.current = el;

      hideTimeout.current && clearTimeout(hideTimeout.current);

      observerRef.current?.disconnect();
      observerRef.current = new IntersectionObserver(
        ([entry]) => {
          if (!entry.isIntersecting) {
            activeElement.current = null;
            setTooltip((t) => ({ ...t, visible: false }));
          }
        },
        { threshold: 0.01 }
      );
      observerRef.current.observe(el);

      updateTooltipPosition();
      setTooltip((t) => ({ ...t, text, visible: true }));
    };

    const handleEnter = (e) => {
      const el = e.target.closest("[data-tooltip]");
      if (!el) return;
      if (activeElement.current === el) return;
      showTooltip(el);
    };

    const handleLeave = (e) => {
      const el = activeElement.current;
      if (!el) return;

      if (!el.contains(e.relatedTarget)) {
        hideTimeout.current = setTimeout(() => {
          activeElement.current = null;
          observerRef.current?.disconnect();
          setTooltip((t) => ({ ...t, visible: false }));
        }, 120);
      }
    };

    // update position (scroll/resize)
    window.addEventListener("scroll", throttledUpdate, { passive: true });
    window.addEventListener("resize", throttledUpdate);

    document.addEventListener("mouseover", handleEnter, true);
    document.addEventListener("mouseout", handleLeave, true);

    return () => {
      window.removeEventListener("scroll", throttledUpdate);
      window.removeEventListener("resize", throttledUpdate);

      document.removeEventListener("mouseover", handleEnter, true);
      document.removeEventListener("mouseout", handleLeave, true);

      observerRef.current?.disconnect();
    };
  }, []);

  return createPortal(
    <div
      ref={tooltipRef}
      className={`tooltip-portal ${tooltip.visible ? "visible" : ""} ${tooltip.position}`}
      style={{
        top: tooltip.y,
        left: tooltip.x
      }}
    >
      {tooltip.text}
      <span
        className="tooltip-arrow"
        style={{
          transform: `translateX(calc(-50% + ${tooltip.arrowOffset}px))`
        }}
      />
    </div>,
    document.body
  );
}
