import { Formik, Form, Field, ErrorMessage } from "formik";
import * as yup from "yup";
const schema = yup.object().shape({
  name: yup.string().required("Name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  message: yup.string().min(10, "Message must be at least 10 characters"),
});

export default function ContactForm(props: { closePopup: () => void }) {
  const onSubmit = async (
    values: { name: string; email: string; message: string },
    { resetForm }: { resetForm: () => void }
  ) => {
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (response.ok) {
        resetForm(); // Сброс формы
        props.closePopup(); // Закрываем попап
      } else {
        const errorData: { message: string } = await response.json();
        console.error("Error response:", errorData.message);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <Formik
      initialValues={{ name: "", email: "", message: "" }}
      validationSchema={schema}
      onSubmit={onSubmit}
    >
      {({ errors, touched }) => (
        <Form className="form">
          <>
            <Field
              name="name"
              type="text"
              className={`form__input ${touched.name && errors.name ? "error" : ""}`}
              placeholder="Your name"
            />
            <ErrorMessage name="name" component="p" className="form__error" />
          </>
          <>
            <Field
              name="email"
              type="email"
              className={`form__input ${touched.email && errors.email ? "error" : ""}`}
              placeholder="Your email"
            />
            <ErrorMessage name="email" component="p" className="form__error" />
          </>
          <>
            <Field
              name="message"
              as="textarea"
              className={`form__textarea ${touched.message && errors.message ? "error" : ""}`}
              placeholder="Please enter at least 10 characters"
              rows={4}
            />
            <ErrorMessage name="message" component="p" className="form__error" />
          </>
          <button type="submit" className="button form__button">
            Submit
          </button>
        </Form>
      )}
    </Formik>
  );
}
