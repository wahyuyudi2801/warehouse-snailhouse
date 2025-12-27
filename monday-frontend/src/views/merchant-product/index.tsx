import { getMerchantById } from "@/api/merchant";
import DetailProductModal from "@/components/detail-product-modal";
import MasterDataLayout from "@/components/master-data-layout";
import SimpleCardFlex from "@/components/simple-card-flex";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { MerchantType } from "@/types/merchant";
import { formatRupiah } from "@/utils/format";
import { Blocks, ChartBar, EyeIcon, PlusCircle, UserIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";

const MerchantProduct = () => {
  const { id } = useParams();
  const [loadingPage, setLoadingPage] = useState(false);
  const [errorPage, setErrorPage] = useState("");
  const [merchant, setMerchant] = useState<MerchantType>({
    id: 0,
    name: "",
    phone: "",
    photo: "https://static.thenounproject.com/png/1077596-200.png",
    address: "",
    products: [],
    keeper: null,
    keeper_id: 0,
  });
  const [open, setOpen] = useState(false);
  const [productThumbnail, setProductThumbnail] = useState("");
  const [productAbout, setProductAbout] = useState("");
  const [productCategory, setProductCategory] = useState("");
  const [productIsPopular, setProductIsPopular] = useState<number>(0);
  const [productName, setProductName] = useState("");
  const [productPrice, setProductPrice] = useState<number>(1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoadingPage(true);

        const result: MerchantType = await getMerchantById(id);

        setMerchant(result);
      } catch (error) {
        console.log(error);
        setErrorPage("Error fetch data");
      } finally {
        setLoadingPage(false);
      }
    };

    fetchData();
  }, [id]);

  const openModalDetail = (
    name: string,
    category: string,
    thumbnail: string,
    price: number,
    about: string,
    is_popular: number
  ) => {
    setOpen(true);
    setProductName(name);
    setProductCategory(category);
    setProductThumbnail(thumbnail);
    setProductPrice(price);
    setProductAbout(about);
    setProductIsPopular(is_popular);
  };

  if (loadingPage) {
    return (
      <div className="flex flex-col gap-8">
        <div className="bg-white rounded-xl shadow p-6">
          <Skeleton className="w-full h-[48px]" />
        </div>
        <div className="bg-white rounded-xl shadow p-6 flex flex-col gap-4">
          <Skeleton className="w-full h-[48px]" />
          <hr />
          <Skeleton className="w-full h-[96px]" />
        </div>
      </div>
    );
  }

  if (errorPage) {
    return <div className="text-red-500 text-lg font-bold">{errorPage}</div>;
  }

  return (
    <>
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-center flex-wrap bg-white w-full rounded-xl shadow p-6">
          <SimpleCardFlex
            name={merchant.name}
            photo={merchant.photo}
            text={merchant.phone}
          />
          {merchant.keeper && (
            <div className="flex flex-col">
              <div className="flex items-center opacity-55">
                <UserIcon />
                <span>Keeper name:</span>
              </div>
              <div className="font-semibold ml-6">
                {merchant.keeper.name}
              </div>
            </div>
          )}
          <div>
            <Button asChild variant={"default"} size={"lg"}>
              <Link to={"/merchant/" + id}>Edit merchant</Link>
            </Button>
          </div>
        </div>
        <MasterDataLayout
          cardTitle={`${merchant.products.length} Total Products`}
          cardDescription="View an update your product merchants list here."
          createUrl={`/merchant-product/${id}/assign`}
          btnText="Assign a Products"
        >
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {merchant.products.length ? (
                merchant.products.map((product, idx) => (
                  <TableRow key={product.name + idx}>
                    <TableCell>
                      <SimpleCardFlex
                        name={product.name}
                        photo={product.thumbnail}
                        text={formatRupiah(product.price)}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Blocks /> <span>{product.pivot?.stock} Stock</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <ChartBar /> <span>{product.category.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2 flex-wrap">
                        <Button
                          onClick={() =>
                            openModalDetail(
                              product.name,
                              product.category.name,
                              product.thumbnail,
                              product.price,
                              product.about,
                              product.is_popular
                            )
                          }
                          variant={"outline"}
                          className="flex gap-1 items-center cursor-pointer"
                        >
                          <EyeIcon /> Details
                        </Button>
                        <Button
                          asChild
                          variant={"default"}
                          className="flex gap-1 items-center cursor-pointer bg-green-700 hover:bg-green-700/90 transition-all"
                        >
                          <Link
                            to={`/merchant-product/${id}/${product.id}/add-stock`}
                          >
                            <PlusCircle color="white" /> Add Stock
                          </Link>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="h-12 text-center bg-gray-50"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </MasterDataLayout>
      </div>

      <DetailProductModal
        open={open}
        setOpen={setOpen}
        productThumbnail={productThumbnail}
        productAbout={productAbout}
        productCategory={productCategory}
        productIsPopular={productIsPopular}
        productName={productName}
        productPrice={productPrice}
      />
    </>
  );
};

export default MerchantProduct;
