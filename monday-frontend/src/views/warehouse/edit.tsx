import { getWarehouseById, updateWarehouse } from "@/api/warehouse";
import Alert from "@/components/alert";
import ErrorInputValidation from "@/components/error-input-validation";
import FormLayout from "@/components/form-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import type { WarehouseType } from "@/types/warehouse";
import axiosError from "@/utils/axios-error";
import {
  CheckCircle,
  CreditCard,
  LoaderCircleIcon,
  ShoppingBasket,
  TextIcon,
} from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";
import { useNavigate, useParams } from "react-router";
import { toast } from "sonner";

const WarehouseEdit = () => {
  const guides = [
    "Upload warehouse image.",
    "Enter warehouse name and warehouse tagline.",
    "Click save button.",
    "Warehouse successfully added.",
    "Check warehouse list to verify.",
  ];
  const [preview, setPreview] = useState(
    "https://static.thenounproject.com/png/1077596-200.png"
  );
  const [errors, setErrors] = useState<{ [key: string]: string[] }>({});
  const [error, setError] = useState<string | undefined>();
  const [loadingPage, setLoadingPage] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();

  const [warehouseName, setWarehouseName] = useState("");
  const [warehousePhone, setWarehousePhone] = useState("");
  const [warehouseAddress, setWarehouseAddress] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoadingPage(true);
        const result: WarehouseType = await getWarehouseById(id);

        setWarehouseName(result.name);
        setWarehousePhone(result.phone);
        setWarehouseAddress(result.address);
        setPreview(result.photo);
      } catch (error) {
        console.log(error);
        setError("Warehouse is not found");
      } finally {
        setLoadingPage(false);
      }
    };

    fetchData();
  }, [id]);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("_method", "PUT");
      formData.append("name", warehouseName);
      formData.append("phone", warehousePhone);
      formData.append("address", warehouseAddress);

      const image = e.currentTarget.image.files?.[0];
      if (image) {
        formData.append("photo", image);
      }

      const result = await updateWarehouse(formData, id);

      if (result) {
        toast.success("Warehouse successfully updated", {
          position: 'top-right'
        });
        navigate("/warehouse");
      }
    } catch (error) {
      setErrors(axiosError(error));
    } finally {
      setLoading(false);
    }
  };

  const onPreview = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  if (loadingPage) {
    return (
      <div className="grid gap-4 md:grid-cols-5">
        <Skeleton className="col-span-3 border bg-white min-h-[320px] flex justify-center items-center">
          <LoaderCircleIcon size={38} className="animate-spin" />
        </Skeleton>
        <Skeleton className="col-span-2 border bg-white min-h-[320px] flex justify-center items-center">
          <LoaderCircleIcon size={38} className="animate-spin" />
        </Skeleton>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <FormLayout
      title="Quick guide to edit product"
      children2={<WarehouseEdit.Chilren2 guides={guides} />}
      back="/product"
      onSubmit={onSubmit}
      loading={loading}
    >
      {errors.message && (
        <Alert
          type="error"
          message={errors.message[0] ?? errors.message}
          hide={setErrors}
        />
      )}
      <div className="grid w-full gap-6">
        <div>
          <div className="flex justify-between items-center">
            <div className="border bg-gray-100 rounded-lg overflow-hidden">
              <img
                className="max-w-[120px] aspect-square object-cover"
                src={preview}
                alt=""
              />
            </div>
            <div>
              <Button
                asChild
                variant={"default"}
                size={"lg"}
                className="cursor-pointer"
              >
                <Label htmlFor="image">Add photo</Label>
              </Button>
              <Input
                id="image"
                name="image"
                onChange={onPreview}
                className="hidden"
                type="file"
              />
            </div>
          </div>
          {errors.photo && <ErrorInputValidation message={errors.photo[0]} />}
        </div>
        <div>
          <Label htmlFor="warehouse_name" className="mb-2 text-sm">
            Name
          </Label>
          <InputGroup>
            <InputGroupInput
              name="warehouse_name"
              id="warehouse_name"
              placeholder="Enter Name"
              value={warehouseName}
              onChange={(e) => setWarehouseName(e.target.value)}
            />
            <InputGroupAddon>
              <ShoppingBasket />
            </InputGroupAddon>
          </InputGroup>
          {errors.name && <ErrorInputValidation message={errors.name[0]} />}
        </div>
        <div>
          <Label htmlFor="warehouse_phone" className="mb-2 text-sm">
            Phone
          </Label>
          <InputGroup>
            <InputGroupInput
              name="warehouse_phone"
              id="warehouse_phone"
              type="tel"
              placeholder="Enter Phone"
              value={warehousePhone}
              onChange={(e) => setWarehousePhone(e.target.value)}
            />
            <InputGroupAddon>
              <CreditCard />
            </InputGroupAddon>
          </InputGroup>
          {errors.phone && <ErrorInputValidation message={errors.phone[0]} />}
        </div>
        <div>
          <Label htmlFor="warehouse_address" className="mb-2 text-sm">
            Address
          </Label>
          <div className="flex w-full border rounded-md px-2 pl-3 transition-all focus-within:ring-3 focus-within:ring-gray-300 focus-within:border-gray-300">
            <TextIcon className="h-4 w-4 mt-2.5 text-gray-500" />
            <Textarea
              name="warehouse_address"
              id="warehouse_address"
              placeholder="Enter Address"
              value={warehouseAddress}
              onChange={(e) => setWarehouseAddress(e.target.value)}
              className="flex-1 border-none outline-none focus-visible:ring-0 focus-visible:outline-none resize-none"
            />
          </div>
          {errors.address && (
            <ErrorInputValidation message={errors.address[0]} />
          )}
        </div>
      </div>
    </FormLayout>
  );
};

WarehouseEdit.Chilren2 = ({ guides }: { guides: string[] }) => {
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

export default WarehouseEdit;
