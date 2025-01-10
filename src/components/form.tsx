import { Formik, Form, Field, ErrorMessage } from "formik";
import { MouseEventHandler } from "react";
// import ReCAPTCHA from "react-google-recaptcha";
import * as yup from "yup";
// import { useRef } from "react";
const schema = yup.object().shape({
    name: yup.string().required("Name is required"),
    email: yup.string().email("Invalid email").required("Email is required"),
    message: yup.string().min(10, "Message must be at least 10 characters"),
  });


  export default function ContactForm(props: { closePopup: MouseEventHandler<HTMLButtonElement> | undefined; }) {
    // const recaptchaRef = useRef<ReCAPTCHA>(null);
    const onSubmit = (values: unknown) => {
      console.log(values);
    };
  
    return (
        <Formik
        initialValues={{ name: "", email: "", message: "" }}
        validationSchema={schema}
        onSubmit={onSubmit}
      >
        {({ errors, touched, isSubmitting }) => (
        <>
          {Object.keys(errors).length > 0 && !isSubmitting && (
            <div className="form__error-summary">
              Please correct the highlighted fields below.
            </div>
          )}
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
            <button type="submit" className="button form__button" onClick={props.closePopup}>
              SUBMIT REQUEST
            </button>
          </Form>
        </>
      )}
      </Formik>
    );
  }
