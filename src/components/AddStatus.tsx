import { useToday } from "@/hooks/useToday";
import { EventParamNames, EventType } from "@/types/events";
import { Jobject } from "@/types/jobs";
import { getTodayLocalizedISO } from "@/util";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import useSWR, { mutate } from "swr";

interface AddStatusProps {
  id: number | null;
  setAddingStatusId: (id: number | null) => void;
}

interface EventParams {
  [EventParamNames.EVENT_TYPE]: EventType | "";
  [EventParamNames.EVENT_DATE]: string;
  [EventParamNames.DETAILS]: string;
}

export const AddStatus: React.FC<AddStatusProps> = ({
  id,
  setAddingStatusId,
}) => {
  const today = useToday();
  const initialValues: EventParams = {
    [EventParamNames.EVENT_TYPE]: "",
    [EventParamNames.EVENT_DATE]: today,
    [EventParamNames.DETAILS]: "",
  };
  const [formValues, setFormValues] = useState(initialValues);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const userSetDate = useRef(false);
  const { data: jobs } = useSWR("/api/jobs");
  const currentJob = jobs?.find((j: Jobject) => j.id === id);

  useLayoutEffect(() => {
    // open and close the dialog based on the id
    if (id !== null) {
      if (dialogRef.current) {
        dialogRef.current.showModal();
      }
    } else {
      dialogRef?.current?.close();
    }
    // after we close the dialog, reset the id to null
    const handleDialogClose = () => {
      setAddingStatusId(null);
    };
    dialogRef?.current?.addEventListener("close", handleDialogClose);
    return () =>
      dialogRef?.current?.removeEventListener("close", handleDialogClose);
  }, [id]);

  useEffect(() => {
    if (!userSetDate.current) {
      setFormValues((prev) => ({
        ...prev,
        event_date: today,
      }));
    }
  }, [today]);

  useEffect(() => {
    if (formValues.event_date === today) {
      userSetDate.current = false;
    }
  }, [formValues.event_date]);

  const addEvent = async () => {
    const response = await fetch("/api/events", {
      method: "POST",
      body: JSON.stringify({ job_id: id, ...formValues }),
    });
    if (!response.ok) throw new Error("failed to add event");
    await mutate(`/api/events?job_id=${id}`);
  };

  const validateForm = () => {
    return formValues.event_type && formValues.event_date;
  };

  const closeDialog = () => {
    dialogRef?.current?.close();
    setAddingStatusId(null);
    setFormValues(initialValues);
    userSetDate.current = false;
  };

  const handleFieldValueChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (name === EventParamNames.EVENT_DATE) {
      userSetDate.current = true;
    }
    setFormValues((prev) => {
      return { ...prev, [name]: value };
    });
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addEvent();
    closeDialog();
  };

  const handleCancelClick = () => {
    closeDialog();
  };

  return (
    <dialog
      ref={dialogRef}
      className="p-4 m-auto backdrop:bg-black/69"
      //@ts-ignore
      closedby="any"
    >
      {currentJob && (
        <div className="max-w-4xl">
          <h1 className="font-display text-5xl text-pink-500">Update Status</h1>
          <h2>
            <span className="text-sky-500">{currentJob.title}</span>{" "}
            <span className="text-gray-400">at</span> {currentJob.company}
          </h2>
          <form
            className="grid grid-cols-2 gap-4 mt-4"
            onSubmit={handleFormSubmit}
          >
            <select
              name={EventParamNames.EVENT_TYPE}
              id={EventParamNames.EVENT_TYPE}
              className="bg-black p-2 text-white scheme-dark border-none"
              value={formValues.event_type}
              onChange={handleFieldValueChange}
            >
              <option value="">select</option>
              {Object.values(EventType).map((status) => {
                return (
                  <option key={status} value={status}>
                    {status}
                  </option>
                );
              })}
            </select>
            <input
              name={EventParamNames.EVENT_DATE}
              id={EventParamNames.EVENT_DATE}
              className="bg-black p-2 text-white scheme-dark border-none"
              type="date"
              value={formValues.event_date}
              onChange={handleFieldValueChange}
            />
            <input
              name={EventParamNames.DETAILS}
              id={EventParamNames.DETAILS}
              className="bg-black p-2 text-white scheme-dark border-none"
              placeholder="details"
              value={formValues.details}
              onChange={handleFieldValueChange}
            />
            <div className="flex gap-2">
              <button
                className="active:translate-y-1 bg-sky-500 text-white p-2 disabled:bg-gray-400 disabled:text-gray-500 flex-1"
                disabled={!validateForm()}
              >
                add
              </button>
              <button
                className="active:translate-y-1 bg-sky-500 text-white p-2 disabled:bg-gray-400 disabled:text-gray-500 flex-1"
                onClick={handleCancelClick}
              >
                cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </dialog>
  );
};
