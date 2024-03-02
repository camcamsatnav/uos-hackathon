import {SignedOut, SignedIn, useUser, UserButton} from "@clerk/clerk-react";
import Login from "./components/Login.tsx";
import Student from "./components/Student.tsx";
import AcademicDash from "./components/AcademicDash.tsx";
import ConvenerDash from "./components/ConvenerDash.tsx";


function App() {
    const {user} = useUser();
    return (
        <div>
            <SignedOut>
                <Login/>
            </SignedOut>
            <SignedIn>
                <div className={"flex justify-between p-4 flex-row w-full"}>
                    <article className={"text-wrap"}>
                        {user?.publicMetadata.type === "student" ?
                            <h3 className={"font-bold text-xl"}>Student Dashboard</h3> : <></>
                        }
                        {user?.publicMetadata.type === "academic" ?
                            <h3 className={"font-bold text-xl"}>Academic Dashboard</h3> : <></>
                        }
                        {user?.publicMetadata.type === "convener" ?
                            <h3 className={"font-bold text-xl"}>Convener Dashboard</h3> : <></>
                        }
                    </article>
                    <UserButton/>
                </div>
                {user?.publicMetadata.type === "student" ?
                    <div className={"w-2/3 m-auto"}>
                        <Student/>
                    </div>: <></>
                }
                {user?.publicMetadata.type === "academic" ?
                    <div className={"w-2/3 m-auto"}>
                        <AcademicDash/>
                    </div> : <></>
                }
                {user?.publicMetadata.type === "convener" ?

                    <div className={"w-2/3 m-auto"}>
                        <ConvenerDash />
                    </div> : <></>
                }
            </SignedIn>
        </div>
    )
}

export default App
