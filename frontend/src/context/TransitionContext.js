import { createContext, useContext } from 'react';

// `ready` is false while the preloader or a page-transition curtain covers the screen.
// Page-level entrance animations wait for it so they play where people can see them.
export const TransitionContext = createContext({ ready: true });

export const usePageReady = () => useContext(TransitionContext).ready;
