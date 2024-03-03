import {SimpleAcademicType, StudentType} from "../assets/Types.ts";
import {Dispatch, SetStateAction, useState} from "react";
import {SubmitHandler, useForm} from "react-hook-form";
import {Alert, Button, TextField} from "@mui/material";
import MultiSelect from "./MultiSelect.tsx";

type ConvenerProps = {
    currentStudent: StudentType;
    setCurrentStudent: Dispatch<SetStateAction<StudentType>>;
    academics: SimpleAcademicType[];
}
type FormValues = {
    id: string;
}

function Convener({currentStudent, setCurrentStudent, academics}: ConvenerProps) {
    const {register, handleSubmit} = useForm<FormValues>()
    const [, setIsLoading] = useState(false);
    const [personName, setPersonName] = useState<number[]>([]);
    const [invalidCount, setInvalidCount] = useState(false);
    const onSubmit: SubmitHandler<FormValues> = (data) => {
        setIsLoading(true);
        if (personName.length < 2) {
            setInvalidCount(true);
            setTimeout(() => {
                setInvalidCount(false);
            }, 1700);
            setIsLoading(false);
            return;
        }
        const requestOptions = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({studentId: parseInt(data.id), academicId: personName})
        };
        fetch('http://localhost:8000/api/assign/', requestOptions)
            .then(response => response.json())
            .then(() => {
                setCurrentStudent({"id": -1, "projects": []});
            });
        setIsLoading(false);
    }

    return (
        <>
            {invalidCount
                ? <div className={"py-4"}><Alert variant="outlined" severity="error">You must select at least 2
                    academics</Alert></div>
                : <></>
            }


            <form style={{display: "flex", flexDirection: "column", width: "40%"}} onSubmit={handleSubmit(onSubmit)}>
                <div className={"py-2"}>
                    <TextField
                        aria-readonly={"true"}
                        id="outlined-disabled"
                        label="student"
                        value={currentStudent.name}
                        style={{width: "100%"}}
                    />
                </div>
                <div className={"py-2"}>
                    <TextField
                        aria-readonly={"true"}
                        id="outlined-disabled"
                        label="urn"
                        value={currentStudent.id}
                        {...register("id")}
                        style={{width: "100%"}}
                    />
                </div>
                <div className={"py-2"}>
                    <TextField
                        aria-readonly={"true"}
                        id="outlined-disabled"
                        label="project"
                        value={currentStudent.projects.map(e => e.name).join(", ")}
                        style={{width: "100%"}}
                    />
                </div>
                <div className={"py-2"}>
                    <TextField
                        aria-readonly={"true"}
                        id="outlined-disabled"
                        label="preferences"
                        value={currentStudent.preferences}
                        style={{width: "100%"}}
                    />
                </div>
                <div className={"py-2"}>
                    <MultiSelect names={academics} personName={personName} setPersonName={setPersonName}/>
                </div>
                <div className={"py-2"}>
                    <Button variant="outlined" type="submit">submit</Button>
                </div>
            </form>

        </>
    )
}

export default Convener;