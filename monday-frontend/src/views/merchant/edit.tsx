import {
  getMerchantById,
  updateMerchant,
} from "@/api/merchant";
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
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import type { MerchantType } from "@/types/merchant";
import axiosError from "@/utils/axios-error";
import { Label } from "@radix-ui/react-label";
import axios from "axios";
import {
  CheckCircle,
  LoaderCircleIcon,
  MapPin,
  PhoneIcon,
  StoreIcon,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { toast } from "sonner";

const MerchantEdit = () => {
  const guides = [
    "Upload merchant image.",
    "Enter merchant name and merchant tagline.",
    "Click save button.",
    "Merchant successfully added.",
    "Check merchant list to verify.",
  ];
  const [errors, setErrors] = useState<{ [key: string]: string[] }>({});
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(
    "https://static.thenounproject.com/png/1077596-200.png"
  );
  const navigate = useNavigate();
  const [loadingPage, setLoadingPage] = useState(false);
  const [errorPage, setErrorPage] = useState("");
  const [merchantName, setMerchantName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const { id } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoadingPage(true);

        const result: MerchantType = await getMerchantById(id);
        setMerchantName(result.name);
        setPhone(result.phone);
        setAddress(result.address);
        setPreview(result.photo);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          setErrorPage(error.message);
        }
      } finally {
        setLoadingPage(false);
      }
    };

    fetchData();
  }, [id]);

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

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setLoading(true);
      const photo = e.currentTarget.photo.files?.[0];

      const formData = new FormData();
      formData.append("_method", "PUT");
      formData.append("name", merchantName);
      formData.append("phone", phone);
      formData.append("address", address);
      if (photo) {
        formData.append("photo", photo);
      }

      const result = await updateMerchant(formData, id);

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

  return (
    <FormLayout
      title="Quick guide to add new merchant"
      children2={<MerchantEdit.Chilren2 guides={guides} />}
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
          {errors.photo && <ErrorInputValidation message={errors.photo[0]} />}
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
              value={merchantName}
              onChange={(e) => setMerchantName(e.target.value)}
            />
            <InputGroupAddon>
              <StoreIcon />
            </InputGroupAddon>
          </InputGroup>
          {errors.name && <ErrorInputValidation message={errors.name[0]} />}
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
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
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
              value={address}
              onChange={(e) => setAddress(e.target.value)}
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

MerchantEdit.Chilren2 = ({ guides }: { guides: string[] }) => {
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

export default MerchantEdit;
