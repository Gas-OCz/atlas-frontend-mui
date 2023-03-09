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
import { Registration } from "@components/sections/registration";
import { Success } from "@components/sections/registration/success";

export interface PageProps {
  race: IRaceSet;
  section: string;
  pageType: EMenu;
  homepagePosition?: "LEFT" | "RIGHT";
}

const Section: FC<PageProps> = (props) => {
  const { section, pageType } = props;
  console.log(section);
  console.log("PageType", pageType);

  switch (pageType) {
    case EMenu.registration: {
      console.log(props?.homepagePosition);
      return (
        <ContentLayout {...props} Footer={Footer}>
          <Registration {...props} />
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
      if (section === "registrace-dokoncena")
        return (
          <ContentLayout {...props} Footer={Footer}>
            <Success />
          </ContentLayout>
        );
      return (
        // <ContentLayout {...props} Footer={Footer}>
        <Box>404</Box>
        // </ContentLayout>
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
      homepagePosition: race?.homepage_position ?? null,
      race: {
        route: race?.route ?? "",
        id_race: race?.id_race ?? null,
        title: race?.title ?? "",
        prerex: race?.prerex ?? "",
        startDate: race?.race?.start_date ?? "",
        endDate: race?.race?.end_date ?? "",
        place: race?.place ?? "",
        homepageId: race?.id || null,
        id_file: race?.id_file ?? "",
      },
      pageType:
        context.query.section === "registrace"
          ? EMenu.registration
          : pageType?.type || EMenu.page404,
      section: context.query.section || null,
    },
  };
};

export default Section;
