import React, { FC } from "react";
import { GetServerSideProps } from "next";
import { ContentLayout } from "@components/layout/layout/contentLayout";
import { IRaceSet } from "../index";
import dataProvider from "@pankod/refine-hasura";
import { client } from "../../_app";
import { EMenu, menuItems } from "@components/layout/menu";
import TextComponent from "@components/sections/texts";
import { Footer } from "@components/layout/footer";
import CustomGallery from "@components/sections/gallery";
import { Box } from "@pankod/refine-mui";

export interface PageProps {
  race: IRaceSet;
  section: string;
  pageType: EMenu;
}
const Section: FC<PageProps> = (props) => {
  console.log(props);
  const { section, pageType } = props;
  console.log(section);
  console.log("PageType", pageType);

  switch (pageType) {
    case EMenu.registration: {
      return (
        <ContentLayout {...props} Footer={Footer}>
          <div>Registrace</div>
        </ContentLayout>
      );
    }
    case EMenu.galerie: {
      return (
        <ContentLayout {...props} Footer={Footer}>
          <CustomGallery {...props} />
        </ContentLayout>
      );
    }
    case EMenu.texts: {
      return (
        <ContentLayout {...props} Footer={Footer}>
          <TextComponent {...props} />
        </ContentLayout>
      );
    }
    default: {
      return (
        <ContentLayout {...props} Footer={Footer}>
          <Box>404</Box>
        </ContentLayout>
      );
    }
  }
};
export const getServerSideProps: GetServerSideProps = async (context) => {
  const data = await dataProvider(client).getList({
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
        "id_race",
        "place",
        { race: ["start_date", "end_date"] },
      ],
    },
  });
  const pageType = menuItems.find(
    (value) => value.route === context.query.section
  );

  const race = data?.data.find(
    (item) => item.route === String(context.query.race)
  );

  return {
    props: {
      race: {
        route: race?.route ?? "",
        title: race?.title ?? "",
        prerex: race?.prerex ?? "",
        startDate: race?.race?.start_date ?? "",
        endDate: race?.race?.end_date ?? "",
        place: race?.place ?? "",
        homepageId: race?.id ?? undefined,
        id_file: race?.id_file ?? "",
      },
      pageType: pageType?.type || EMenu.page404,
      section: context.query.section,
    },
  };
};

export default Section;
