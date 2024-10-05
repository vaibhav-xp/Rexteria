"use client";

import background from "@/assets/banner_home_3.webp";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Label } from "@/components/ui/label";
import useStore from "@/hooks/use-store";
import { showAlert } from "@/services/handle-api";
import { sendOtpFn, verfiyOtpFn } from "@/services/login";
import { MoveLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { IoArrowBack } from "react-icons/io5";

const Login = () => {
  const router = useRouter();
  const { refetchUser } = useStore();
  const [state, setState] = useState("send");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [loadingSend, setLoadingSend] = useState(false);
  const [loadingVerify, setLoadingVerify] = useState(false);

  const handleSendOTP = (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingSend(true);
    const formData = new FormData();
    formData.append("email", email);

    sendOtpFn(formData)
      .then((data) => showAlert(data))
      .then(() => {
        setState("otp");
      })
      .finally(() => {
        setLoadingSend(false);
      });
  };

  const handleVerifyOTP = (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp) {
      showAlert({ message: "Please enter OTP", statusCode: 0 });
      return;
    }
    setLoadingVerify(true);
    const formData = new FormData();
    formData.append("otp", otp);
    formData.append("email", email);

    verfiyOtpFn(formData)
      .then((data) => showAlert(data))
      .then(() => router.replace("/"))
      .then(() => refetchUser())
      .finally(() => {
        setLoadingVerify(false);
      });
  };

  const handleBack = () => {
    setOtp("");
    setState("send");
  };

  return (
    <div className="w-full h-screen flex flex-col lg:flex-row">
      {/* Image Section */}
      <div className="relative lg:w-3/5 w-full h-2/5 lg:h-full flex-shrink-0">
        <Image
          src={background}
          alt="background image"
          layout="fill"
          className="object-cover brightness-75 transition-opacity duration-700"
        />
        <div className="absolute inset-0 opacity-40" />
      </div>

      {/* Form Section */}
      <div className="flex flex-col items-center justify-center w-full lg:w-2/5 p-8 lg:p-10 transition-transform duration-500 ease-in-out relative">
        {state === "send" && (
          <form
            onSubmit={handleSendOTP}
            className="bg-transparent p-8 rounded-lg shadow-lg w-full max-w-md space-y-6 animate-fade-in"
          >
            <h2 className="text-3xl font-bold mb-6 text-center">Login</h2>

            <div>
              <Label htmlFor="email" className="block text-sm font-medium mb-1">
                Email
              </Label>
              <Input
                type="email"
                id="email"
                placeholder="Enter your email"
                className="w-full mb-2 p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <Button
              type="submit"
              variant="default"
              className="w-full py-3"
              disabled={loadingSend}
            >
              {loadingSend ? "Sending..." : "Send OTP"}
            </Button>
          </form>
        )}

        {state === "otp" && (
          <form
            onSubmit={handleVerifyOTP}
            className="bg-transparent p-8 rounded-lg shadow-lg w-full max-w-md space-y-6 animate-slide-in"
          >
            <h2 className="text-3xl font-bold mb-6 text-center">Verify OTP</h2>

            <div>
              <Label htmlFor="otp" className="block text-sm font-medium mb-1">
                Enter OTP
              </Label>
              <InputOTP
                maxLength={6}
                className="w-full"
                value={otp}
                onChange={(value) => setOtp(value)}
              >
                <InputOTPGroup className="flex justify-between w-full gap-2">
                  {[0, 1, 2, 3, 4, 5].map((index) => (
                    <InputOTPSlot key={index} index={index} />
                  ))}
                </InputOTPGroup>
              </InputOTP>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Button
                type="button"
                variant="default"
                onClick={handleBack}
                className="hover:underline"
              >
                <IoArrowBack /> Back
              </Button>
              <Button
                type="submit"
                variant="default"
                disabled={loadingVerify}
                className="w-full py-3"
              >
                {loadingVerify ? "Verifying..." : "Verify OTP"}
              </Button>
            </div>
          </form>
        )}
        <Link href={"/"} className="flex gap-2 text-primary mt-4 group">
          <MoveLeft className="translate-x-0 group-hover:-translate-x-2 duration-200 transition-translate" />
          Home
        </Link>
      </div>
    </div>
  );
};

export default Login;
