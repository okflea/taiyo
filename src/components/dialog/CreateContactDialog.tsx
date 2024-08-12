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
import { PlusCircledIcon } from "@radix-ui/react-icons"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { toast } from "sonner"
import { useState } from "react"
import LoaderIcon from "@/assets/Loading"
import { useRecoilState } from "recoil"
import { contactAtom } from "@/store/atoms"
import { v4 as uuidv4 } from 'uuid';
import { dialogCloseFn } from "@/lib/utils"

const schema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email("Invalid email"),
  phone: z.string().min(10, { message: "Phone number must be at least 10 characters" })

  ,
})

function CreateContactDialog() {
  const [isLoading, setIsLoading] = useState(false)
  const [contacts, setContacts] = useRecoilState(contactAtom)
  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      phone: "",
    },
    resolver: zodResolver(schema),
  })

  function createContact(values: z.infer<typeof schema>) {
    try {
      setIsLoading(true)

      setContacts([...contacts, {
        id: uuidv4(),
        name: values.name,
        email: values.email,
        phone: parseInt(values.phone)
      }])

      form.reset()
      toast.success("Contact created")
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
    createContact(values)
  }
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          // variant="secondary"
          className="justify-evenly p-1 w-40 text-muted ">
          <PlusCircledIcon />
          <p> Create Contact </p>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Contact</DialogTitle>
          <DialogDescription>
            Make your Contact here. Click Add when you're done.
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
                <FormItem>
                  {/* <FormLabel>Password</FormLabel> */}
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Phone"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              disabled={isLoading}
              className="w-full"
              type="submit"
            >{isLoading ? <LoaderIcon /> : "Add"}</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default CreateContactDialog
