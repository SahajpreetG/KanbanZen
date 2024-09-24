// store/AlertStore.ts

import { create } from 'zustand';

interface AlertState {
  isVisible: boolean;
  message: string;
  type: 'success' | 'error';
  showAlert: (message: string, type?: 'success' | 'error') => void;
  hideAlert: () => void;
}

export const useAlertStore = create<AlertState>((set) => ({
  isVisible: false,
  message: '',
  type: 'success',
  showAlert: (message, type = 'success') => set({ isVisible: true, message, type }),
  hideAlert: () => set({ isVisible: false, message: '', type: 'success' }),
}));
