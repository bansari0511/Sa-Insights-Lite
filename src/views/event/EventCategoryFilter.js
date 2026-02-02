import { useContext } from "react";
import { EventContext } from "../../context/EventContext";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import categories from "./event-category.json"

export default function EventCategoryFilter() {

  const {
    eventCategoryFilterValue,
    setEventCategoryFilterValue
  } = useContext(EventContext);

  const sortedData = categories.filter(a => a.label).sort((a, b) => a.label.localeCompare(b.label));


  return (
    <Autocomplete
      multiple
      id="tags-standard"
      options={sortedData}
      groupBy={(option) => option.label[0]}
      value={eventCategoryFilterValue}
      getOptionLabel={(option) => option.label}
      isOptionEqualToValue={(option, value) => option.id === value.id}
      renderOption={(props, option) => (
        <li {...props} key={option.id}>
          {option.label}
        </li>
      )}
      onChange={(event, newValue) => {
        setEventCategoryFilterValue(newValue);
      }}
      sx={{
        width: 322,
        marginTop: "10px",
        marginLeft: "auto",
        marginRight: "auto",
      }}
      renderInput={(params) => (
        <TextField {...params} label="Event Category" placeholder="Category" />
      )}
    />
  );
}
