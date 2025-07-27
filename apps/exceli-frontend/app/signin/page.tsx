import { Auth } from "@/components/ui/AuthPage";

export default function Signup() {
      console.log("in signup page")

    return(
        <div>
            <Auth isSignin={true} />
        </div>
    )
}