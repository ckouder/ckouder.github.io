import { ABOUT_APP, FINDER_APP } from "../utils/constants";
import { onlyOneWindowOfInstance, type NewWindowStrategy } from "./utils/newWindowStrategies";

export const onNewWindow = new Map<string, NewWindowStrategy>([
  [FINDER_APP, onlyOneWindowOfInstance],
  [ABOUT_APP, onlyOneWindowOfInstance],
]);