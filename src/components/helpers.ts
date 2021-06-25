import { InputProps } from "@chakra-ui/input";
import axios from "axios";
import { lengthChecker, rangeChecker, regexChecker } from "./checkers";
import { ValidatorInputFieldProps } from "./ValidatorInputField";

export interface internalConfig {
  type: null | string | number;
  inbuiltType: "Aadhaar" | "PAN" | "PhoneNum" | null;
  required: null | boolean;
  illegals: string;
  length: {
    max: null | number;
    min: null | number;
    exact: null | number;
  };
  number: {
    max: null | number;
    min: null | number;
  };
  allow: {
    beyondLength: boolean | null;
    illegals: boolean | null;
  };
  customRegex: RegExp | null;
  asyncVal: {
    url: string | null;
    params: any;
  };
}

export const getConfigFromProps = (
  props: ValidatorInputFieldProps & InputProps,
  config: internalConfig
) => {
  const newConfig: internalConfig = { ...config };
  let k: keyof typeof props;
  for (k in props) {
    if (props[k] !== undefined) {
      // console.log(props[k]);
      switch (k) {
        case "isRequired":
          newConfig.required = true;
          break;
        case "minLength":
          newConfig.length.min = props.minLength as number;
          break;
        case "maxLength":
          newConfig.length.max = props.maxLength as number;
          break;
        case "inbuiltType":
          newConfig.inbuiltType =
            props.inbuiltType as typeof config.inbuiltType;
          break;
        case "type":
          switch (props.type) {
            case "number":
              newConfig.type = "number";
              if (!newConfig.illegals.includes("a-z"))
                newConfig.illegals = `${newConfig.illegals}a-zA-Z`;
              break;
            default:
              if (
                props.allowAlpha === false &&
                !newConfig.illegals.includes("a-z")
              )
                newConfig.illegals = `${newConfig.illegals}a-zA-Z`;
              if (
                props.allowNum === false &&
                !newConfig.illegals.includes("0-9")
              )
                newConfig.illegals = `${newConfig.illegals}0-9`;
          }
          break;
        case "allowIllegalInputs":
          if (props.allowAlpha === false && !newConfig.illegals.includes("a-z"))
            newConfig.illegals = `${newConfig.illegals}a-zA-Z`;
          if (props.allowNum === false && !newConfig.illegals.includes("0-9"))
            newConfig.illegals = `${newConfig.illegals}0-9`;
          if (
            props.illegalCharacters &&
            !newConfig.illegals.includes(props.illegalCharacters)
          )
            newConfig.illegals = `${newConfig.illegals}${props.illegalCharacters}`;
          if (props.allowIllegalInputs === false) {
            newConfig.allow.illegals = false;
          } else {
            newConfig.allow.illegals = true;
          }
          break;
        case "allowBeyondMaxLength":
          newConfig.allow.beyondLength = props.allowBeyondMaxLength
            ? true
            : false;
          break;
        case "asyncValidation":
          newConfig.asyncVal = {
            url: props.asyncValidation?.url as string,
            params: props.asyncValidation?.options,
          };
          break;
      }
    }
  }
  return newConfig;
};

export const defaultValidator = async (
  text: string,
  config: internalConfig
) => {
  let syncChecksComplete = true;
  let k: keyof internalConfig;
  for (k in config) {
    if (config[k]) {
      let error = check(text, k, config);
      if (error) {
        syncChecksComplete = false;
        return error;
      }
    }
  }
  if (syncChecksComplete && config.asyncVal?.url)
    return APIvalidation(config.asyncVal.url);
  return "";
};

const APIvalidation = async (url: string, options?: any) => {
  console.log(url);

  return axios
    .get(url) //mock api that returns data.args.validate: true "https://771bc051-2dd5-4eea-8a4c-4600410edd25.mock.pstmn.io/get"
    .then((res) => {
      console.log(res.data.args.validate);
      if (!res.data.args.validate) {
        return "failed server validation";
      } else return "";
    });
};

const check = (
  input: string,
  k: keyof internalConfig,
  config: internalConfig
) => {
  switch (k) {
    case "required":
      return config.required === true && input.length === 0
        ? "Required field"
        : "";
    case "length":
      return lengthChecker(input, config.length);
    case "number":
      if (config.type === "number") {
        return rangeChecker(input, config.number);
      }
      return "";
    case "customRegex":
      return regexChecker(input, config.customRegex as RegExp);
  }
};
