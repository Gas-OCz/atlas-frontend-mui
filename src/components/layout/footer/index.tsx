import React from "react";
import Image from "next/image";
import { Box, Stack, Typography } from "@pankod/refine-mui";
import { nudista } from "../../../../pages/_app";
import whiteLogo from "public/logo-white.svg";
export const Footer: React.FC = () => (
  <Box
    sx={{
      display: "flex",
      justifyContent: "space-between",
      p: 1.0,
      color: "white",
    }}
  >
    <Box style={{ width: 71, marginRight: 10, alignSelf: "center" }}>
      <Stack direction={"row"}>
        <Image width={88} src={whiteLogo} alt={"footer-logo"} />
      </Stack>
    </Box>
    <Box style={{ width: "100%", alignSelf: "center" }}></Box>
    <Box
      style={{
        marginLeft: 10,
        minWidth: 110,
        alignSelf: "center",
        textAlign: "right",
      }}
    >
      <Stack direction={"column"} sx={{ fontFamily: nudista.style }}>
        <Typography style={{ fontSize: 10 }}>
          All rights reserved 2023
        </Typography>
        <Typography style={{ fontSize: 10 }}>Developed by Gas-O</Typography>
        <Typography style={{ fontSize: 10 }}>admin@sitepark.cz</Typography>
      </Stack>
    </Box>
  </Box>
);
