import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { Link } from "react-router";

const FormLayout = ({
  children,
  title,
  children2,
  back,
  onSubmit,
  loading,
  headerCard,
  headerCard2,
  btnText = 'Submit'
}: {
  children: React.ReactNode;
  title: string;
  children2: React.ReactNode;
  back: string;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  loading?: boolean;
  headerCard?: React.ReactNode;
  headerCard2?: React.ReactNode;
  btnText?: string;
}) => {
  return (
    <div className="grid gap-4 lg:grid-cols-5">
      <div className="col-span-3 flex flex-wrap gap-4">
        {headerCard}
        {headerCard2}
        <form onSubmit={onSubmit} encType="multipart/form-data" className="w-full">
          <Card>
            <CardHeader>
              <CardTitle>Complete the form</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4">
                {children}
              </div>
            </CardContent>
            <CardFooter>
              <div className="flex w-full justify-end gap-2">
                <Button asChild variant={"outline"} disabled={loading}>
                  {loading ? "Back" : <Link to={back}>Back</Link>}
                </Button>
                <Button
                  type="submit"
                  variant={"default"}
                  className="bg-blue-600 hover:bg-blue-800"
                  disabled={loading}
                >
                  {loading ? "Loading..." : btnText}
                </Button>
              </div>
            </CardFooter>
          </Card>
        </form>
      </div>
      <div className="col-span-3 lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>{title}</CardTitle>
          </CardHeader>
          <CardContent>{children2}</CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FormLayout;
