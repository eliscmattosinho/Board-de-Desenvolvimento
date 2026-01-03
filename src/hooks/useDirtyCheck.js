import { useMemo } from "react";

export function useDirtyCheck(base, current, isActive = true) {
    return useMemo(() => {
        if (!isActive || !base || !current) return false;

        return Object.keys(base).some((key) => {
            return base[key] !== current[key];
        });
    }, [base, current, isActive]);
}
