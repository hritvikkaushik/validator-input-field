import { Input, InputProps } from "@chakra-ui/react";
import { useField } from "formik";
import React, { Fragment, useEffect } from "react";
import axios from "axios";
import { AadhaarValidator } from "./inbuiltValidations";

interface ValidatorInputFieldProps {
  name: string;
  validationURL?: string;
  inbuiltType?: "Aadhaar";
}

const checkCharacterSet = (text: string) => {
  const chars = new RegExp(/[0-9]+/g);
  if (!chars.test(text)) return false;
  return true;
};

const APIvalidation = async () => {
  return axios
    .get("https://771bc051-2dd5-4eea-8a4c-4600410edd25.mock.pstmn.io/get") //mock api that returns data.args.validate: true
    .then((res) => {
      console.log(res.data.args.validate);
      if (!res.data.args.validate) {
        return "failed server validation";
      } else return "";
    });
};

const ValidatorInputField = (props: ValidatorInputFieldProps & InputProps) => {
  const validate = (text: string) => {
    let error: any;
    switch (props.inbuiltType) {
      case "Aadhaar":
        error = AadhaarValidator(text);
        break;
      default:
        error = internalValidator(text);
    }
    return error;
  };

  const internalValidator = async (value: string) => {
    console.log(1);

    let syncChecksComplete = true;
    if (!value) {
      syncChecksComplete = false;
      return "required";
    }
    if (!checkCharacterSet(value)) {
      syncChecksComplete = false;
      return "NaN";
    }
    if (syncChecksComplete) return APIvalidation();
  };

  const keyPressHandler = (e: React.KeyboardEvent) => {
    console.log(e.key);
    if (/[0-9\s]/.test(e.key)) return e;
    e.preventDefault();
  };

  const [field, meta, helpers] = useField({
    name: props.name,
    validate,
    // props.inbuiltType === undefined ? internalValidator : AadhaarValidator,
  });

  return (
    <Fragment>
      <Input
        bgColor="gray.300"
        isInvalid={meta.error ? true : false}
        {...field}
        onKeyPress={keyPressHandler}
        marginBottom="10px"
      />
      {meta.touched && meta.error && <div className="error">{meta.error}</div>}
    </Fragment>
  );
};

export default ValidatorInputField;
