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
  Typography,
} from "@pankod/refine-mui";
import React from "react";
import { Menu as MenuIcon } from "@mui/icons-material";

import Link from "next/link";
import Image from "next/image";
import whiteLogo from "public/logo/LogoAA-08.png";
import { LayoutProps } from "@pankod/refine-core";
import { IRaceSet } from "../../../../pages/[race]";
import { nhost } from "../../../utilites/nhost";
import { cheddarGothic, nudista } from "../../../../pages/_app";
import { useRouter } from "next/navigation";

export interface PageProps extends LayoutProps {
  race: IRaceSet;
  section: string | undefined;
  pageType: EMenu;
  homepagePosition?: "LEFT" | "RIGHT";
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

export const menuItemsBike = [
  { route: "", title: "Home", type: EMenu.homepage },
  { route: "about", title: "O závodu", type: EMenu.texts },
  { route: "propozice", title: "Propozice", type: EMenu.texts },
  { route: "contacts", title: "Kontakty", type: EMenu.texts },
];

// const themeColorOrange = {
//   footer: "#1A4D2E",
//   menu: "#ff9f29",
//   registraceButton: {
//     font: "white",
//     background: "#1A4D2E",
//   },
//   menuActive: "#1A4D2E",
//   menuSelected: {
//     background: "#ff9f29",
//     text: "#1A4D2E",
//   },
// };

const themeColorGreen = {
  footer: "#1A4D2E",
  menu: "#1A4D2E",
  registraceButton: {
    font: "black",
    background: "#ff9f29",
  },
  menuActive: "#ff9f29",
  menuSelected: {
    background: "#1A4D2E",
    text: "#ff9f29",
  },
};
const MyMenu = (props: PageProps) => {
  const { race } = props;

  const { startDate, endDate, place } = race;
  const router = useRouter();
  console.log(race.names);
  const navItems =
    props?.homepagePosition === "RIGHT" ? menuItemsBike : menuItems;
  const drawerWidth = 240;
  //const classes = useStyles();

  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };

