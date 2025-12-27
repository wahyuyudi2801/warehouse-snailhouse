import { useEffect, useState } from "react";
import CardList1 from "./CardList1";
import CardList2 from "./CardList2";
import type { TransactionType } from "@/types/transaction";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { getAllTransaction, getTransactionByMerchant } from "@/api/transaction";
import axios from "axios";
import { Skeleton } from "@/components/ui/skeleton";

export default function Overview() {
  const [transactions, setTransactions] = useState<TransactionType[]>([]);
  const [totalRevenue, setTotalRevenue] = useState<number>(0);
  const [totalTransaction, setTotalTransaction] = useState<number>(0);
  const [productsSold, setProductsSold] = useState<number>(0);
  const [loadingPage, setLoadingPage] = useState(false);
  const [errorPage, setErrorPage] = useState("");
  const { user } = useAuth();

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoadingPage(true);
        let result: TransactionType[] = []
        if (user?.role == "keeper") {
          const merchantId = user?.merchant.id ?? 0;

          if (merchantId == 0) {
            toast.error("Merchant not found", {
              position: "top-right",
            });

            return false;
          }

          result = await getTransactionByMerchant(merchantId);
        } else if (user?.role == "manager") {
          result = await getAllTransaction();
        }

        const subTotal = result.reduce((a, b) => a + b.sub_total, 0);
        const sold = result
          .flatMap((r) => r.transaction_products ?? [])
          .reduce((sum, p) => sum + p.quantity, 0);

        setTotalRevenue(subTotal);
        setTotalTransaction(result.length);
        setProductsSold(sold);
        setTransactions(result);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          setErrorPage(error.message);
        }
      } finally {
        setLoadingPage(false);
      }
    };

    fetch();
  }, [user]);

  if (loadingPage) {
    return (
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0 text-slate-900">
        <div className="grid auto-rows-min gap-4 md:grid-cols-3">
          <Skeleton className="h-[200px] rounded-xl" />
          <Skeleton className="h-[200px] rounded-xl" />
          <Skeleton className="h-[200px] rounded-xl" />
        </div>
        <div className="grid auto-rows-min gap-6 md:grid-cols-4 items-start">
          <Skeleton className="h-[200px] rounded-xl" />
          <Skeleton className="h-[200px] rounded-xl col-span-3" />
        </div>
      </div>
    );
  }

  if (errorPage !== "") {
    return (
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0 text-slate-900">
        <h1>{errorPage}</h1>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0 text-slate-900 relative">
      <CardList1
        totalRevenue={totalRevenue}
        totalTransaction={totalTransaction}
        productsSold={productsSold}
      />
      <CardList2 transactions={transactions} />
    </div>
  );
}
