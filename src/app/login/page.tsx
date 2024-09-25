"use client";

import background from "@/assets/bg-mods.webp";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Label } from "@/components/ui/label";
import { showAlert } from "@/services/handle-api";
import { sendOtpFn, verfiyOtpFn } from "@/services/login";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { IoArrowBack } from "react-icons/io5";

const Login = () => {
  const router = useRouter();
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
      .finally(() => {
        setLoadingVerify(false);
      });
  };

  const hanelBack = () => {
    setOtp("");
    setState("send");
  };

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
        {state === "send" && (
          <form
            onSubmit={handleSendOTP}
            className="bg-transparent p-8 rounded-lg shadow-lg w-full max-w-sm"
          >
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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <Button
              type="submit"
              variant={"default"}
              className="w-full"
              disabled={loadingSend}
            >
              {loadingSend ? "Sending..." : "Send OTP"}
            </Button>
          </form>
        )}

        {state === "otp" && (
          <form
            onSubmit={handleVerifyOTP}
            className="bg-transparent p-8 rounded-lg shadow-lg w-full max-w-sm"
          >
            <h2 className="text-3xl font-bold mb-6 text-center text-primary">
              Verify OTP
            </h2>

            <div className="mb-6">
              <Label
                htmlFor="otp"
                className="block text-sm font-medium mb-1 text-primary"
              >
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
              <Button type="button" variant={"default"} onClick={hanelBack}>
                <IoArrowBack /> Back
              </Button>
              <Button
                type="submit"
                variant={"default"}
                disabled={loadingVerify}
              >
                {loadingVerify ? "Verifying..." : "Verify OTP"}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Login;
