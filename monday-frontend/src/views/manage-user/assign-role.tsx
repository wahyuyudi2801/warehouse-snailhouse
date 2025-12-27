import { assignRole, getRoles } from "@/api/role";
import { getUsers } from "@/api/user";
import ErrorInputValidation from "@/components/error-input-validation";
import FormLayout from "@/components/form-layout";
import SelectGroup from "@/components/select-group";
import { Skeleton } from "@/components/ui/skeleton";
import type { SelectType } from "@/types/select-type";
import type { RoleType, UserType } from "@/types/user";
import axiosError from "@/utils/axios-error";
import { CheckCircle, LoaderCircleIcon, SquareUser, UserIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";

export default function AssignRole() {
  const guides: string[] = [
    'Assign role to user',
    'Select role and user',
    'Click save button',
  ];
  const [loading, setLoading] = useState(false);
  const [loadingPage, setLoadingPage] = useState(false)
  const [errorPage, setErrorPage] = useState('')
  const [errors, setErrors] = useState<{ [key: string]: string[] }>({})
  const navigate = useNavigate()

  const [users, setUsers] = useState<SelectType[]>([]);
  const [userId, setUserId] = useState('');
  const [roles, setRoles] = useState<SelectType[]>([]);
  const [roleId, setRoleId] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoadingPage(true);

        const result: UserType[] = await getUsers();
        const users: SelectType[] = [];
        result.map((value) => {
          users.push({
            value: value.id.toString(),
            text: value.name,
          });
        });
        setUsers(users);

        const resultRoles: RoleType[] = await getRoles();
        const roles: SelectType[] = [];
        resultRoles.map((value) => {
          roles.push({
            value: value.id.toString(),
            text: value.name,
          });
        });
        setRoles(roles);
      } catch (error) {
        console.log(error);
        setErrorPage('Error fetching data');
      } finally {
        setLoadingPage(false);
      }
    };

    fetchData();
  }, [])

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setLoading(true);
      const formData = new FormData()
      formData.append('user_id', userId)
      formData.append('role_id', roleId)

      const result = await assignRole(formData)
      if(result) {
        toast.success(result.message, {
          position: 'top-right'
        });
        navigate('/user-list')
      }
    } catch (error) {
      setErrors(axiosError(error))
    } finally {
      setLoading(false)
    }
  }

  if (loadingPage) {
    return (
      <div className="grid gap-4 md:grid-cols-5">
        <Skeleton className="col-span-3 border bg-white min-h-[320px] flex justify-center items-center">
          <LoaderCircleIcon size={38} className="animate-spin" />
        </Skeleton>
        <Skeleton className="col-span-2 border bg-white min-h-[320px] flex justify-center items-center">
          <LoaderCircleIcon size={38} className="animate-spin" />
        </Skeleton>
      </div>
    );
  }

  if (errorPage) {
    return <div className="text-lg font-bold text-red-500">{errorPage}</div>;
  }

  return (
    <FormLayout
      title="Quick guide to add new user"
      children2={<AssignRole.Chilren2 guides={guides} />}
      back="/user-list"
      onSubmit={onSubmit}
      loading={loading}
    >
      <div>
        <SelectGroup
        title="Select User"
        icon={UserIcon}
        id="user_id"
        contents={users}
        value={userId}
        onChange={setUserId}
        />
        {errors.user_id && <ErrorInputValidation message={errors.user_id[0]} />}
      </div>

      <div>
        <SelectGroup
        title="Select Role"
        icon={SquareUser}
        id="role_id"
        contents={roles}
        value={roleId}
        onChange={setRoleId}
        />
        {errors.role_id && <ErrorInputValidation message={errors.role_id[0]} />}
      </div>
    </FormLayout>
  );
}

AssignRole.Chilren2 = ({ guides }: { guides: string[] }) => {
  return (
    <ul>
      {guides.map((value, index) => (
        <li key={`guide-${index}`} className="mb-2.5">
          <div className="flex items-center gap-1.5">
            <CheckCircle color="green" width={20} />
            <span className="font-normal text-sm">{value}</span>
          </div>
        </li>
      ))}
    </ul>
  );
};