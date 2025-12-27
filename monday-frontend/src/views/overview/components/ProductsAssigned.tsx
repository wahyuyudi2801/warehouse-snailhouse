import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { StoreIcon } from "lucide-react";
import ItemTable from "./ItemTable";
import type { TransactionDetailType } from "@/types/transaction";
import { formatRupiah } from "@/utils/format";

const ProductsAssigned = ({
  transaction_products,
  value,
  setToggleModal,
}: {
  transaction_products: TransactionDetailType[];
  value: string;
  setToggleModal: ({
    name,
    category,
    thumbnail,
    price,
    about,
    is_popular,
  }: {
    name: string;
    category: string;
    thumbnail: string;
    price: number;
    about: string;
    is_popular: number;
  }) => void;
}) => {
  return (
    <div className="border-t px-4">
      <Accordion type="single" collapsible className="relative">
        <AccordionItem value={value} className="overflow-x-scroll md:overflow-x-visible">
          <AccordionTrigger className="absolute w-full md:relative">
            <h4 className="text-base font-bold">
              Product Assigned ({transaction_products.length})
            </h4>
          </AccordionTrigger>

          <div className="min-w-fit md:mt-0 mt-16">
            {transaction_products.map((tp) => (
              <AccordionContent key={"transaction-product-" + tp.id}>
                <div className="flex justify-between items-center font-bold text-base gap-4">
                  <ItemTable
                    data={{
                      title: tp.product.name,
                      text: (
                        <>
                          <span className="text-blue-700 font-bold">
                            {formatRupiah(tp.price)}
                          </span>{" "}
                          ({tp.quantity}x)
                        </>
                      ),
                      img_url: tp.product.thumbnail,
                    }}
                  />
                  <div className="flex items-center">
                    <StoreIcon
                      width={22}
                      className="mr-1 relative bottom-[1px]"
                    />
                    <div className="leading-none">
                      {tp.product.category.name}
                    </div>
                  </div>
                  <div>
                    <Button
                      variant={"outline"}
                      className="text-blue-600 cursor-pointer"
                      onClick={() =>
                        setToggleModal({
                          name: tp.product.name,
                          category: tp.product.category.name,
                          thumbnail: tp.product.thumbnail,
                          price: tp.product.price,
                          about: tp.product.about,
                          is_popular: tp.product.is_popular,
                        })
                      }
                    >
                      Details
                    </Button>
                  </div>
                </div>
              </AccordionContent>
            ))}
          </div>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default ProductsAssigned;
