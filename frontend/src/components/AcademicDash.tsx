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

    useEffect(() => {
        setIsLoading(true);
        fetch(`https://ee07-131-227-156-30.ngrok-free.app/api/academics/?id=${user?.id}`)
            .then(response => response.json())
            .then(data => {
                setAcademic(data);
                setIsLoading(false);
            })
    }, [currentData.currentStudent]);

    const {user} = useUser();
    const handleChange = (_: SyntheticEvent, newValue: number) => {
        setCurrentData({
            ...currentData,
            tabValue: newValue
        });
    };
    return (
        <>
            {currentData.visibleTabs ?
                <Tabs value={currentData.tabValue} onChange={handleChange} aria-label="tabs">
                    <Tab label="Todo" {...a11yProps(0)} />
                    <Tab label="Completed" {...a11yProps(1)} />
                </Tabs>
                : <></>}
            {currentData.currentStudent.id === -1 ?
                <>
                    <TabPanel value={currentData.tabValue} index={0}>
                        <AcademicTable academic={academic} todo={true} currentData={currentData} setCurrentData={setCurrentData}/>
                    </TabPanel>
                    <TabPanel value={currentData.tabValue} index={1}>
                        <AcademicTable academic={academic} todo={false} currentData={currentData} setCurrentData={setCurrentData}/>
                    </TabPanel>
                </>
                : <Academic currentData={currentData} setCurrentData={setCurrentData}/>
            }
        </>
    )
}

export default AcademicDash;
