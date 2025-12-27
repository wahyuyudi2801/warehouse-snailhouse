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
import { ChartBarStacked, CheckCircle, Tags } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router";
import axios from "axios";
import { createUser } from "@/api/user";

export default function UserCreate() {
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
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string[] }>({});
  const navigate = useNavigate();

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const photo = e.currentTarget.photo.files?.[0];
    const name = e.currentTarget.user_name.value;
    const email = e.currentTarget.email.value;
    const phone = e.currentTarget.phone.value;
    const password = e.currentTarget.password.value;
    const password_confirmation = e.currentTarget.password_confirmation.value;

    const form = new FormData();
    form.append("name", name);
    form.append("email", email);
    form.append("phone", phone);
    form.append("password", password);
    form.append("password_confirmation", password_confirmation);

    if (photo) {
      form.append("photo", photo);
    }

    try {
      const result = await createUser(form);

      if (result) {
        toast.success(`User has been created`, {
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

  return (
    <FormLayout
      title="Quick guide to add new user"
      children2={<UserCreate.Chilren2 guides={guides} />}
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
            <InputGroupInput name="user_name" placeholder="Name" />
            <InputGroupAddon>
              <ChartBarStacked />
            </InputGroupAddon>
          </InputGroup>
          {errors.name && <ErrorInputValidation message={errors.name[0]} />}
        </div>

        {/* Email */}
        <div>
          <InputGroup>
            <InputGroupInput name="email" type="email" placeholder="Email" />
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
            />
            <InputGroupAddon>
              <Tags />
            </InputGroupAddon>
          </InputGroup>
          {errors.phone && <ErrorInputValidation message={errors.phone[0]} />}
        </div>

        {/* Password */}
        <div>
          <InputGroup>
            <InputGroupInput
              name="password"
              type="password"
              placeholder="Password"
            />
            <InputGroupAddon>
              <Tags />
            </InputGroupAddon>
          </InputGroup>
          {errors.password && (
            <ErrorInputValidation message={errors.password[0]} />
          )}
        </div>

        {/* Password confirm */}
        <div>
          <InputGroup>
            <InputGroupInput
              name="password_confirmation"
              type="password"
              placeholder="Password Confirmation"
            />
            <InputGroupAddon>
              <Tags />
            </InputGroupAddon>
          </InputGroup>
        </div>
      </div>
    </FormLayout>
  );
}

UserCreate.Chilren2 = ({ guides }: { guides: string[] }) => {
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
