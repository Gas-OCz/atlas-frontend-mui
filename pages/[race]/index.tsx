import { FC } from "react";
import { GetServerSideProps } from "next";
import { ContentLayout } from "@components/layout/layout/contentLayout";
import { LayoutProps } from "@pankod/refine-core";
import dataProvider from "@pankod/refine-hasura";
import { client } from "../_app";
import { EMenu } from "@components/layout/menu";
import Homepage from "@components/sections/homepage/homepage";
import { Footer } from "@components/layout/footer";
interface PageProps extends LayoutProps {
  race: IRaceSet;
  section: string;
  pageType: EMenu;
}

export interface IRaceSet {
  route: string;
  title: string;
  prerex: string;
  startDate: string;
  endDate: string;
  place: string;
  homepageId: string;
  id_file: string;
}
const RaceHomePage: FC<PageProps> = (props) => {
  return (
    <ContentLayout Footer={Footer} {...props}>
      <Homepage {...props} />
    </ContentLayout>
  );
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
  const race = data?.data.find(
    (item) => item.route === String(context.query.race)
  );
  return {
    props: {
      race: {
        homepageId: race?.id,
        route: race?.route ?? "",
        title: race?.title ?? "",
        prerex: race?.prerex ?? "",
        startDate: race?.race?.start_date ?? "",
        endDate: race?.race?.end_date ?? "",
        place: race?.place ?? "",
        id_homepage: race?.id ?? undefined,
        id_file: race?.id_file,
      },
      pageType: EMenu.homepage,
    },
  };
};

export default RaceHomePage;
