interface IHero {
  hero_name: string | null;
  hero_type_id: number | null;
  skin_hex: string | null;
  sex: number | null;
  inventory: number | null;
}

export const hero: IHero = {
  hero_name: null,
  hero_type_id: null,
  skin_hex: null,
  sex: null,
  inventory: null,
};
