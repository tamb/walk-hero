export enum VIEWS {
  LANDING = 0,
  QUEST = 100,
  MINIGAMES = 200,
}

export enum MINIGAME_STATUS {
  DIRECTIONS = 0, // showing directions for minigame
  PLAYING = 10, // actively playing
  WON = 20, // you have won the minigame
  REWARDING = 21, // you are viewing the rewards you've earned from a win
  LOST = 30, // you have lost the minigame
  PENALTY = 31, // you are viewing the penalty from a loss
  PAUSED = 40, // in the midst of play but paused
  NOT_PLAYING = -10, // inactive user or only active with quest
}
