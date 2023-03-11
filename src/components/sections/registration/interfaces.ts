import { IRaceSet } from "../../../../pages/[race]";

export interface RegistrationProps {
  race: IRaceSet;
  section: string;
  homepagePosition?: "LEFT" | "RIGHT";
}
export interface IRaceShirt {
  id: string;
  title: string;
  price: number;
  available: boolean;
}
export enum EUpsellType {
  standard = "standard",
  shirt = "shirt",
}

export interface IRaceUpsell {
  id: string;
  type: EUpsellType;
  title: string;
  price: number;
  available: boolean;
  multiple: boolean;
}

export interface IRegistrationDto {
  id: string;
  club_name: string;
  team_name: string;
  note: string;
  price: number; // celková cena za přihlášku včetně DPH

  //registration_status_type: "accepted"; //status při registraci, defaultně v db je accepted, nemělo by být nutné vyplnit

  id_race: string; //Odkaz na závod kterého se registrace týká
  id_race_categories: string; //odkaz na kategorii kam registrace spadá

  //Závodníci
  registration_competitors: {
    data: RegistrationCompetitors[];
  };
  //Doprovod
  registration_accompaniments: { data: RegistrationAccompaniments[] };

  //Doplňkový prodej
  registration_upsells: { data: IRegistrationUpsells[] };
}
export interface RegistrationCompetitors {
  id: string;
  first_name: string;
  last_name?: string;
  phone_number: string;
  email: string;
  personal_id: string; //RČ - počítá se s formatem 6 nebo 10 znaků, vypočítává se z toho datum narození
  id_race_shirt: string; //Odkaz na vybrané triko z "race_shirts"
}
interface RegistrationAccompaniments {
  id: string;
  first_name: string;
  last_name: string;
  phone: string;
}
export interface IRegistrationUpsells {
  id: string;
  title: string;
  id_race_upsell: string; // propojí se na "race_upsells" podle kterého se určí o co jde
  amount: string;
  price: string; //Jednotková cena s DPH.
}

export interface IRaceCategory {
  id: string;
  id_race: string;
  title: string;
  shortcut: string;
  price: number;
  surcharge: number;
  accompaniment: boolean;
  description: string;
}
export interface IRaceCategoryRule {
  id: string;
  id_race_category: string;
  age_from: number;
  age_to: number;
  sex: ECategorySex;
  optional: boolean;
}

export enum ECategorySex {
  male = "male",
  female = "female",
  mix = "mix",
}
