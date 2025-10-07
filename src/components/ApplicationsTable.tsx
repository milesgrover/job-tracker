import { FieldLabels, FieldNames, Jobject } from "@/types/jobs";
import { ShowLoader } from "./ShowLoader";
import { ApplicationRow } from "./ApplicationRow";

interface ApplicationsTableProps {
  filteredJobs: Jobject[];
  setAddingStatusId: (id: number | null) => void;
}
const headings: (FieldNames | "status" | "details")[] = [
  FieldNames.URL,
  FieldNames.REQUIREMENTS,
  FieldNames.APPLIED_DATE,
  "status",
  "details",
];

let lastDate = "";
let toggle: 0 | 1 = 0;

export const ApplicationsTable: React.FC<ApplicationsTableProps> = ({
  filteredJobs,
  setAddingStatusId,
}) => {
  return (
    <ShowLoader message="loading jobs...">
      <table className="border-collapse border-3 border-white mt-4 mb-10 w-full text-sm h-full">
        <thead>
          <tr>
            {headings.map((f) => {
              return (
                <th
                  className="border-3 border-white p-4 text-xs uppercase"
                  key={f}
                >
                  {FieldLabels[f as FieldNames] ?? f}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {filteredJobs?.map((job) => {
            const dateString = new Date(job.applied_date).toLocaleDateString();
            if (dateString !== lastDate) {
              toggle = 1 - toggle;
              lastDate = dateString;
            }
            return (
              <ApplicationRow
                key={job.id}
                job={job}
                styleToggle={toggle}
                setAddingStatusId={setAddingStatusId}
              />
            );
          })}
        </tbody>
      </table>
    </ShowLoader>
  );
};
