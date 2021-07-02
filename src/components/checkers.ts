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
    if (max && input > max) return `Value must be smaller than ${max}`;
    if (min && input < min) return `Value must be larger than ${min}`;
  } else {
    const value = parseInt(input as string);
    if (max && value > max) return `Value must be smaller than ${max}`;
    if (min && value < min) return `Value must be larger than ${min}`;
  }
  return "";
};

export const lengthChecker = (
  input: number | string,
  min?: number,
  max?: number
) => {
  if (typeof input === typeof "") {
    if (max && (input as string).length > max)
      return `Input must be at most ${max} characters long`;
    if (min && (input as string).length < min)
      return `Input must be at least ${min} characters long`;
  } else {
    const strVal = `${input}`;
    if (max && strVal.length > max)
      return `Input must be at most ${max} characters long`;
    if (min && strVal.length < min)
      return `Input must be at least ${max} characters long`;
  }
  return "";
};
