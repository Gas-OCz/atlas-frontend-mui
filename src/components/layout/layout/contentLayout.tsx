import React from "react";
import { LayoutProps } from "@pankod/refine-core";
import { Box, Container } from "@pankod/refine-mui";
import MyMenu, { EMenu } from "@components/layout/menu";
import { IRaceSet } from "../../../../pages/[race]";
import { nudista } from "../../../../pages/_app";
export interface ContentLayout extends LayoutProps {
  race: IRaceSet;
  section: string | undefined;
  pageType: EMenu;
  homepagePosition?: "LEFT" | "RIGHT";
}

export const ContentLayout: React.FC<ContentLayout> = (props) => {
  const { Footer, OffLayoutArea, children } = props;
  return (
    <>
      <Box display="flex" flexDirection="row">
        <Box
          sx={{
            display: "flex",
            fontFamily: nudista.style,
            flexDirection: "column",
            flex: 1,
            minHeight: "100vh",
            backgroundColor: "#FAF3E3",
          }}
        >
          <Box
            component="main"
            sx={{
              pt: { xs: 0, md: 1, lg: 2 },
              px: { xs: 0, md: 1, lg: 2 },
              flexGrow: 1,
              backgroundColor: "#FAF3E3",
            }}
          >
            <Container maxWidth="lg" sx={{ px: { xs: 0, md: 1, lg: 2 } }}>
              <MyMenu {...props} />
              {children}
            </Container>
          </Box>
          <Container maxWidth="lg" sx={{ px: { xs: 0, md: 1, lg: 2 } }}>
            <Box maxWidth="lg" sx={{ paddingX: 0, backgroundColor: "#1A4D2E" }}>
              {Footer && <Footer />}
            </Box>
          </Container>
        </Box>
        {OffLayoutArea && <OffLayoutArea />}
      </Box>
    </>
  );
};
