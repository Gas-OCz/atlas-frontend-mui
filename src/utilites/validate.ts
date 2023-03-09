function isValidDate(year: number, month: number, day: number): boolean {
  const date = new Date(year, month - 1, day);
  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
  );
}

export const validRC = (rc: string): boolean | string => {
  const message = "Rodné číslo není platné";
  // odebrání lomítka z řetězce, pokud existuje
  rc = rc.replace("/", "");
  // ověření délky řetězce
  if (rc.length !== 10 && rc.length !== 6) {
    return message;
  }

  if (rc.length === 6) {
    return true;
  }
  const day = rc.substring(4, 6);
  const month = rc.substring(2, 4);
  const year = rc.substring(0, 2);
  const control = rc.substring(9, 10);

  // Ověření platnosti data narození
  const birthYear =
    parseInt(year, 10) < 54
      ? 2000 + parseInt(year, 10)
      : 1900 + parseInt(year, 10);

  const birthMonth = parseInt(month, 10) % 50;
  const birthDay = parseInt(day, 10);

  if (!isValidDate(birthYear, birthMonth, birthDay)) {
    return message;
  }
  const sude = rc
    .substring(0, 9)
    .split("")
    .filter((num) => parseInt(num) % 2 === 0)
    .reduce((acc, val) => acc + parseInt(val), 0);

  const liche = rc
    .substring(0, 9)
    .split("")
    .filter((num) => parseInt(num) % 2 !== 0)
    .reduce((acc, val) => acc + parseInt(val), 0);
  if (liche - sude - 11 === parseInt(control)) return true;
  return message;
};
