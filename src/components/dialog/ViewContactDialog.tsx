
import {
  Dialog, DialogContent,
  DialogDescription, DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { EnterFullScreenIcon } from "@radix-ui/react-icons"
import { Contact } from "@/lib/types"

interface Props {
  contact: Contact
}

function ViewContactDialog({ contact }: Props) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="icon"
        >
          <EnterFullScreenIcon />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{contact.name}</DialogTitle>
          <DialogDescription>
            Contact Details:
          </DialogDescription>
          <div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-2  "
          >
            <p
              className="text-sm text-secondary"
            >{contact.email}</p>
            <p
              className="text-sm text-primary/50"
            >{contact.phone}</p>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}

export default ViewContactDialog
