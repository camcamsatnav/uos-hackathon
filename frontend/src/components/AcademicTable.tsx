import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import {TableHead} from "@mui/material";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import {AcademicType, CurrentData} from "../assets/Types.ts";
import {Dispatch, SetStateAction} from "react";

interface AcademicTableProps {
    academic: AcademicType | undefined;
    todo: boolean;
    currentData: CurrentData;
    setCurrentData: Dispatch<SetStateAction<CurrentData>>;
}


function AcademicTable({academic, todo, currentData, setCurrentData}: AcademicTableProps) {
    return (
        <TableContainer component={Paper}>
            <Table sx={{minWidth: 650}} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell>Student</TableCell>
                        <TableCell align="right">URN</TableCell>
                        <TableCell align="right">Module</TableCell>
                        <TableCell align="right">Project</TableCell>
                        <TableCell align="right">State</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {academic?.students.map((row) => (
                        <>
                            {row.projects.filter(e => todo ? e.state === "PENDING" || e.state === "MODERATIONPENDING" : e.state !== "PENDING" && e.state !== "MODERATIONPENDING").map((e) => (
                                <TableRow
                                    key={e.id + " " + row.id}
                                    sx={{'&:last-child td, &:last-child th': {border: 0}}}
                                    onClick={() => {
                                        if (!todo) return;
                                        setCurrentData({
                                            ...currentData,
                                            currentStudent: row,
                                            currentAcademic: academic.id,
                                            visibleTabs: false,
                                            currentProject: e.id
                                        })
                                    }}
                                >
                                    <TableCell component="th" scope="row">{row.name}</TableCell>
                                    <TableCell align="right">{row.id}</TableCell>
                                    <TableCell align="right">{e.module}</TableCell>
                                    <TableCell align="right">{e.name}</TableCell>
                                    <TableCell align="right">{e.state}</TableCell>
                                </TableRow>
                            ))}
                        </>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    )
}

export default AcademicTable;