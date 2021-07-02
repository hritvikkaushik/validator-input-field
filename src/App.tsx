import { Button, ChakraProvider } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import React from "react";
import "./App.css";
import ValidatorInputField from "./components/V2";

function App() {
  const validation = new Promise<string>((resolve, reject) => {
    setTimeout(() => {
      resolve("Failed server validation");
      // resolve("");
    }, 400);
  });

  const asyncValidator = async (text: string) => {
    console.log(5, text);
    return validation;
  };

  return (
    <ChakraProvider>
      <div className="App" style={{ width: "400px" }}>
        <Formik
          initialValues={{ formfield: "" }}
          onSubmit={(values, { setSubmitting }) => {
            setTimeout(() => {
              alert(JSON.stringify(values, null, 2));

              setSubmitting(false);
            }, 400);
          }}
        >
          <Form>
            <ValidatorInputField
              name="formfield"
              // label="Enter text"
              // preventIllegalInputs={true}
              // illegalCharacters="1"
              // matchRegex={/a/}
              // maxLength={10}
              // minLength={5}
              asyncVal={asyncValidator}
              // type="number"
              inbuiltType="Aadhaar"

              // validationConfig={{
              //   // regex: /freecharge/,
              //   required: true,
              //   allowAlpha: true,
              //   allowNum: false,
              //   illegalCharacters: "!@#$%^&*()",
              //   maxLength: 10,
              //   minLength: 6,
              //   allowBeyondMaxLength: false,
              //   allowIllegalInputs: false,
              //   asyncValidation: {
              //     url: "https://771bc051-2dd5-4eea-8a4c-4600410edd25.mock.pstmn.io/get",
              //   },
              // }}
            />
            <Button type="submit">Submit</Button>
          </Form>
        </Formik>
      </div>
    </ChakraProvider>
  );
}

export default App;
