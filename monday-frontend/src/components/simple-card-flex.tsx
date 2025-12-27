import React from "react";

const SimpleCardFlex = ({
  photo,
  name,
  text,
}: {
  photo: string;
  name: string;
  text: string | React.ReactNode;
}) => {
  return (
    <div className="flex gap-2 items-center">
      <div className="w-14 h-14 rounded-full bg-gray-100 inline-block overflow-hidden">
        <img
          src={photo}
          className="w-full aspect-square object-cover"
        />
      </div>
      <div>
        <h4 className="font-bold capitalize">{name}</h4>
        <div className="opacity-65">{text}</div>
      </div>
    </div>
  );
};

export default SimpleCardFlex;
