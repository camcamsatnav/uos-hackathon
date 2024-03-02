import { SignInButton } from "@clerk/clerk-react"
import { Button } from "@mui/material";
function Login() {

    //put login page stuff here :D
    return (
        <div className={"h-screen flex items-center justify-center flex-col"}>
            <div className={"p-4"}>Sign In</div>
            <SignInButton>
                <Button variant="outlined">Sign in</Button>
            </SignInButton>
        </div>
    );
}

export default Login;