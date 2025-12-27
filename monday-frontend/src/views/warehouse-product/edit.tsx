import {
  getByWarehouseIdAndProductId,
  warehouseProductAssign,
} from "@/api/warehouse";
import ErrorInputValidation from "@/components/error-input-validation";
import FormLayout from "@/components/form-layout";
import SimpleCardFlex from "@/components/simple-card-flex";
import SkeletonMaster from "@/components/skeleton-master";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Label } from "@/components/ui/label";
import type { ProductType } from "@/types/product";
import type { WarehouseType } from "@/types/warehouse";
import axiosError from "@/utils/axios-error";
import { formatRupiah } from "@/utils/format";
import { BlocksIcon, Box, CheckCircle } from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";
import { useNavigate, useParams } from "react-router";
import { toast } from "sonner";

const WarehouseProductEdit = () => {
  const guides = [
    "Make sure the warehouse details are correct.",
    "Enter the p product details correctly and accurately.",
    "Specify the stock quantity to be added accurately is dummy text.",
    "Review the entered information for accuracy.",
    "Click 'Submit' to complete the process.",
  ];
  const [loading, setLoading] = useState(false);
  const { id, product_id } = useParams();
  const [warehouse, setWarehouse] = useState<WarehouseType>({
    id: 0,
    name: "",
    phone: "",
    photo: "https://static.thenounproject.com/png/1077596-200.png",
    address: "",
    products: [],
  });
  const [product, setProduct] = useState<ProductType | undefined>();
  const [stock, setStock] = useState<string>("");

  const [loadingPage, setLoadingPage] = useState(false);
  const [errorPage, setErrorPage] = useState("");
  const navigate = useNavigate();
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("product_id", product?.id.toString() || "undefined");
      formData.append("stock", stock.toString());

      const result = await warehouseProductAssign(formData, id);

      if (result) {
        toast.success("Successfully adding stock.", {
          position: "top-right",
        });

        navigate("/warehouse-product/" + id);
      }
    } catch (error) {
      setErrors(axiosError(error));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoadingPage(true);
        const result: WarehouseType = await getByWarehouseIdAndProductId(
          id,
          product_id
        );
        const findProduct: ProductType | undefined = result.products.find(
          (product) => product.id.toString() == product_id
        );

        if (findProduct == undefined) {
          toast.error("Product is not found", {
            position: "top-right",
          });
          navigate("/warehouse-product/" + id);
        }
        setProduct(findProduct);
        setStock(findProduct?.pivot?.stock.toString() || "");
        setWarehouse(result);
      } catch (error) {
        console.log(error);
        setErrorPage("Error fetching data");
      } finally {
        setLoadingPage(false);
      }
    };

    fetchData();
  }, [id, product_id, navigate]);

  if (loadingPage) {
    return <SkeletonMaster />;
  }

  if (errorPage) {
    return <div className="text-lg font-bold text-red-500">{errorPage}</div>;
  }

  return (
    <div>
      <FormLayout
        title="Quick guide to add new warehouse"
        children2={<WarehouseProductEdit.Chilren2 guides={guides} />}
        back={`/warehouse-product/${id}`}
        onSubmit={onSubmit}
        loading={loading}
        headerCard={
          <WarehouseProductEdit.HeaderCard
            name={warehouse.name}
            photo={warehouse.photo}
            text={warehouse.phone}
          />
        }
        btnText="Assign"
      >
        <div>
          <Label htmlFor="stock" className="mb-2 text-sm">
            Stock
          </Label>
          <InputGroup>
            <InputGroupInput
              type="number"
              name="stock"
              id="stock"
              placeholder="Enter Stock"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
            />
            <InputGroupAddon>
              <BlocksIcon />
            </InputGroupAddon>
          </InputGroup>
          {errors.stock && <ErrorInputValidation message={errors.stock[0]} />}
        </div>
      </FormLayout>

      <div className="grid mt-4 lg:grid-cols-5">
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Merchant Details</CardTitle>
            <CardDescription>
              View merchant detail in warehouse product
            </CardDescription>
          </CardHeader>
          <CardContent>
            {product?.merchants.length ? (
              product.merchants.map((merchant) => (
                <SimpleCardFlex
                  name={merchant.name}
                  photo={merchant.photo}
                  text={merchant.phone}
                />
              ))
            ) : (
              <div>No Merchants yet</div>
            )}

            <hr className="my-4" />

            <div className="flex justify-between items-center">
              <SimpleCardFlex
                name={product?.name || "lorem"}
                photo={product?.thumbnail || "lorem.png"}
                text={formatRupiah(product?.price || 0)}
              />
              <div className="flex items-center gap-1">
                <Box />
                <div className="text-sm font-medium">
                  {product?.pivot?.stock} Stock
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <div></div>
      </div>
    </div>
  );
};

WarehouseProductEdit.HeaderCard = ({
  name,
  photo,
  text,
}: {
  name: string;
  photo: string;
  text: string;
}) => {
  return (
    <div className="w-full bg-white rounded-xl shadow px-6 py-4">
      <h1 className="font-bold text-lg mb-4">Warehouse Details</h1>
      <SimpleCardFlex name={name} photo={photo} text={text} />
    </div>
  );
};

WarehouseProductEdit.Chilren2 = ({ guides }: { guides: string[] }) => {
  return (
    <ul>
      {guides.map((value, index) => (
        <li key={`guide-${index}`} className="mb-2.5">
          <div className="flex items-center gap-1.5">
            <CheckCircle color="green" width={20} />
            <span className="font-normal text-sm">{value}</span>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default WarehouseProductEdit;
