import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter, Route, Routes } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Overview from "./views/overview";
import Product from "./views/product";
import Category from "./views/category/Index";
import Warehouse from "./views/warehouse";
import Merchant from "./views/merchant";
import Role from "./views/role";
import UserList from "./views/manage-user/user-list";
import AssignRole from "./views/manage-user/assign-role";
import Setting from "./views/setting";
import { NotFound404 } from "./views/404";
import EditCategory from "./views/category/edit";
import CreateCategory from "./views/category/create";
import CreateProduct from "./views/product/create";
import EditProduct from "./views/product/edit";
import Login from "./views/auth/login";
import { AuthProvider } from "./context/AuthContext";
import PublicRoute from "./routes/PublicRoute";
import Layout from "./components/layout";
import { Toaster } from "./components/ui/sonner";
import WarehouseEdit from "./views/warehouse/edit";
import WarehouseProduct from "./views/warehouse-product";
import WarehouseProductAssign from "./views/warehouse-product/assign-product";
import WarehouseProductEdit from "./views/warehouse-product/edit";
import MerchantCreate from "./views/merchant/create";
import MerchantEdit from "./views/merchant/edit";
import MerchantProduct from "./views/merchant-product";
import MerchantProductAssign from "./views/merchant-product/assign-product";
import MerchantProductEdit from "./views/merchant-product/edit";
import UserCreate from "./views/manage-user/create";
import UserEdit from "./views/manage-user/edit";
import ProtectedRoute from "./routes/ProtectedRoute";
import WarehouseCreate from "./views/warehouse/create";
import Transaction from "./views/transaction";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <Toaster />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route element={<PublicRoute />}>
              <Route path="login" element={<Login />} />
              <Route
                path="reset-password"
                element={<div>Reset Password is coming..</div>}
              />
            </Route>

            {/* Route for manager only */}
            <Route element={<ProtectedRoute allowedRoles={["manager"]} />}>
              <Route element={<Layout />}>
                <Route path="/product" element={<Product />} />
                <Route path="/product/create" element={<CreateProduct />} />
                <Route path="/product/:id" element={<EditProduct />} />

                <Route path="/category" element={<Category />} />
                <Route path="/category/create" element={<CreateCategory />} />
                <Route path="/category/:id" element={<EditCategory />} />

                <Route path="/warehouse" element={<Warehouse />} />
                <Route path="/warehouse/create" element={<WarehouseCreate />} />
                <Route path="/warehouse/:id" element={<WarehouseEdit />} />
                <Route
                  path="/warehouse-product/:id"
                  element={<WarehouseProduct />}
                />
                <Route
                  path="/warehouse-product/:id/assign"
                  element={<WarehouseProductAssign />}
                />
                <Route
                  path="/warehouse-product/:id/:product_id/add-stock"
                  element={<WarehouseProductEdit />}
                />

                <Route path="/merchant" element={<Merchant />} />
                <Route path="/merchant/create" element={<MerchantCreate />} />
                <Route path="/merchant/:id" element={<MerchantEdit />} />
                <Route
                  path="/merchant-product/:id"
                  element={<MerchantProduct />}
                />
                <Route
                  path="/merchant-product/:id/assign"
                  element={<MerchantProductAssign />}
                />
                <Route
                  path="/merchant-product/:id/:product_id/add-stock"
                  element={<MerchantProductEdit />}
                />

                <Route path="/role" element={<Role />} />
                <Route path="/user-list" element={<UserList />} />
                <Route path="/user-list/create" element={<UserCreate />} />
                <Route path="/user-list/:id" element={<UserEdit />} />
                <Route path="/assign-role" element={<AssignRole />} />
                <Route path="/setting" element={<Setting />} />
              </Route>
              <Route path="*" element={<NotFound404 />} />
            </Route>

            {/* Route for keeper only */}
            <Route element={<ProtectedRoute allowedRoles={["keeper"]} />}>
              <Route element={<Layout />}>
                <Route path="/transaction" element={<Transaction/>} />
              </Route>
            </Route>

            {/* Route for manager and keeper */}
            <Route
              element={<ProtectedRoute allowedRoles={["manager", "keeper"]} />}
            >
              <Route element={<Layout />}>
                <Route index path="/" element={<Overview />} />
              </Route>
            </Route>
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>
);
