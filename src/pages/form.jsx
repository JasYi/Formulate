import "./form.css";
import "@shopify/polaris/build/esm/styles.css";
import {
  Form,
  FormLayout,
  Checkbox,
  TextField,
  Button,
  ChoiceList,
} from "@shopify/polaris";
import { useState, useCallback } from "react";
import { useQuery, useMutation } from "convex/react";
import { useSearchParams } from "react-router-dom";
import { api } from "../../convex/_generated/api";

function FormOnSubmitExample() {
  const [searchParams] = useSearchParams();
  const formID = searchParams.get("id");
  console.log("form ID:", formID);
  const formData = useQuery(api.form.getFormSchema, { formId: formID });
  const submitForm = useMutation(api.form.submitForm);

  const [formValues, setFormValues] = useState({});

  const [selected, setSelected] = useState(["hidden"]);

  const handleMultiChange = useCallback((value) => setSelected(value), []);

  const handleChange = useCallback((question, value) => {
    setFormValues((prevValues) => ({
      ...prevValues,
      [question]: value,
    }));
  }, []);

  const handleSubmit = useCallback(() => {
    console.log(formValues); // Logs the form values upon submission
    const finalFormValues = Object.entries(formValues).map(([key, value]) => ({
      question: key,
      answer: value,
    }));
    submitForm({ answers: finalFormValues, id: formID });
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
        return (
          <ChoiceList
            key={field.question_text}
            title={field.question_text}
            choices={field.answer_choices.map((choice) => ({
              label: choice,
              value: choice,
            }))}
            selected={formValues[field.question_text] || []}
            onChange={(value) => handleChange(field.question_text, value)}
          />
        );
      case "checkbox":
        if (field.answer_choices === undefined) {
          return (
            <Checkbox
              key={field.question_text}
              label={field.question_text}
              checked={!!formValues[field.question_text]}
              onChange={(value) =>
                handleChange(field.question_text, String(value))
              }
            />
          );
        } else {
          return (
            <ChoiceList
              allowMultiple
              title={field.question_text}
              choices={field.answer_choices.map((choice) => ({
                label: choice,
                value: choice,
              }))}
              selected={formValues[field.question_text] || []}
              onChange={(value) => handleChange(field.question_text, value)}
            />
          );
        }
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
    return <div>Loading...</div>;
  } else {
    return (
      <>
        <div className="form-container">
          {/* Dynamic heading with form title */}
          <h1 className="main-desc">
            {" "}
            Hi! Let's complete your {formData.schema.title} form!{" "}
          </h1>
          <Form onSubmit={handleSubmit}>
            <FormLayout>
              {formData.schema.questions.map(
                (field) => renderField(field) // Conditionally render form fields based on the type
              )}
              
              <Button submit onClick={() => alert("Form Submitted Successfully.")}>Submit</Button>
            </FormLayout>
          </Form>
        </div>
      </>
    );
  }
}

export default FormOnSubmitExample;
