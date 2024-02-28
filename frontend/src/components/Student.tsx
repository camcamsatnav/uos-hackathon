import {useEffect, useState} from "react";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import {useUser} from "@clerk/clerk-react";

interface Student {
    clerk_id: string
    name: string;
    exams: Exam[];
}

interface Exam {
    name: string;
    date: string;
    state: string;
    module: number;
    total_marks: number;
}

function Student() {
    const { user } = useUser();
    const [student, setStudent] = useState<Student>({"clerk_id": user?.id ? user.id : "", "name": "", "exams": []})
    const [isLoading, setIsLoading] = useState(true)
    const [exam, setExam] = useState<Exam[]>([])


    useEffect(() => {
        setIsLoading(true)
        fetch(`https://c193-131-227-156-30.ngrok-free.app/api/student/?id=${user?.id}`)
            .then(response => response.json())
            .then(data => {
                setStudent(data[0].fields);
                fetch(`https://c193-131-227-156-30.ngrok-free.app/api/exam/?id=${data[0].fields.exams.join(',')}`)
                    .then(res => res.json())
                    .then(data => {
                        setExam(data.map((e: { fields: Exam; }) => {return e.fields}));
                    })
                setIsLoading(false);
            });
    }, []);

    return (
        <>
            {isLoading ? <h1>Loading...</h1> :
            <div>
                <h1>{student.name}'s scores</h1>
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Exam</TableCell> {/*css so this dont look dumb*/}
                                <TableCell align="right">Score</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {exam.map(e => {
                                if (e.state !== "MODERATED") return <></>
                                return (
                                    <TableRow key={e.name} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                        <TableCell component="th" scope="row">{e.name}</TableCell>
                                        <TableCell align="right">{e.total_marks}</TableCell>
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