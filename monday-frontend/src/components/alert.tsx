import { XIcon } from "lucide-react";

const Alert = ({ message, type, hide }: { message: string, type: "success" | "error" | "warning", hide: (value: { [key: string]: string[] }) => void }) => {
  const getColor = () => {
    switch (type) {
      case "success":
        return "bg-green-500";
      case "error":
        return "bg-red-500";
      case "warning":
        return "bg-yellow-500";
      default:
        return "bg-blue-500";
    }
  };
  return (
    <div className={`${getColor()} rounded-lg px-4 py-2 font-medium text-xs mb-4 flex justify-between items-center`}>
      <div className="text-white">{message}</div>
      <div>
        <XIcon
          size={20}
          color="white"
          onClick={() => hide({})}
          className="cursor-pointer"
        />
      </div>
    </div>
  );
};

export default Alert;
