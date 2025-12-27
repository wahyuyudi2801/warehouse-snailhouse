import { getCategories } from "@/api/category";
import { createProduct } from "@/api/product";
import Alert from "@/components/alert";
import ErrorInputValidation from "@/components/error-input-validation";
import FormLayout from "@/components/form-layout";
import SelectGroup from "@/components/select-group";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { CategoryType } from "@/types/category";
import type { SelectType } from "@/types/select-type";
import axios from "axios";
import {
  ChartBarStacked,
  CheckCircle,
  CreditCard,
  ShoppingBasket,
  StarIcon,
  TextIcon,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";

const CreateProduct = () => {
  const guides = [
    "Upload product image.",
    "Enter product name and product tagline.",
    "Click save button.",
    "Product successfully added.",
    "Check product list to verify.",
  ];
  const selectPopulars: SelectType[] = [
    {
      value: "1",
      text: "Popular",
    },
    {
      value: "2",
      text: "Not Popular",
    },
  ];
  const [selectCategories, setSelectCategories] = useState<SelectType[]>([]);
  const [preview, setPreview] = useState(
    "https://static.thenounproject.com/png/1077596-200.png"
  );
  const [categoryId, setCategoryId] = useState("");
  const [isPopular, setIsPopular] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const result: CategoryType[] = await getCategories();
      const categories: SelectType[] = [];

      result.map((value) => {
        categories.push({
          value: value.id.toString(),
          text: value.name,
        });
      });

      setSelectCategories(categories);
    };

    fetchData();
  }, []);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const name = e.currentTarget.product_name.value;
    const thumbnail = e.currentTarget.thumbnail.files?.[0];
    const about = e.currentTarget.about.value;
    const price = e.currentTarget.price.value;

    const formData = new FormData();
    formData.append("name", name);
    formData.append("thumbnail", thumbnail);
    formData.append("about", about);
    formData.append("price", price);
    formData.append("category_id", categoryId);
    formData.append("is_popular", isPopular);

    try {
      const response = await createProduct(formData);

      if (response) {
        toast.success("Product added successfully");
        navigate("/product");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log(error);
        setErrors(error.response?.data.errors);
      }
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
      title="Quick guide to add new product"
      children2={<CreateProduct.Chilren2 guides={guides} />}
      back="/product"
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
        {/* Thumbnail */}
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
                name="thumbnail"
                onChange={onPreview}
                className="hidden"
                type="file"
              />
            </div>
          </div>
          {errors.thumbnail && (
            <ErrorInputValidation message={errors.thumbnail[0]} />
          )}
        </div>

        {/* Popularity */}
        <div>
          <SelectGroup
            id="is_popular"
            icon={StarIcon}
            title="Select Popularity"
            contents={selectPopulars}
            onChange={setIsPopular}
          />
          {errors.is_popular && (
            <ErrorInputValidation message={errors.is_popular[0]} />
          )}
        </div>

        {/* Product Name */}
        <div>
          <Label htmlFor="product_name" className="text-sm mb-2">
            Name
          </Label>
          <InputGroup>
            <InputGroupInput
              id="product_name"
              name="product_name"
              placeholder="Product name"
            />
            <InputGroupAddon>
              <ShoppingBasket />
            </InputGroupAddon>
          </InputGroup>
          {errors.name && <ErrorInputValidation message={errors.name[0]} />}
        </div>

        {/* Price */}
        <div>
          <Label htmlFor="price" className="text-sm mb-2">
            Price
          </Label>
          <InputGroup>
            <InputGroupInput
              id="price"
              name="price"
              type="number"
              placeholder="Product price"
              min={0}
            />
            <InputGroupAddon>
              <CreditCard />
            </InputGroupAddon>
          </InputGroup>
          {errors.price && <ErrorInputValidation message={errors.price[0]} />}
        </div>

        {/* Category Id */}
        <div>
          <SelectGroup
            id="category_id"
            icon={ChartBarStacked}
            title="Select Product Category"
            contents={selectCategories}
            onChange={setCategoryId}
          />
          {errors.category_id && (
            <ErrorInputValidation message={errors.category_id[0]} />
          )}
        </div>

        {/* About */}
        <div>
          <Label htmlFor="about" className="text-sm mb-2">
            About
          </Label>
          <div className="flex w-full border rounded-md px-2 pl-3 transition-all focus-within:ring-3 focus-within:ring-gray-300 focus-within:border-gray-300">
            <TextIcon className="h-4 w-4 mt-2.5 text-gray-500" />
            <Textarea
              id="about"
              name="about"
              placeholder="Product about"
              className="flex-1 border-none outline-none focus-visible:ring-0 focus-visible:outline-none resize-none"
            />
          </div>
          {errors.about && <ErrorInputValidation message={errors.about[0]} />}
        </div>
      </div>
    </FormLayout>
  );
};

CreateProduct.Chilren2 = ({ guides }: { guides: string[] }) => {
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

export default CreateProduct;
