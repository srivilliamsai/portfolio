import { createContext, useContext } from 'react';
export const IntroContext = createContext(false);
export const useIntroActive = () => useContext(IntroContext);
