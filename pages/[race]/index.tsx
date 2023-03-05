import { Layout } from "@components/layout";
import { FC } from "react";
import { useRouter } from "next/navigation";
import { GetServerSideProps } from "next";
import { query } from "gql-query-builder";
interface PageProps {
  race: string;
}
const RaceHomePage: FC<PageProps> = (props) => {
  const { race } = props;
  console.log(race);
  return <Layout>RaceHomePage</Layout>;
};
export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {
      race: context.query.race,
    },
  };
};

export default RaceHomePage;
