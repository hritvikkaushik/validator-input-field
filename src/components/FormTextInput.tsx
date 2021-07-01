import React, {
  ChangeEvent,
  ElementType,
  KeyboardEvent,
  ReactElement,
  useEffect,
  useRef,
} from "react";
import {
  FormControl,
  FormControlProps,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Input,
  InputProps,
  Text,
} from "@chakra-ui/react";
import { Field, FieldProps, getIn } from "formik";

const invalidNumber = (e: KeyboardEvent<HTMLInputElement>) => {
  const invalidNums = ["-", "+", "e", ".", "ArrowUp", "ArrowDown"];
  if (invalidNums.includes(e.key)) {
    e.preventDefault();
  }
};

export type MaskedInputProps = {
  mask: string;
  maskChar: string;
  as: ElementType;
};

type TextInputExtraProps = {
  helperText?: string;
  name: string;
  errors?: string;
  touched?: boolean;
  isNumberValidate?: boolean;
  onTextChange?: (text: string) => void;
  maskInput?: MaskedInputProps;
  prefixText?: string; // TODO: WORKES ONLY WITH SINGLE LETTER
  changeValidate?: (e: ChangeEvent<HTMLInputElement>) => boolean;
};

export function FormTextInput(
  props: FormControlProps & InputProps & TextInputExtraProps
): ReactElement {
  const {
    label,
    name,
    helperText,
    errors,
    touched,
    isNumberValidate,
    onChange,
    onTextChange,
    maskInput,
    prefixText,
    ...rest
  } = props;

  // to prevent https://github.com/facebook/react/issues/14856 issue
  // code sample https://github.com/facebook/react/issues/14856#issuecomment-762970883
  const wheelTimeout = useRef<any>();
  const onWheelPrevent = () => {
    clearTimeout(wheelTimeout.current);
    wheelTimeout.current = setTimeout(() => {
      wheelTimeout.current = false;
    }, 300);
  };
  useEffect(() => {
    const cancelWheel = (e: WheelEvent) =>
      wheelTimeout.current && e.preventDefault();
    document.body.addEventListener("wheel", cancelWheel, { passive: false });
    return () => document.body.removeEventListener("wheel", cancelWheel);
  }, []);
  const validateInput = {
    onKeyDown: isNumberValidate ? invalidNumber : rest.onKeyDown || undefined,
    onWheel:
      isNumberValidate || rest.type === "number"
        ? onWheelPrevent
        : rest.onWheel || undefined,
  };

  return (
    <FormControl pos="relative" isInvalid={!!(errors && touched)}>
      <Input
        className={prefixText ? "input-prefix-text" : ""}
        bg="#F9FCFF"
        h="auto"
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
        _focus={{
          outline: "none",
        }}
        _invalid={{
          borderBottomColor: "brand.600",
        }}
        placeholder=" "
        id={name}
        {...rest}
        {...validateInput}
        {...maskInput}
        onChange={(e) => {
          if (rest.changeValidate) {
            if (!rest.changeValidate(e)) {
              e.preventDefault();
              return;
            }
          }
          if (rest.type === "number" && rest.maxLength) {
            if (e.target.value.length > rest.maxLength) {
              e.target.value = e.target.value.slice(0, rest.maxLength);
              e.preventDefault();
              return;
            }
          }
          if (onTextChange) onTextChange(e.target.value);
          if (onChange) onChange(e);
        }}
      />
      <FormLabel
        pointerEvents="none"
        htmlFor={name}
        pos="absolute"
        top={1}
        p={3}
        transformOrigin="0%"
        transitionDuration="300"
        fontSize="1rem"
        color="#696B6F"
      >
        {label}
      </FormLabel>
      <FormErrorMessage pl={3} textStyle="errorText1">
        {errors}
      </FormErrorMessage>
      <FormHelperText pl={3} textStyle="helperText1">
        {helperText}
      </FormHelperText>
      {prefixText ? (
        <Text fontSize="1rem" fontWeight="bold" className="prefix-text">
          {prefixText}
        </Text>
      ) : null}
    </FormControl>
  );
}

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
  };

export function FormFieldTextInput<FormShape>(
  props: FormFieldTextInputProps<FormShape>
): ReactElement {
  const { name, isExternalError, externalError } = props;
  return (
    <Field name={name}>
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
