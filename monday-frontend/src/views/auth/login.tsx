import Authenticate from "@/api/auth/login";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { LockIcon, MailIcon, SnailIcon } from "lucide-react";
import React, { useState } from "react";
import { Link } from "react-router";
import { useAuth } from "@/context/AuthContext";
import ErrorInputValidation from "@/components/error-input-validation";
import axiosError from "@/utils/axios-error";
import Alert from "@/components/alert";

const Login = () => {
  const [errors, setErrors] = React.useState<{ [key: string]: string[] }>({});
  const [loading, setLoading] = React.useState(false);
  const { login } = useAuth();
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await Authenticate(email, password);

      if (response.data.token) {
        login(response.data.user, response.data.token);
        setEmail('')
        setPassword('')
      }
    } catch (error) {
      setErrors(axiosError(error));
    } finally {
      setPassword('')
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-screen flex flex-col gap-4 justify-center items-center p-4">
      <div className="flex items-center gap-2">
        <SnailIcon size={50} color="purple" />
        <h1 className="font-pacifico text-4xl text-purple-900">Snailhouse</h1>
      </div>
      <Card className="w-full sm:w-[420px]">
        <CardHeader className="text-center">
          <CardTitle className="text-xl font-bold">
            Hi👋🏻, Welcome back!
          </CardTitle>
          <CardDescription>Login to your account to continue!</CardDescription>
        </CardHeader>
        <CardContent>
          {errors.message && <Alert message={errors.message[0]} type="error" hide={setErrors} />}

          <form onSubmit={onSubmit} className="flex flex-col gap-4">
            <div>
              <InputGroup>
                <InputGroupInput name="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                <InputGroupAddon>
                  <MailIcon />
                </InputGroupAddon>
              </InputGroup>
              {errors.email && <ErrorInputValidation message={errors.email[0]} />}
            </div>
            <div>
              <InputGroup>
                <InputGroupInput
                  name="password"
                  type="password"
                  placeholder="Password"
                  autoComplete="off"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <InputGroupAddon>
                  <LockIcon />
                </InputGroupAddon>
              </InputGroup>
              {errors.password && <ErrorInputValidation message={errors.password[0]} />}
            </div>

            <p className="text-[11px]">
              Forgot your password?{" "}
              <Link
                to="/reset-password"
                className="text-blue-500 hover:underline"
              >
                Reset Password
              </Link>
            </p>

            <Button
              type="submit"
              variant={"default"}
              className="w-full mt-4"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
