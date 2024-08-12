import CreateUserDialog from "@/components/dialog/CreateUserDialog";
import DeleteUserDialog from "@/components/dialog/DeleteTaskDialog";
import EditUserDialog from "@/components/dialog/EditUserDialog";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { User } from "@/lib/types";
import { formatDateTime } from "@/lib/utils";
import { CheckCircledIcon, CrossCircledIcon } from "@radix-ui/react-icons";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const Admin = () => {
  const getUsers = async () => {
    const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/users`);
    // console.log(response.data);
    return response.data.users;
  }
  const { data, isFetched } = useQuery<User[]>({
    queryKey: ["users"],
    queryFn: getUsers
  })
  return <>

    {/* table */}
    <div
      className="overflow-x-auto p-10 mt-20 m-4 border-2 border-secondary rounded-lg shadow-lg">
      <CreateUserDialog />
      <Table>
        <TableCaption className="gap-2">
          <p> A list of all users </p>
        </TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="">Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>isBlocked</TableHead>
            <TableHead className="text-center">Joined</TableHead>
            <TableHead className="text-center">Actions</TableHead>
            <TableHead className="text-right">Bananas</TableHead>
            <TableHead className="text-right">Score</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>

          {isFetched && data?.map((user: User) => (
            <TableRow key={user.id}>
              <TableCell className="font-medium">{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                <Badge
                  variant={"outline"}
                  className={`${user.status === "ONLINE" ? "text-emerald-600" : "text-rose-700"} p-2 rounded-full font-light`}>
                  {user.status}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge
                  variant={"outline"}
                  className={`${user.isAdmin ? "text-sky-600" : "text-yellow-700"} p-2 rounded-full font-light`}>
                  {user.isAdmin ? "Admin" : "Player"}
                </Badge>
              </TableCell>
              <TableCell>
                {user.isBlocked ?
                  <CheckCircledIcon
                    className="text-rose-700" />
                  :
                  <CrossCircledIcon
                    className="text-emerald-600" />
                }
              </TableCell>
              <TableCell className="text-center font-light">{formatDateTime(user.createdAt)}</TableCell>
              <TableCell className="text-center gap-2">
                <EditUserDialog user={user} />
                <DeleteUserDialog userId={user.id} />
              </TableCell>
              <TableCell className="text-right">{user.bananas}</TableCell>
              <TableCell className="text-right">{user.score}</TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={8}>Total 🍌 </TableCell>
            <TableCell className="text-right">{
              data?.reduce((acc, user) => acc + (user.bananas || 0), 0)
            }</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div >
  </>;
};

export default Admin;
