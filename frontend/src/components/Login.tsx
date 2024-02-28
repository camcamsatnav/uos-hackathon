import { SignInButton } from "@clerk/clerk-react"
import {Button} from "@mui/material";
function Login() {

    //put login page stuff here :D
    return (
        <SignInButton>
            <Button variant="outlined">Sign in</Button>
        </SignInButton>
    );
}

export default Login;