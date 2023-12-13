import { useRoutes } from "react-router-dom";
import { ROUTES } from "./constants/routes";
import { PublicLoader } from "./components/Loadable";
import { lazy } from "react";

const Signin = PublicLoader( lazy( () => import( "./pages/Signin" ) ) );
const Dashboard = PublicLoader( lazy( () => import( "./pages/Dashboard" ) ) );
const NotFound = PublicLoader( lazy( () => import( "./pages/404" ) ) );

export default function App() {
  return useRoutes( [
    {
      path: ROUTES.ACCOUNT,
      element: <Signin />,
    },
    {
      path: "/",
      element: <Dashboard />,
    },
    {
      path: ROUTES.ALL,
      element: <NotFound />,
    },
  ] );
}
