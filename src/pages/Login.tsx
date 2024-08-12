import { Button } from "@/components/ui/button";
import { useAuth } from "@/provider/AuthProvider";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { toast } from "sonner";
import LoaderIcon from "@/assets/Loading";
import { User } from "@/lib/types";
import { useRecoilState } from "recoil";
import { UserAtom } from "@/atoms";

const schema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
})
const Login = () => {
  const { token, setToken } = useAuth();
  const [_, setUser] = useRecoilState<User | null>(UserAtom)
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      toast.warning("User is Logged in")
      navigate("/", { replace: true });
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
    },
    resolver: zodResolver(schema),
  })

  async function onSubmit(values: z.infer<typeof schema>) {
    setIsLoading(true)

    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/auth/login`, values)
      console.log(response.status)
      if (response.status === 200) {
        setIsLoading(false)
        toast.success("login success")
        form.reset()
        handleLogin(response.data.token, {
          id: response.data.id,
          name: response.data.name,
          email: response.data.email,
          isAdmin: response.data.isAdmin,
          status: response.data.status,
          isBlocked: response.data.isBlocked,
          createdAt: response.data.createdAt,
          updatedAt: response.data.updatedAt,
          score: response.data.score,
          bananas: response.data.bananas
        })
      }
    } catch (err: any) {

      setIsLoading(false)
      if (err.response?.status === 401) {
        toast.error(err.response?.data.error)
        return
      }
      toast.error("something went wrong")
    }
  }
  return <>
    <div className="w-full h-[500px] flex items-center justify-center">
      <div className="w-[400px] flex flex-col items-center justify-center border-2 border-secondary rounded-lg shadow-lg p-4 space-y-3">
        <h1 className="text-3xl font-bold text-primary">Login</h1>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2 w-full">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  {/* <FormLabel className="font-thin">Email</FormLabel> */}
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
                  {/* <FormLabel className="font-thin">Password</FormLabel> */}
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
            <Button
              className="w-full bg-primary hover:bg-primary/80"
              type="submit"
              disabled={isLoading}
            >{isLoading ? <LoaderIcon /> : "Login"}</Button>
          </form>
        </Form>
        <div
          className="text-sm py-2 font-light">
          Don't have an account? <p onClick={() => { navigate("/register") }} className="text-secondary font-normal hover:cursor-pointer" >Signup</p></div>
      </div>
    </div>
  </>;
};

export default Login;
