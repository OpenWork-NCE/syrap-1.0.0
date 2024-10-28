import { create } from 'zustand';
import { myTheme } from '@/theme';
import { University } from '@/types/real-types';

export const useTheme = create((set) => ({
  theme: myTheme,
  changeTheme: (newTheme: any) => set({ theme: newTheme }),
}));

export const useRole = create((set) => ({
  role: 'Cenadi',
  changeRole: (newRole: 'Cenadi' | 'Ipes' | 'Minesup') =>
    set({ role: newRole }),
}));

export const useUniversities = create((set) => ({
  universities: [],
  changeUniversities: (universities: University[]) => set({ universities }),
}));
