import React from "react";
import { ErrorMessage, Field, useField, useFormikContext } from "formik";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface DateSelectorProps {
  id?: string;
  label?: string;
  name: string;
}

export const DateSelector: React.FC<DateSelectorProps> = (props) => {
  return (
    <div className="d-flex flex-column mb-3">
      <label htmlFor={props.name}>Birth Date</label>
      <Field name={props.name}>
        {({ form, field }: { form: any; field: any }) => {
          const { setFieldValue } = useFormikContext();
          const { value } = field;
          return (
            <DatePicker
              dateFormat={"dd/MM/yyyy"}
              id={props.name}
              selected={value}
              onChange={(val) => setFieldValue(props.name, val)}
            />
          );
        }}
      </Field>
      <ErrorMessage name={props.name}>
        {(msg) => <small style={{ color: "red" }}>{msg}</small>}
      </ErrorMessage>
    </div>
  );
};
