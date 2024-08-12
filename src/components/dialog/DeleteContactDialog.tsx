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
import { toast } from "sonner"
import { useState } from "react"
import LoaderIcon from "@/assets/Loading"
import { useRecoilState } from "recoil"
import { contactAtom } from "@/store/atoms"

interface Props {
  contactId: string
}

function DeleteContactDialog({ contactId }: Props) {
  const [isLoading, setIsLoading] = useState(false)
  const [_, setContacts] = useRecoilState(contactAtom)
  function deleteUser(contactId: string) {
    setIsLoading(true)
    try {
      setContacts(prev => prev.filter(contact => contact.id !== contactId))
      toast.success('User deleted')
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
          variant="outline"
          size="icon"
        >
          <TrashIcon />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete Contact</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this contact? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter
          className="w-full"
        >
          <Button
            type="button"
            disabled={isLoading}
            className="w-1/2"
            variant={"destructive"} onClick={() => deleteUser(contactId)}
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

export default DeleteContactDialog
