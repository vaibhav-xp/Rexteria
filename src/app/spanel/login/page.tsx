import Image from "next/image";
import background from "@/assets/bg-mods.webp";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const Login = () => {
  return (
    <div className="w-full h-screen flex">
      {/* Image Section */}
      <div className="relative w-3/5 flex-shrink-0">
        <Image
          src={background}
          alt="background image"
          layout="fill"
          className="object-cover brightness-75"
        />
        <div className="absolute inset-0 bg-black opacity-40" />
      </div>

      {/* Form Section */}
      <div className="flex items-center justify-center w-2/5 p-10">
        <form className="bg-transparent p-8 rounded-lg shadow-lg w-full max-w-sm">
          <h2 className="text-3xl font-bold mb-6 text-center text-primary">
            Login
          </h2>

          <div className="mb-4">
            <Label
              htmlFor="email"
              className="block text-sm font-medium mb-1 text-primary"
            >
              Email
            </Label>
            <Input
              type="email"
              id="email"
              placeholder="Enter your email"
              className="w-full mb-2 p-3 border border-primary rounded focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>

          <div className="mb-6">
            <Label
              htmlFor="password"
              className="block text-sm font-medium mb-1 text-primary"
            >
              Password
            </Label>
            <Input
              type="password"
              id="password"
              placeholder="Enter your password"
              className="w-full mb-2 p-3 border border-primary rounded focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-primary hover:bg-opacity-80 text-white font-bold py-2 rounded transition duration-200"
          >
            Login
          </Button>

          <div className="mt-4 text-center">
            <a href="#" className="text-primary hover:underline">
              Forgot Password?
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
