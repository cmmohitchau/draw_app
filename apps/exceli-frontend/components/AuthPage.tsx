'use client'
import axios from "axios";
import { Button } from "@repo/ui/button";
import { Input } from "@repo/ui/input";
import { useRef } from "react";

interface AuthProps {
  isSignin: boolean;
}

export function Auth({ isSignin }: AuthProps) {
  const userNameRef = useRef<HTMLInputElement | null>(null);
  const passwordRef = useRef<HTMLInputElement | null>(null);
  const nameRef = useRef<HTMLInputElement | null> (null);

  async function clickHandler() {
    const email = userNameRef.current?.value;
    const password = passwordRef.current?.value;
    const name = nameRef.current?.value;

    if (!email || !password || (!isSignin && !name)) {
      alert("Please fill in all required fields.");
      return;
    }

    
    try {
      const res = await axios.post(
        `http://localhost:3001/${isSignin ? "signin" : "signup"}`,
        isSignin
          ? { email, password }
          : { email, password, name }
      );

      console.log("Success:", res.data);
      alert("Success");
    } catch (error) {
      console.error("Error:", error);
      alert("Failed");
    }
  }

  return (
    <div className="h-screen w-screen flex justify-center">
        <div className=" flex flex-col justify-center m-4">
            <div className="bg-slate-300 w-80 rounded-2xl px-6 py-10">
                {!isSignin && (
                    <Input className="" ref={nameRef} placeholder="Name" name="name" />
                )}
                <Input className=""  ref={userNameRef} name="username" placeholder="Username (Email)" />
                <Input className="pl-4"
                    ref={passwordRef}
                    name="password"
                    type="password"
                    placeholder="Password"
                />
                <Button className="bg-green-500 rounded-2xl w-full mt-2" size="lg" onClick={clickHandler}>
                    {isSignin ? "Sign In" : "Sign Up"}
                </Button>
            </div>
        </div>
    </div>
  );
}
