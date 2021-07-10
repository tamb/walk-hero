interface IHero {
  hero_name?: string;
  hero_type_id?: string;
  skin_hex?: string;
  sex?: number;
  inventory?: object;
}

export const hero: IHero = {
  hero_name: null,
  hero_type_id: null,
  skin_hex: null,
  sex: null,
  inventory: null,
};
