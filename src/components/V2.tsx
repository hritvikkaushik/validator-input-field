import React, { ChangeEvent, ReactElement } from "react";
import { FormControlProps, InputProps } from "@chakra-ui/react";
import { Field, FieldProps, getIn } from "formik";
import { FormTextInput, MaskedInputProps } from "./FormTextInput";
import { AadhaarValidator } from "./inbuiltValidations";

export type FormFieldTextInputProps<FormShape> = FormControlProps &
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
  };

export function FormFieldTextInput<FormShape>(
  props: FormFieldTextInputProps<FormShape>
): ReactElement {
  const { name, isExternalError, externalError, inbuiltType } = props;

  const defaultValidator = (text: string) => {
    let syncChecksComplete = true;

    if (syncChecksComplete && props.asyncVal) return props.asyncVal(text);
  };

  const validate = (text: string) => {
    switch (inbuiltType) {
      case "Aadhaar":
        return AadhaarValidator(text);

      default:
        return defaultValidator(text);
    }
  };

  return (
    <Field name={name} validate={validate}>
      {({ field, form }: FieldProps<string, FormShape>) => {
        return (
          <FormTextInput
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
