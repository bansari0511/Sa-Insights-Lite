import React, { useEffect, useState } from "react";
import { useTheme } from '@mui/material';
import PropTypes from "prop-types";
import TextField from "@mui/material/TextField";
import Autocomplete, { autocompleteClasses } from "@mui/material/Autocomplete";
import useMediaQuery from "@mui/material/useMediaQuery";
import ListSubheader from "@mui/material/ListSubheader";
import Popper from "@mui/material/Popper";
import { useTheme, styled } from "@mui/material/styles";
import { VariableSizeList } from "react-window";
import Typography from "@mui/material/Typography";

const LISTBOX_PADDING = 8; // px

function renderRow(props) {
  const { data, index, style } = props;
  const dataSet = data[index];
  const inlineStyle = {
    ...style,
    top: style.top + LISTBOX_PADDING,
  };

  if (dataSet.hasOwnProperty("group")) {
    return (
      <ListSubheader key={dataSet.key} component="div" style={inlineStyle}>
        {dataSet.group}
      </ListSubheader>
    );
  }

  return (
    <Typography component="li" {...dataSet[0]} noWrap style={inlineStyle} key={dataSet[0].key || `item-${index}`}>
      {`#${dataSet[2] + 1} - ${dataSet[1]}`}
    </Typography>
  );
}

const OuterElementContext = React.createContext({});

const OuterElementType = React.forwardRef((props, ref) => {
  const outerProps = React.useContext(OuterElementContext);
  return <div ref={ref} {...props} {...outerProps} />;
});

function useResetCache(data) {
  const ref = React.useRef(null);
  React.useEffect(() => {
    if (ref.current != null) {
      ref.current.resetAfterIndex(0, true);
    }
  }, [data]);
  return ref;
}

// Adapter for react-window
const ListboxComponent = React.forwardRef(function ListboxComponent(
  props,
  ref
) {
  const { children, ...other } = props;
  const itemData = [];
  children.forEach((item) => {
    itemData.push(item);
    itemData.push(...(item.children || []));
  });

  const theme = useTheme();
  const smUp = useMediaQuery(theme.breakpoints.up("sm"), {
    noSsr: true,
  });
  const itemCount = itemData.length;
  const itemSize = smUp ? 36 : 48;

  const getChildSize = (child) => {
    if (child.hasOwnProperty("group")) {
      return 48;
    }

    return itemSize;
  };

  const getHeight = () => {
    if (itemCount > 8) {
      return 8 * itemSize;
    }
    return itemData.map(getChildSize).reduce((a, b) => a + b, 0);
  };

  const gridRef = useResetCache(itemCount);

  return (
    <div ref={ref}>
      <OuterElementContext.Provider value={other}>
        <VariableSizeList
          itemData={itemData}
          height={getHeight() + 2 * LISTBOX_PADDING}
          width="100%"
          ref={gridRef}
          outerElementType={OuterElementType}
          innerElementType="ul"
          itemSize={(index) => getChildSize(itemData[index])}
          overscanCount={5}
          itemCount={itemCount}
        >
          {renderRow}
        </VariableSizeList>
      </OuterElementContext.Provider>
    </div>
  );
});

ListboxComponent.propTypes = {
  children: PropTypes.node,
};

const StyledPopper = styled(Popper)({
  [`& .${autocompleteClasses.listbox}`]: {
    boxSizing: "border-box",
    "& ul": {
      padding: 0,
      margin: 0,
    },
  },
});

// Memoized to prevent unnecessary re-renders
const SearchBox = React.memo(function SearchBox({
  options,
  label,
  onChange,
  value,
  width = 500,
  placeholder
}) {
  const theme = useTheme();

  return (
    <Autocomplete
      id="virtualize-demo"
      sx={{ 
        width, 
        marginLeft: "auto", 
        marginRight: "auto", 
        marginTop: "20px", 
        backgroundColor: theme.palette.primary.contrastText 
      }}
      value={value}
      disableListWrap
      PopperComponent={StyledPopper}
      ListboxComponent={ListboxComponent}
      options={options}
      getOptionLabel={(option) => option?.label || ""}
      isOptionEqualToValue={(option, value) => option?.id === value?.id}
      renderInput={(params) => (
        <TextField {...params} label={label} placeholder={placeholder} />
      )}
      renderOption={(props, option, state) => [
        { ...props, key: option.id || option.label || `option-${state.index}` },
        option.label,
        state.index,
      ]}
      renderGroup={(params) => params}
      onChange={onChange}
    />
  );
});

SearchBox.displayName = 'SearchBox';

export default SearchBox;

SearchBox.propTypes = {
  options: PropTypes.array.isRequired,
  label: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.object,
  width: PropTypes.number,
  placeholder: PropTypes.string,
};