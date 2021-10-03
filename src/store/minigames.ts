import { ReactNode } from "react";
import { MINIGAME_STATUS } from "../utils/enums";

interface IMiniGames {
  cash: number;
  resources: number;
  lives: number;
  minigame_status: number;
  msg: HTMLElement | ReactNode | null;
}

export const minigames: IMiniGames = {
  cash: 0,
  resources: 0,
  lives: 100,
  minigame_status: MINIGAME_STATUS.NOT_PLAYING,
  msg: null,
};
