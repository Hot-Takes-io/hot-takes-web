import NeedToSignIn from "./NeedToSignIn";
import TakeModalView from "./TakeModalView";

export const Modals = {
  TakeModalView,
  NeedToSignIn,
};

export const ModalNames: Record<keyof typeof Modals, string> = Object.keys(
  Modals
).reduce((acc, key) => {
  acc[key as keyof typeof Modals] = key;
  return acc;
}, {} as Record<keyof typeof Modals, string>);
