import React from "react";

const ErrorInputValidation = ({ message }: { message: string }) => {
  return (
    <div className="text-red-500 font-normal text-xs mt-1">{message}</div>
  );
};

export default ErrorInputValidation;
