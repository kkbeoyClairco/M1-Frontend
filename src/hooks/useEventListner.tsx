import { useEffect, useRef } from 'react';

export function useEventListener<T extends HTMLElement>(
    ref: React.RefObject<T>,
    event: keyof HTMLElementEventMap,
    handler: (event: Event) => void,
    deps: any[] = []
) {
    const savedHandler = useRef<(event: Event) => void>();

    useEffect(() => {
        savedHandler.current = handler;
    }, [handler, ...deps]);

    useEffect(() => {
        const element = ref.current;
        if (!element) return;

        const eventListener = (event: Event) => {
            if (savedHandler.current) {
                savedHandler.current(event);
            }
        };

        element.addEventListener(event, eventListener, true);
        return () => {
            element.removeEventListener(event, eventListener, true);
        };
    }, [ref, event, ...deps]);
}
