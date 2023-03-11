import React from "react";
import { LayoutProps } from "@pankod/refine-core";
import { Box, Container } from "@pankod/refine-mui";
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
          <Container maxWidth="lg" sx={{ px: { xs: 0, md: 0, lg: 0 } }}>
            {children}
            <Box
              maxWidth="lg"
              sx={{ paddingX: 0, paddingY: 0, backgroundColor: "#1A4D2E" }}
            >
              {Footer && <Footer />}
            </Box>
          </Container>
        </Box>
      </Box>
      {OffLayoutArea && <OffLayoutArea />}
    </Box>
  );
};
