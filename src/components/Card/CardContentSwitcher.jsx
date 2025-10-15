import React, { useRef } from "react";
import { CSSTransition, SwitchTransition } from "react-transition-group";

export default function CardContentSwitcher({ editMode, shouldAnimate, onAnimationEnd, children }) {
  const contentRef = useRef(null);
  const [editChild, viewChild] = children;

  return (
    <SwitchTransition mode="out-in">
      <CSSTransition
        key={editMode ? "edit" : "view"}
        nodeRef={contentRef}
        timeout={400}
        classNames="slide"
        in={shouldAnimate}
        onEntered={onAnimationEnd}
      >
        <div className="content-inner" ref={contentRef}>
          {editMode ? editChild : viewChild}
        </div>
      </CSSTransition>
    </SwitchTransition>
  );
}
