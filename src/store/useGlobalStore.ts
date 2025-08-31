import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User } from "@/types";
import { LocalStorage } from "@/lib/services/local-storage";
import { EStorageKey } from "@/constants/storage";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

interface AuthActions {
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  login: (user: User) => void;
  logout: () => void;
  initializeAuth: () => void;
}

interface GlobalState extends AuthState {}

export interface GlobalStore extends GlobalState, AuthActions {}

const initialState: Pick<GlobalStore, keyof GlobalState> = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
};

const useGlobalStore = create<GlobalStore>()(
  persist(
    (set) => ({
      ...initialState,
      
      setUser: (user) => set({ 
        user, 
        isAuthenticated: !!user 
      }),
      
      setLoading: (isLoading) => set({ isLoading }),
      
      login: (user) => set({ 
        user, 
        isAuthenticated: true, 
        isLoading: false 
      }),
      
      logout: () => {
        // Clear localStorage
        LocalStorage.remove(EStorageKey.AUTH_TOKEN);
        LocalStorage.remove(EStorageKey.AUTH_REFRESHTOKEN);
        LocalStorage.remove(EStorageKey.AUTH_USER);
        
        set({ 
          user: null, 
          isAuthenticated: false, 
          isLoading: false 
        });
      },
      
      initializeAuth: () => {
        try {
          const token = LocalStorage.get(EStorageKey.AUTH_TOKEN);
          const user = LocalStorage.get(EStorageKey.AUTH_USER);
          
          if (token && user) {
            set({ 
              user, 
              isAuthenticated: true, 
              isLoading: false 
            });
          } else {
            set({ 
              user: null, 
              isAuthenticated: false, 
              isLoading: false 
            });
          }
        } catch (error) {
          console.error('Error initializing auth:', error);
          set({ 
            user: null, 
            isAuthenticated: false, 
            isLoading: false 
          });
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        user: state.user, 
        isAuthenticated: state.isAuthenticated 
      }),
    }
  )
);

export default useGlobalStore;
