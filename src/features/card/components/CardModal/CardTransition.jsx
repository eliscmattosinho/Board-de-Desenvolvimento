import React, { useRef } from "react";

import { CSSTransition, SwitchTransition } from "react-transition-group";

import CardEditView from "../CardEditView";
import CardView from "../CardView";

export default function CardTransition({
    editMode,
    shouldAnimate,
    onAnimationEnd,
    title,
    setTitle,
    description,
    setDescription,
    columns,
    currentColumnId,
    onSelect
}) {
    const contentRef = useRef(null);

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
                    {editMode ? (
                        <CardEditView
                            title={title}
                            setTitle={setTitle}
                            description={description}
                            setDescription={setDescription}
                            columns={columns}
                            currentColumnId={currentColumnId}
                            onSelect={onSelect}
                        />
                    ) : (
                        <CardView
                            title={title}
                            description={description}
                            columns={columns}
                            currentColumnId={currentColumnId}
                            onSelect={onSelect}
                        />
                    )}
                </div>
            </CSSTransition>
        </SwitchTransition>
    );
}
