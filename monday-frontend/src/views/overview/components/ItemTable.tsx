import React from "react";

const ItemTable = ({
  data,
}: {
  data: {
    title: string;
    text: React.ReactNode;
    img_url: string;
  };
}) => {
  return (
    <div className="flex gap-4 justify-start items-center">
      <div className="bg-gray-100 w-[64px] rounded-4xl overflow-hidden">
        <img
          className="w-full h-auto aspect-square object-cover"
          src={data.img_url}
          alt={data.title}
        />
      </div>
      <div className="text-left">
        <h4 className="text-base md:text-lg font-bold">{data.title}</h4>
        <div className="text-sm font-semibold text-gray-900/50">
          {data.text}
        </div>
      </div>
    </div>
  );
};

export default ItemTable;
