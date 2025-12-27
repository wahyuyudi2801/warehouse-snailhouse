import { SidebarInset, SidebarProvider, SidebarTrigger } from "./ui/sidebar";
import AppSidebar from "./app-sidebar";
import { Separator } from "./ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "./ui/breadcrumb";
import { Link, Outlet, useLocation } from "react-router";
import { Fragment, useEffect, useState } from "react";

export default function Layout() {
  const [breadcrumbs, setBreadcrumbs] = useState<string[]>([]);
  const location = useLocation();
  useEffect(() => {
    if (location.pathname != "/") {
      const pathname: string = location.pathname.slice(1);
      const pathnameSplit: string[] = pathname.split("/");
      setBreadcrumbs(pathnameSplit);
    } else {
      setBreadcrumbs(["overview"]);
    }
  }, [location]);
  return (
    <SidebarProvider>
      <AppSidebar />

      <SidebarInset className="bg-slate-50">
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <Breadcrumb>
              <BreadcrumbList>
                {breadcrumbs.map((breadcrumb, index) => {
                  return (
                    <Fragment key={index}>
                      <BreadcrumbItem
                        className="hidden capitalize md:block"
                      >
                        <Link
                          to={`/${breadcrumb != "overview" ? breadcrumb : ""}`}
                        >
                          {" "}
                          {breadcrumb}{" "}
                        </Link>
                      </BreadcrumbItem>
                      {index != breadcrumbs.length - 1 && <BreadcrumbSeparator className="hidden md:block"/>}
                    </Fragment>
                  );
                })}

                {/* <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Data Fetching</BreadcrumbPage>
                </BreadcrumbItem> */}
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
