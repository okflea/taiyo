import { useEffect } from "react";
import { useRecoilState } from "recoil";
import { UserAtom } from "@/atoms";
import { AvatarIcon } from "@radix-ui/react-icons";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import { socket } from "@/socket";


export function ConnectionState() {
  const [user, _] = useRecoilState(UserAtom);

  useEffect(() => {
    if (user && socket.connected) {
      socket.emit('login', user.id);
    }

    // const handleStatusUpdate = ({ userId, status }) => {
    //   if (userId === user?.id) {
    //     setUser(prevUser => ({ ...prevUser, status }));
    //   }
    // };

    return () => {
      if (user) {
        socket.emit('logout', user.id);
      }
    };
  }, [user]);
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className="bg-transparent h-[50px] px-3 flex  flex-row items-center cursor-default gap-2"
          >
            {socket.connected && <AvatarIcon className="w-5 h-5 text-emerald-400" />}
            {!socket.connected && <AvatarIcon className="w-5 h-5 text-rose-300" />}
            <p>
              {user?.name}</p>
            {/* <Switch */}
            {/*   checked={isConnected} */}
            {/*   onCheckedChange={handleCheckedChange} /> */}
          </div>
        </TooltipTrigger>
        <TooltipContent>
          {socket.connected && <p>Online</p>}
          {!socket.connected && <p>Offline</p>}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
