import { getMerchant } from "@/api/merchant";
import MasterDataLayout from "@/components/master-data-layout";
import SimpleCardFlex from "@/components/simple-card-flex";
import SkeletonMaster from "@/components/skeleton-master";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { MerchantType } from "@/types/merchant";
import axios from "axios";
import { EditIcon, EyeIcon, ShoppingBasket } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router";

export default function Warehouse() {
  const [merchants, setMerchants] = useState<MerchantType[]>([]);
  const [loadingPage, setLoadingPage] = useState(false);
  const [errorPage, setErrorPage] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoadingPage(true);
        const result = await getMerchant();

        setMerchants(result);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          setErrorPage(error.message);
        }
      } finally {
        setLoadingPage(false);
      }
    };

    fetchData();
  }, []);

  if (loadingPage) {
    return <SkeletonMaster />;
  }

  if (errorPage) {
    return <div className="text-lg font-bold text-red-500">{errorPage}</div>;
  }

  return (
    <>
      <MasterDataLayout
        cardTitle={`${merchants.length} Total Merhcants`}
        cardDescription="List of all merchants"
        createUrl="/merchant/create"
      >
        <Table>
          <TableHeader className="bg-gray-100">
            <TableRow>
              <TableHead className="w-[40%]">Mechant Information</TableHead>
              <TableHead className="w-[40%]">Product Quantity</TableHead>
              <TableHead className="w-[20%]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {merchants.length ? (
              merchants.map((merchant, idx) => (
                <TableRow key={idx}>
                  <TableCell>
                    <SimpleCardFlex
                      name={merchant.name}
                      photo={merchant.photo}
                      text={merchant.phone}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <ShoppingBasket />{" "}
                      <span className="font-bold">
                        {merchant.products.length} Products
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        asChild
                        variant={"outline"}
                        className="flex gap-1 items-center cursor-pointer"
                      >
                        <Link
                          to={`/merchant-product/${merchant.id}`}
                          className="flex gap-1 items-center cursor-pointer"
                        >
                          <EyeIcon /> Details
                        </Link>
                      </Button>
                      <Button asChild variant={"default"}>
                        <Link
                          to={`/merchant/${merchant.id}`}
                          className="flex gap-1 items-center cursor-pointer"
                        >
                          <EditIcon color="white" /> Edit
                        </Link>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} className="text-center">
                  No data found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </MasterDataLayout>
    </>
  );
}
