import { assignMerchantProduct, getMerchantById } from "@/api/merchant";
import { getWarehouseById, getWarehouses } from "@/api/warehouse";
import Alert from "@/components/alert";
import ErrorInputValidation from "@/components/error-input-validation";
import FormLayout from "@/components/form-layout";
import SelectGroup from "@/components/select-group";
import SimpleCardFlex from "@/components/simple-card-flex";
import SkeletonMaster from "@/components/skeleton-master";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Label } from "@/components/ui/label";
import type { MerchantType } from "@/types/merchant";
import type { SelectType } from "@/types/select-type";
import type { WarehouseType } from "@/types/warehouse";
import axiosError from "@/utils/axios-error";
import { BlocksIcon, Box, CheckCircle, WarehouseIcon } from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";
import { useNavigate, useParams } from "react-router";
import { toast } from "sonner";

const MerchantProductAssign = () => {
  const guides = [
    "Make sure the merchant details are correct.",
    "Enter the p product details correctly and accurately.",
    "Specify the stock quantity to be added accurately is dummy text.",
    "Review the entered information for accuracy.",
    "Click 'Submit' to complete the process.",
  ];
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const [merchant, setMerchant] = useState<MerchantType>({
    id: 0,
    name: "",
    phone: "",
    photo: "https://static.thenounproject.com/png/1077596-200.png",
    address: "",
    products: [],
  });

  const [selectWarehouses, setSelectWarehouses] = useState<SelectType[]>([]);
  const [warehouseId, setWarehouseId] = useState("");

  const [selectProducts, setSelectProducts] = useState<SelectType[]>([]);
  const [productId, setProductId] = useState("");

  const [isLoadingComponent, setIsLoadingComponent] = useState(false);
  const [loadingPage, setLoadingPage] = useState(false);
  const [errorPage, setErrorPage] = useState("");
  const navigate = useNavigate();
  const [errors, setErrors] = useState<{ [key: string]: string[] }>({});

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("warehouse_id", warehouseId);
      formData.append("product_id", productId);
      formData.append("stock", e.currentTarget.stock.value);

      const result = await assignMerchantProduct(formData, id);

      if (result) {
        toast.success("Merchant successfully assigning product.", {
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

        // get merchant
        const result = await getMerchantById(id);
        setMerchant(result);

        // get warehouses
        const warehouses: WarehouseType[] = await getWarehouses();
        const warehousesForSelect: SelectType[] = [];
        warehouses.map((warehouse) => {
          warehousesForSelect.push({
            value: warehouse.id.toString(),
            text: warehouse.name,
          });
        });
        setSelectWarehouses(warehousesForSelect);
      } catch (error) {
        console.log(error);
        setErrorPage("Error fetching data");
      } finally {
        setLoadingPage(false);
      }
    };

    fetchData();
  }, [id]);

  const onChangeSelectWarehouse = async (warehouse_id: string) => {
    try {
      setIsLoadingComponent(true);
      // set warehouse id
      setWarehouseId(warehouse_id);

      // get products by warehouse id
      const warehouse: WarehouseType = await getWarehouseById(warehouse_id);
      const productForSelect: SelectType[] = [];

      warehouse.products.map((product) => {
        productForSelect.push({
          value: product.id.toString(),
          text: product.name,
        });
      });

      setSelectProducts(productForSelect);
    } catch (error) {
      console.log(error);
      setErrorPage(
        "Error fetching data. Warehouse not found. Please try again."
      );
    } finally {
      setProductId("");
      console.log(productId)
      setIsLoadingComponent(false);
    }
  };

  if (loadingPage) {
    return <SkeletonMaster />;
  }

  if (errorPage) {
    return <div className="text-lg font-bold text-red-500">{errorPage}</div>;
  }

  return (
    <FormLayout
      title="Quick guide to add new merchant"
      children2={<MerchantProductAssign.Chilren2 guides={guides} />}
      back={`/merchant-product/${id}`}
      onSubmit={onSubmit}
      loading={loading}
      headerCard={
        <MerchantProductAssign.HeaderCard
          name={merchant.name}
          photo={merchant.photo}
          text={merchant.phone}
        />
      }
      btnText="Assign"
    >
        {errors.message && (
            <Alert message={errors.message[0]} type="error" hide={setErrors} />
        )}
      <div>
        <SelectGroup
          id="warehouse_id"
          icon={WarehouseIcon}
          title="Select Warehouse"
          contents={selectWarehouses}
          value={warehouseId}
          onChange={onChangeSelectWarehouse}
          disabled={selectWarehouses.length === 0}
        />
        {errors.warehouse_id && (
          <ErrorInputValidation message={errors.warehouse_id[0]} />
        )}
      </div>
      <div>
        <SelectGroup
          id="product_id"
          icon={Box}
          title="Select Product"
          contents={selectProducts}
          value={productId}
          onChange={setProductId}
          disabled={selectProducts.length === 0}
          isLoading={isLoadingComponent}
        />
        {errors.product_id && (
          <ErrorInputValidation message={errors.product_id[0]} />
        )}
      </div>
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
          />
          <InputGroupAddon>
            <BlocksIcon />
          </InputGroupAddon>
        </InputGroup>
        {errors.stock && <ErrorInputValidation message={errors.stock[0]} />}
      </div>
    </FormLayout>
  );
};

MerchantProductAssign.HeaderCard = ({
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
      <h1 className="font-bold text-lg mb-4">Merchant Details</h1>
      <SimpleCardFlex name={name} photo={photo} text={text} />
    </div>
  );
};

MerchantProductAssign.Chilren2 = ({ guides }: { guides: string[] }) => {
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

export default MerchantProductAssign;
