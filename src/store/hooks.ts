import { useDispatch, useSelector, useStore } from "react-redux";
import type { AppDispatch, RootStore } from "./index";

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootStore>();
export const useAppStore = useStore.withTypes<typeof import("./index").store>();
