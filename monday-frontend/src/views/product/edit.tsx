import { getCategories } from "@/api/category";
import { getProductById, updateProduct } from "@/api/product";
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
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import type { CategoryType } from "@/types/category";
import type { ProductType } from "@/types/product";
import type { SelectType } from "@/types/select-type";
import axiosError from "@/utils/axios-error";
import {
  ChartBarStacked,
  CheckCircle,
  CreditCard,
  LoaderCircleIcon,
  ShoppingBasket,
  StarIcon,
  TextIcon,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { toast } from "sonner";

const EditProduct = () => {
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

  const [loadingPage, setLoadingPage] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();
  const { id } = useParams();

  const [preview, setPreview] = useState(
    "https://static.thenounproject.com/png/1077596-200.png"
  );
  const [isPopular, setIsPopular] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [productName, setProductName] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [productAbout, setProductAbout] = useState("");

  // functions
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setLoading(true);
      const formData = new FormData();
      const thumbnail = e.currentTarget.thumbnail.files?.[0];
      if (thumbnail) {
        formData.append("thumbnail", thumbnail);
      }
      formData.append("_method", "PUT");
      formData.append("name", productName);
      formData.append("price", productPrice.toString());
      formData.append("is_popular", isPopular);
      formData.append("category_id", categoryId);
      formData.append("about", productAbout);

      const response = await updateProduct(formData, id);

      if (response) {
        toast.success("Product successfully updated", {
          position: "top-right",
        });
        navigate("/product");
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
    const fetchData = async () => {
      try {
        setLoadingPage(true);
        const resultCategory: CategoryType[] = await getCategories();
        const categories: SelectType[] = [];

        resultCategory.map((value) => {
          categories.push({
            value: value.id.toString(),
            text: value.name,
          });
        });

        setSelectCategories(categories);

        const resultProduct: ProductType = await getProductById(id);
        setPreview(resultProduct.thumbnail);
        setProductName(resultProduct.name);
        setProductPrice(resultProduct.price.toString());
        setProductAbout(resultProduct.about);
        setIsPopular(resultProduct.is_popular.toString());
        setCategoryId(resultProduct.category_id.toString());
      } catch (error) {
        console.log(error);
        setError("Error fetching data");
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

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <FormLayout
      title="Quick guide to edit product"
      children2={<EditProduct.Chilren2 guides={guides} />}
      back="/product"
      onSubmit={onSubmit}
      loading={loading}
    >
      {errors.message && (
        <Alert
          type="error"
          message={errors.message[0]}
          hide={() => setErrors}
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
                alt="edit product image"
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
            value={isPopular}
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
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
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
              value={productPrice}
              onChange={(e) => setProductPrice(e.target.value)}
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
            value={categoryId}
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
              value={productAbout}
              onChange={(e) => setProductAbout(e.target.value)}
              className="flex-1 border-none outline-none focus-visible:ring-0 focus-visible:outline-none resize-none"
            />
          </div>
          {errors.about && <ErrorInputValidation message={errors.about[0]} />}
        </div>
      </div>
    </FormLayout>
  );
};

EditProduct.Chilren2 = ({ guides }: { guides: string[] }) => {
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

export default EditProduct;
