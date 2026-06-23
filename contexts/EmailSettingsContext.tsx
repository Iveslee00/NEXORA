'use client';

import { createContext, useContext } from 'react';
import { EmailSettings } from '@/types/emailModules';

interface EmailSettingsContextType extends EmailSettings {
  update: (partial: Partial<EmailSettings>) => void;
}

export const EmailSettingsContext = createContext<EmailSettingsContextType>({
  backgroundColor: '#f4f4f4',
  contentBgColor: '#ffffff',
  primaryColor: '#6366f1',
  utmString: '',
  trackingPixel: '',
  previewText: '',
  update: () => {},
});

export function useEmailSettings() {
  return useContext(EmailSettingsContext);
}
