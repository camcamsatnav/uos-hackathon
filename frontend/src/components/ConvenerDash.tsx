import {useEffect, useState} from "react";
import {SimpleAcademicType, StudentType} from "../assets/Types.ts";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import {TableHead} from "@mui/material";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import Convener from "./Convener.tsx";
import {useUser} from "@clerk/clerk-react";


function ConvenerDash() {
    const [students, setStudents] = useState<StudentType[]>([])
    const [academics, setAcademics] = useState<SimpleAcademicType[]>([])
    const [currentStudent, setCurrentStudent] = useState<StudentType>({"id": -1, "projects": []})
    const [, setIsLoading] = useState(false)
    const [allocated, setAllocated] = useState<number[]>([-1])
    const {user} = useUser();
    useEffect(() => {
        setIsLoading(true);
        fetch(`http://localhost:8000/api/convener/?id=${user?.id}`)
            .then(response => response.json())
            .then((data: {academics: SimpleAcademicType[], students: StudentType[]}) => {
                setStudents(data.students);
                setAcademics(data.academics);
                const temp = []
                for (let i = 0; i < data.academics.length; i++) {
                    temp.push(...data.academics[i].students)
                }
                setAllocated(temp);
                setIsLoading(false);
            });
    }, [currentStudent, user]);



    return (
        <>
        {currentStudent.id === -1 ?
                <TableContainer component={Paper}>
                    <Table sx={{minWidth: 650}} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{fontWeight: 700}}>Student</TableCell>
                                <TableCell sx={{fontWeight: 700}} align="right">URN</TableCell>
                                <TableCell sx={{fontWeight: 700}} align="right">Needs allocating?</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {students?.map((row) => (
                                <>
                                    <TableRow
                                        key={row.id}
                                        sx={{'&:last-child td, &:last-child th': {border: 0}}}
                                        onClick={() => {
                                            if (allocated.includes(row.id)) return;
                                            setCurrentStudent(row);
                                        }}
                                    >
                                        <TableCell component="th" scope="row">{row.name}</TableCell>
                                        <TableCell align="right">{row.id}</TableCell>
                                        {allocated.includes(row.id) ? <TableCell align="right">{"Allocated"}</TableCell> : <TableCell align="right">{"Needs allocating"}</TableCell>}
                                    </TableRow>
                                </>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                : <Convener currentStudent={currentStudent} setCurrentStudent={setCurrentStudent} academics={academics}/>

        }
        </>
    )

}
export default ConvenerDash;