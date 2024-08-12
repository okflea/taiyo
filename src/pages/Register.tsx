
import { Button } from "@/components/ui/button";
import { useAuth } from "@/provider/AuthProvider";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { toast } from "sonner";
import LoaderIcon from "@/assets/Loading";
import { User } from "@/lib/types";
import { Checkbox } from "@/components/ui/checkbox";
import { useRecoilState } from "recoil";
import { UserAtom } from "@/atoms";

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
const Register = () => {
  const { token, setToken } = useAuth();
  const [_, setUser] = useRecoilState<User | null>(UserAtom)
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    if (token) {
      navigate("/", { replace: true });
      toast.warning("User is Logged in")
    }
  }, [])
  const handleLogin = (token: string, user: User) => {
    setToken(token);
    setUser(user);
    navigate("/", { replace: true });
  };

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

  async function onSubmit(values: z.infer<typeof schema>) {
    setIsLoading(true)
    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/auth/register`, values)
      const { id, name, bananas, score, email, isAdmin, status, isBlocked, createdAt, updatedAt } = response.data
      if (response.status === 201) {
        toast.success("Registration success")
        form.reset()
        handleLogin(response.data.token, {
          id,
          name,
          email,
          isAdmin,
          status,
          isBlocked,
          createdAt,
          updatedAt,
          score,
          bananas,
        })
      }
    } catch (err: any) {
      if (err.response?.status === 401) {
        toast.error(err.response?.data.error)
        return
      }
      toast.error("something went wrong")
    } finally {
      setIsLoading(false)
    }
  }
  return <>
    <div className="w-full h-[500px] flex items-center justify-center">
      <div className="w-[400px] flex flex-col items-center justify-center border-2 border-secondary rounded-lg shadow-lg p-4 space-y-4">
        <h1 className="text-3xl font-bold text-primary">Register</h1>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2 w-full">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  {/* <FormLabel>Name</FormLabel> */}
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  {/* <FormLabel>Email</FormLabel> */}
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="Email"
                      {...field}
                    />
                  </FormControl>
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
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      Is this user an admin?
                    </FormLabel>
                  </div>
                </FormItem>
              )}
            />
            <Button
              className="w-full bg-primary hover:bg-primary/80"
              type="submit"
              disabled={isLoading}
            >{isLoading ? <LoaderIcon /> : "Sign up"}</Button>
          </form>
        </Form>
        <div className="text-sm font-light">Already have an account? <p onClick={() => { navigate("/login") }} className="text-secondary font-normal hover:cursor-pointer">Login</p></div>
      </div>
    </div>
  </>;
};

export default Register;
