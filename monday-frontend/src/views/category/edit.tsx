import { updateCategory } from "@/api/category";
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
import { sanctumRequest } from "@/services/sanctumRequest";
import axiosError from "@/utils/axios-error";
import {
  ChartBarStacked,
  CheckCircle,
  LoaderCircleIcon,
  Tags,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { toast } from "sonner";

const EditCategory = () => {
  const { id } = useParams();
  const guides = [
    "Upload category image.",
    "Enter category name and category tagline.",
    "Click save button.",
    "Category successfully edited.",
    "Check category list to verify.",
  ];
  const [preview, setPreview] = useState(
    "https://static.thenounproject.com/png/1077596-200.png"
  );
  const [name, setName] = useState("");
  const [tagline, setTagline] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingPage, setLoadingPage] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string[] }>({});
  const navigate = useNavigate();

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const photo = e.currentTarget.photo.files
      ? e.currentTarget.photo.files[0]
      : null;

    try {
      setLoading(true);
      const form = new FormData();
      form.append("_method", "PUT");
      form.append("name", name);
      form.append("tagline", tagline);

      if (photo) {
        form.append("photo", photo);
      }
      
      const result = await updateCategory(form, id)

      if (result) {
        toast.success(`Category has been updated`, {
          duration: 4000,
          position: "top-right",
        });

        // redirect
        navigate("/category");
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

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        setLoadingPage(true);
        const response = await sanctumRequest("GET", `/category/${id}`);

        setName(response.data.name);
        setTagline(response.data.tagline);
        setPreview(response.data.photo);
      } catch (error) {
        setErrors(axiosError(error));
      } finally {
        setLoadingPage(false);
      }
    };

    fetchCategory();
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

  return (
    <FormLayout
      title="Quick guide to edit category"
      children2={<EditCategory.Chilren2 guides={guides} />}
      back="/category"
      onSubmit={onSubmit}
      loading={loading}
    >
      {errors?.message && (
        <Alert type="error" message={errors.message[0]} hide={setErrors} />
      )}

      <div className="grid w-full gap-6">
        <div>
          <div className="flex justify-between items-center">
            <div className="border bg-gray-100 rounded-lg overflow-hidden">
              <img
                className="max-w-[120px] aspect-square object-cover"
                src={preview}
                alt="preview"
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
              />
            </div>
          </div>
          {errors?.photo && <ErrorInputValidation message={errors.photo[0]} />}
        </div>
        <div>
          <Label htmlFor="category_name" className="mb-2">
            Name
          </Label>
          <InputGroup>
            <InputGroupInput
              id="category_name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Category name"
            />
            <InputGroupAddon>
              <ChartBarStacked />
            </InputGroupAddon>
          </InputGroup>
          {errors?.name && <ErrorInputValidation message={errors.name[0]} />}
        </div>
        <div>
          <Label htmlFor="tagline" className="mb-2">
            Tagline
          </Label>
          <InputGroup>
            <InputGroupInput
              id="tagline"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              placeholder="Category tagline"
            />
            <InputGroupAddon>
              <Tags />
            </InputGroupAddon>
          </InputGroup>
          {errors?.tagline && (
            <ErrorInputValidation message={errors.tagline[0]} />
          )}
        </div>
      </div>
    </FormLayout>
  );
};

EditCategory.Chilren2 = ({ guides }: { guides: string[] }) => {
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

export default EditCategory;
