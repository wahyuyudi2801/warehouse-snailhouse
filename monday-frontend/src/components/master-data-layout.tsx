import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { PlusIcon } from "lucide-react";
import { Link } from "react-router";

type MasterDataType = {
  children: React.ReactNode;
  cardTitle: string;
  cardDescription: string;
  createUrl: string;
  btnText?: string;
};

const MasterDataLayout = ({
  children,
  cardTitle,
  cardDescription,
  createUrl,
  btnText = "Add New",
}: MasterDataType) => {
  return (
    <Card>
      <CardHeader className="flex justify-between items-center">
        <div>
          <CardTitle className="mb-2">{cardTitle}</CardTitle>
          <CardDescription>{cardDescription}</CardDescription>
        </div>
        <div>
          <Button
            asChild
            variant={"default"}
            size={"lg"}
            className="flex items-center rounded-full bg-blue-500 cursor-pointer hover:bg-blue-500/90"
          >
            <Link to={createUrl}>
              <span className="text-white">{btnText}</span>{" "}
              <PlusIcon color="white" className="size-4" />
            </Link>
          </Button>
        </div>
      </CardHeader>
      <hr />
      <CardContent>{children}</CardContent>
    </Card>
  );
};

export default MasterDataLayout;
