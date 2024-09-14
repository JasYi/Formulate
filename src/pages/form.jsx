import "@shopify/polaris/build/esm/styles.css";
import { ConvexProvider, ConvexReactClient } from "convex/react";
import {
  Form,
  FormLayout,
  Checkbox,
  TextField,
  Button,
} from "@shopify/polaris";
import { useState, useCallback } from "react";
import { useQuery, useMutation } from "convex/react";
import { useSearchParams } from "react-router-dom";
import { api } from "../../convex/_generated/api";

// Sample JSON from backend
// const formData = {
//   formName: "W-4",
//   fields: [
//     {
//       Question: "Name",
//       Type: "text",
//       Answers: null,
//     },
//     {
//       Question: "State",
//       Type: "text",
//       Answer: null,
//     },
//     // {
//     //     Question: "State",
//     //     Type: "multiple_choice",
//     //     Answer: ["Alabama", "Alaska", "Arizona", "Arkansas", "California"],
//     //   },
//     {
//       Question: "Newsletter",
//       Type: "checkbox",
//       Answers: null,
//     },
//     {
//       Question: "Birthday",
//       Type: "date",
//       Answers: null,
//     },
//   ],
// };

function FormOnSubmitExample() {
  const [searchParams] = useSearchParams();
  const formID = searchParams.get("id");
  console.log("form ID:", formID);
  const formData = useQuery(api.form.getFormSchema, { formId: formID });
  const submitForm = useMutation(api.form.submitForm);

  const [formValues, setFormValues] = useState({});

  const handleChange = useCallback((question, value) => {
    setFormValues((prevValues) => ({
      ...prevValues,
      [question]: value,
    }));
  }, []);

  const handleSubmit = useCallback(() => {
    console.log(formValues); // Logs the form values upon submission
    submitForm({ answers: formValues, id: formID });
    setFormValues({}); // Clears form after submission
  }, [formValues]);

  // Function to dynamically render fields based on the "Type" in JSON
  const renderField = (field) => {
    switch (field.question_type) {
      case "text":
        return (
          <TextField
            key={field.question_text}
            label={field.question_text}
            value={formValues[field.question_text] || ""}
            onChange={(value) => handleChange(field.question_text, value)}
            autoComplete="off"
          />
        );
      case "multiple_choice":
        const choices = field.answer_choices;
        return (
          <ChoiceList
            key={field.question_text}
            title={field.question_text}
            choices={choices.map((choice) => ({
              label: choice,
              value: choice,
            }))}
            selected={formValues[field.question_text] || []}
            onChange={(value) => handleChange(field.question_text, value)}
          />
        );
      case "checkbox":
        return (
          <Checkbox
            key={field.question_text}
            label={field.question_text}
            checked={!!formValues[field.question_text]}
            onChange={(value) => handleChange(field.question_text, value)}
          />
        );
      case "date":
        return (
          <TextField
            key={field.question_text}
            label={field.question_text}
            value={formValues[field.question_text] || ""}
            onChange={(value) => handleChange(field.question_text, value)}
            type="date"
          />
        );
      default:
        return null;
    }
  };

  if (!formData) {
    return <div>Loading</div>;
  } else {
    return (
      <>
        {/* Dynamic heading with form name */}
        <h1 style={{ fontWeight: "bold" }}>
          {" "}
          Hi! Let's complete your {formData.name} form!{" "}
        </h1>
        <Form onSubmit={handleSubmit}>
          <FormLayout>
            {formData.schema.questions.map(
              (field) => renderField(field) // Conditionally render form fields based on the type
            )}
            <Button submit>Submit</Button>
          </FormLayout>
        </Form>
      </>
    );
  }
}

export default FormOnSubmitExample;
