import './App.css';
import { SignOutButton, SignedOut, SignedIn, useUser, UserButton } from "@clerk/clerk-react";
import Login from "./components/Login.tsx";



function App() {
    const { user, isSignedIn } = useUser();
    return (
        <>
            <SignedOut>
                <Login/>
            </SignedOut>
            <SignedIn>
                {isSignedIn ? <><h1>{user?.publicMetadata.type as never}</h1> <UserButton/></> : <h1>"Not signed in"</h1>}
                <h1>Sign out</h1>
                <SignOutButton/>
            </SignedIn>
        </>
    )
}
export default App
