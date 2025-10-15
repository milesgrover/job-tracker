import { FieldNames, Jobject, JobPostBody, JobUpdateBody } from "@/types/jobs";
import { BasicLink } from "./BasicLink";
import { StatusTimeline } from "./StatusTimeline";
import { useState } from "react";
import { EditButtons } from "./EditButtons";
import useSWR from "swr";
import { Loader } from "./Loader";

interface ApplicationRowProps {
  job: Jobject;
  styleToggle: 0 | 1;
  setAddingStatusId: (id: number | null) => void;
}
export const ApplicationRow: React.FC<ApplicationRowProps> = ({
  job,
  styleToggle,
  setAddingStatusId,
}) => {
  const {
    applied_date,
    company,
    id,
    location,
    notes,
    pay_rate,
    requirements,
    title,
    url,
  } = job;
  const [editMode, setEditMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [updateValues, setUpdateValues] = useState<Partial<JobPostBody>>({
    applied_date,
    company,
    location,
    notes,
    pay_rate,
    requirements,
    title,
    url,
  });

  const { mutate } = useSWR("/api/jobs");

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setUpdateValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitUpdate = async () => {
    setIsLoading(true);
    const changedFields = (
      Object.keys(updateValues) as (keyof Partial<JobPostBody>)[]
    ).filter((key) => {
      return updateValues[key] !== job[key as keyof JobPostBody];
    });
    const changedValues: Partial<JobPostBody> = {};
    if (!changedFields.length) {
      setEditMode(false);
      setIsLoading(false);
      setUpdateValues({ ...job });
      return;
    }
    for (const field of changedFields) {
      changedValues[field] = updateValues[field];
    }
    const res = await fetch("/api/jobs", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, ...changedValues } as JobUpdateBody),
    });
    if (!res.ok) throw new Error("failed to update job");
    await mutate();
    setEditMode(false);
    setIsLoading(false);
  };

  const dateString = new Date(applied_date).toLocaleDateString();

  const cellStyle = ({ padding = true, relative = false } = {}) => {
    const styles = [];
    if (styleToggle) {
      styles.push("bg-zinc-800");
    } else {
      styles.push("bg-background");
    }
    if (padding) {
      styles.push("p-4");
    }
    if (relative) {
      styles.push("relative");
    }
    return styles.join(" ");
  };
  return (
    <div className="grid grid-cols-subgrid col-span-full relative">
      <div className={cellStyle()}>
        {isLoading && (
          <div className="absolute bg-black/60 inset-0 text-lime-600 z-2">
            <div className="absolute max-w-50 inset-0 m-auto grid items-center">
              <Loader />
            </div>
          </div>
        )}

        <div className="max-w-50 truncate">
          {editMode ? (
            <input
              name={FieldNames.URL}
              type="text"
              className="w-full bg-white text-black p-2"
              value={url}
              onChange={handleInputChange}
            />
          ) : (
            <BasicLink href={url} title={url}>
              Job post
            </BasicLink>
          )}
        </div>
      </div>
      <div className={cellStyle({ padding: false })}>
        {editMode ? (
          <textarea
            name={FieldNames.REQUIREMENTS}
            className="w-full bg-white text-black p-2 min-h-full"
            value={updateValues.requirements}
            onChange={handleInputChange}
          ></textarea>
        ) : (
          <div className="max-h-54 overflow-auto p-4 min-h-full font-longtext text-xs">
            {requirements}
          </div>
        )}
      </div>
      <div className={cellStyle()}>
        {editMode ? (
          <input
            name={FieldNames.APPLIED_DATE}
            type="date"
            className="w-full bg-white text-black p-2"
            value={updateValues?.applied_date?.split("T")[0]}
            onChange={handleInputChange}
          />
        ) : (
          dateString
        )}
      </div>
      <div className={cellStyle()}>
        <div className="flex flex-col h-full">
          <div className="flex-1">
            <StatusTimeline
              jobId={id}
              applied={dateString}
              editMode={editMode}
            />
          </div>
          {!editMode && (
            <button
              className="bg-sky-500 px-2 py-1 active:translate-y-1 mt-6"
              onClick={() => setAddingStatusId(id)}
            >
              add
            </button>
          )}
        </div>
      </div>
      <div className={cellStyle({ relative: true })}>
        {editMode ? (
          <>
            <input
              name={FieldNames.COMPANY}
              type="text"
              className="w-full bg-white text-black p-2 mb-2"
              value={updateValues.company}
              onChange={handleInputChange}
            />
            <input
              name={FieldNames.TITLE}
              type="text"
              className="w-full bg-white text-black p-2 mb-2"
              value={updateValues.title}
              onChange={handleInputChange}
            />
            <input
              name={FieldNames.LOCATION}
              type="text"
              className="w-full bg-white text-black p-2 mb-2"
              value={updateValues.location}
              onChange={handleInputChange}
            />
            <input
              name={FieldNames.PAY_RATE}
              type="text"
              className="w-full bg-white text-black p-2 mb-2"
              value={updateValues.pay_rate || ""}
              onChange={handleInputChange}
            />
            <textarea
              name={FieldNames.NOTES}
              className="w-full bg-white text-black p-2"
              value={updateValues.notes || ""}
              onChange={handleInputChange}
            />
          </>
        ) : (
          <>
            <h2 className="text-pink-500 text-lg">{company}</h2>
            <h3 className="text-sky-500 text-base">{title}</h3>

            <h4 className="mt-3 text-gray-400">location</h4>
            <div>{location}</div>
            <h4 className="mt-3 text-emerald-400">$$$</h4>
            <div>{pay_rate || "?"}</div>
            {notes && (
              <>
                <h4 className="mt-3 text-gray-400">notes</h4>
                <div>{notes}</div>
              </>
            )}
          </>
        )}
        <div className="absolute top-2 right-2">
          <EditButtons
            editMode={editMode}
            onClickEdit={() => setEditMode(true)}
            onClickCancel={() => setEditMode(false)}
            onClickConfirm={handleSubmitUpdate}
          />
        </div>
      </div>
    </div>
  );
};
