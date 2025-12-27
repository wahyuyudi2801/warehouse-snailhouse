"use client";
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
import { ChartBarStacked, CheckCircle, LoaderCircleIcon, Tags } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useNavigate, useParams } from "react-router";
import axios from "axios";
import { getUserById, updateUser } from "@/api/user";
import { Skeleton } from "@/components/ui/skeleton";

export default function UserEdit() {
  const guides = [
    "Upload user photo.",
    "Enter user name and user tagline.",
    "Click save button.",
    "User successfully added.",
    "Check user list to verify.",
  ];

  const [preview, setPreview] = useState(
    "https://static.thenounproject.com/png/1077596-200.png"
  );
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string[] }>({});
  const [loadingPage, setLoadingPage] = useState(false);
  const [errorPage, setErrorPage] = useState("");
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoadingPage(true);

        const result = await getUserById(id);
        setUserName(result.name);
        setEmail(result.email);
        setPhone(result.phone);
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

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const photo = e.currentTarget.photo.files?.[0];

    const form = new FormData();
    form.append("_method", 'PUT');
    form.append("name", userName);
    form.append("email", email);
    form.append("phone", phone);

    if (photo) {
      form.append("photo", photo);
    }

    try {
      const result = await updateUser(form, id);

      if (result) {
        toast.success(`User has been updated`, {
          duration: 4000,
          position: "top-right",
        });

        // redirect
        navigate("/user-list");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 422) {
          setErrors(error.response?.data.errors);
        } else {
          setErrors({ message: ["Something went wrong. Please try again."] });
        }
      }
    } finally {
      setLoading(false);
    }
  };

  // Perbarui fungsi onChange (onPreview) Anda
  const onPreview = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;

    if (file) {
      setPreview(URL.createObjectURL(file)); // Untuk preview
    } else {
      setPreview("");
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

  if(errorPage) {
    return (
      <div className="text-lg font-bold text-red-500">{errorPage}</div>
    )
  }

  return (
    <FormLayout
      title="Quick guide to add new user"
      children2={<UserEdit.Chilren2 guides={guides} />}
      back="/user-list"
      onSubmit={onSubmit}
      loading={loading}
    >
      <div className="grid w-full gap-6">
        {errors.message && (
          <Alert message={errors.message[0]} type="error" hide={setErrors} />
        )}

        <div>
          <div className="flex justify-between items-center">
            <div className="border bg-gray-100 rounded-lg overflow-hidden">
              <img
                className="max-w-[120px] aspect-square object-cover"
                src={preview}
                alt="user photo"
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
                accept="image/jpeg,image/png,image/jpg"
                type="file"
              />
            </div>
          </div>
          {errors.photo && <ErrorInputValidation message={errors.photo[0]} />}
        </div>

        {/* Name */}
        <div>
          <InputGroup>
            <InputGroupInput
              name="user_name"
              placeholder="Name"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
            />
            <InputGroupAddon>
              <ChartBarStacked />
            </InputGroupAddon>
          </InputGroup>
          {errors.name && <ErrorInputValidation message={errors.name[0]} />}
        </div>

        {/* Email */}
        <div>
          <InputGroup>
            <InputGroupInput
              name="email"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <InputGroupAddon>
              <Tags />
            </InputGroupAddon>
          </InputGroup>
          {errors.email && <ErrorInputValidation message={errors.email[0]} />}
        </div>

        {/* Phone */}
        <div>
          <InputGroup>
            <InputGroupInput
              name="phone"
              type="tel"
              placeholder="Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            <InputGroupAddon>
              <Tags />
            </InputGroupAddon>
          </InputGroup>
          {errors.phone && <ErrorInputValidation message={errors.phone[0]} />}
        </div>
      </div>
    </FormLayout>
  );
}

UserEdit.Chilren2 = ({ guides }: { guides: string[] }) => {
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
