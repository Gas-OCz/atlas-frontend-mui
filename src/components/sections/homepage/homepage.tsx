import React, { FC } from "react";
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
  DateField,
} from "@pankod/refine-mui";
import { PageProps } from "../../../../pages/[race]/[section]";
import Grid from "@mui/material/Unstable_Grid2";
import { HttpError, useList } from "@pankod/refine-core";
import { nhost } from "../../../utilites/nhost";
import { Divider } from "@mui/material"; // Grid version 2
const resource = "texts";
const fields = {
  fields: ["id", "title", "htmlcontent", "id_file", "created_at"],
};
interface ITexts {
  id: string;
  title: string;
  htmlcontent: string;
  id_file?: string;
  created_at: string;
}
const Homepage: FC<PageProps> = (props) => {
  const { race } = props;
  const { homepageId } = race;
  const { data, isLoading } = useList<ITexts, HttpError>({
    resource: resource,
    metaData: fields,
    config: {
      sort: [
        {
          field: "created_at",
          order: "desc",
        },
      ],
      filters: [
        {
          field: "id_homepage",
          operator: "eq",
          value: homepageId,
        },
        {
          field: "type",
          operator: "eq",
          value: "news",
        },
      ],
    },
  });
  if (isLoading) return <Box>Loading ...</Box>;
  return (
    <Box>
      <Box sx={{ paddingTop: 5 }}>
        <Box
          sx={{
            backgroundColor: "#ff9f29",
            width: "fit-content",
            paddingX: 2,
            paddingY: 1.5,
            fontSize: 24,
            fontWeight: "bold",
          }}
        >
          {"Aktuálně"}
        </Box>
        <Grid
          container
          rowSpacing={1}
          columnSpacing={{ xs: 0, sm: 2, md: 3 }}
          sx={{ paddingTop: 6 }}
        >
          <Grid xs={12} lg={6}>
            {data?.data.map((item) => (
              <div key={`news${item.id}`}>
                <Card
                  sx={{
                    marginY: 1,
                    display: "flex",
                    backgroundColor: "transparent",
                    boxShadow: "none",
                  }}
                >
                  {item?.id_file && (
                    <CardMedia
                      component="img"
                      sx={{ width: 200 }}
                      image={nhost.storage.getPublicUrl({
                        fileId: item.id_file,
                        width: 250,
                      })}
                      alt=""
                    />
                  )}
                  <Box sx={{ display: "flex", flexDirection: "column" }}>
                    <CardContent sx={{ flex: "1 0 auto" }}>
                      <Typography component="div" variant="h5">
                        {item.title}
                      </Typography>
                      <Typography variant="subtitle1" component="div">
                        <div
                          dangerouslySetInnerHTML={{
                            __html: item?.htmlcontent,
                          }}
                        />
                      </Typography>
                    </CardContent>
                  </Box>
                </Card>
                <Divider
                  sx={{
                    borderWidth: "2px",
                    "&::before, &::after": {
                      borderColor: "primary",
                    },
                  }}
                  textAlign="right"
                  flexItem
                  color={"black"}
                >
                  <DateField value={item?.created_at} format={"DD/MM/YYYY"} />
                </Divider>
              </div>
            ))}
          </Grid>
          <Grid xs={6}>
            <Box
              sx={{
                position: "absolute",
                top: 112,
                zIndex: 1,
                display: { xs: "none", lg: "block" },
              }}
            >
              <img
                src={nhost.storage.getPublicUrl({
                  fileId: race.id_file,
                  width: 550,
                })}
                alt={""}
              />
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};
export default Homepage;
