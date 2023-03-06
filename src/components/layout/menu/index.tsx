import {
  AppBar,
  IconButton,
  Toolbar,
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  CssBaseline,
  Button,
  Drawer,
  DateField,
  Stack,
} from "@pankod/refine-mui";
import React from "react";
import { Menu as MenuIcon } from "@mui/icons-material";

import Link from "next/link";
import Image from "next/image";
import whiteLogo from "public/logo-white.svg";
import { LayoutProps } from "@pankod/refine-core";
import { IRaceSet } from "../../../../pages/[race]";
import { nhost } from "../../../utilites/nhost";

export interface PageProps extends LayoutProps {
  race: IRaceSet;
  section: string | undefined;
  pageType: EMenu;
}

export enum EMenu {
  homepage,
  texts,
  galerie,
  registration,
  page404,
}
export const menuItems = [
  { route: "", title: "Home", type: EMenu.homepage },
  { route: "about", title: "O závodu", type: EMenu.texts },
  { route: "propozice", title: "Propozice", type: EMenu.texts },
  { route: "gallery", title: "Galerie", type: EMenu.galerie },
  { route: "results", title: "Výsledky", type: EMenu.texts },
  { route: "contacts", title: "Kontakty", type: EMenu.texts },
];
const MyMenu = (props: PageProps) => {
  const { race } = props;
  const { startDate, endDate, place } = race;

  const navItems = menuItems;
  const drawerWidth = 240;
  //const classes = useStyles();

  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: "center" }}>
      <List>
        {navItems.map((item, index) => (
          <ListItem key={index} disablePadding>
            <ListItemButton sx={{ textAlign: "center" }}>
              <Link
                style={{
                  textDecoration: "none",
                  color: "black",
                }}
                href={`/${props.race.route}/${item.route}`}
              >
                <ListItemText primary={item.title} />
              </Link>
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  //const container = window !== undefined ? () => document.body : undefined;
  const activeMenuSx = {
    backgroundImage: "linear-gradient(transparent 58%, #ff9f29 0%)",
    paddingX: 3,

    paddingY: 0.2,
  };

  const toolbar = {
    "& .MuiToolbar-root": {
      minHeight: 5,
    },
  };
  const section = props.section ?? "";
  return (
    <Box>
      <CssBaseline />

      <Box component="nav" sx={{ display: "flex" }}>
        <Drawer
          //container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: "block", lg: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
      </Box>
      <AppBar
        sx={{ ...toolbar, backgroundColor: "transparent", boxShadow: "none" }}
        position={"relative"}
      >
        <Toolbar sx={{ minHeight: 30 }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { lg: "none" } }}
          >
            <MenuIcon sx={{ color: "black" }} />
          </IconButton>

          <Box sx={{ display: { xs: "none", lg: "block" } }}>
            {navItems.map((item, index) => (
              <Link
                style={{
                  textDecoration: "none",
                  color: "black",
                }}
                href={`/${props.race.route}/${item.route}`}
              >
                <Button
                  key={index}
                  sx={{
                    padding: 0,
                    color: "#000",
                    fontSize: 24,
                    textTransform: "none",
                    fontWeight: "Bold",
                    paddingX: 2,
                  }}
                >
                  <Box sx={item.route === section ? activeMenuSx : undefined}>
                    {item.title}
                  </Box>
                </Button>
              </Link>
            ))}
          </Box>
        </Toolbar>
      </AppBar>
      <Box
        component="main"
        sx={{
          p: 3,
          backgroundColor: "#1A4D2E",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box>
            <Image src={whiteLogo} alt={whiteLogo} />
          </Box>

          <Box sx={{ display: { xs: "none", lg: "block" }, zIndex: 100 }}>
            <Box
              sx={{
                color: "white",
                fontSize: 40,
                fontWeight: "bold",
                fontFamily: "Pathway Gothic One",
              }}
            >
              {place}
            </Box>
            <Stack direction={"row"}>
              <DateField
                sx={{
                  fontFamily: "Pathway Gothic One",
                  color: "#FAF3E3",
                  fontSize: 96,
                  fontWeight: "bold",
                }}
                value={startDate}
                format={"DD. -"}
              />

              <DateField
                sx={{
                  paddingLeft: 1.5,
                  fontFamily: "Pathway Gothic One",
                  color: "#FAF3E3",
                  fontSize: 96,
                  fontWeight: "bold",
                }}
                value={endDate}
                format={" DD. MM. YYYY"}
              />
              <Box sx={{ paddingLeft: 6, marginTop: 5 }}>
                <img
                  src={nhost.storage.getPublicUrl({
                    fileId: "472e1437-ad8c-46a8-a979-5bf3f29bc15e",
                    width: 96,
                  })}
                  alt={""}
                  width={60}
                  height={60}
                />
              </Box>
            </Stack>
          </Box>
        </Box>
        {section === "" && (
          <Box
            sx={{
              position: "absolute",
              display: { xs: "none", lg: "block" },
              left: "calc(50% - 100px)",
              zIndex: 500,
              width: "200px",
              fontSize: 24,
              fontWeight: "bold",
              border: "1px solid #000",
              padding: 1.5,
            }}
          >
            <Box sx={{ p: 3, zIndex: 500, backgroundColor: "#ff9f29" }}>
              Registrace
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default MyMenu;
