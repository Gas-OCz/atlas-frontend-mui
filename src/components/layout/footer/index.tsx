import React from "react";
import logo from "../../../../public/footer-logo.png";
import Image from "next/image";
import { Box, Stack, Typography, width } from "@pankod/refine-mui";
import { Grid } from "@mui/material";

export const Footer: React.FC = () => (
  <Box sx={{ display: "flex", justifyContent: "space-between", pb: 2, px: 2 }}>
    <Box style={{ width: 71, marginRight: 10, alignSelf: "center" }}>
      <Stack direction={"row"}>
        <Image width={67} src={logo} alt={"footer-logo"} />
      </Stack>
    </Box>
    <Box style={{ width: "100%", alignSelf: "center" }}>
      <div style={{ height: "1px", border: "1px solid #000" }}></div>
    </Box>
    <Box
      style={{
        marginLeft: 10,
        minWidth: 110,
        alignSelf: "center",
        textAlign: "right",
      }}
    >
      <Stack direction={"column"}>
        <Typography style={{ fontSize: 10 }}>
          All rights reserved 2023
        </Typography>
        <Typography style={{ fontSize: 10 }}>Developed by Gas-O</Typography>
        <Typography style={{ fontSize: 10 }}>admin@sitepark.cz</Typography>
      </Stack>
    </Box>
  </Box>
);
