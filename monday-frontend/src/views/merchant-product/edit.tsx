import { getByMerchantAndProduct, updateMerchantProduct } from "@/api/merchant";
import Alert from "@/components/alert";
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
import type { MerchantProductType, MerchantType } from "@/types/merchant";
import type { ProductType } from "@/types/product";
import type { WarehouseType } from "@/types/warehouse";
import axiosError from "@/utils/axios-error";
import { formatRupiah } from "@/utils/format";
import { BlocksIcon, Box, CheckCircle } from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";
import { useNavigate, useParams } from "react-router";
import { toast } from "sonner";

const MerchantProductEdit = () => {
  const guides = [
    "Make sure the merchant details are correct.",
    "Enter the p product details correctly and accurately.",
    "Specify the stock quantity to be added accurately is dummy text.",
    "Review the entered information for accuracy.",
    "Click 'Submit' to complete the process.",
  ];
  const [loading, setLoading] = useState(false);
  const { id, product_id } = useParams();
  const [merchantProduct, setMerchantProduct] = useState<
    MerchantProductType | { [key: string]: string | number }
  >({});
  const [merchant, setMerchant] = useState<MerchantType>({
    id: 0,
    name: "",
    phone: "",
    photo: "https://static.thenounproject.com/png/1077596-200.png",
    address: "",
    products: [],
  });
  const [product, setProduct] = useState<ProductType | undefined>();
  const [warehouse, setWarehouse] = useState<WarehouseType | undefined>();
  const [stock, setStock] = useState<string>("");

  const [loadingPage, setLoadingPage] = useState(false);
  const [errorPage, setErrorPage] = useState("");
  const navigate = useNavigate();
  const [errors, setErrors] = useState<{ [key: string]: string[] }>({});

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('_method', 'PUT');
      formData.append("warehouse_id", warehouse?.id.toString() || "undefined");
      formData.append("stock", stock.toString());

      const result = await updateMerchantProduct(formData, id, product_id);

      if (result) {
        toast.success("Successfully adding stock.", {
          position: "top-right",
        });

        navigate("/merchant-product/" + id);
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
        const result: MerchantProductType = await getByMerchantAndProduct(
          id,
          product_id
        );

        setStock(result.stock.toString());
        setMerchantProduct(result);
        setWarehouse(result.warehouse);
        setMerchant(result.merchant);
        setProduct(result.product);
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
        title="Quick guide to edit stock in merchant"
        children2={<MerchantProductEdit.Chilren2 guides={guides} />}
        back={`/merchant-product/${id}`}
        onSubmit={onSubmit}
        loading={loading}
        headerCard={
          <MerchantProductEdit.HeaderCard
            name={warehouse?.name || "lorem"}
            photo={
              warehouse?.photo ||
              "https://static.thenounproject.com/png/1077596-200.png"
            }
            text={warehouse?.phone || "lorem"}
          />
        }
        headerCard2={
          <MerchantProductEdit.HeaderCard2
            merchant={merchant}
            product={product}
            merchantProduct={merchantProduct}
          />
        }
        btnText="Assign"
      >
        {errors.message && <Alert message={errors.message[0]} type="error" hide={setErrors} />}
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
    </div>
  );
};

MerchantProductEdit.HeaderCard = ({
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
      <h1 className="font-bold text-lg mb-4">Merchant Product Details</h1>
      <SimpleCardFlex name={name} photo={photo} text={text} />
    </div>
  );
};

MerchantProductEdit.Chilren2 = ({ guides }: { guides: string[] }) => {
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

MerchantProductEdit.HeaderCard2 = ({
  merchant,
  product,
  merchantProduct,
}: {
  merchant: MerchantType;
  product: ProductType | undefined;
  merchantProduct: MerchantProductType | { [key: string]: string | number };
}) => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Merchant Details</CardTitle>
        <CardDescription>
          This is a merchant detail in merchant product
        </CardDescription>
      </CardHeader>
      <CardContent>
        <SimpleCardFlex
          name={merchant.name}
          photo={merchant.photo}
          text={merchant.phone}
        />

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
              {merchantProduct.stock} Stock
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MerchantProductEdit;
