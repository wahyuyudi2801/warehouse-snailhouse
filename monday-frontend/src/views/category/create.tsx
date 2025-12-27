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
import { createCategory } from "@/api/category";

const CreateCategory = () => {
  const guides = [
    "Upload category image.",
    "Enter category name and category tagline.",
    "Click save button.",
    "Category successfully added.",
    "Check category list to verify.",
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
    const name = e.currentTarget.category_name.value;
    const tagline = e.currentTarget.tagline.value;
    const photo = e.currentTarget.photo.files
      ? e.currentTarget.photo.files[0]
      : null;

    const form = new FormData();
    form.append("name", name);
    form.append("tagline", tagline);

    if (photo) {
      form.append("photo", photo);
    }

    try {
      const result = await createCategory(form);

      if (result) {
        toast.success(`Category has been created`, {
          duration: 4000,
          position: "top-right",
        });

        // redirect
        navigate("/category");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setErrors({
          message: ["Something went wrong. Please try again."],
        });
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
      title="Quick guide to add new category"
      children2={<CreateCategory.Chilren2 guides={guides} />}
      back="/category"
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
                accept="image/jpeg,image/png,image/jpg"
                type="file"
              />
            </div>
          </div>
          {errors.photo && <ErrorInputValidation message={errors.photo[0]} />}
        </div>
        <div>
          <InputGroup>
            <InputGroupInput name="category_name" placeholder="Category name" />
            <InputGroupAddon>
              <ChartBarStacked />
            </InputGroupAddon>
          </InputGroup>
          {errors.name && <ErrorInputValidation message={errors.name[0]} />}
        </div>
        <div>
          <InputGroup>
            <InputGroupInput name="tagline" placeholder="Category tagline" />
            <InputGroupAddon>
              <Tags />
            </InputGroupAddon>
          </InputGroup>
          {errors.tagline && (
            <ErrorInputValidation message={errors.tagline[0]} />
          )}
        </div>
      </div>
    </FormLayout>
  );
};

CreateCategory.Chilren2 = ({ guides }: { guides: string[] }) => {
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

export default CreateCategory;
