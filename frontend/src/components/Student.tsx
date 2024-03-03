import {useEffect, useState} from "react";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import {useUser} from "@clerk/clerk-react";
import {StudentType, Project} from "../assets/Types.ts";

function Student() {
    const {user} = useUser();
    const [student, setStudent] = useState<StudentType>({
        "clerk_id": user?.id ? user.id : "",
        "name": "",
        "projects": [],
        "id": -1
    })
    const [isLoading, setIsLoading] = useState(true)
    const [project, setProject] = useState<Project[]>([])


    useEffect(() => {
        setIsLoading(true)
        fetch(`http://localhost:8000/api/student/?id=${user?.id}`)
            .then(response => response.json())
            .then(data => {
                setStudent(data);
                setProject(data.projects)
                setIsLoading(false);
            });
    }, [user]);
    return (
        <>
            {isLoading ? <h1>Loading...</h1> :
                <div>
                    <h1 className={"py-4 font-bold text-xl"}>{student.name}'s Scores</h1>
                    <TableContainer component={Paper}>
                        <Table sx={{minWidth: 650}} aria-label="simple table">
                            <TableHead>
                                <TableRow>{/*write HERE*/}
                                    <TableCell sx={{fontWeight: 700}}>{"Project"}</TableCell>
                                    <TableCell sx={{fontWeight: 700}} align="right">{"Score"}</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {project.map(e => {
                                    if (e.state !== "MODERATED" && e.state !== "SUBMITTED")return (
                                        <TableRow key={e.id} sx={{'&:last-child td, &:last-child th': {border: 0}}}>
                                            <TableCell component="th" scope="row">{e.name}</TableCell>
                                            <TableCell align="right">{"Unavailable"}</TableCell>
                                        </TableRow>
                                    )
                                    return (
                                        <TableRow key={e.id} sx={{'&:last-child td, &:last-child th': {border: 0}}}>
                                            <TableCell component="th" scope="row">{e.name}</TableCell>
                                            <TableCell align="right">{e.grade.map((elem) => elem.mark).reduce((a, b) => a + b, 0) / e.grade.length}</TableCell>
                                        </TableRow>
                                    )
                                })}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </div>
            }
        </>
    )
}

export default Student;