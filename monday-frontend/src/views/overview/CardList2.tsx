import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DownloadReport from "./components/DownloadReport";
import TransactionInfo from "./components/TransactionInfo";
import ProductsAssigned from "./components/ProductsAssigned";
import { BanknoteIcon, CreditCardIcon, PercentIcon } from "lucide-react";
import type { TransactionType } from "@/types/transaction";
import { formatRupiah } from "@/utils/format";
import { useState } from "react";
import DetailProductModal from "@/components/detail-product-modal";

const CardList2 = ({ transactions }: { transactions: TransactionType[] }) => {
  const [toggleModal, setToggleModal] = useState(false)
  const [productName, setProductName] = useState("");
  const [productCategory, setProductCategory] = useState("");
  const [productThumbnail, setProductThumbnail] = useState("");
  const [productPrice, setProductPrice] = useState<number>(0);
  const [productAbout, setProductAbout] = useState("");
  const [productIsPopular, setProductIsPopular] = useState<number>(1);

  const openModalProduct = ({
    name,
    category,
    thumbnail,
    price,
    about,
    is_popular
  }: {
    name: string;
    category: string;
    thumbnail: string;
    price: number;
    about: string;
    is_popular: number;
  }) => {

    setProductName(name)
    setProductCategory(category)
    setProductThumbnail(thumbnail)
    setProductPrice(price)
    setProductAbout(about)
    setProductIsPopular(is_popular)
    setToggleModal(true)
  }

  return (
    <>
      {/* Modal Detail Product */}
      <DetailProductModal
        open={toggleModal}
        setOpen={setToggleModal}
        productThumbnail={productThumbnail}
        productAbout={productAbout}
        productCategory={productCategory}
        productIsPopular={productIsPopular}
        productName={productName}
        productPrice={productPrice}
      />

      <div className="grid auto-rows-min gap-6 lg:grid-cols-4 items-start">
        <DownloadReport />

        <Card className="lg:col-span-3 overflow-x-scroll">
          <CardHeader>
            <CardTitle>
              <h2 className="text-xl font-bold">Latest Transactions</h2>
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-5">
            {transactions.length ? (
              transactions.map((transaction) => (
              <div
                key={"transaction-" + transaction.id}
                className="border rounded-lg"
              >
                <TransactionInfo
                  customer_name={transaction.name}
                  customer_phone={transaction.phone}
                  customer_photo={
                    "https://gimgs2.nohat.cc/thumb/f/640/male-face-icon-default-profile-image--c3f2c592f9.jpg"
                  }
                  merchant_name={transaction.merchant?.name}
                />

                <ProductsAssigned
                  value={"product-assigned-" + transaction.id}
                  transaction_products={transaction.transaction_products}
                  setToggleModal={openModalProduct}
                />

                <div className="flex justify-between items-center font-medium text-sm border-t p-2 pl-4">
                  <div className="flex items-center opacity-60">
                    <BanknoteIcon className="pb-1 mr-0.5" />
                    <span>Sub Total:</span>
                  </div>
                  <span className="text-slate-800">
                    {formatRupiah(transaction.sub_total)}
                  </span>
                </div>
                <div className="flex justify-between items-center font-medium text-sm border-t p-2 pl-4">
                  <div className="flex items-center opacity-60">
                    <PercentIcon className="pb-1 mr-0.5" />
                    <span>Tax Total:</span>
                  </div>
                  <span className="text-slate-800">
                    {formatRupiah(transaction.tax_total)}
                  </span>
                </div>
                <div className="flex justify-between items-center font-bold text-base border-t p-4">
                  <div className="flex items-center opacity-60">
                    <CreditCardIcon className="pb-1 mr-0.5" />
                    <span>Grand Total:</span>
                  </div>
                  <span className="text-blue-800">
                    {formatRupiah(transaction.grand_total)}
                  </span>
                </div>
              </div>
            ))
            ) : (
              <div className="text-center py-4">
                There are no transactions yet
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default CardList2;
