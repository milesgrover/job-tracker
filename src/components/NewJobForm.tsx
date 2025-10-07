"use client";

import {
  ElementType,
  HTMLAttributes,
  HTMLInputTypeAttribute,
  useEffect,
  useRef,
  useState,
} from "react";
import { FieldLabels, FieldNames, JobPostBody } from "@/types/jobs";
import { Loader } from "./Loader";
import useSWR from "swr";
import { useToday } from "@/hooks/useToday";

interface FieldProperties {
  name: FieldNames;
  label?: string;
  element?: "textarea" | "input";
  type?: HTMLInputTypeAttribute;
  required?: boolean;
}

const fields: FieldProperties[] = [
  { name: FieldNames.URL, label: FieldLabels.url, required: true },
  { name: FieldNames.REQUIREMENTS, element: "textarea", required: true },
  { name: FieldNames.TITLE, label: FieldLabels.title, required: true },
  { name: FieldNames.COMPANY, required: true },
  { name: FieldNames.LOCATION, required: true },
  { name: FieldNames.PAY_RATE, label: FieldLabels.pay_rate },
  { name: FieldNames.NOTES, element: "textarea" },
  {
    name: FieldNames.APPLIED_DATE,
    label: FieldLabels.applied_date,
    type: "date",
    required: true,
  },
];

export const NewJobForm = () => {
  const { mutate } = useSWR("/api/jobs");
  const today = useToday();
  const initialValues: JobPostBody = {
    [FieldNames.URL]: "",
    [FieldNames.REQUIREMENTS]: "",
    [FieldNames.TITLE]: "",
    [FieldNames.COMPANY]: "",
    [FieldNames.LOCATION]: "",
    [FieldNames.PAY_RATE]: "",
    [FieldNames.NOTES]: "",
    [FieldNames.APPLIED_DATE]: today,
  };
  const [formValues, setFormValues] = useState<JobPostBody>(initialValues);
  const [error, setError] = useState("");
  const [sendingJob, setSendingJob] = useState(false);

  const userSetDate = useRef(false);

  useEffect(() => {
    if (!userSetDate.current) {
      setFormValues((prev) => ({
        ...prev,
        applied_date: today,
      }));
    }
  }, [today]);

  const validateForm = () => {
    return fields.every(({ name, required }) => {
      return !!formValues[name] || !required;
    });
  };

  const handleFieldValueChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    if (name === FieldNames.APPLIED_DATE) {
      userSetDate.current = true;
    }
    setFormValues((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setSendingJob(true);
      const res = await fetch("/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formValues),
      });

      if (!res.ok) throw new Error("Failed to create job");

      await mutate();

      setError("");
      setFormValues(initialValues);
      setSendingJob(false);
      userSetDate.current = false;
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Unexpected error occurred");
      }
      setSendingJob(false);
    }
  };
  return (
    <div className="mt-4 mb-20">
      {error && <div className="text-red-500">{error}</div>}
      <form
        className="grid lg:grid-rows-4 gap-4 lg:grid-flow-col"
        onSubmit={handleFormSubmit}
      >
        {fields.map(({ name, label, element, type }) => {
          const InputElement: ElementType<HTMLAttributes<HTMLElement>> =
            element || "input";
          return (
            <div
              key={name}
              className={`flex flex-col gap-2 ${
                element === "textarea" ? "row-span-3" : ""
              }`}
            >
              <label className="uppercase" htmlFor={name}>
                {label ?? name}
              </label>
              <InputElement
                className={`bg-white text-black p-2 ${
                  element === "textarea" ? "h-54" : ""
                }`}
                id={name}
                name={name}
                type={type}
                value={formValues[name]}
                onChange={handleFieldValueChange}
              />
            </div>
          );
        })}
        <button
          className="bg-sky-500 p-4 lg:row-start-5 col-start-1 mt-4 disabled:bg-gray-400 disabled:text-gray-500"
          disabled={!validateForm() || sendingJob}
        >
          {sendingJob ? (
            <div className="max-w-15 m-auto text-white">
              <Loader />
            </div>
          ) : (
            "add new application"
          )}
        </button>
      </form>
    </div>
  );
};
