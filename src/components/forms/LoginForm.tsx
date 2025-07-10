import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Tlogin, loginSchema } from "@/schema/loginSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { toast } from "sonner";
import { fetchWrapper } from "@/lib/fetch-wrapper";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();

  const form = useForm<Tlogin>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleSubmit = form.handleSubmit(async ({ email, password }) => {
    try {
      const { data, error } = await fetchWrapper<{
        data: { token?: string };
      }>("/api/login", {
        method: "POST",
        body: { email, password },
      });
      if (error) {
        form.setError("root", {
          message: error ?? "Login failed. Please try again.",
        });
        toast.error(error ?? "Something went wrong!");
        return;
      }

      if (data?.data.token) {
        toast.success("Logged in successfully.");
        router.push("/dashboard");
      } else {
        toast.error("Unexpected response from server.");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("An unexpected error occurred. Please try again.");
    }
  });
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={handleSubmit}>
              <div className="flex flex-col gap-6">
                <div className="grid gap-3">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="Email..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid gap-3">
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="Password..."
                            className="w-full"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="flex flex-col gap-3">
                  <Button
                    type="submit"
                    disabled={form.formState.isSubmitting}
                    className="w-full"
                  >
                    {form.formState.isSubmitting ? "Signing in..." : "Sign In"}
                  </Button>
                </div>
              </div>
              <div className="mt-4 text-center text-sm">
                {form.formState.errors.root && (
                  <p className="text-red-500">
                    {form.formState.errors.root.message}
                  </p>
                )}
              </div>
            </form>
          </Form>

          <div className="mt-6 p-4 bg-slate-700/50 rounded-lg">
            <p className="text-xs text-slate-400 mb-2">Demo Credentials:</p>
            <p className="text-xs text-slate-300">Email: admin1@example.com</p>
            <p className="text-xs text-slate-300">Password: adminpass1</p>

            <p className="text-xs text-slate-400 mb-2 mt-2">
              Demo Credentials2:
            </p>
            <p className="text-xs text-slate-300">Email: admin2@example.com</p>
            <p className="text-xs text-slate-300">Password: adminpass2</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
