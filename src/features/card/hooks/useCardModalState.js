import { useState } from "react";

export function useCardModalState(card) {
    const isCreating = Boolean(card?.isNew);
    const [editMode, setEditMode] = useState(isCreating);
    const [isAnimating, setIsAnimating] = useState(false);

    return {
        isCreating,
        editMode,
        setEditMode,
        isAnimating,
        triggerAnimation: () => setIsAnimating(true),
        resetAnimation: () => setIsAnimating(false),
    };
}
