import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatRupiah } from "@/utils/format";
import { CircleDollarSign, NotebookText, ShoppingBag } from "lucide-react";

const CardList1 = ({
  totalRevenue,
  totalTransaction,
  productsSold,
}: {
  totalRevenue: number;
  totalTransaction: number;
  productsSold: number;
}) => {
  return (
    <div className="grid auto-rows-min gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader>
          <CardTitle>
            <div className="bg-gray-500/15 rounded-full inline-block p-3">
              <CircleDollarSign
                width={20}
                height={20}
                className="text-blue-800"
              />
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <h2 className="text-2xl font-bold">{formatRupiah(totalRevenue)}</h2>
          <p className="text-base font-semibold text-slate-900/55">
            Total Revenue
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>
            <div className="bg-gray-500/15 rounded-full inline-block p-3">
              <NotebookText width={20} height={20} className="text-blue-800" />
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <h2 className="text-2xl font-bold">{totalTransaction}</h2>
          <p className="text-base font-semibold text-slate-900/55">
            Total Transactions
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>
            <div className="bg-gray-500/15 rounded-full inline-block p-3">
              <ShoppingBag width={20} height={20} className="text-blue-800" />
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <h2 className="text-2xl font-bold">{productsSold}</h2>
          <p className="text-base font-semibold text-slate-900/55">
            Products Sold
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default CardList1;
