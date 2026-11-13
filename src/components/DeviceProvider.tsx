import React, { createContext, useContext } from 'react';
import {
  DeviceDetectionState,
  useDeviceDetection,
} from '../hooks/useIsMobile';

const DeviceContext = createContext<DeviceDetectionState>({
  isMobile: false,
  isTouch: false,
  prefersReducedMotion: false,
});

export function useDevice(): DeviceDetectionState {
  return useContext(DeviceContext);
}

interface DeviceProviderProps {
  children: React.ReactNode;
  breakpoint?: number;
}

export function DeviceProvider({
  children,
  breakpoint = 768,
}: DeviceProviderProps) {
  const device = useDeviceDetection(breakpoint);

  return (
    <DeviceContext.Provider value={device}>{children}</DeviceContext.Provider>
  );
}

export default DeviceProvider;
