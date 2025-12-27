import { getProducts } from "@/api/product";
import { getWarehouseById, warehouseProductAssign } from "@/api/warehouse";
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
import type { ProductType } from "@/types/product";
import type { SelectType } from "@/types/select-type";
import type { WarehouseType } from "@/types/warehouse";
import axiosError from "@/utils/axios-error";
import { BlocksIcon, Box, CheckCircle } from "lucide-react";
import React, { useEffect, useState, type FormEvent } from "react";
import { useNavigate, useParams } from "react-router";
import { toast } from "sonner";

const WarehouseProductAssign = () => {
  const guides = [
    "Make sure the warehouse details are correct.",
    "Enter the p product details correctly and accurately.",
    "Specify the stock quantity to be added accurately is dummy text.",
    "Review the entered information for accuracy.",
    "Click 'Submit' to complete the process.",
  ];
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const [warehouse, setWarehouse] = useState<WarehouseType>({
    id: 0,
    name: "",
    phone: "",
    photo: "https://static.thenounproject.com/png/1077596-200.png",
    address: "",
    products: [],
  });

  const [selectProducts, setSelectProducts] = useState<SelectType[]>([]);
  const [loadingPage, setLoadingPage] = useState(false);
  const [errorPage, setErrorPage] = useState("");
  const [productId, setProductId] = useState("");
  const navigate = useNavigate()
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setLoading(true);
      const formData = new FormData()
      formData.append('product_id', productId)
      formData.append('stock', e.currentTarget.stock.value)

      const result = await warehouseProductAssign(formData, id)

      if(result) {
        toast.success("Warehouse successfully assigning product.", {
          position: "top-right",
        })

        navigate('/warehouse-product/' + id)
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
        const result = await getWarehouseById(id);

        setWarehouse(result);

        const products: ProductType[] = await getProducts();
        const productForSelect: SelectType[] = [];
        products.map((product) => {
          productForSelect.push({
            value: product.id.toString(),
            text: product.name,
          });
        });

        setSelectProducts(productForSelect);
      } catch (error) {
        console.log(error);
        setErrorPage("Error fetching data");
      } finally {
        setLoadingPage(false);
      }
    };

    fetchData();
  }, [id]);

  if (loadingPage) {
    return <SkeletonMaster />;
  }

  if (errorPage) {
    return <div className="text-lg font-bold text-red-500">{errorPage}</div>;
  }

  return (
    <FormLayout
      title="Quick guide to add new warehouse"
      children2={<WarehouseProductAssign.Chilren2 guides={guides} />}
      back={"/warehouse-merchant/" + id}
      onSubmit={onSubmit}
      loading={loading}
      headerCard={
        <WarehouseProductAssign.HeaderCard
          name={warehouse.name}
          photo={warehouse.photo}
          text={warehouse.phone}
        />
      }
      btnText="Assign"
    >
      <div>
        <Label htmlFor="product_id" className="mb-2 text-sm">
          Product
        </Label>
        <SelectGroup
          id="product_id"
          icon={Box}
          title="Select Product"
          contents={selectProducts}
          onChange={setProductId}
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

WarehouseProductAssign.HeaderCard = ({
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

WarehouseProductAssign.Chilren2 = ({ guides }: { guides: string[] }) => {
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

export default WarehouseProductAssign;
