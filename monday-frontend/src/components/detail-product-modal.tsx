import type { Dispatch, SetStateAction } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { formatRupiah } from "@/utils/format";

type DetailProductModalType = {
    open: boolean,
    setOpen: Dispatch<SetStateAction<boolean>>,
    productThumbnail: string,
    productName: string,
    productIsPopular: number,
    productCategory: string,
    productPrice: number,
    productAbout: string
}

const DetailProductModal = ({
    open,
    setOpen,
    productThumbnail,
    productName,
    productIsPopular,
    productCategory,
    productPrice,
    productAbout
}: DetailProductModalType) => {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Detail Product</DialogTitle>
          <DialogDescription>This is detail product</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">
          <div>
            <img
              className="rounded"
              src={productThumbnail}
              alt={productName}
              width={100}
            />
          </div>
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-lg font-semibold">
                <span>{productName}</span>
                {productIsPopular == 1 && (
                  <div className="ml-2 inline-block text-[10px] text-white bg-blue-500 rounded-full px-2 py-1">
                    Popular
                  </div>
                )}
              </h2>
              <div className="text-sm opacity-70">{productCategory}</div>
            </div>
            <div className="text-lg font-extrabold text-green-500">
              {formatRupiah(productPrice)}
            </div>
          </div>
          <hr />
          <div className="text-sm font-medium opacity-70">{productAbout}</div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DetailProductModal;
