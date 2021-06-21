export const AadhaarValidator = (text: string) => {
  const pattern = new RegExp(/^[1-9]{1}[0-9]{3}\s[0-9]{4}\s[0-9]{4}$/);
  if (!pattern.test(text)) return "Entered text is not a valid aadhaar number.";
  return "";
};
