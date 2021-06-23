export const regexChecker = (input: string, regex: RegExp) => {
  if (!regex.test(input)) return "Invalid input";
  return "";
};

export const rangeChecker = (
  input: number | string,
  min?: number,
  max?: number
) => {
  if (typeof input === typeof 1) {
    if (max && input > max) return "Too large";
    if (min && input < min) return "Too small";
  } else {
    const value = parseInt(input as string);
    if (max && value > max) return "Too large";
    if (min && value < min) return "Too small";
  }
  return "";
};

export const lengthChecker = (
  input: number | string,
  min?: number,
  max?: number
) => {
  if (typeof input === typeof "") {
    if (max && (input as string).length > max) return "Too long";
    if (min && (input as string).length < min) return "Too short";
  } else {
    const strVal = `${input}`;
    if (max && strVal.length > max) return "Too long";
    if (min && strVal.length < min) return "Too short";
  }
  return "";
};

export const illegalChecker = (input: string, illegals: string) => {
  if (illegals.includes(input)) return "Illegal character";
  return "";
};