  const themeColor = themeColorGreen;

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: "center" }}>
      <List>
        <ListItem disablePadding>
          <ListItemButton
            onClick={() => router.push(`/${race.route}/registrace`)}
          >
            <ListItemText primary={`Registrace`} />
          </ListItemButton>
        </ListItem>
        {navItems.map((item) => (
          <ListItem key={item.route} disablePadding>
            <ListItemButton
              onClick={() => router.push(`/${race.route}/${item.route}`)}
            >
              <ListItemText primary={item.title} />
            </ListItemButton>
          </ListItem>
        ))}
        <ListItem
          disablePadding
          sx={{
            backgroundColor: themeColor.menuActive,
            color: "white",
            fontWeight: "bold",
          }}
        >
          <ListItemButton onClick={() => router.push(`/`)}>
            <ListItemText primary={`${race.names.join("/")}`} />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  //const container = window !== undefined ? () => document.body : undefined;
  const activeMenuSx = {
    backgroundImage: "linear-gradient(transparent 48%, #ff9f29 0%)",
    paddingX: 1.5,

    paddingY: 0.5,
  };
  const menuSx = {
    paddingX: 0,

    paddingY: 0.5,
  };

  const toolbar = {
    "& .MuiToolbar-root": {
      minHeight: 5,
    },
  };
  const section = props.section;
  const raceTitle = race?.title?.split(/\s/g);

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
            sx={{ color: "black", mr: 2, display: { lg: "none" } }}
          >
            <MenuIcon sx={{ color: "black" }} />
            <Typography sx={{ paddingLeft: 1 }} variant={"h5"}>
              Menu
            </Typography>
          </IconButton>

          <Box
            sx={{
              display: {
                xs: "none",
                lg: "block",
              },
            }}
          >
            <Box sx={{ display: "flex" }}>
              {navItems.map((item, index) => (
                <Link
                  key={`menu${item.route}`}
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
                      fontFamily: nudista.style,
                      paddingX: 2,
                    }}
                  >
                    <Box
                      sx={
                        item.route === section ||
                        (section === "homepage" && item.route === "")
                          ? activeMenuSx
                          : menuSx
                      }
                    >
                      {item.title}
                    </Box>
                  </Button>
                </Link>
              ))}

              <Link
                style={{
                  position: "absolute",
                  right: 0,
                  textDecoration: "none",
                  color: themeColor.menuActive,
                  width: 280,
                }}
                href={`/`}
              >
                <Button
                  sx={{
                    padding: 0,
                    color: themeColor.menuSelected.text,
                    fontSize: 24,
                    textTransform: "none",
                    fontWeight: "Bold",
                    fontFamily: nudista.style,
                    paddingX: 2,
                  }}
                >
                  <Box
                    sx={{
                      paddingX: 3,

                      paddingY: 0.5,
                      backgroundImage: `linear-gradient(transparent 0%, ${themeColor.menuSelected.background} 0%)`,
                    }}
                  >
                    {"Adventure / Bike"}
                  </Box>
                </Button>
              </Link>
            </Box>
          </Box>
        </Toolbar>
      </AppBar>
      <Box
        component="main"
        sx={{
          p: 3,
          backgroundColor: themeColor.menu,
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
            <Stack direction={"row"}>
              <Image
                src={whiteLogo}
                alt={"whiteLogo"}
                width={215}
                style={{ cursor: "pointer" }}
                onClick={() => router.push(`/${race.route}`)}
              />
              <Box
                sx={{
                  marginTop: 6,
                  color: "#FAF3E3",
                  fontFamily: cheddarGothic.style.fontFamily,
                }}
              >
                <Box sx={{ fontSize: 60 }}>{raceTitle?.[0]}</Box>
                <Box sx={{ fontSize: 30, marginTop: -2.8 }}>
                  {raceTitle?.[1]}
                </Box>
              </Box>
            </Stack>
          </Box>

          <Box
            sx={{
              display: { xs: "none", lg: "block" },
              zIndex: 100,
              minHeight: "220px",
            }}
          >
            <Box
              sx={{
                color: "#FAF3E3",
                fontSize: 36,
                fontWeight: "bold",

                fontFamily: cheddarGothic.style,
              }}
            >
              {place}
            </Box>
            <Stack direction={"row"}>
              <DateField
                sx={{
                  color: "#FAF3E3",
                  fontSize: 96,
                  fontWeight: "bold",

                  fontFamily: cheddarGothic.style,
                }}
                value={startDate}
                format={"DD. -"}
              />

              <DateField
                sx={{
                  paddingLeft: 1.5,
                  color: "#FAF3E3",
                  fontSize: 96,
                  fontWeight: "bold",
                  fontFamily: cheddarGothic.style,
                }}
                value={endDate}
                format={" DD. MM. YYYY"}
              />
              <Box sx={{ paddingLeft: 3, paddingRight: 3, marginTop: 4.5 }}>
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
      </Box>
      {section !== "registrace" && section !== "registrace-dokoncena" && (
        <Box
          sx={{
            marginTop: { xs: 0, lg: -8 },

            position: { xs: "relative", lg: "absolute" },
            //display: { xs: "none", lg: "block" },
            left: { lg: "calc(50% - 130px)" },
            zIndex: 500,
            width: { xs: "100%", lg: "260px" },
            // border: "1px solid #000",
            padding: { xs: 0, lg: 1.5 },
            textAlign: "center",
          }}
        >
          {/*marginTop: -4,*/}
          {/*position: "absolute",*/}
          {/*left: "calc(50% - 130px)",*/}
          {/*zIndex: 500,*/}
          {/*width: "260px",*/}
          {/*fontSize: 24,*/}
          {/*fontWeight: "bold",*/}
          {/*// border: "1px solid #000",*/}
          {/*padding: 1.5,*/}
          {/*textAlign: "center",*/}
          <Box
            sx={{
              zIndex: 500,
              backgroundColor: themeColor.registraceButton.background,
            }}
          >
            <Link
              style={{ textDecoration: "none" }}
              href={`/${race.route}/registrace`}
            >
              <Button
                sx={{
                  width: "100%",
                  p: { xs: 0.5, lg: 3 },
                  color: themeColor.registraceButton.font,
                  fontSize: { xs: 25, lg: 40 },
                  backgroundColor: themeColor.registraceButton.background,
                  fontWeight: 700,
                  fontStyle: "normal",
                  fontFamily: cheddarGothic.style,
                }}
              >
                Registrace
              </Button>
            </Link>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default MyMenu;
