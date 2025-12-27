import SimpleCardFlex from "@/components/simple-card-flex";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";
import {
  BadgeDollarSign,
  Banknote,
  Box,
  CircleStar,
  Minus,
  Percent,
  Phone,
  Plus,
  PlusSquare,
  ShoppingBag,
  ShoppingCart,
  Trash2,
  User,
} from "lucide-react";
import CardTransaction from "./components/CardTransaction";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@/components/ui/table";
import { getMerchantByUserId } from "@/api/merchant";
import type { MerchantType } from "@/types/merchant";
import SkeletonMaster from "@/components/skeleton-master";
import { formatRupiah } from "@/utils/format";
import axios from "axios";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import type {
  CreateTransactionDetailType,
  CreateTransactionType,
} from "@/types/transaction";
import { newTransaction } from "@/api/transaction";
import ErrorInputValidation from "@/components/error-input-validation";
import { Badge } from "@/components/ui/badge";

export default function Transaction() {
  const { user } = useAuth();
  const defaultData = {
    name: "",
    phone: "",
    qty_total: 0,
    sub_total: 0,
    tax_total: 0,
    grand_total: 0,
    merchant_id: 0,
    transaction_products: [],
  };
  const [openDialog, setOpenDialog] = useState(false);
  const [openDialogAlert, setOpenDialogAlert] = useState(false);
  const [merchant, setMerchant] = useState<MerchantType>({
    id: 0,
    name: "",
    address: "",
    photo: "",
    phone: "",
    keeper_id: 0,
    keeper: null,
    products: [],
  });
  const [loadingPage, setLoadingPage] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorPage, setErrorPage] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string[] }>({});
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [transactions, setTransactions] =
    useState<CreateTransactionType>(defaultData);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoadingPage(true);
        const result = await getMerchantByUserId();

        setMerchant(result);
      } catch (error) {
        console.log(error);
        setErrorPage("Error fetching data");
      } finally {
        setLoadingPage(false);
      }
    };

    fetchData();
  }, [user]);

  const onSubmit = async () => {
    try {
      setLoading(true);
      setTransactions((prev) => {
        return {
          ...prev,
          merchant_id: merchant.id,
          name: customerName,
          phone: customerPhone,
        };
      });

      const result = await newTransaction(transactions);

      if (result) {
        toast.success("New transaction successfuly created", {
          position: "top-right",
          style: {
            background: "oklch(79.2% 0.209 151.711)",
          },
        });

        reset();
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setErrors(error.response?.data);
      }
    } finally {
      setLoading(false);
    }
  };

  const getQty = (id: number) => {
    return transactions.transaction_products.find((i) => i.product_id === id)
      ?.quantity;
  };

  const removeItem = (id: number) => {
    setTransactions((prev) => {
      const filterByProductId = prev.transaction_products.filter(
        (item) => item.product_id !== id
      );

      const subTotal = filterByProductId.reduce((a, b) => a + b.sub_total, 0);
      const taxTotal = subTotal * 0.1;

      return {
        ...prev,
        qty_total: filterByProductId.length,
        sub_total: subTotal,
        tax_total: taxTotal,
        grand_total: subTotal + taxTotal,
        transaction_products: filterByProductId,
      };
    });
  };

  const reset = () => {
    setCustomerName("");
    setCustomerPhone("");
    setTransactions(defaultData);
  };

  const validated = () => {
    if (
      customerName === "" ||
      customerPhone === "" ||
      transactions.name === "" ||
      transactions.phone === ""
    ) {
      alert("Lengkapi data informasi customer");
      return false;
    } else if (transactions.transaction_products.length <= 0) {
      alert("Belum ada item di assign");
      return false;
    } else {
      return true;
    }
  };

  const addItem = (
    id: number,
    name: string,
    price: number,
    photo: string,
    category: string,
    quantity: number
  ) => {
    setTransactions((prevTransaction) => {
      const existingTransactionDetail =
        prevTransaction.transaction_products.findIndex(
          (value) => value.product_id === id
        );

      if (existingTransactionDetail > -1) {
        const newTransactionDetail = [...prevTransaction.transaction_products];
        const newQuantity =
          prevTransaction.transaction_products[existingTransactionDetail]
            .quantity + quantity;

        const updatedTransactionDetail = {
          ...prevTransaction.transaction_products[existingTransactionDetail],
          quantity: newQuantity,
          sub_total: price * newQuantity,
        };

        newTransactionDetail[existingTransactionDetail] =
          updatedTransactionDetail;
        const qtytotal = newTransactionDetail.reduce(
          (a, b) => a + b.quantity,
          0
        );
        const subtotal = newTransactionDetail.reduce(
          (a, b) => a + b.sub_total,
          0
        );
        const taxtotal = subtotal * 0.1;
        const transactionData = {
          name: customerName,
          phone: customerPhone,
          merchant_id: merchant?.id,
          qty_total: qtytotal,
          sub_total: subtotal,
          tax_total: taxtotal,
          grand_total: subtotal + taxtotal,
        };

        if (updatedTransactionDetail.quantity < 1) {
          return {
            ...transactionData,
            transaction_products: newTransactionDetail.filter(
              (item) => item.product_id !== id
            ),
          };
        }

        return {
          ...transactionData,
          transaction_products: newTransactionDetail,
        };
      } else if (quantity > 0) {
        const newTransactionDetail: CreateTransactionDetailType = {
          product_id: id,
          name,
          category,
          photo,
          price,
          quantity: quantity,
          sub_total: price * quantity,
        };
        const updatedTransactionDetail = [
          ...prevTransaction.transaction_products,
          newTransactionDetail,
        ];
        const qtytotal = updatedTransactionDetail.reduce(
          (a, b) => a + b.quantity,
          0
        );
        const subTotal = updatedTransactionDetail.reduce(
          (a, b) => a + b.sub_total,
          0
        );
        const taxTotal = subTotal * 0.1;

        return {
          name: customerName,
          phone: customerPhone,
          merchant_id: merchant.id,
          qty_total: qtytotal,
          sub_total: subTotal,
          tax_total: taxTotal,
          grand_total: subTotal + taxTotal,
          transaction_products: updatedTransactionDetail,
        };
      }

      return prevTransaction;
    });
  };

  if (loadingPage) {
    return <SkeletonMaster />;
  }

  if (errorPage) {
    return <div className="text-lg font-bold text-red-500">{errorPage}</div>;
  }
  return (
    <>
      {/* Alert Dialog */}
      <AlertDialog open={openDialogAlert} onOpenChange={setOpenDialogAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Do you want to checkout?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will finalize your transaction.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={onSubmit}>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Products</DialogTitle>
            <DialogDescription>
              Assign products to this transaction
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-2">
            {merchant && merchant.products.length > 0 ? (
              merchant.products.map((product) => (
                <div
                  className="border rounded-xl px-4 py-2 flex justify-between items-center"
                  key={product.id + "-product"}
                >
                  <div>
                    <SimpleCardFlex
                      photo={product.thumbnail}
                      name={product.name}
                      text={formatRupiah(product.price)}
                    />
                  </div>
                  {product.pivot?.stock && product.pivot.stock > 0 ? (
                    <div className="flex justify-center items-center gap-2">
                      <Button
                        onClick={() =>
                          addItem(
                            product.id,
                            product.name,
                            product.price,
                            product.thumbnail,
                            product.category.name,
                            -1
                          )
                        }
                        size={"icon-sm"}
                        className="bg-red-500 cursor-pointer rounded-full hover:bg-red-500/90"
                      >
                        {" "}
                        <Minus color="white" />{" "}
                      </Button>
                      <Button
                        size={"icon-sm"}
                        variant={"outline"}
                        className="cursor-pointer rounded-full"
                        disabled
                      >
                        {getQty(product.id) || 0}
                      </Button>
                      <Button
                        onClick={() =>
                          addItem(
                            product.id,
                            product.name,
                            product.price,
                            product.thumbnail,
                            product.category.name,
                            1
                          )
                        }
                        size={"icon-sm"}
                        className="bg-green-500 cursor-pointer rounded-full hover:bg-green-500/90"
                      >
                        {" "}
                        <Plus color="white" />{" "}
                      </Button>
                    </div>
                  ) : (
                    <Badge variant="secondary">Sold Out</Badge>
                  )}
                </div>
              ))
            ) : (
              <div>no data</div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <div className="grid gap-4 relative lg:grid-cols-5">
        <div className="lg:col-span-3 flex flex-col gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Customer Informations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <Label htmlFor="customer_name" className="mb-2">
                  Customer Name
                </Label>
                <InputGroup>
                  <InputGroupInput
                    name="customer_name"
                    placeholder="Enter customer name"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                  />
                  <InputGroupAddon>
                    <User />
                  </InputGroupAddon>
                </InputGroup>
                {errors.name && (
                  <ErrorInputValidation message={errors.name[0]} />
                )}
              </div>
              <div>
                <Label htmlFor="phone_number" className="mb-2">
                  Phone Number
                </Label>
                <InputGroup>
                  <InputGroupInput
                    name="phone_number"
                    placeholder="Enter phone number"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                  />
                  <InputGroupAddon>
                    <Phone />
                  </InputGroupAddon>
                </InputGroup>
                {errors.phone && (
                  <ErrorInputValidation message={errors.phone[0]} />
                )}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>
                <div className="flex justify-between items-center">
                  <div>
                    {transactions.transaction_products.length} Total Items
                  </div>
                  <div>
                    <Button
                      onClick={() => setOpenDialog(true)}
                      variant="outline"
                      className="cursor-pointer"
                    >
                      <PlusSquare />
                      <span>Assign Product</span>
                    </Button>
                  </div>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              {errors.transaction_products && (
                <ErrorInputValidation
                  message={errors.transaction_products[0]}
                />
              )}

              {transactions.transaction_products.length ? (
                transactions.transaction_products.map((item, idx) => (
                  <div key={idx} className="border rounded-xl">
                    <div className="w-fullrounded-xl p-4 flex justify-between items-center border-b">
                      <SimpleCardFlex
                        name={item.name}
                        photo={item.photo}
                        text={formatRupiah(item.price) + " x " + item.quantity}
                      />
                      <div className="flex items-center gap-1">
                        <CircleStar />
                        <span>{item.category}</span>
                      </div>
                      <div>
                        <Button
                          onClick={() => removeItem(item.product_id)}
                          variant="destructive"
                          className="cursor-pointer"
                        >
                          <Trash2 color="white" />
                        </Button>
                      </div>
                    </div>
                    <CardTransaction
                      Icon={Banknote}
                      title="Subtotal"
                      text={formatRupiah(item.price * item.quantity)}
                    />
                  </div>
                ))
              ) : (
                <div className="p-4 text-center">No items yet</div>
              )}
            </CardContent>
          </Card>
        </div>
        <div className="lg:col-span-2 relative flex flex-col gap-4">
          {merchant.id != 0 ? (
            <Card>
              <CardContent>
                <SimpleCardFlex
                  name={merchant.name}
                  photo={merchant.photo}
                  text={merchant.phone}
                />
              </CardContent>
            </Card>
          ) : (
            ""
          )}
          <Card className="sticky top-4 w-full">
            <CardHeader>
              <CardTitle>Payment Informations</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableBody className="border">
                  <TableRow className="border-none">
                    <TableHead className="p-3">
                      <div className="flex items-center gap-1 opacity-55">
                        <ShoppingCart />
                        <span>Total Item</span>
                      </div>
                    </TableHead>
                    <TableCell>
                      {transactions.transaction_products.length}
                    </TableCell>
                  </TableRow>
                  <TableRow className="border-none">
                    <TableHead className="p-3">
                      <div className="flex items-center gap-1 opacity-55">
                        <Box /> <span>Total Quantity</span>
                      </div>
                    </TableHead>
                    <TableCell>{transactions.qty_total}</TableCell>
                  </TableRow>
                  <TableRow className="border-none">
                    <TableHead className="p-3">
                      <div className="flex items-center gap-1 opacity-55">
                        <Banknote />
                        <span>Subtotal</span>
                      </div>
                    </TableHead>
                    <TableCell>
                      {formatRupiah(transactions.sub_total)}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableHead className="p-3">
                      <div className="flex items-center gap-1 opacity-55">
                        <Percent />
                        <span>PPN 10%</span>
                      </div>
                    </TableHead>
                    <TableCell>
                      {formatRupiah(transactions.tax_total)}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableHead className="p-3">
                      <div className="flex items-center gap-1 opacity-55">
                        <BadgeDollarSign /> <span>Grand Total</span>
                      </div>
                    </TableHead>
                    <TableCell>
                      {formatRupiah(transactions.grand_total)}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              <div className="flex flex-col gap-2 mt-4">
                <Button
                  variant={"destructive"}
                  onClick={reset}
                  className="cursor-pointer"
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    if (validated()) {
                      setOpenDialogAlert(true);
                    }
                  }}
                  className="bg-blue-500 cursor-pointer hover:bg-blue-500/90"
                  disabled={loading}
                >
                  <ShoppingBag color="white" />
                  Checkout
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
