"use client";
import SkeletonMaster from "@/components/skeleton-master";
import MasterDataLayout from "@/components/master-data-layout";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { EditIcon, ShoppingBasket } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router";
import type { CategoryType } from "@/types/category";
import SimpleCardFlex from "@/components/simple-card-flex";
import { getCategories } from "@/api/category";

export default function Category() {
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const result = await getCategories();
        
        setCategories(result);
      } catch (error) {
        console.log(error);
        setError("Error fetching data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <SkeletonMaster />;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <MasterDataLayout
      cardTitle={`${categories.length} Total Categories`}
      cardDescription="List of all categories"
      createUrl="/category/create"
    >
      <Table>
        <TableHeader className="bg-gray-100">
          <TableRow>
            <TableHead className="w-[5%]">No</TableHead>
            <TableHead className="w-[40%]">Category Information</TableHead>
            <TableHead className="w-[35%]">Product Quantity</TableHead>
            <TableHead className="w-[20%]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories.length ? (
            categories.map((value, idx) => (
              <TableRow key={idx}>
                <TableCell>{++idx}</TableCell>
                <TableCell>
                  <SimpleCardFlex photo={value.photo} name={value.name} text={value.tagline} />
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <ShoppingBasket />{" "}
                    <span className="font-bold">
                      {value.products.length} Products
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <Button
                    asChild
                    variant={"default"}
                  >
                    <Link to={`/category/${value.id}`} className="flex gap-1 items-center">
                      <EditIcon color="white" /> Edit
                    </Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={3} className="h-12 text-center bg-gray-50">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </MasterDataLayout>
  );
}
