import React from "react";
import { LayoutProps } from "@pankod/refine-core";
import { Box, Container } from "@pankod/refine-mui";

import { Sider as DefaultSider } from "../sider";
import { Header as DefaultHeader } from "../header";

export const Layout: React.FC<LayoutProps> = ({
  Footer,
  OffLayoutArea,
  children,
}) => {
  return (
    <Box display="flex" flexDirection="row">
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          minHeight: "100vh",
          backgroundColor: "red",
        }}
      >
        <Box
          component="main"
          sx={{
            p: { xs: 0, md: 1, lg: 2 },
            flexGrow: 1,
            backgroundColor: "#FAF3E3",
          }}
        >
          <Container maxWidth="lg" sx={{ px: { xs: 1, md: 1, lg: 2 } }}>
            {children}
            {Footer && <Footer />}
          </Container>
        </Box>
      </Box>
      {OffLayoutArea && <OffLayoutArea />}
    </Box>
  );
};
