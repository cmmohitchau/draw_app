'use client'
import axios from "axios";
import { Button } from "@repo/ui/button";
import { Input } from "@repo/ui/input";
import { useRef, useState } from "react";
import Link from 'next/link'
import { useRouter } from "next/navigation";

interface AuthProps {
  isSignin: boolean;
}

export function Auth({ isSignin }: AuthProps) {
  const [name , setName] = useState("");
  const [password , setPassword] = useState("");
  const [email , setEmail ] = useState("");
  const [error , setError] = useState(false);
  const router = useRouter();
   console.log("in auth page")
 

  async function  clickHandler() {


    if (!email || !password || (!isSignin && !name)) {
      setError(true);
      return;
    }

    
    try {
      let res;      
      
      if (isSignin) {
        res = await axios.post('http://localhost:3001/signin', { email, password });
      } else {
        res = await axios.post('http://localhost:3001/signup', { email, password , name});
      }
      console.log("response in authpage " , res.data);
      
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
                    <Input className="px-2 py-2 my-2 w-full rounded"  onchange={(e) => setName(e.target.value)} placeholder="Name" />
                  </div>
                )}
                <label className="">Email</label>
                <Input className="px-2 py-2 my-2 w-full rounded" onchange={ (e) => setEmail(e.target.value) } placeholder="Username (Email)" />
                <label className="">Password</label>
                <Input 
                    onchange={(e) => setPassword(e.target.value)}
                    className="px-2 py-2 my-2 w-full rounded"
                    type="password"
                    placeholder="Password"
                />
                <Button className="bg-green-500 hover:bg-green-700 rounded-2xl  w-full mt-8 cursor-pointer" size="lg" onclick={clickHandler}>
                    {isSignin ? "Sign In" : "Sign Up"}
                </Button>
                {isSignin ? "Not have an account ? " : "Already have an account ? "}
                {isSignin ? <Link href="/signup" className="" ><span className="underline"> Signup</span></Link> : <Link href="/signin" ><span className="underline"> Signin</span></Link>}
                {error ? <p className="text-sm text-red-400">Please fill all the fields</p> : ""}
            </div>
        </div>
    </div>
  );
}
