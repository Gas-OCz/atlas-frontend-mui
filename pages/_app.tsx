import React from "react";
import { AppProps } from "next/app";
import { Refine } from "@pankod/refine-core";
import {
  notificationProvider,
  RefineSnackbarProvider,
  CssBaseline,
  GlobalStyles,
  ReadyPage,
  ErrorComponent,
} from "@pankod/refine-mui";
import routerProvider from "@pankod/refine-nextjs-router";
import dataProvider, { GraphQLClient } from "@pankod/refine-hasura";
import { ColorModeContextProvider } from "@contexts";
import { Title, Sider, Layout, Header } from "@components/layout";
import { Footer } from "@components/layout/footer";

const API_URL =
  "https://zqjydifrzpoglwwntsno.hasura.eu-central-1.nhost.run/v1/graphql";

const client = new GraphQLClient(API_URL, {
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
        ]}
        Sider={Sider}
        Footer={Footer}
        Layout={Layout}
        Header={Header}
      >
        <Component {...pageProps} />
      </Refine>
    </>
  );
}

export default MyApp;
