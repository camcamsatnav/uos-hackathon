import { SignOutButton, SignedOut, SignedIn, useUser, UserButton } from "@clerk/clerk-react";
import Login from "./components/Login.tsx";
import Student from "./components/Student.tsx";



function App() {
    const { user } = useUser();
    return (
        <>
            <SignedOut>
                <Login/>
            </SignedOut>
            <SignedIn>
                <h1>{user?.id}</h1>
                {user?.publicMetadata.type === "student" ?
                <Student/> : <></>
                }
                {user?.publicMetadata.type === "academics" ?
                    <></> : <></>
                }
                {user?.publicMetadata.type === "convenors" ?
                    <></> : <></>
                }
                <UserButton/>
                <SignOutButton/>
            </SignedIn>
        </>
    )
}
export default App
