import {useEffect, useState} from "react";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

interface Student {
    id: string;
    name: string;
    exams: Exam[];
}

interface Exam {
    id: number;
    name: string;
    state: string;
    grade: number;
}

function Student() {
    const [data, setData] = useState<Student>({"id": "", "name": "", "exams": []})
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        setIsLoading(true)
        fetch('https://api.example.com/items')
            .then(response => response.json())
            .then(data => {
                setData(data)
                setIsLoading(false)
            });
    }, []);
    //request from api for the students data
    //useEffect to call the request
    //show data in a table
    return (
        <>
            <div>
            {isLoading ? <h1>Loading...</h1> : <h1>Loaded</h1>}
            </div>
            <div>
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Exam</TableCell>
                                <TableCell align="right">Score</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {data.exams.map((e) => {
                                if (e.state !== "MODERATED") return <></>
                                return (
                                    <TableRow>
                                        <TableCell component="th" scope="row">{e.name}</TableCell>
                                        <TableCell align="right">{e.grade}</TableCell>
                                    </TableRow>
                                )
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
        </>


    )
}
export default Student;