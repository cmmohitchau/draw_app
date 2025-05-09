'use client'
import axios from "axios";
import { Button } from "@repo/ui/button";
import { Input } from "@repo/ui/input";
import { useRef } from "react";
import Link from 'next/link'
import { useRouter } from "next/navigation";

interface AuthProps {
  isSignin: boolean;
}

export function Auth({ isSignin }: AuthProps) {
  const userNameRef = useRef<HTMLInputElement | null>(null);
  const passwordRef = useRef<HTMLInputElement | null>(null);
  const nameRef = useRef<HTMLInputElement | null> (null);

  const router = useRouter();

  async function  clickHandler() {
    const email = userNameRef.current?.value;
    const password = passwordRef.current?.value;
    const name = nameRef.current?.value;

    if (!email || !password || (!isSignin && !name)) {
      alert("Please fill in all required fields.");
      return;
    }

    
    try {
      let res;      

      if (isSignin) {
        res = await axios.post('http://localhost:3001/signin', { email, password });
      } else {
        res = await axios.post('http://localhost:3001/signup', { email, password , name});
      }
      localStorage.setItem("token" , res.data.token);
      router.push("/room")
      
    } catch (error) {
      console.error("Error:", error);
      alert("Failed");
    }
  }

  return (
    <div className="h-screen w-screen flex justify-center">
        <div className=" flex flex-col justify-center m-4">
            <div className="bg-slate-300 dark:bg-gray-900 w-80 rounded-2xl px-6 py-10">
                {!isSignin && (
                  <div>
                    <label className="">Name</label>
                    <Input className="my-2" ref={nameRef} placeholder="Name" />
                  </div>
                )}
                <label className="">Email</label>
                <Input className="my-2"  ref={userNameRef} placeholder="Username (Email)" />
                <label className="">Password</label>
                <Input className="my-2"
                    ref={passwordRef}
                    type="password"
                    placeholder="Password"
                />
                <Button className="bg-green-500 rounded-2xl  w-full mt-8 cursor-pointer" size="lg" onClick={clickHandler}>
                    {isSignin ? "Sign In" : "Sign Up"}
                </Button>
                {isSignin ? "Not have an account ? " : "Already have an account ? "}
                {isSignin ? <Link href="/signup" className="" ><span className="underline"> Signup</span></Link> : <Link href="/signin" ><span className="underline"> Signin</span></Link>}
            </div>
        </div>
    </div>
  );
}
