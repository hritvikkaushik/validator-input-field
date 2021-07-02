import React, { ChangeEvent, ReactElement } from "react";
import { FormControlProps, InputProps } from "@chakra-ui/react";
import { Field, FieldProps, getIn } from "formik";
import { FormTextInput, MaskedInputProps } from "./FormTextInput";
import { AadhaarValidator } from "./inbuiltValidations";
import { lengthChecker, rangeChecker, regexChecker } from "./checkers";

export type ValidatorInputFieldProps<FormShape> = FormControlProps &
  InputProps & {
    helperText?: string;
    isNumberValidate?: boolean;
    isExternalError?: boolean;
    externalError?: string;
    name: keyof FormShape;
    onTextChange?: (text: string) => void;
    maskInput?: MaskedInputProps;
    prefixText?: string;
    changeValidate?: (e: ChangeEvent<HTMLInputElement>) => boolean;
    //-------------------------------------------------------------------//
    inbuiltType?: "Aadhaar" | "PAN";
    asyncVal?: (text: string) => Promise<string>;
    preventIllegalInputs?: boolean;
    illegalCharacters?: string;
    matchRegex?: RegExp;
    preventBeyondLength?: boolean;
    length?: number;
  };

export function ValidatorInputField<FormShape>(
  props: ValidatorInputFieldProps<FormShape>
): ReactElement {
  const { name, isExternalError, externalError, inbuiltType } = props;

  const defaultValidator = (text: string) => {
    // let syncChecksComplete = true;
    let k: keyof typeof props;
    for (k in props) {
      if (props[k]) {
        let error = check(text, k, props[k]);
        if (error) {
          // syncChecksComplete = false;
          return error;
        }
      }
    }
    if (props.asyncVal) return props.asyncVal(text);
    return "";
  };

  const check = (text: string, k: keyof typeof props, val: any) => {
    switch (k) {
      case "isRequired":
        return text.length === 0 ? "Required" : "";
      case "matchRegex":
        return regexChecker(text, val);
      case "maxLength":
        return lengthChecker(text, undefined, val);
      case "minLength":
        return lengthChecker(text, val, undefined);
      case "max":
        return rangeChecker(text, undefined, val);
      case "min":
        return rangeChecker(text, val, undefined);
    }
  };

  const validate = async (text: string) => {
    let error = "";
    switch (inbuiltType) {
      case "Aadhaar":
        error = AadhaarValidator(text);
        break;

      default:
        break;
    }
    return error || (await defaultValidator(text));
  };

  const pasteHandler = (e: React.ClipboardEvent<HTMLInputElement>) => {
    console.log(e);
    if (!props.preventIllegalInputs) return e;
    const text = e.clipboardData.getData("text");
    if (props.matchRegex && !text.match(props.matchRegex)) {
      console.log(1);
      e.preventDefault();
    }
    function CheckRestricted(src: string, restricted: string) {
      return src.split("").some((ch) => restricted.indexOf(ch) !== -1);
    }
    if (
      props.illegalCharacters &&
      CheckRestricted(text, props.illegalCharacters)
    ) {
      console.log(2);
      e.preventDefault();
    }
    return e;
  };

  const keyPressHandler = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (props.preventBeyondLength) {
      if (
        (e.target as HTMLInputElement).value.length === props.maxLength ||
        (e.target as HTMLInputElement).value.length === props.length
      )
        e.preventDefault();
    }

    if (props.preventIllegalInputs) {
      if (props.type === "number" && e.key.match(/[a-zA-Z]/)) {
        e.preventDefault();
        // console.log(12);
      }
      // if (props.validationConfig.allowNum === false && e.key.match(/[0-9]/))
      //   e.preventDefault();
      if (props.illegalCharacters?.includes(e.key)) e.preventDefault();
    }
  };

  return (
    <Field name={name} validate={validate}>
      {({ field, form }: FieldProps<string, FormShape>) => {
        return (
          <FormTextInput
            onPaste={pasteHandler}
            onKeyPress={keyPressHandler}
            {...field}
            {...props}
            touched={(getIn(form.touched, name) as boolean) || isExternalError}
            errors={
              (getIn(form.errors, name) as string) ||
              (isExternalError ? externalError : undefined)
            }
          />
        );
      }}
    </Field>
  );
}

export default ValidatorInputField;
