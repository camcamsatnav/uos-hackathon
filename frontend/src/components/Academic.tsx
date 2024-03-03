import {Dispatch, SetStateAction} from "react";
import {Button, Checkbox, FormControlLabel, TextField} from "@mui/material";
import {useForm, SubmitHandler} from "react-hook-form"
import {CurrentData} from "../assets/Types.ts";

type AcademicProps = {
    currentData: CurrentData;
    setCurrentData: Dispatch<SetStateAction<CurrentData>>;
}

type FormValues = {
    id: string;
    name: string;
    score: string;
    module: number;
}

function Academic({currentData, setCurrentData}: AcademicProps) {
    const {register, handleSubmit} = useForm<FormValues>()
    const onSubmit: SubmitHandler<FormValues> = (data) => {
        const requestOptions = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({studentId: parseInt(data.id), projectId: currentData.currentProject, academicId: currentData.currentAcademic, score: parseInt(data.score)})
        };
        fetch('http://localhost:8000/api/marks/', requestOptions)
            .then(response => response.json())
            .then(() => {
                setCurrentData({
                    ...currentData,
                    visibleTabs: true,
                    currentStudent: {"id": -1, "projects": []}
                })
            });
    }
    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)}>
                <TextField
                    aria-readonly={"true"}
                    id="outlined-disabled"
                    label="urn"
                    value={currentData.currentStudent.id}
                    {...register("id")}
                />
                <TextField
                    aria-readonly={"true"}
                    id="outlined-disabled"
                    label="name"
                    value={currentData.currentStudent.name}
                    {...register("name")}
                />
                <TextField
                    aria-readonly={"true"}
                    id="outlined-disabled"
                    label="module"
                    value={currentData.currentStudent.projects.filter(e => e.id === currentData.currentProject).map(e => e.module)}
                    {...register("module")}
                />
                <TextField
                    id="outlined-number"
                    label="score"
                    type="number"
                    defaultValue={0}
                    InputLabelProps={{
                        shrink: true,
                    }}
                    {...register("score")}
                />
                <FormControlLabel required control={<Checkbox/>} label="plagarism checked?"/>
                <Button variant="outlined" type="submit">submit</Button>
                <br/>
            </form>
        </>
    )
}

export default Academic;