import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Label } from "./ui/label";
import { Loader } from "lucide-react";

const SelectGroup = ({
  id,
  icon: Icon,
  title,
  contents,
  onChange,
  value,
  disabled = false,
  isLoading = false
}: {
  id: string;
  icon: React.ElementType;
  title: string;
  value?: string;
  disabled?: boolean;
  isLoading?: boolean;
  contents: {
    value: string;
    text: string;
  }[];
  onChange?: (value: string) => void;
}) => {

  return (
    <div>
      <Label htmlFor={id} className="text-sm mb-2">{title}</Label>
      <div className="flex items-center w-full border rounded-md px-2 pl-3 transition-all focus-within:ring-3 focus-within:ring-gray-300 focus-within:border-gray-300">
        {isLoading ? <Loader size={18} className="animate-spin" /> : <Icon size={18} />}
        <Select name={id} onValueChange={onChange} value={value} disabled={disabled || isLoading}>
          <SelectTrigger id={id} className="flex-1 border-none shadow-none focus-visible:ring-0 focus-visible:outline-none resize-none">
            <SelectValue placeholder={title} />
          </SelectTrigger>
          <SelectContent>
            {contents.map((content, idx) => (
              <SelectItem key={content.text + "-" + idx} value={content.value}>
                {content.text}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default SelectGroup;
