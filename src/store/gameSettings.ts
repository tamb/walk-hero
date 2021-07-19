interface IGameSettings {
  game_vibrations: boolean;
  haptic_feedback: boolean;
  sound_fx: boolean;
  music: boolean;
}

export const game_settings: IGameSettings = {
  game_vibrations: true,
  haptic_feedback: true,
  sound_fx: false,
  music: false,
};
