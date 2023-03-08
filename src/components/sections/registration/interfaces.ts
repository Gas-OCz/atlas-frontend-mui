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

export interface IRegistrationDto {
  club_name: string;
  team_name: string;
  note: string;
  price: number; // celková cena za přihlášku včetně DPH

  //registration_status_type: "accepted"; //status při registraci, defaultně v db je accepted, nemělo by být nutné vyplnit

  id_race: string; //Odkaz na závod kterého se registrace týká
  id_race_categories: string; //odkaz na kategorii kam registrace spadá

  //Závodníci
  registration_competitors: {
    //id_registration:string; // klíč přes který se propojí s registraci
    first_name: string;
    last_name?: string;
    phone_number: string;
    email: string;
    personal_id: string; //RČ - počítá se s formatem 6 nebo 10 znaků, vypočítává se z toho datum narození
    id_race_shirt: string; //Odkaz na vybrané triko z "race_shirts"
  }[];

  //Doprovod
  registration_accompaniments: {
    //id_registration:string; // klíč přes který se propojí s registraci
    first_name: string;
    last_name: string;
    phone: string;
  }[];

  //Doplňkový prodej
  registration_upsells: {
    //id_registration:string; // klíč přes který se propojí s registraci
    id_race_upsell: string; // propojí se na "race_upsells" podle kterého se určí o co jde
    amount: string;
    price: string; //Jednotková cena s DPH.
  }[];
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