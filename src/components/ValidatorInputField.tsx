import { Input, InputProps } from "@chakra-ui/react";
import { useField } from "formik";
import React, { Fragment } from "react";
import axios from "axios";

interface ValidatorInputFieldProps {
  name: string;
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
      if (!res.data.args.validate) {
        console.log(res.data.args.validate);
        return "failed server validation";
      } else return "";
    });
};

const ValidatorInputField = (props: ValidatorInputFieldProps & InputProps) => {
  const validate = (value: string) => {
    if (!value) {
      return "required";
    }
    if (!checkCharacterSet(value)) {
      return "NaN";
    }
    return APIvalidation();
  };

  const [field, meta, helpers] = useField({
    name: props.name,
    validate: validate,
  });

  return (
    <Fragment>
      <Input
        bgColor="blackAlpha.300"
        isInvalid={meta.error ? true : false}
        {...field}
      />
      {meta.touched && meta.error && <div className="error">{meta.error}</div>}
    </Fragment>
  );
};

export default ValidatorInputField;
