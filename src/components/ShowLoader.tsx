import useSWR from "swr";
import { Loader } from "./Loader";

interface ShowLoaderProps {
  children: React.ReactNode;
  message?: string;
  data?: any;
  isLoading?: boolean;
}

export const ShowLoader: React.FC<ShowLoaderProps> = ({
  children,
  message,
  data,
  isLoading,
}) => {
  const swrHook = useSWR("/api/jobs");
  if (data === undefined) {
    data = swrHook.data;
  }
  if (isLoading === undefined) {
    isLoading = swrHook.isLoading;
  }
  if (!data && !isLoading) {
    return <div className="text-gray-400 text-center">{message || "..."}</div>;
  } else if (isLoading) {
    return (
      <div className="text-gray-400 text-center">
        <div className="text-lime-600 max-w-50 mb-2 mx-auto">
          <Loader />
        </div>
        {message}
      </div>
    );
  } else {
    return <>{children}</>;
  }
};
