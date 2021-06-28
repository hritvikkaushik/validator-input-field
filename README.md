# validator-input-field

A React form input component based on Chakra-UI and Formik that performs various types of validations as required, and has various inbuilt validations as required by the organization.
  
## Requirements
- Should be extensible
- Should allow for custom validations to be added
- Should handle async validation from a server
- Should have inbuilt types for validations such as
  - Aadhar
  - PAN
  - Mobile Number
  - PIN Code
  - Names
  - ...

## Current Progress
So far I've been able to
- take a character-set as a prop and validate according to that
- prevent user from typing illegal characters
- prevent user from typing beyond the maximum length
- take an inbuilt type as a prop (e.g., 'aadhaar')
  - if inbuilt type is specified, then the appropriator validator for that type is called using switch-case
  - otherwise custom validations are performed, as specified by the props.
- perform async validation from a server
  
Besides, Formik functionality such as schema-based validation is working.

## API at present
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
      validationConfig?: validationConfig;
    }

## TODO
- Make a cleaner API to reduce/optimize code.
- Add more inbuilt types. Currently, only 'Aadhaar' is there.
- Change from Chakra Input component to a Chakra FormControl, and implement additional Chakra Components like FormErrorMessage, FormLabel, FormHelperText, etc.
- Finalize the async validation API to send query and parameters with the HTTP request (currently we have only been sending a GET request to a mock API that returns true or false without sending any query, for development purposes.)
- ???
