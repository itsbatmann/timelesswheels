import { createContext, useContext } from "react";

/**
 * False while the preloader owns the screen, true the moment the shutter starts
 * opening. Every entrance animation on the first screen waits on this so the
 * hero is already in motion as the slats part, rather than popping in after.
 */
export const ReadyContext = createContext(false);

export const useReady = () => useContext(ReadyContext);
