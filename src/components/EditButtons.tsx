interface EditButtonsProps {
  onClickEdit: () => void;
  onClickConfirm: () => void;
  onClickCancel: () => void;
  editMode: boolean;
  disabled?: boolean;
}

export const EditButtons: React.FC<EditButtonsProps> = ({
  onClickEdit,
  onClickConfirm,
  onClickCancel,
  editMode,
  disabled = false,
}) => {
  return (
    <div className="flex flex-col gap-2">
      {editMode ? (
        <>
          <button
            className="text-xs bg-sky-900 p-2 active:translate-y-1 disabled:bg-gray-400 disabled:text-gray-500"
            onClick={() => onClickCancel()}
            disabled={disabled}
          >
            <div className="icon-base icon-cancel bg-slate-300" />
          </button>
          <button
            className="text-xs bg-sky-900 p-2 active:translate-y-1 disabled:bg-gray-400 disabled:text-gray-500"
            onClick={() => onClickConfirm()}
            disabled={disabled}
          >
            <div className="icon-base icon-confirm bg-slate-300" />
          </button>
        </>
      ) : (
        <button
          className="text-xs bg-sky-900 p-2 active:translate-y-1 disabled:bg-gray-400 disabled:text-gray-500"
          onClick={() => onClickEdit()}
          disabled={disabled}
        >
          <div className="icon-base icon-edit bg-slate-300" />
        </button>
      )}
    </div>
  );
};
