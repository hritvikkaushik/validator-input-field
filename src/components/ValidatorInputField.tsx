import {
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Input,
  InputProps,
} from "@chakra-ui/react";
import { useField } from "formik";
import React, { Fragment, useEffect } from "react";
import axios from "axios";
import { AadhaarValidator } from "./inbuiltValidations";
import {
  illegalChecker,
  lengthChecker,
  rangeChecker,
  regexChecker,
} from "./checkers";

interface validationConfig {
  allowAlpha?: boolean; //Allow a-zA-Z
  allowNum?: boolean; //Allow 0-9
  regex?: RegExp; //Regex to check input with
  illegalCharacters?: string;
  maxValue?: number;
  minValue?: number;
  maxLength?: number;
  minLength?: number;
  length?: number;
  allowBeyondMaxLength?: boolean; //if false, no input accepted once max length reached
  allowIllegalInputs?: boolean; //if true, no other input except the allowed characters accepted
  asyncValidation?: {
    url: string; //url to hit for async validation
    options?: object;
  };
  inbuiltType?: "Aadhaar" | "PAN";
  required?: boolean;
}

interface ValidatorInputFieldProps {
  name: string;
  label: string;
  validationConfig?: validationConfig;
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

const validate = (text: string, config: validationConfig) => {
  switch (config?.inbuiltType) {
    case "Aadhaar":
      return AadhaarValidator(text);

    default:
      return defaultValidator(text, config as validationConfig);
  }
};

const check = (text: string, k: keyof validationConfig, val: any) => {
  switch (k) {
    case "required":
      return text.length === 0 ? "Required" : "";
    case "regex":
      return regexChecker(text, val);
    case "maxLength":
      return lengthChecker(text, undefined, val);
    case "minLength":
      return lengthChecker(text, val, undefined);
    case "maxValue":
      return rangeChecker(text, undefined, val);
    case "minValue":
      return rangeChecker(text, val, undefined);
  }
};

const defaultValidator = async (text: string, config: validationConfig) => {
  let syncChecksComplete = true;
  let k: keyof validationConfig;
  for (k in config) {
    if (config[k]) {
      let error = check(text, k, config[k]);
      if (error) {
        syncChecksComplete = false;
        return error;
      }
    }
  }

  if (syncChecksComplete && config.asyncValidation?.url)
    return APIvalidation(config.asyncValidation.url);
};

const ValidatorInputField = (props: ValidatorInputFieldProps & InputProps) => {
  const [field, meta, helpers] = useField({
    name: props.name,
    validate: (text) =>
      validate(text, props.validationConfig as validationConfig),
    // props.inbuiltType === undefined ? internalValidator : AadhaarValidator,
  });

  const keyPressHandler = (e: React.KeyboardEvent) => {
    if (props.validationConfig?.allowBeyondMaxLength === false) {
      if (
        field.value.length === props.validationConfig.length ||
        field.value.length === props.validationConfig.maxLength
      )
        e.preventDefault();
    }

    if (props.validationConfig?.allowIllegalInputs === false) {
      if (
        props.validationConfig.allowAlpha === false &&
        e.key.match(/[a-zA-Z]/)
      ) {
        e.preventDefault();
        console.log(12);
      }
      if (props.validationConfig.allowNum === false && e.key.match(/[0-9]/))
        e.preventDefault();
      if (props.validationConfig.illegalCharacters?.includes(e.key))
        e.preventDefault();
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
