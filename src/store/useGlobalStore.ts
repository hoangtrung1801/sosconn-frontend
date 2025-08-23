import { create } from "zustand";

interface GlobalState {}

export interface GlobalStore extends GlobalState {}

const initialState: Pick<GlobalStore, keyof GlobalState> = {};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const useGlobalStore = create<GlobalStore>((set) => ({
  ...initialState,
}));

export default useGlobalStore;
