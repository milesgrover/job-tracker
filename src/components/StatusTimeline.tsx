import useSWR from "swr";
import { Event, EventBody, EventParamNames, EventType } from "@/types/events";
import { underscoresToSpaces } from "@/util";
import { useState } from "react";
import { EditButtons } from "./EditButtons";

interface StatusTimelineProps {
  jobId: number;
  applied: string;
  editMode: boolean;
}

const eventColor: Partial<Record<EventType, string>> = {
  [EventType.Rejected]: "text-red-500",
  [EventType.Offer]: "text-green-500",
  [EventType.Interviewed]: "text-green-500",
  [EventType.Interview_scheduled]: "text-green-500",
  [EventType.Awaiting_response]: "text-yellow-200",
};

export const StatusTimeline: React.FC<StatusTimelineProps> = ({
  jobId,
  applied,
  editMode,
}) => {
  const [editingEventId, setEditingEventId] = useState<number | null>(null);
  const [updateValues, setUpdateValues] = useState<Partial<EventBody>>();
  const {
    data: events,
    isLoading,
    mutate,
  } = useSWR<Event[]>(`/api/events?job_id=${jobId}`);
  if (isLoading) return <div className="text-gray-500">loading timeline…</div>;
  if (!events?.length) return <div>applied</div>;

  const appliedEvent: Event = {
    id: -1,
    job_id: jobId,
    event_date: applied,
    event_type: EventType.Applied,
    updatedAt: "",
    createdAt: "",
  };

  const handleEventValueChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setUpdateValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleEventSubmitUpdate = async (eventId: number) => {
    if (!updateValues) return;
    const findEvent = events.find((e) => e.id === eventId);
    if (!findEvent) return;
    const newValues: EventBody = {
      id: eventId,
      job_id: jobId,
      event_date: updateValues.event_date ?? findEvent.event_date,
      event_type: updateValues.event_type ?? findEvent.event_type,
      details: updateValues.details ?? findEvent.details,
    };
    const res = await fetch("/api/events", {
      method: "PUT",
      body: JSON.stringify(newValues),
    });
    console.log(res);
    if (!res.ok) throw new Error("failed to update event");
    await mutate();
    setEditingEventId(null);
    setUpdateValues(undefined);
  };

  const renderEvent = (event: Event) => {
    return (
      <div key={event.id} className="text-xs relative">
        <span className="text-gray-400">
          {new Date(event.event_date).toLocaleDateString()}:
        </span>{" "}
        <span className={eventColor[event.event_type] || ""}>
          {underscoresToSpaces(event.event_type)}
        </span>
        {event.details && <span> – {event.details}</span>}
        {editMode && event.id !== -1 && (
          <div className="absolute top-0 right-0">
            <EditButtons
              editMode={editingEventId === event.id}
              onClickEdit={() => setEditingEventId(event.id)}
              onClickCancel={() => setEditingEventId(null)}
              onClickConfirm={() => handleEventSubmitUpdate(event.id)}
              disabled={editingEventId !== null && editingEventId !== event.id}
            />
          </div>
        )}
      </div>
    );
  };
  const renderEditEvent = (event: Event) => {
    return (
      <div key={event.id} className="text-xs flex flex-col gap-4 pr-9 relative">
        <div className="flex flex-col gap-2">
          <label htmlFor="event_date">Date:</label>
          <input
            id="event_date"
            name="event_date"
            type="date"
            defaultValue={event.event_date.split("T")[0]}
            className="bg-white text-black p-4"
            onChange={handleEventValueChange}
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="event_type">Type:</label>
          <select
            name={EventParamNames.EVENT_TYPE}
            id={EventParamNames.EVENT_TYPE}
            className="bg-white px-2 py-4 text-black border-none"
            defaultValue={event.event_type}
            // value={}
            onChange={handleEventValueChange}
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
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="details">Details:</label>
          <input
            id="details"
            name="details"
            type="text"
            defaultValue={event.details}
            className="bg-white text-black p-4"
            placeholder="details..."
            onChange={handleEventValueChange}
          />
        </div>
        {editMode && (
          <div className="absolute top-0 right-0">
            <EditButtons
              editMode={editingEventId === event.id}
              onClickEdit={() => setEditingEventId(event.id)}
              onClickCancel={() => setEditingEventId(null)}
              onClickConfirm={() => handleEventSubmitUpdate(event.id)}
              disabled={editingEventId !== null && editingEventId !== event.id}
            />
          </div>
        )}
      </div>
    );
  };
  return (
    <div className="flex flex-col gap-4">
      {renderEvent(appliedEvent)}
      {events.map((event) =>
        event.id === editingEventId
          ? renderEditEvent(event)
          : renderEvent(event)
      )}
    </div>
  );
};
