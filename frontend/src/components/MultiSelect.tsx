import { Theme, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Chip from '@mui/material/Chip';
import {Dispatch, SetStateAction} from "react";
import {SimpleAcademicType} from "../assets/Types.ts";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

type MultipleSelectProps = {
    names: SimpleAcademicType[];
    personName: number[];
    setPersonName: Dispatch<SetStateAction<number[]>>
}

type numberArray =  {
    target: {value: number[]}
}

function getStyles(name: number, personName: readonly number[], theme: Theme) {
    return {
        fontWeight:
            !personName.includes(name)
                ? theme.typography.fontWeightRegular
                : theme.typography.fontWeightMedium,
    };
}

function MultipleSelectChip({names, personName, setPersonName}: MultipleSelectProps) {
    const theme = useTheme();
    const handleChange = (event: SelectChangeEvent<typeof personName>) => {
        const {
            target: { value },
        } = event as numberArray;
        setPersonName(
            [...value]
        );
    };

    return (
        <div>
            <FormControl sx={{ width: "100%" }}>
                <InputLabel id="demo-multiple-chip-label">Academics</InputLabel>
                <Select
                    labelId="demo-multiple-chip-label"
                    id="demo-multiple-chip"
                    multiple
                    value={personName}
                    onChange={handleChange}
                    input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
                    renderValue={(selected) => (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            {selected.map((e) => (
                                <Chip key={e} label={names.filter((a) => a.id === e).map((a) => a.name)[0]} />
                            ))}
                        </Box>
                    )}
                    MenuProps={MenuProps}
                >
                    {names.map((name) => (
                        <MenuItem
                            key={name.id}
                            value={name.id}
                            style={getStyles(name.id, personName, theme)}
                        >
                            {name.name}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </div>
    );
}
export default MultipleSelectChip;