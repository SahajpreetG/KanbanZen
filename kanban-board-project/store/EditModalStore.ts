// store/EditModalStore.ts

import { create } from 'zustand';

interface EditModalState {
  isOpen: boolean;
  taskToEdit: Todo | null;
  columnId: TypedColumn | null;
  openEditModal: () => void;
  closeEditModal: () => void;
  setTaskToEdit: (task: Todo, columnId: TypedColumn) => void;
}

export const useEditModalStore = create<EditModalState>((set) => ({
  isOpen: false,
  taskToEdit: null,
  columnId: null,
  openEditModal: () => set({ isOpen: true }),
  closeEditModal: () =>
    set({ isOpen: false, taskToEdit: null, columnId: null }),
  setTaskToEdit: (task, columnId) =>
    set({ taskToEdit: task, columnId: columnId }),
}));
