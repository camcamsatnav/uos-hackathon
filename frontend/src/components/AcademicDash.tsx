import {SyntheticEvent, useEffect, useState} from "react";
import {Tab, Tabs} from "@mui/material";
import Academic from "./Academic.tsx";
import {AcademicType, CurrentData} from "../assets/Types.ts";
import {useUser} from "@clerk/clerk-react";
import TabPanel from "./TabPanel.tsx";
import AcademicTable from "./AcademicTable.tsx";

function a11yProps(index: number) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}



function AcademicDash() {
    const [, setIsLoading] = useState(false);
    const [academic, setAcademic] = useState<AcademicType>(); //all students that have been allocated to the academic and is requiring marking
    const [currentData, setCurrentData] = useState<CurrentData>({"currentStudent": {"id": -1, "projects": []}, "currentProject": -1, "currentAcademic": -1, "tabValue": 0, "visibleTabs": true});
    const {user} = useUser();
    useEffect(() => {
        setIsLoading(true);
        fetch(`http://localhost:8000/api/academics/?id=${user?.id}`)
            .then(response => response.json())
            .then(data => {
                setAcademic(data);
                setIsLoading(false);
            })
    }, [currentData.currentStudent, user]);


    const handleChange = (_: SyntheticEvent, newValue: number) => {
        setCurrentData({
            ...currentData,
            tabValue: newValue
        });
    };
    return (
        <>
            <div>
            {currentData.visibleTabs ?
                <Tabs value={currentData.tabValue} onChange={handleChange} aria-label="tabs">
                    <Tab label="Todo" {...a11yProps(0)} />
                    <Tab label="Completed" {...a11yProps(1)} />
                </Tabs>
                : <></>}
            </div>
            {currentData.currentStudent.id === -1 ?
                <>
                    <div>
                    <TabPanel value={currentData.tabValue} index={0}>
                        {JSON.stringify(academic)?.includes("PENDING")
                            ? <AcademicTable academic={academic} todo={true} currentData={currentData} setCurrentData={setCurrentData}/>
                            : <h1>No students to mark</h1>
                        }
                    </TabPanel>
                    <TabPanel value={currentData.tabValue} index={1}>
                        <AcademicTable academic={academic} todo={false} currentData={currentData} setCurrentData={setCurrentData}/>
                    </TabPanel>
                    </div>
                </>
                : <Academic currentData={currentData} setCurrentData={setCurrentData}/>
            }
        </>
    )
}

export default AcademicDash;
