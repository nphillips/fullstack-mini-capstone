import { cn } from "../utils/cn";

const Button = ({ children, onClick, disabled, color = "amber" }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "flex cursor-pointer items-center gap-2 rounded-sm px-4 py-2 text-sm font-bold text-white shadow-md",
        color === "amber" && "bg-amber-600",
        color === "green" && "bg-green-600",
        color === "red" && "bg-red-600",
        color === "purple" && "bg-violet-600",
      )}
    >
      {children}
    </button>
  );
};

export default Button;
