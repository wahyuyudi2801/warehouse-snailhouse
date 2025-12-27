import type React from "react";

type CardTransactionType = {
    Icon: React.ElementType,
    title: string,
    text: string,
    border?: string
}

export default function CardTransaction({
  Icon,
  title,
  text,
  border,
}: CardTransactionType) {
  return (
    <div className={`w-full ${border} p-4 flex justify-between items-center`}>
      <div className="flex items-center gap-1 opacity-50">
        <Icon />
        <span>{title}</span>
      </div>
      <div>
        <span className="font-bold">{text}</span>
      </div>
    </div>
  );
}
