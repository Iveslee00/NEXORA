'use client';

import { createContext, useContext } from 'react';
import { GlobalSettings } from '@/types/modules';

interface GlobalSettingsContextValue extends GlobalSettings {
  setButtonColor: (color: string) => void;
  setPageBackgroundColor: (color: string) => void;
  setPageBackgroundImage: (url: string) => void;
}

export const GlobalSettingsContext = createContext<GlobalSettingsContextValue>({
  buttonColor: '#6366f1',
  pageBackgroundColor: '',
  pageBackgroundImage: '',
  setButtonColor: () => {},
  setPageBackgroundColor: () => {},
  setPageBackgroundImage: () => {},
});

export function useGlobalSettings() {
  return useContext(GlobalSettingsContext);
}
