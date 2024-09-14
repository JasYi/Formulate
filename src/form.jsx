import "./App.css";
import '@shopify/polaris/build/esm/styles.css';
import { ConvexProvider, ConvexReactClient } from "convex/react";
import {Form, FormLayout, Checkbox, TextField, Button} from '@shopify/polaris';
import {useState, useCallback} from 'react';

// Sample JSON from backend
const formData = {
    formName: "W-4",
    fields: [
      {
        Question: "Name",
        Type: "text",
        Answers: null,
      },
      {
        Question: "State",
        Type: "text",
        Answer: null,
      },
      {
        Question: "Newsletter",
        Type: "checkbox",
        Answers: null,
      },
      {
        Question: "Birthday",
        Type: "date",
        Answers: null,
      },
    ],
  };
  
  function FormOnSubmitExample() {
    const [formValues, setFormValues] = useState({});
  
    const handleChange = useCallback((question, value) => {
      setFormValues((prevValues) => ({
        ...prevValues,
        [question]: value,
      }));
    }, []);
  
    const handleSubmit = useCallback(() => {
      console.log(formValues); // Logs the form values upon submission
      setFormValues({}); // Clears form after submission
    }, [formValues]);
  
    // Function to dynamically render fields based on the "Type" in JSON
    const renderField = (field) => {
      switch (field.Type) {
        case "text":
          return (
            <TextField
              key={field.Question}
              label={field.Question}
              value={formValues[field.Question] || ""}
              onChange={(value) => handleChange(field.Question, value)}
              autoComplete="off"
            />
          );
        case "multiple_choice":
          const choices = field.Answer.split(", ");
          return (
            <ChoiceList
              key={field.Question}
              title={field.Question}
              choices={choices.map((choice) => ({
                label: choice,
                value: choice,
              }))}
              selected={formValues[field.Question] || []}
              onChange={(value) => handleChange(field.Question, value)}
            />
          );
        case "checkbox":
          return (
            <Checkbox
              key={field.Question}
              label={field.Question}
              checked={!!formValues[field.Question]}
              onChange={(value) => handleChange(field.Question, value)}
            />
          );
        case "date":
          return (
            <TextField
              key={field.Question}
              label={field.Question}
              value={formValues[field.Question] || ""}
              onChange={(value) => handleChange(field.Question, value)}
              type="date"
            />
          );
        default:
          return null;
      }
    };
  
    return (
      <>
        {/* Dynamic heading with form name */}
        <h1 style={{ fontWeight: 'bold' }}> Hi! Let's complete your {formData.formName} form! </h1>
        <Form onSubmit={handleSubmit}>
          <FormLayout>
            {formData.fields.map((field) =>
              renderField(field) // Conditionally render form fields based on the type
            )}
            <Button submit>Submit</Button>
          </FormLayout>
        </Form>
      </>
    );
  }
  
  export default FormOnSubmitExample;
  
