'use client';

import { createContext, useContext } from 'react';

interface DeviceContextValue {
  isMobile: boolean;
}

export const DeviceContext = createContext<DeviceContextValue>({ isMobile: false });

export function useDevice() {
  return useContext(DeviceContext);
}
