import React, { useRef } from "react";
import { CSSTransition, SwitchTransition } from "react-transition-group";
import StatusDropdown from "@components/StatusDropdown/StatusDropdown";

export default function CardForm({
    form,
    columns,
    onSelect,
    readOnly,
    isCreating,
    onTransitionStart,
    onTransitionEnd,
}) {
    const { title, setTitle, description, setDescription, columnId } = form;
    const contentRef = useRef(null);

    return (
        <SwitchTransition mode="out-in">
            <CSSTransition
                key={readOnly ? "view" : "edit"}
                nodeRef={contentRef}
                timeout={400}
                classNames="slide"
                unmountOnExit
                onEnter={onTransitionStart}
                onExit={onTransitionStart}
                onEntered={onTransitionEnd}
                onExited={onTransitionEnd}
            >
                <div
                    ref={contentRef}
                    className={`modal-content ${readOnly ? "card-view" : "card-edit"} ${isCreating ? "card-create" : ""
                        }`}
                >
                    {!readOnly ? (
                        <div className="modal-field title-block">
                            <label className="input-title" htmlFor="card-title">
                                Título:
                            </label>
                            <input
                                id="card-title"
                                className="input-entry"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Título da tarefa"
                            />
                        </div>
                    ) : (
                        <h2 className="card-name">{title}</h2>
                    )}

                    <div className="status-block">
                        <label className="input-title" htmlFor="card-status">
                            Status:
                        </label>
                        <StatusDropdown
                            id="card-status"
                            columns={columns}
                            currentColumnId={columnId}
                            onSelect={onSelect}
                        />
                    </div>

                    <div className="modal-field">
                        <label className="input-title" htmlFor="card-description">
                            Descrição:
                        </label>
                        {readOnly ? (
                            <p className="description-text">
                                {description || "Nenhuma descrição disponível."}
                            </p>
                        ) : (
                            <textarea
                                id="card-description"
                                className="input-entry textarea-description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Descrição (opcional)"
                                rows={4}
                            />
                        )}
                    </div>
                </div>
            </CSSTransition>
        </SwitchTransition>
    );
}
