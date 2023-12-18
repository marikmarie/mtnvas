import "./index.css";
import "@inovua/reactdatagrid-community/index.css";
import {
  ColorScheme,
  ColorSchemeProvider,
  MantineProvider,
} from "@mantine/core";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import store, { persistor } from "./app/store";
import { Provider } from "react-redux";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Notifications } from "@mantine/notifications";
import { PersistGate } from "redux-persist/integration/react";
import { ModalsProvider } from "@mantine/modals";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const client = new QueryClient();

ReactDOM.createRoot( document.getElementById( "root" ) as HTMLElement ).render(
  <React.StrictMode>
    <QueryClientProvider client={client}>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <BrowserRouter>
            <Notifications position="top-right" zIndex={2077} />
            <AppWrapper />
          </BrowserRouter>
        </PersistGate>
      </Provider>
      <ReactQueryDevtools />
    </QueryClientProvider>
  </React.StrictMode>,
);

function AppWrapper() {
  const [colorScheme, setColorScheme] = React.useState<ColorScheme>( "light" );
  const toggleColorScheme = ( value?: ColorScheme ) =>
    setColorScheme( value || ( colorScheme === "dark" ? "light" : "dark" ) );

  return (
    <ColorSchemeProvider
      colorScheme={colorScheme}
      toggleColorScheme={toggleColorScheme}
    >
      <MantineProvider
        theme={{ colorScheme, primaryColor: "yellow", cursorType: "pointer" }}
        withNormalizeCSS
        withGlobalStyles
      >
        <Notifications position="top-right" zIndex={2077} />
        <ModalsProvider>
          <App />
        </ModalsProvider>
      </MantineProvider>
    </ColorSchemeProvider>
  );
}
