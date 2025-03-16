"use client";

import { Button } from "@/components/ui/button";
import { useSearchParams } from "next/navigation";
import { useVerifyUser } from "@/features/auth/api/use-verify-user";
import { verifyUserSchema, VerifyUserSchema } from "@/features/auth/schemas";
import { useState } from "react";
import axios from "axios";
export const VerifyUserCard = () => {
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId") ?? "";
  const secret = searchParams.get("secret") ?? "";
  const { mutate, isPending } = useVerifyUser();
  const [values, setValues] = useState<VerifyUserSchema>({
    userId: userId,
    secret: secret,
  });

  // const onSubmit = (values: VerifyUserSchema) => {
  //   mutate(values);
  // };

  const onSubmit = async () => {
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_APP_URL}/api/v1/auth/verify`
    );
    console.log(res);
  };

  return (
    <div className="max-h-screen flex justify-center items-center">
      <div>
        {/*<h1 className='text-4xl text-center'>Verification Page</h1>*/}
        <div className="">
          <Button disabled={isPending} onClick={onSubmit}>
            Verify
          </Button>
        </div>
      </div>
    </div>
  );
};
