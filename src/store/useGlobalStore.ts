import { create } from "zustand";

interface GlobalState {}

export interface GlobalStore extends GlobalState {}

const initialState: Pick<GlobalStore, keyof GlobalState> = {};

const useGlobalStore = create<GlobalStore>(() => ({
  ...initialState,
}));

export default useGlobalStore;
