import { Button, ChakraProvider } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import React from "react";
import "./App.css";
import ValidatorInputField from "./components/ValidatorInputField";

function App() {
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
            <ValidatorInputField name="formfield" type="number" />
            <Button type="submit">Submit</Button>
          </Form>
        </Formik>
      </div>
    </ChakraProvider>
  );
}

export default App;
