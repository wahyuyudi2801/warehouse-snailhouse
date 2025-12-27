import { getUsers } from "@/api/user";
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
import type { UserType } from "@/types/user";
import axios from "axios";
import { EditIcon, PhoneIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router";

export default function UserList() {
  const [users, setUsers] = useState<UserType[]>([]);
  const [loadingPage, setLoadingPage] = useState(false);
  const [errorPage, setErrorPage] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoadingPage(true);
        const result = await getUsers();

        setUsers(result);
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
        cardTitle={`${users.length} Total Users`}
        cardDescription="List of all users"
        createUrl="/user-list/create"
      >
        <Table>
          <TableHeader className="bg-gray-100">
            <TableRow>
              <TableHead className="w-[40%]">User Information</TableHead>
              <TableHead className="w-[40%]">Role User</TableHead>
              <TableHead className="w-[20%]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length ? (
              users.map((user, idx) => (
                <TableRow key={idx}>
                  <TableCell>
                    <SimpleCardFlex
                      name={user.name}
                      photo={user.photo}
                      text={
                        <div className="flex items-center gap-1">
                          <PhoneIcon size={16} /> <span>{user.phone}</span>
                        </div>
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <div className={`capitalize ${user.roles.length ? "bg-green-500" : "bg-red-500"} px-2.5 py-1.5 rounded-full text-white text-sm inline-block`}>
                      {user.roles.length ? user.roles[0].name : "No role"}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button asChild variant={"default"}>
                        <Link
                          to={`/user-list/${user.id}`}
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
