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
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { dialogCloseFn } from "@/lib/utils"
import axios from "axios"
import { toast } from "sonner"
import { useQueryClient } from "@tanstack/react-query"
import { useState } from "react"
import LoaderIcon from "@/assets/Loading"
import { User } from "@/lib/types"
import { Switch } from "../ui/switch"

interface Props {
  user: User
}
const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email("Invalid email"),
  isAdmin: z.boolean().default(false).optional(),
  isBlocked: z.boolean().default(false).optional(),
})

function EditUserDialog({ user }: Props) {
  const [isLoading, setIsLoading] = useState(false)
  const qc = useQueryClient()
  const form = useForm({
    defaultValues: {
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      isBlocked: user.isBlocked
    },
    resolver: zodResolver(formSchema),
  })

  async function updateUser(user: User, values: z.infer<typeof formSchema>) {
    try {

      const res = await axios.patch(`${import.meta.env.VITE_BACKEND_URL}/api/users/${user.id}`, {
        name: values.name,
        email: values.email,
        isAdmin: values.isAdmin,
        isBlocked: values.isBlocked
      })
      setIsLoading(false)
      if (res.status === 200) {
        qc.invalidateQueries({ queryKey: ["users"] })
        form.reset()
        toast.success("User updated")
        dialogCloseFn()

      }
    } catch (error) {
      setIsLoading(false)
      console.log(error)
      toast.error("Something went wrong")
    }
  }

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    updateUser(user, values)
  }
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="secondary"
          className="p-1">
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
              name="isAdmin"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>Grant Admin Privileges</FormLabel>
                    {/* <FormDescription> */}
                    {/*   Receive emails about new products, features, and more. */}
                    {/* </FormDescription> */}
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isBlocked"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>Block</FormLabel>
                    {/* <FormDescription> */}
                    {/*   Receive emails about new products, features, and more. */}
                    {/* </FormDescription> */}
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <Button
              disabled={isLoading}
              type="submit"
              variant={"secondary"}
              // className="w-full bg-yellow-500 hover:bg-yellow-600"
              className="w-full "
            >{isLoading ? <LoaderIcon /> : "Save"}</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default EditUserDialog
