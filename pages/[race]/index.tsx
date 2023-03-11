import { FC } from "react";
import { GetServerSideProps } from "next";
import { ContentLayout } from "@components/layout/layout/contentLayout";
import { LayoutProps } from "@pankod/refine-core";
import dataProvider from "@pankod/refine-hasura";
import { client } from "../_app";
import { EMenu } from "@components/layout/menu";
import Homepage from "@components/sections/homepage/homepage";
import { Footer } from "@components/layout/footer";
import homepage from "@components/sections/homepage/homepage";
import HomepageRace from "../index";
interface PageProps extends LayoutProps {
  race: IRaceSet;
  section: string;
  pageType: EMenu;
}

export interface IRaceSet {
  id_race: string;
  names: string[];
  place: string;
  route: string;
  title: string;
  prerex: string;
  startDate: string;
  endDate: string;
  homepageId: string;
  id_file: string;
}
//TODO create section 404
const RaceHomePage: FC<PageProps> = (props) => {
  if (props?.race?.route === "homepage") {
    return <HomepageRace />;
  } else {
    return (
      <ContentLayout Footer={Footer} {...props}>
        <Homepage {...props} />
      </ContentLayout>
    );
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
        { race: ["start_date", "end_date", "place"] },
      ],
    },
  });
  const race = data?.data?.find(
    (item) => item.route === String(context.query.race)
  );

  return {
    props: {
      homepagePosition: race?.homepage_position ?? null,

      race: {
        names: data?.data.map((value: any) => value.title),
        homepageId: race?.id ?? null,
        route: race?.route ?? "homepage",
        title: race?.title ?? "",
        prerex: race?.prerex ?? "",
        startDate: race?.race?.start_date ?? "",
        endDate: race?.race?.end_date ?? "",
        place: race?.race?.place ?? "",
        id_homepage: race?.id ?? null,
        id_file: race?.id_file ?? null,
      },
      pageType: EMenu.homepage,
      section: context.query.section ?? "homepage",
    },
  };
};

export default RaceHomePage;
