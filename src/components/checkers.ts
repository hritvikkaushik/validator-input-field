export const regexChecker = (input: string, regex: RegExp) => {
  if (!regex.test(input)) return "Invalid input";
  return "";
};

export const rangeChecker = (
  input: number | string,
  range: {
    min?: number | null;
    max?: number | null;
  }
) => {
  if (typeof input === typeof 1) {
    if (range.max && input > range.max)
      return `Value must be smaller than ${range.max}.`;
    if (range.min && input < range.min)
      return `Value must be larger than ${range.min}.`;
  } else {
    const value = parseInt(input as string);
    if (range.max && value > range.max)
      return `Value must be smaller than ${range.max}.`;
    if (range.min && value < range.min)
      return `Value must be larger than ${range.min}.`;
  }
  return "";
};

export const lengthChecker = (
  input: string,
  length: {
    min: number | null;
    max: number | null;
    exact: number | null;
  }
) => {
  if (length.exact && input.length !== length.exact)
    return `Input must be ${length.exact} characters long.`;
  if (length.max && input.length > length.max)
    return `Input must be shorter than ${length.max} characters.`;
  if (length.min && input.length < length.min)
    return `Input must be longer than ${length.min} characters.`;
  return "";
};

export const illegalChecker = (input: string, illegals: string) => {
  if (illegals.includes(input)) return "Illegal character";
  return "";
};
