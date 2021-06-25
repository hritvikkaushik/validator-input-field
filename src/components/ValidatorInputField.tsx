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
import { AadhaarValidator } from "./inbuiltValidations";
import {
  internalConfig,
  getConfigFromProps,
  defaultValidator,
} from "./helpers";

export interface ValidatorInputFieldProps {
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
    const newConfig = getConfigFromProps(props, config);
    setConfig(newConfig);
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const [field, meta] = useField({
    name: props.name,
    validate,
  });

  const keyPressHandler = (e: React.KeyboardEvent) => {
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
