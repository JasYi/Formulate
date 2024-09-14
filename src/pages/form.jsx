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

// Sample JSON from backend
// const formData = {
//   name: "get_form_fields",
//   arguments: `{
//     "title": "Notice of Eligibility & Rights and Responsibilities under the Family and Medical Leave Act",
//     "questions": [
//       { "question_text": "Date", "question_type": "date" },
//       { "question_text": "From (Employer)", "question_type": "text" },
//       { "question_text": "To (Employee)", "question_type": "text" },
//       {
//         "question_text": "On (mm/dd/yyyy), we learned that you need leave (beginning on) (mm/dd/yyyy) for one of the following reasons: (Select as appropriate)",
//         "question_type": "multiple_choice",
//         "answer_choices": [
//           "The birth of a child, or placement of a child with you for adoption or foster care, and to bond with the newborn or newly-placed child",
//           "Your own serious health condition",
//           "You are needed to care for your family member due to a serious health condition. Your family member is your: Spouse, Parent, Child under age 18, Child 18 years or older and incapable of self-care because of a mental or physical disability",
//           "A qualifying exigency arising out of the fact that your family member is on covered active duty or has been notified of an impending call or order to covered active duty status. Your family member on covered active duty is your: Spouse, Parent, Child of any age",
//           "You are needed to care for your family member who is a covered servicemember with a serious injury or illness. You are the servicemember’s: Spouse, Parent, Child, Next of kin"
//         ]
//       }
//     ]
//   }`,
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
    return <div>Loading...</div>;
  } else {
    return (
      <>
        <div className="overflow-auto">
          {/* Dynamic heading with form title */}
          <h1 style={{ fontWeight: "bold" }}>
            {" "}
            Hi! Let's complete your {formData.schema.title} form!{" "}
          </h1>
          <Form onSubmit={handleSubmit}>
            <FormLayout>
              {formData.schema.questions.map(
                (field) => renderField(field) // Conditionally render form fields based on the type
              )}
              <Button submit>Submit</Button>
            </FormLayout>
          </Form>
        </div>
      </>
    );
  }
}

export default FormOnSubmitExample;
