import { Layout } from "@components/layout";
import { FC } from "react";
import { GetServerSideProps } from "next";
interface PageProps {
  race: string;
  section: string;
}
const Section: FC<PageProps> = ({ race, section }) => {
  console.log(section);
  console.log(race);
  return <Layout>Section</Layout>;
};
export const getServerSideProps: GetServerSideProps = async (context) => {
  console.log(context);
  return {
    props: {
      race: context.query.race,
      section: context.query.section,
    },
  };
};

export default Section;
