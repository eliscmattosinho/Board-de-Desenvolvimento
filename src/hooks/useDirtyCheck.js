import { useMemo } from "react";

export function useDirtyCheck(base, current, isActive = true) {
    return useMemo(() => {
        if (!isActive || !base || !current) return false;

        return Object.keys(base).some((key) => {
            const baseVal = base[key];
            const currentVal = current[key];

            return baseVal !== currentVal;
        });
    }, [base, current, isActive]);
}
