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

const API_URL = "https://your-hasura-url/graphql";

const client = new GraphQLClient(API_URL, {
  headers: {
    "x-hasura-role": "public",
  },
});

const gqlDataProvider = dataProvider(client);

function MyApp({ Component, pageProps }: AppProps): JSX.Element {
  return (
    <ColorModeContextProvider>
      <CssBaseline />
      <GlobalStyles styles={{ html: { WebkitFontSmoothing: "auto" } }} />
      <RefineSnackbarProvider>
        <Refine
          routerProvider={routerProvider}
          dataProvider={gqlDataProvider}
          notificationProvider={notificationProvider}
          ReadyPage={ReadyPage}
          catchAll={<ErrorComponent />}
          Title={Title}
          Sider={Sider}
          Layout={Layout}
          Header={Header}
        >
          <Component {...pageProps} />
        </Refine>
      </RefineSnackbarProvider>
    </ColorModeContextProvider>
  );
}

export default MyApp;
