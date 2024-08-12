import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Pencil2Icon } from "@radix-ui/react-icons"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { dialogCloseFn } from "@/lib/utils"
import { toast } from "sonner"
import { useState } from "react"
import LoaderIcon from "@/assets/Loading"
import { Contact } from "@/lib/types"
import { useRecoilState } from "recoil"
import { contactAtom } from "@/store/atoms"

interface Props {
  contact: Contact
}
const schema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email("Invalid email"),
  phone: z.string().min(10, { message: "Phone number must be at least 10 characters" })

  ,
})

function EditContactDialog({ contact }: Props) {
  const [isLoading, setIsLoading] = useState(false)
  const [_, setContacts] = useRecoilState(contactAtom)
  const form = useForm({
    defaultValues: {
      name: contact.name,
      email: contact.email,
      phone: contact.phone.toString(),
    },
    resolver: zodResolver(schema),
  })

  function updateContact(contact: Contact, values: z.infer<typeof schema>) {
    try {

      setIsLoading(true)

      setContacts(prev => prev.map(c => {
        if (c.id === contact.id) {
          return {
            ...c,
            name: values.name,
            email: values.email,
            phone: parseInt(values.phone)
          }
        }
        return c
      }))

      form.reset()
      toast.success("User updated")
      dialogCloseFn()

    } catch (error) {
      console.log(error)
      toast.error("Something went wrong")
    } finally {
      setIsLoading(false)
    }
  }

  function onSubmit(values: z.infer<typeof schema>) {
    setIsLoading(true)
    updateContact(contact, values)
  }
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="icon">
          <Pencil2Icon />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
          <DialogDescription>
            Make changes to your User here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  {/* <Label>Task</Label> */}
                  <Input placeholder="Name" {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <Input placeholder="Email" {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem className="">

                  <Input type="number" placeholder="Phone" {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              disabled={isLoading}
              type="submit"
              variant={"secondary"}
              className="w-full "
            >{isLoading ? <LoaderIcon /> : "Save"}</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog >
  )
}

export default EditContactDialog
