export const validRC = (rc: string): boolean => {
  // odebrání lomítka z řetězce, pokud existuje
  rc = rc.replace("/", "");

  // ověření délky řetězce
  if (rc.length !== 10) {
    return false;
  }

  // ověření data narození
  let yy = parseInt(rc.substring(0, 2));
  const mm = parseInt(rc.substring(2, 4), 10); // měsíce se počítají od 0
  const dd = parseInt(rc.substring(4, 6));
  const datumNarozeni = new Date(yy, mm, dd);

  if (yy <= 15) {
    // this should be the number where you think it stops to be 20xx (like 15 for 2015; for every number after that it will be 19xx)
    yy += 2000;
  } else {
    yy += 1900;
  }
  if (
    datumNarozeni.getFullYear() !== yy ||
    datumNarozeni.getMonth() !== mm ||
    datumNarozeni.getDate() !== dd
  ) {
    return false;
  }

  // ověření kontrolního čísla
  let modulo = 0;
  for (let i = 0; i < 9; i++) {
    modulo += parseInt(rc.charAt(i));
  }

  return !(modulo % 11 === 0);
};
