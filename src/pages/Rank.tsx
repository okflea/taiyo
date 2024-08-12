import { User } from '@/lib/types';
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useEffect, useState } from 'react';
import { socket } from '@/socket';
import { useQueryClient } from '@tanstack/react-query';

export function Rank() {
  const qc = useQueryClient()
  const data = qc.getQueryData<User[]>(["users"])
  const [usersHighscores, setUsersHighscores] = useState(data)
  useEffect(() => {
    socket.on("highScores", (data) => {
      setUsersHighscores(data)
    })
    return () => {
    };
  }, [])
  return (
    <div>
      <div
        className="overflow-x-auto p-10 mt-20 m-4 border-2 border-secondary rounded-lg shadow-lg">
        <Table>
          <TableCaption className="gap-2">
            <p> Top 10 High Scores </p>
          </TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="">Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Score</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>

            {usersHighscores && usersHighscores?.map((user: User) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell>
                  <Badge
                    variant={"outline"}
                    className={`${user.status === "ONLINE" ? "text-emerald-600" : "text-rose-700"} p-2 rounded-full font-light`}>
                    {user.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">{user.score}</TableCell>
              </TableRow>
            ))}
          </TableBody>
          {/* <TableFooter> */}
          {/*   <TableRow> */}
          {/*     <TableCell colSpan={7}>Total 🍌 </TableCell> */}
          {/*     <TableCell className="text-right">{ */}
          {/*       usersHighscores?.reduce((acc, user) => acc + (user.score || 0), 0) */}
          {/*     }</TableCell> */}
          {/*   </TableRow> */}
          {/* </TableFooter> */}
        </Table>

      </div>
    </div>
  );
}
