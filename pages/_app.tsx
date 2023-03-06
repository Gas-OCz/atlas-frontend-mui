import React from "react";
import { AppProps } from "next/app";
import { Refine } from "@pankod/refine-core";
import {
  CssBaseline,
  GlobalStyles,
  ReadyPage,
  ErrorComponent,
} from "@pankod/refine-mui";
import routerProvider from "@pankod/refine-nextjs-router";
import dataProvider, { GraphQLClient } from "@pankod/refine-hasura";
import { Title, Sider, Layout, Header } from "@components/layout";
import { Footer } from "@components/layout/footer";
import localFont from "@next/font/local";

export const nudista = localFont({
  src: [
    {
      path: "../public/fonts/nudista/Nudista_Medium.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/nudista/Nudista_Thin.otf",
      weight: "200",
      style: "normal",
    },
    {
      path: "../public/fonts/nudista/Nudista_Medium.otf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../public/fonts/nudista/Nudista_Semibold.otf",
      weight: "bold",
      style: "normal",
    },
    {
      path: "../public/fonts/nudista/Nudista_Bold.otf",
      weight: "700",
      style: "normal",
    },
  ],
});
export const cheddarGothic = localFont({
  src: [
    {
      path: "../public/fonts/gothic/CheddarGothic00001.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/gothic/CheddarGothic00001.otf",
      weight: "200",
      style: "normal",
    },
    {
      path: "../public/fonts/gothic/CheddarGothic00001.otf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../public/fonts/gothic/CheddarGothic00001.otf",
      weight: "bold",
      style: "normal",
    },
    {
      path: "../public/fonts/gothic/CheddarGothic00001.otf",
      weight: "700",
      style: "normal",
    },
  ],
});
const API_URL =
  "https://zqjydifrzpoglwwntsno.hasura.eu-central-1.nhost.run/v1/graphql";

export const client = new GraphQLClient(API_URL, {
  headers: {
    "x-hasura-admin-secret": "247c470d4d4f319a053465caf0bd6558",
  },
});

const gqlDataProvider = dataProvider(client);

function MyApp({ Component, pageProps }: AppProps): JSX.Element {
  return (
    <>
      <CssBaseline />
      <GlobalStyles
        styles={{
          html: { WebkitFontSmoothing: "auto" },
        }}
      />
      <Refine
        routerProvider={routerProvider}
        dataProvider={gqlDataProvider}
        ReadyPage={ReadyPage}
        catchAll={<ErrorComponent />}
        Title={Title}
        resources={[
          {
            name: "homepage",
            options: {
              route: "",
            },
          },
          {
            name: "texts",
          },
        ]}
        Sider={Sider}
        Footer={Footer}
        Layout={Layout}
        Header={Header}
      >
        <main className={`${nudista.className} `}>
          <Component {...pageProps} />
        </main>
      </Refine>
    </>
  );
}

export default MyApp;
