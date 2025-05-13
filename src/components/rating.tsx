import { cn } from "@/lib/utils";

interface RatingProps {
  className?: string;
  rating: number;
  maxRating?: number;
  size?: "sm" | "md" | "lg";
  readOnly?: boolean;
  onChange?: (rating: number) => void;
}

/**
 * A star rating component that can be used to display and collect ratings
 */
export function Rating({ 
  className, 
  rating, 
  maxRating = 5,
  size = "md",
  readOnly = true,
  onChange 
}: RatingProps) {
  const stars = Array.from({ length: maxRating }, (_, i) => i + 1);

  const sizes = {
    sm: "w-3 h-3",
    md: "w-4 h-4",
    lg: "w-5 h-5"
  };

  return (
    <div className={cn("flex items-center gap-0.5", className)}>
      {stars.map((star) => (
        <button
          key={star}
          type="button"
          className={cn(
            "text-yellow-400 cursor-default",
            !readOnly && "cursor-pointer hover:scale-110 transition-transform",
          )}
          onClick={() => {
            if (!readOnly && onChange) {
              onChange(star);
            }
          }}
          disabled={readOnly}
        >
          <svg
            className={sizes[size]}
            fill={star <= rating ? "currentColor" : "none"}
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
            />
          </svg>
        </button>
      ))}
    </div>
  );
}
