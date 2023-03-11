import { PageProps } from "../../../../pages/[race]/[section]";
import React, { FC, Fragment } from "react";
import { HttpError, useList } from "@pankod/refine-core";
import { Box } from "@pankod/refine-mui";

interface ITexts {
  title: string;
  htmlcontent: string;
}
const resource = "texts";
const fields = {
  fields: ["id", "title", "htmlcontent"],
};
const TextComponent: FC<PageProps> = (props) => {
  const { section, race } = props;
  const { homepageId } = race;

  const { data, isLoading } = useList<ITexts, HttpError>({
    resource: resource,
    metaData: fields,
    config: {
      filters: [
        {
          field: "id_homepage",
          operator: "eq",
          value: homepageId,
        },
        {
          field: "type",
          operator: "eq",
          value: section,
        },
      ],
      sort: [
        {
          field: "created_at",
          order: "desc",
        },
      ],
    },
  });

  if (isLoading) return <Box>Loading ...</Box>;

  return (
    <Box>
      {data?.data.map((item) => (
        <Fragment key={item.title}>
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
              {item.title}
            </Box>
          </Box>
          <Box sx={{ paddingX: 3, paddingTop: 3 }}>
            <div dangerouslySetInnerHTML={{ __html: item?.htmlcontent }} />
          </Box>
        </Fragment>
      ))}
    </Box>
  );
};
export default TextComponent;
