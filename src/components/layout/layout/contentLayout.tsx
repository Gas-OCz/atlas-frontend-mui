import React from "react";
import { LayoutProps } from "@pankod/refine-core";
import { Box, Container } from "@pankod/refine-mui";
import MyMenu, { EMenu } from "@components/layout/menu";
import { IRaceSet } from "../../../../pages/[race]";
export interface ContentLayout extends LayoutProps {
  race: IRaceSet;
  section: string | undefined;
  pageType: EMenu;
}

export const ContentLayout: React.FC<ContentLayout> = (props) => {
  const { Footer, OffLayoutArea, children } = props;
  return (
    <>
      <Box display="flex" flexDirection="row">
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            flex: 1,
            minHeight: "100vh",
            backgroundColor: "#FAF3E3",
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
              <MyMenu {...props} />
              {children}
            </Container>
          </Box>
          <Container maxWidth="lg">
            <Box maxWidth="lg" sx={{ paddingX: 0 }}>
              {Footer && <Footer />}
            </Box>
          </Container>
        </Box>
        {OffLayoutArea && <OffLayoutArea />}
      </Box>
    </>
  );
};
