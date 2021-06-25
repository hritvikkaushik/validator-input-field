import {
  FormControl,
  FormErrorMessage,
  // FormHelperText,
  // FormLabel,
  Input,
  InputProps,
} from "@chakra-ui/react";
import { useField } from "formik";
import React, { Fragment, useEffect, useState } from "react";
import axios from "axios";
import { AadhaarValidator } from "./inbuiltValidations";
import {
  illegalChecker,
  lengthChecker,
  rangeChecker,
  regexChecker,
} from "./checkers";

// interface validationConfig {
//   maxValue?: number;
//   minValue?: number;
//   maxLength?: number;
//   minLength?: number;
//   required?: boolean;
// }

interface ValidatorInputFieldProps {
  name: string;
  label: string;
  // validationConfig?: validationConfig;
  inbuiltType?: "Aadhaar" | "PAN";
  length?: number;
  allowAlpha?: boolean; //Allow a-zA-Z
  allowNum?: boolean; //Allow 0-9
  regex?: RegExp; //Regex to check input with
  illegalCharacters?: string;
  allowBeyondMaxLength?: boolean; //if false, no input accepted once max length reached
  allowIllegalInputs?: boolean; //if true, no other input except the allowed characters accepted
  asyncValidation?: {
    url: string; //url to hit for async validation
    options?: object;
  };
}

interface internalConfig {
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

const defaultValidator = async (text: string, config: internalConfig) => {
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

const ValidatorInputField: React.FC<ValidatorInputFieldProps & InputProps> = (
  props
) => {
  const [config, setConfig] = useState<internalConfig>({
    type: null,
    inbuiltType: null,
    required: null,
    illegals: "",
    length: {
      max: null,
      min: null,
      exact: null,
    },
    number: {
      max: null,
      min: null,
    },
    allow: {
      beyondLength: null,
      illegals: null,
    },
    customRegex: null,
    asyncVal: {
      url: null,
      params: {},
    },
  });

  const {
    name,
    label,
    inbuiltType,
    max,
    min,
    maxLength,
    minLength,
    type,
    allowAlpha,
    allowBeyondMaxLength,
    allowIllegalInputs,
    allowNum,
    ...rest
  } = props;

  useEffect(() => {
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
            if (
              props.allowAlpha === false &&
              !newConfig.illegals.includes("a-z")
            )
              newConfig.illegals = `${newConfig.illegals}a-zA-Z`;
            if (props.allowNum === false && !newConfig.illegals.includes("0-9"))
              newConfig.illegals = `${newConfig.illegals}0-9`;
            if (
              props.illegalCharacters &&
              !newConfig.illegals.includes(props.illegalCharacters)
            )
              newConfig.illegals = `${newConfig.illegals}${props.illegalCharacters}`;
            if (allowIllegalInputs === false) {
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
    console.log(1, newConfig);
    setConfig(newConfig);
  }, []);

  const validate = async (text: string) => {
    switch (config.inbuiltType) {
      case "Aadhaar":
        setConfig({
          ...config,
          length: {
            ...config.length,
            exact: 14,
          },
        });
        let error = await defaultValidator(text, config as internalConfig);
        if (error !== "") return error;
        return AadhaarValidator(text);

      default:
        return defaultValidator(text, config as internalConfig);
    }
  };

  const [field, meta, helpers] = useField({
    name: props.name,
    validate,
    // props.inbuiltType === undefined ? internalValidator : AadhaarValidator,
  });

  const keyPressHandler = (e: React.KeyboardEvent) => {
    // console.log(config.allow);

    if (config.allow.beyondLength === false) {
      if (
        field.value.length === config.length.max ||
        field.value.length === config.length.exact
      )
        console.log(config.length);

      e.preventDefault();
    }

    if (config.allow.illegals === false) {
      const pattern = new RegExp(`[${config.illegals}]`);
      // console.log(config.illegals);
      // console.log(pattern);

      if (e.key.match(pattern)) e.preventDefault();
    }
  };

  return (
    <Fragment>
      <FormControl isInvalid={!!(meta.error && meta.touched)}>
        <Input
          bgColor="#F9FCFF"
          _invalid={{
            borderBottomColor: "#800020",
          }}
          _focus={{
            outline: "none",
          }}
          placeholder={props.label}
          border="1px"
          borderColor="#D1E8FF"
          borderRadius={0}
          borderTopRadius="base"
          fontSize="1rem"
          fontWeight="bold"
          display="inline-block"
          width="100%"
          appearance="none"
          outline="none"
          px={3}
          pt={4}
          pb={2}
          {...field}
          onKeyPress={keyPressHandler}
          marginBottom="10px"
          {...rest}
        />
        {/* <FormLabel
          pointerEvents="none"
          htmlFor={props.name}
          pos="absolute"
          top={1}
          p={3}
          transformOrigin="0%"
          transitionDuration="300"
          fontSize="1rem"
          color="#696B6F"
        >
          {props.label}
        </FormLabel> */}
        <FormErrorMessage pl={3}>{meta.error}</FormErrorMessage>
      </FormControl>
    </Fragment>
  );
};

export default ValidatorInputField;
