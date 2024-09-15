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
import { useNavigate } from "react-router-dom";

function FormOnSubmitExample() {
  const [searchParams] = useSearchParams();
  const formID = searchParams.get("id");
  console.log("form ID:", formID);
  const formData = useQuery(api.form.getFormSchema, { formId: formID });
  const submitForm = useMutation(api.form.submitForm);

  const [formValues, setFormValues] = useState({});

  const [selected, setSelected] = useState(["hidden"]);

  const navigate = useNavigate();

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
    navigate("/submission");
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
      <a href="/" className="block">
      <div className="logo-form flex items-center space-x-2">
        <svg width="50" height="29" viewBox="0 0 50 29" fill="none" xmlns="http://www.w3.org/2000/svg">

            <path
              d="M35.4877 28.8058H26.3686C26.3686 25.8029 28.794 23.3707 31.7886 23.3707H35.5013C40.4064 23.3707 44.4985 19.4575 44.5798 14.5388C44.6611 9.52493 40.6097 5.43505 35.6368 5.43505C33.4688 5.43505 31.3821 6.22313 29.7561 7.64983L17.8862 18.3569C15.664 20.3679 12.2359 20.1776 10.2305 17.9493L25.9756 3.75018C26.0298 3.69583 26.0976 3.64148 26.1518 3.58713L26.7209 3.11157C29.2547 1.1006 32.3983 0 35.6368 0C43.5907 0 50.0405 6.50847 49.9998 14.4844C49.9592 22.4332 43.401 28.8058 35.4877 28.8058Z"
              fill="#191919"
            />
            <path
              d="M14.3632 28.8058C6.40936 28.8058 -0.040459 22.2973 0.000191099 14.3214C0.0408412 6.3726 6.59906 0 14.5258 0H23.645C23.645 3.00287 21.2196 5.43505 18.225 5.43505H14.4987C9.59362 5.43505 5.50151 9.34829 5.42021 14.267C5.33891 19.2808 9.39037 23.3707 14.3632 23.3707C16.5312 23.3707 18.6179 22.5826 20.2439 21.1559L32.1138 10.4489C34.336 8.43792 37.7641 8.62814 39.7696 10.8565L23.3198 25.6942H23.2792C20.7453 27.7052 17.6152 28.8058 14.3632 28.8058Z"
              fill="#191919"
            />
          </svg>
          <h1 className="header-title text-2x1 font-bold">Formulate</h1>
        </div>
        </a>
        <div className="form-container">
        
          {/* Dynamic heading with form title */}
          <h1 className="main-desc">
            {" "}
            Hi! Let's complete your {formData.schema.title} form.{" "}
          </h1>
          <Form onSubmit={handleSubmit}>
            <FormLayout>
              {formData.schema.questions.map(
                (field) => renderField(field) // Conditionally render form fields based on the type
              )}

              <Button size="large"submit>Submit</Button>
            </FormLayout>
          </Form>
        </div>
      </>
    );
  }
}

export default FormOnSubmitExample;
