import { useContext } from "react";
import { EventContext } from "../../context/EventContext";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import evTypes from "./event-type.json"

export default function EventTypeFilter() {

  const {
    eventTypeFilterValue,
    setEventTypeFilterValue
  } = useContext(EventContext);

  const sortedData = evTypes.filter(a => a.label).sort((a, b) => a.label.localeCompare(b.label));


  return (
    <Autocomplete
      multiple
      id="tags-standard"
      options={sortedData}
      groupBy={(option) => option.label[0]}
      value={eventTypeFilterValue}
      getOptionLabel={(option) => option.label}
      isOptionEqualToValue={(option, value) => option.id === value.id}
      renderOption={(props, option) => (
        <li {...props} key={option.id}>
          {option.label}
        </li>
      )}
      onChange={(event, newValue) => {
        setEventTypeFilterValue(newValue);
      }}
      sx={{
        width: 322,
        marginTop: "10px",
        marginLeft: "auto",
        marginRight: "auto",
      }}
      renderInput={(params) => (
        <TextField {...params} label="Event Type" placeholder="Type" />
      )}
    />
  );
}
