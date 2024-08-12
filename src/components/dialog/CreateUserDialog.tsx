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
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { dialogCloseFn } from "@/lib/utils"
import axios from "axios"
import { toast } from "sonner"
import { useQueryClient } from "@tanstack/react-query"
import { useState } from "react"
import LoaderIcon from "@/assets/Loading"
import { Switch } from "../ui/switch"

const schema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  confirmPassword: z.string().min(6, { message: "Password must be at least 6 characters" }),
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  isAdmin: z.boolean().default(false).optional(),
}).superRefine(({ confirmPassword, password }, ctx) => {
  if (confirmPassword !== password) {
    ctx.addIssue({
      code: "custom",
      message: "The passwords did not match",
      path: ['confirmPassword']
    });
  }
})

function CreateUserDialog() {
  const [isLoading, setIsLoading] = useState(false)
  const qc = useQueryClient()
  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      name: "",
      isAdmin: false
    },
    resolver: zodResolver(schema),
  })

  async function createUser(values: z.infer<typeof schema>) {
    try {
      setIsLoading(true)

      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/users`, values)
      if (res.status === 201) {
        qc.invalidateQueries({ queryKey: ["users"] })
        form.reset()
        toast.success("User created")
        dialogCloseFn()
      }
    } catch (error) {
      console.log(error)
      toast.error("Something went wrong")
    } finally {
      setIsLoading(false)
    }
  }

  function onSubmit(values: z.infer<typeof schema>) {
    setIsLoading(true)
    createUser(values)
  }
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          // variant="secondary"
          className="justify-evenly p-1 mb-4 float-end w-40">
          <PlusCircledIcon />
          <p> Create User </p>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create User</DialogTitle>
          <DialogDescription>
            Make your User here. Click save when you're done.
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
              name="password"
              render={({ field }) => (
                <FormItem>
                  {/* <FormLabel>Password</FormLabel> */}
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  {/* <FormLabel>Password</FormLabel> */}
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Confirm Password"
                      {...field}
                    />
                  </FormControl>
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

            {/* <FormField */}
            {/*   control={form.control} */}
            {/*   name="isBlocked" */}
            {/*   render={({ field }) => ( */}
            {/*     <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm"> */}
            {/*       <div className="space-y-0.5"> */}
            {/*         <FormLabel>Block</FormLabel> */}
            {/*       </div> */}
            {/*       <FormControl> */}
            {/*         <Switch */}
            {/*           checked={field.value} */}
            {/*           onCheckedChange={field.onChange} */}
            {/*         /> */}
            {/*       </FormControl> */}
            {/*     </FormItem> */}
            {/*   )} */}
            {/* /> */}
            <Button
              disabled={isLoading}
              type="submit"
              className="w-full bg-yellow-500 hover:bg-yellow-600"
            >{isLoading ? <LoaderIcon /> : "Create"}</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default CreateUserDialog
