import { Link } from "react-router-dom";
import { styled, Box, Typography } from "@mui/material";
import appConfig from "src/config/appConfig";

const LinkStyled = styled(Link)(() => ({
  height: "70px",
  overflow: "hidden",
  display: "block",
  textDecoration: "none",
}));

const Logo = () => {
  return (
    <LinkStyled
      to="/"
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
          background: "linear-gradient(135deg, #4f46e5 0%, #3b82f6 50%, #0891b2 100%)",
          boxShadow: "0 4px 14px rgba(79, 70, 229, 0.3)",
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
