import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { TrashIcon } from "@radix-ui/react-icons"
import { useQueryClient } from "@tanstack/react-query"
import axios from "axios"
import { toast } from "sonner"
import { useState } from "react"
import LoaderIcon from "@/assets/Loading"

interface Props {
  userId: string
}

function DeleteUserDialog({ userId }: Props) {
  const [isLoading, setIsLoading] = useState(false)
  const qc = useQueryClient()
  async function deleteUser(userId: string) {
    setIsLoading(true)
    try {
      const res = await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/users/${userId}`)
      if (res.status === 200) {
        toast.success('User deleted')
        qc.invalidateQueries({ queryKey: ["users"] })
      }
    } catch (e: any) {
      if (e.response?.status !== 500) {
        toast.error(e?.response?.data?.error)
        return
      }
      toast.error("something went wrong")
    } finally {
      setIsLoading(false)
    }
  }
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="destructive"
          className="p-1">
          <TrashIcon />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete User</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this user? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter
          className="w-full"
        >
          <Button
            type="button"
            disabled={isLoading}
            className="w-1/2"
            variant={"destructive"} onClick={() => deleteUser(userId)}
          >{isLoading ? <LoaderIcon /> : "Delete"}</Button>
          <DialogClose asChild>
            <Button
              className="w-1/2"
              type="button"
              variant={"secondary"}>Cancel</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default DeleteUserDialog
