import { cn } from "@/lib/utils";

const AVATAR_COLORS = [
  "bg-pastel-peach text-orange-700",
  "bg-pastel-mint text-green-700",
  "bg-pastel-lavender text-purple-700",
  "bg-pastel-butter text-yellow-700",
  "bg-pastel-pink text-pink-700",
  "bg-sky-200 text-sky-800",
];

interface InitialsAvatarProps {
  name: string;
  size?: "sm" | "md" | "lg";
  className?: string;
  avatarUrl?: string;
}

export default function InitialsAvatar({
  name,
  size = "md",
  className,
  avatarUrl,
}: InitialsAvatarProps) {
  const initials = name
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");

  const colorIndex = name.charCodeAt(0) % AVATAR_COLORS.length;
  const colorClass = AVATAR_COLORS[colorIndex];

  const sizeClasses = {
    sm: "w-8 h-8 text-xs",
    md: "w-10 h-10 text-sm",
    lg: "w-16 h-16 text-xl",
  };

  if (avatarUrl) {
    return (
      <img
        src={avatarUrl}
        alt={name}
        className={cn(
          "rounded-full object-cover",
          sizeClasses[size],
          className,
        )}
      />
    );
  }

  return (
    <div
      className={cn(
        "rounded-full flex items-center justify-center font-semibold flex-shrink-0",
        colorClass,
        sizeClasses[size],
        className,
      )}
    >
      {initials || "?"}
    </div>
  );
}
