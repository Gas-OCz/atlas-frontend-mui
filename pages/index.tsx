import React, { FC, useCallback, useEffect, useRef, useState } from "react";

import { HttpError, useList } from "@pankod/refine-core";
import { nhost } from "../src/utilites/nhost";
import {
  Box,
  debounce,
  ImageList,
  ImageListItem,
  Stack,
} from "@pankod/refine-mui";
import { Layout } from "@components/layout";
import { Footer } from "@components/layout/footer";
import Image from "next/image";
import logo from "public/logo.png";
import { useWindowSize } from "@components/hooks/windowsResize";
import { useRouter } from "next/dist/client/router";
import { cheddarGothic } from "./_app";
export interface IHomePage {
  loading: boolean;
  id_file: string;
  title: string;
  prerex: string;
  homepage_position: "LEFT" | "RIGHT";
  id_file_title: string;
  id_race: string;
  route: string;
}

const HomepageRace: FC = () => {
  const { data, isLoading } = useList<IHomePage, HttpError>({
    resource: "homepage",
    metaData: {
      fields: [
        "id",
        "id_file",
        "title",
        "prerex",
        "homepage_position",
        "id_file_title",
        "route",
      ],
    },
  });
  const router = useRouter();
  const { push } = router;
  const [loading, setLoading] = useState(true);
  const [hover, setHover] = useState<"LEFT" | "RIGHT" | undefined>(undefined);
  const windowsSize = useWindowSize();
  const [cols, setCols] = useState(2);
  const dataLeft = data?.data.find(
    (value) => value.homepage_position === "LEFT"
  );
  const dataRight = data?.data.find(
    (value) => value.homepage_position === "RIGHT"
  );
  const refRow = useRef(null);
  const [photoWidth, setPhotoWidth] = useState(400);
  const [logoWidth, setLogoWidth] = useState(400 / 2);
  const debounceFce = useCallback(
    debounce((refRow, windowsSize) => {
      if (refRow.current && refRow.current) {
        setPhotoWidth(
          Math.round((refRow.current as any).clientWidth / 2 - 3) ?? 400
        );
      }
      if (windowsSize.width < 700) {
        setCols(2);
        setLogoWidth(Math.round(photoWidth / 3));
      } else {
        setCols(1);
        setLogoWidth(Math.round(photoWidth / 3));
      }
      setLoading(false);
    }, 200),
    []
  );
  useEffect(() => {
    setLoading(true);
    debounceFce(refRow, windowsSize);
  }, [refRow, windowsSize]);

  // useEffect(() => {
  //   setLoading(true);
  //   debounceFce(refRow, windowsSize);
  // }, [windowsSize]);
  //
  // useEffect(() => {
  //   setLoading(true);
  //   debounceFce(refRow, windowsSize);
  // }, []);
  if (loading || isLoading) return <div>Loading ...</div>;

  const rightTitle = dataRight?.title?.split(/\s/g);
  const leftTitle = dataLeft?.title?.split(/\s/g);
  return (
    <Layout Footer={Footer}>
      <Box ref={refRow}>
        <ImageList
          sx={{
            p: 0,
            width: "100%",
            height: "100%",
            transform: "translateZ(0)",
            mb: 1.5,
          }}
          gap={10}
        >
          <Box
            sx={{
              width: `${logoWidth}px`,
              position: "absolute",
              zIndex: 1,
              backgroundColor: "#FF9F29",
              padding: 2,
              top: 0,
              left: cols === 2 ? `0px` : `calc(50% - ${logoWidth}px/2)`,
            }}
          >
            <Stack direction={"row"}>
              <Image src={logo} width={logoWidth - 30} alt={"logo"} />
            </Stack>
          </Box>
          {dataLeft && (
            <ImageListItem
              onMouseEnter={() => setHover("LEFT")}
              onMouseLeave={() => setHover(undefined)}
              cols={cols}
              rows={1}
              onClick={() => push(dataLeft.route)}
              sx={{ cursor: "pointer", opacity: hover === "LEFT" ? 0.7 : 1 }}
            >
              {hover}
              <img
                src={nhost.storage.getPublicUrl({
                  fileId: dataLeft.id_file,
                  width: photoWidth,
                })}
                alt={dataLeft.title}
              />

              <div
                style={{
                  position: "absolute",
                  width: "50%",
                  left: `calc(50% - ${cols === 2 ? 0 : 1}px)`,
                  background: "#1A4D2E",
                  top: "30%",
                  color: "white",
                  fontSize: "14px",
                  padding: 10,
                  textOverflow: "ellipsis",
                  maxHeight: "28%",
                  display: "-webkit-box",
                  overflow: "hidden",
                }}
              >
                {dataLeft?.prerex}
              </div>
              <div
                style={{
                  position: "absolute",
                  width: "60%",
                  right: "30%",
                  bottom: "20%",
                  color: "#FAF3E3",
                  fontFamily: cheddarGothic.style.fontFamily,
                }}
              >
                <Box fontSize={110}>{leftTitle?.[0]}</Box>
                <Box fontSize={40} sx={{ marginTop: -4 }}>
                  {leftTitle?.[1]}
                </Box>
              </div>
            </ImageListItem>
          )}
          {dataRight && (
            <ImageListItem
              cols={cols}
              rows={1}
              onMouseEnter={() => setHover("RIGHT")}
              onMouseLeave={() => setHover(undefined)}
              onClick={() => push(dataRight.route)}
              sx={{ cursor: "pointer", opacity: hover === "RIGHT" ? 0.7 : 1 }}
            >
              <img
                src={nhost.storage.getPublicUrl({
                  fileId: dataRight.id_file,
                  width: photoWidth,
                })}
                alt={dataRight.title}
              />

              <div
                style={{
                  position: "absolute",
                  width: "40%",
                  left: 0,
                  background: "#FF9F29",
                  bottom: "20%",
                  padding: 10,
                  fontSize: "14px",
                  color: "white",
                  textOverflow: "ellipsis",
                  maxHeight: "28%",
                  display: "-webkit-box",
                  overflow: "hidden",
                }}
              >
                {dataRight?.prerex}
              </div>
              <div
                style={{
                  position: "absolute",
                  width: "60%",
                  left: "40%",
                  top: "20%",
                  color: "#FAF3E3",
                  fontFamily: cheddarGothic.style.fontFamily,
                }}
              >
                <Box fontSize={110}>{rightTitle?.[0]}</Box>
                <Box fontSize={40} sx={{ marginTop: -4 }}>
                  {rightTitle?.[1]}
                </Box>
              </div>
            </ImageListItem>
          )}
        </ImageList>
      </Box>
    </Layout>
  );
};

export default HomepageRace;
