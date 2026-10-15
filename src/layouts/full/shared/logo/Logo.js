import { Link } from "react-router-dom";
import { styled, Box, Typography } from "@mui/material";
import appConfig from "src/config/appConfig";
import { useBasePath } from "../../../../context/BasePathContext";

const LinkStyled = styled(Link)(() => ({
  height: "70px",
  overflow: "hidden",
  display: "block",
  textDecoration: "none",
}));

const Logo = () => {
  const basePath = useBasePath();


  return (
    <LinkStyled
      to={basePath || "/"}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          px: 3,
          py: 1.5,
          borderRadius: "10px",
          background: "linear-gradient(135deg, #161874 0%, #312e81 50%, #4c1d95 100%)",
          boxShadow: "0 4px 14px rgba(22, 24, 116, 0.3)",
        }}
      >
        <Typography
          sx={{
            fontFamily: "'Inter', 'Arial', sans-serif",
            fontSize: "1.1rem",
            fontWeight: 700,
            color: "white",
            letterSpacing: "0.5px",
            textTransform: "uppercase",
          }}
        >
          {appConfig.appName}
        </Typography>
      </Box>
    </LinkStyled>
  );
};

export default Logo;
