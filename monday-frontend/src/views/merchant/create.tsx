import { createMerchant } from "@/api/merchant";
import { getKeepers } from "@/api/user";
import Alert from "@/components/alert";
import ErrorInputValidation from "@/components/error-input-validation";
import FormLayout from "@/components/form-layout";
import SelectGroup from "@/components/select-group";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import type { SelectType } from "@/types/select-type";
import type { UserType } from "@/types/user";
import axiosError from "@/utils/axios-error";
import { Label } from "@radix-ui/react-label";
import axios from "axios";
import { CheckCircle, LoaderCircleIcon, MapPin, PhoneIcon, StoreIcon, UserCircle } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";

const MerchantCreate = () => {
  const guides = [
    "Upload merchant image.",
    "Enter merchant name and merchant tagline.",
    "Click save button.",
    "Merchant successfully added.",
    "Check merchant list to verify.",
  ];
  const [keepers, setKeepers] = useState<SelectType[]>([]);
  const [keeperId, setKeeperId] = useState<string>('');
  const [loadingPage, setLoadingPage] = useState(false)
  const [errorPage, setErrorPage] = useState("")
  const [errors, setErrors] = useState<{ [key: string]: string[] }>({});
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState("https://static.thenounproject.com/png/1077596-200.png");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoadingPage(true)
        const result = await getKeepers()

        const selects: SelectType[] = []
        result.map((value: UserType) => {
          selects.push({
            value: value.id.toString(),
            text: value.name + " (" + value.email + ")",
          })
        })

        setKeepers(selects)
      } catch (error) {
        if(axios.isAxiosError(error)) {
          setErrorPage(error.message)
        }
      } finally {
        setLoadingPage(false)
      }
    }

    fetchData()
  }, [])

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setLoading(true);
      const photo = e.currentTarget.photo.files?.[0];
      const name = e.currentTarget.merchant_name.value;
      const phone = e.currentTarget.phone.value;
      const address = e.currentTarget.address.value;

      const formData = new FormData();
      formData.append("photo", photo);
      formData.append("name", name);
      formData.append("keeper_id", keeperId);
      formData.append("phone", phone);
      formData.append("address", address);

      const result = await createMerchant(formData);

      if (result) {
        toast.success("Merchant successfully created", {
          position: "top-right",
        });
        navigate("/merchant");
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

  if (errorPage) {
    return <div className="text-red-500">{errorPage}</div>;
  }

  return (
    <FormLayout
      title="Quick guide to add new merchant"
      children2={<MerchantCreate.Chilren2 guides={guides} />}
      back="/merchant"
      onSubmit={onSubmit}
      loading={loading}
    >
      {errors.message && (
        <Alert
          type="error"
          message={errors.message[0]}
          hide={() => setErrors({})}
        />
      )}

      <div className="grid w-full gap-6">
        {/* Phone */}
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
                name="photo"
                onChange={onPreview}
                className="hidden"
                type="file"
                accept="image/png, image/jpeg, image/jpg"
              />
            </div>
          </div>
          {errors.photo && (
            <ErrorInputValidation message={errors.photo[0]} />
          )}
        </div>

        {/* Merchant Name */}
        <div>
          <Label htmlFor="merchant_name" className="text-sm mb-2">
            Name
          </Label>
          <InputGroup>
            <InputGroupInput
              id="merchant_name"
              name="merchant_name"
              placeholder="Merchant name"
            />
            <InputGroupAddon>
              <StoreIcon />
            </InputGroupAddon>
          </InputGroup>
          {errors.name && <ErrorInputValidation message={errors.name[0]} />}
        </div>

        {/* Keeper */}
        <div>
          <SelectGroup
          title="Select User"
          icon={UserCircle}
          id="keeper_id"
          contents={keepers}
          onChange={setKeeperId}
          value={keeperId}
          />
          {errors.keeper_id && <ErrorInputValidation message={errors.keeper_id[0]} />}
        </div>

        {/* Phone */}
        <div>
          <Label htmlFor="phone" className="text-sm mb-2">
            Phone
          </Label>
          <InputGroup>
            <InputGroupInput
              id="phone"
              name="phone"
              type="tel"
              placeholder="Merchant phone"
              min={0}
            />
            <InputGroupAddon>
              <PhoneIcon />
            </InputGroupAddon>
          </InputGroup>
          {errors.phone && <ErrorInputValidation message={errors.phone[0]} />}
        </div>

        {/* Address */}
        <div>
          <Label htmlFor="address" className="text-sm mb-2">
            Address
          </Label>
          <div className="flex w-full border rounded-md px-2 pl-3 transition-all focus-within:ring-3 focus-within:ring-gray-300 focus-within:border-gray-300">
            <MapPin className="h-4 w-4 mt-2.5 text-gray-500" />
            <Textarea
              id="address"
              name="address"
              placeholder="Merchant address"
              className="flex-1 border-none outline-none focus-visible:ring-0 focus-visible:outline-none resize-none"
            />
          </div>
          {errors.address && <ErrorInputValidation message={errors.address[0]} />}
        </div>
      </div>
    </FormLayout>
  );
};

MerchantCreate.Chilren2 = ({ guides }: { guides: string[] }) => {
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

export default MerchantCreate;
