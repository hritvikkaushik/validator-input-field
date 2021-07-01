export const AadhaarValidator = (text: string) => {
  const pattern = new RegExp(/^[2-9]{1}[0-9]{3}([0-9]{8})$/);
  if (!pattern.test(text)) return "Please enter a valid Aadhaar Number.";
  return "";
};

export const PANValidator = (value: string) => {
  if (value.length !== 10) {
    return "PAN should be 10 character long";
  }
  let panRegx = /([A-Za-z]){5}([0-9]){4}([A-Za-z]){1}$/;
  if (!panRegx.test(value)) {
    return "Please enter a valid PAN.";
  }
  return "";
};

export const EmailValidator = (value: string) => {
  let emailRegx = /^[A-Z0-9._%+-]+@[A-Z0-9.-]{3,}\.[A-Za-z]{2,4}$/i;
  if (!emailRegx.test(value)) {
    return "Please enter a valid email address.";
  }
  return "";
};

export const MobileValidator = (value: string) => {
  let emailRegx = /^[1-9]{1}\d{9}$/;
  if (!emailRegx.test(value)) {
    return "Please enter a valid mobile number.";
  }
  return "";
};
