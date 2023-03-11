import {
  ECategorySex,
  IRaceCategoryRule,
} from "@components/sections/registration/interfaces";

function isValidDate(year: number, month: number, day: number): boolean {
  const date = new Date(year, month - 1, day);
  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
  );
}
export interface IGetAgeAndSex {
  age: number;
  ageConfirm?: boolean;
  sex: ECategorySex;
}
export const checkRulesSex = (
  zavodnici: IGetAgeAndSex[],
  rules: IRaceCategoryRule[]
): boolean[] => {
  const check: boolean[] = new Array(zavodnici.length).fill(false);
  const newRules = [...rules];
  for (let i = 0; i < zavodnici.length; i++) {
    for (let j = 0; j < newRules.length; j++) {
      if (
        (rules[j].sex === ECategorySex.mix ||
          zavodnici[i].sex === rules[j].sex) &&
        !check[i]
      ) {
        check[i] = true;
        newRules.splice(j, 1);
        break;
      }
    }
  }
  return check;
};
export const checkRulesAge = (
  zavodnici: IGetAgeAndSex[],
  rules: IRaceCategoryRule[]
): boolean[] => {
  const check: boolean[] = new Array(zavodnici.length).fill(false);
  const newRules = [...rules];
  for (let i = 0; i < zavodnici.length; i++) {
    for (let j = 0; j < newRules.length; j++) {
      if (
        zavodnici[i].age >= newRules[j].age_from &&
        zavodnici[i].age <= newRules[j].age_to &&
        !check[i]
      ) {
        check[i] = true;
        newRules.splice(j, 1);
        break;
      }
    }
  }
  return check;
};

export const getAgeAndSex = (rc: string): IGetAgeAndSex => {
  const day = rc.substring(4, 6);
  const month = rc.substring(2, 4);
  const year = rc.substring(0, 2);

  const birthYear =
    parseInt(year, 10) < 54
      ? 2000 + parseInt(year, 10)
      : 1900 + parseInt(year, 10);

  const birthMonth = parseInt(month, 10) % 50;
  const birthDay = parseInt(day, 10);
  const today = new Date();
  const birthDate = new Date(birthYear, birthMonth, birthDay);
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  let sex = ECategorySex.male;
  if (parseInt(month, 10) > 50) sex = ECategorySex.female;
  return { age: age, sex: sex };
};
export const validRC = (rc: string): boolean | string => {
  rc = rc.replace("/", "");
  if (rc.length !== 10 && rc.length !== 6) {
    return false;
  }

  if (rc.length === 6) {
    return true;
  }
  const day = rc.substring(4, 6);
  const month = rc.substring(2, 4);
  const year = rc.substring(0, 2);
  const control = rc.substring(9);

  const birthYear =
    parseInt(year, 10) < 54
      ? 2000 + parseInt(year, 10)
      : 1900 + parseInt(year, 10);

  const birthMonth = parseInt(month, 10) % 50;
  const birthDay = parseInt(day, 10);

  if (!isValidDate(birthYear, birthMonth, birthDay)) {
    return false;
  }

  const vypocet = parseInt(rc.substring(0, 9));

  return vypocet % 11 === parseInt(control) || vypocet % 11 === 10;
};
