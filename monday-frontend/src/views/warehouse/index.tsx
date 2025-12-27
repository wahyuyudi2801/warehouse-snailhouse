import { getWarehouses } from "@/api/warehouse";
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
import type { WarehouseType } from "@/types/warehouse";
import { EditIcon, EyeIcon, ShoppingBasket } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router";

export default function Warehouse() {
  const [warehouses, setWarehouses] = useState<WarehouseType[]>([]);
  const [error, setError] = useState<string | undefined>();
  const [loadingPage, setLoadingPage] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoadingPage(true);
        const result = await getWarehouses();
        setWarehouses(result);
      } catch (error) {
        console.log(error);
        setError("Fetching data error");
      } finally {
        setLoadingPage(false);
      }
    };

    fetchData();
  }, []);

  if (loadingPage) {
    return <SkeletonMaster />;
  }

  if (error) {
    return <div className="text-lg font-bold text-red-500">{error}</div>;
  }

  return (
    <MasterDataLayout
      cardTitle={`${warehouses.length} Total Warehouse`}
      cardDescription="List of all warehouses"
      createUrl="/warehouse/create"
    >
      <Table>
        <TableHeader className="bg-gray-100">
          <TableRow>
            <TableHead>Warehouse Information</TableHead>
            <TableHead>Address</TableHead>
            <TableHead>Product Quantity</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {warehouses.length ? (
            warehouses.map((warehouse, idx) => (
              <TableRow key={idx}>
                <TableCell>
                  <SimpleCardFlex
                    name={warehouse.name}
                    photo={warehouse.photo}
                    text={warehouse.phone}
                  />
                </TableCell>
                <TableCell>
                  <p className="text-wrap">{warehouse.address}</p>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1 flex-wrap">
                    <div>
                      <ShoppingBasket />
                    </div>
                    <div className="font-bold">
                      {warehouse.products.length} Products
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2 flex-wrap">
                    <Button
                      asChild
                      variant={"outline"}
                      className="flex gap-1 items-center cursor-pointer"
                    >
                      <Link to={'/warehouse-product/' + warehouse.id}><EyeIcon /> Details</Link>
                    </Button>
                    <Button
                      asChild
                      variant={"default"}
                      className="flex gap-1 items-center cursor-pointer"
                    >
                      <Link to={'/warehouse/' + warehouse.id}><EditIcon color="white" /> Edit</Link>
                    </Button>
                  </div>
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
