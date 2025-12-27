import { createWarehouse } from "@/api/warehouse";
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
import { Textarea } from "@/components/ui/textarea";
import axiosError from "@/utils/axios-error";
import {
  CheckCircle,
  CreditCard,
  ShoppingBasket,
  TextIcon,
} from "lucide-react";
import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";

const WarehouseCreate = () => {
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
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string[] }>({});
  const navigate = useNavigate();

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setLoading(true);
      const photo = e.currentTarget.image.files?.[0];
      const name = e.currentTarget.warehouse_name.value;
      const phone = e.currentTarget.warehouse_phone.value;
      const address = e.currentTarget.warehouse_address.value;

      const formData = new FormData();
      formData.append("photo", photo);
      formData.append("name", name);
      formData.append("phone", phone);
      formData.append("address", address);

      const result = await createWarehouse(formData)

      if (result) {
        toast.success("Warehouse successfully created", {
          position: 'top-right'
        });
        navigate("/warehouse");
      }
    } catch (error) {
      setErrors(axiosError(error));
    } finally {
      setLoading(false)
    }
  };

  const onPreview = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  return (
    <FormLayout
      title="Quick guide to add new warehouse"
      children2={<WarehouseCreate.Chilren2 guides={guides} />}
      back="/warehouse"
      onSubmit={onSubmit}
      loading={loading}
    >
      {errors.message && (
        <Alert type="error" message={errors.message[0] ?? errors.message} hide={setErrors} />
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
          <Label htmlFor="warehouse_name" className="mb-2 text-sm">Name</Label>
          <InputGroup>
            <InputGroupInput name="warehouse_name" id="warehouse_name" placeholder="Enter Name" />
            <InputGroupAddon>
              <ShoppingBasket />
            </InputGroupAddon>
          </InputGroup>
          {errors.name && <ErrorInputValidation message={errors.name[0]} />}
        </div>
        <div>
          <Label htmlFor="warehouse_phone" className="mb-2 text-sm">Phone</Label>
          <InputGroup>
            <InputGroupInput name="warehouse_phone" id="warehouse_phone" type="tel" placeholder="Enter Phone" />
            <InputGroupAddon>
              <CreditCard />
            </InputGroupAddon>
          </InputGroup>
          {errors.phone && <ErrorInputValidation message={errors.phone[0]} />}
        </div>
        <div>
          <Label htmlFor="warehouse_address" className="mb-2 text-sm">Address</Label>
          <div className="flex w-full border rounded-md px-2 pl-3 transition-all focus-within:ring-3 focus-within:ring-gray-300 focus-within:border-gray-300">
            <TextIcon className="h-4 w-4 mt-2.5 text-gray-500" />
            <Textarea
              name="warehouse_address"
              id="warehouse_address"
              placeholder="Enter Address"
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

WarehouseCreate.Chilren2 = ({ guides }: { guides: string[] }) => {
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

export default WarehouseCreate;
