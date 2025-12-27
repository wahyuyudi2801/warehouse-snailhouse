import { StoreIcon } from "lucide-react";
import ItemTable from "./ItemTable";

const TransactionInfo = ({
  customer_name,
  customer_phone,
  customer_photo = "default.png",
  merchant_name = "undefined",
}: {
  customer_name: string;
  customer_phone: string;
  customer_photo: string | undefined;
  merchant_name: string | undefined;
}) => {
  return (
    <div className="flex flex-wrap justify-between items-center font-bold text-base p-4">
      <ItemTable
        data={{
          title: customer_name,
          text: customer_phone,
          img_url: customer_photo,
        }}
      />
      <div className="flex flex-wrap justify-end items-center">
        <StoreIcon width={22} className="mr-1 relative bottom-[1px]" />
        <div className="leading-none">{merchant_name}</div>
      </div>
    </div>
  );
};

export default TransactionInfo;
