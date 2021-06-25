import { Button, ChakraProvider } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import React from "react";
import "./App.css";
import ValidatorInputField from "./components/ValidatorInputField";
// import * as Yup from "yup";

function App() {
  // const schema = Yup.object().shape({
  //   formfield: Yup.string()
  //     .min(2, "Too short")
  //     .max(10, "Too long")
  //     .required("Required"),
  // });

  return (
    <ChakraProvider>
      <div className="App" style={{ width: "400px" }}>
        <Formik
          initialValues={{ generalField: "", aadhaarField: "" }}
          onSubmit={(values, { setSubmitting }) => {
            setTimeout(() => {
              alert(JSON.stringify(values, null, 2));

              setSubmitting(false);
            }, 400);
          }}
          // validationSchema={schema}
        >
          <Form>
            <ValidatorInputField
              name="aadhaarField"
              label="Enter text"
              // regex: /freecharge/,
              isRequired
              inbuiltType="Aadhaar"
              allowAlpha={false}
              allowIllegalInputs={false}
            />
            <ValidatorInputField
              name="generalField"
              label="Enter text"
              // regex: /freecharge/,
              isRequired
              allowAlpha={false}
              allowNum={true}
              illegalCharacters="!@#$%^&*()"
              allowBeyondMaxLength={true}
              allowIllegalInputs={false}
              asyncValidation={{
                url: "https://771bc051-2dd5-4eea-8a4c-4600410edd25.mock.pstmn.io/get",
              }}
              type="number"
              maxLength={10}
              minLength={8}
            />
            <Button type="submit">Submit</Button>
          </Form>
        </Formik>
      </div>
    </ChakraProvider>
  );
}

export default App;
