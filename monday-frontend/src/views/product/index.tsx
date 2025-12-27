import { getProducts } from "@/api/product";
import DetailProductModal from "@/components/detail-product-modal";
import MasterDataLayout from "@/components/master-data-layout";
import SimpleCardFlex from "@/components/simple-card-flex";
import SkeletonMaster from "@/components/skeleton-master";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { ProductType } from "@/types/product";
import { formatRupiah } from "@/utils/format";
import { EditIcon, EyeIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router";

export default function Product() {
  const [productName, setProductName] = useState("");
  const [productCategory, setProductCategory] = useState("");
  const [productThumbnail, setProductThumbnail] = useState("");
  const [productPrice, setProductPrice] = useState<number>(0);
  const [productAbout, setProductAbout] = useState("");
  const [productIsPopular, setProductIsPopular] = useState<number>(1);
  const [open, setOpen] = useState(false);
  const [products, setProducts] = useState<ProductType[]>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const response = await getProducts();

        setProducts(response);
      } catch (error) {
        console.log(error);
        setError("Error fetching data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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

  if (loading) {
    return <SkeletonMaster />;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <>
      <MasterDataLayout
        cardTitle={`${products?.length} Total Products`}
        cardDescription="List of all products"
        createUrl="/product/create"
      >
        <Table>
          <TableHeader className="bg-gray-100">
            <TableRow>
              <TableHead className="w-[40%]">Product Information</TableHead>
              <TableHead className="w-[40%]">Category</TableHead>
              <TableHead className="w-[20%]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products?.length ? (
              products.map((product, idx) => (
                <TableRow key={idx}>
                  <TableCell>
                    <SimpleCardFlex
                      photo={product.thumbnail}
                      name={product.name}
                      text={formatRupiah(product.price)}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <img width={30} src={product.category.photo} />
                      <span className="font-bold">{product.category.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant={"outline"}
                        className="flex gap-1 items-center cursor-pointer"
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
                      >
                        <EyeIcon /> Details
                      </Button>
                      <Button
                        asChild
                        variant={"default"}
                        className="flex gap-1 items-center cursor-pointer"
                      >
                        <Link to={"/product/" + product.id}>
                          <EditIcon color="white" /> Edit
                        </Link>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} className="h-12 text-center bg-gray-50">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </MasterDataLayout>

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
}
