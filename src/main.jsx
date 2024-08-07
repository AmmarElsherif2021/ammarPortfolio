import React from "react";
import ReactDOM from "react-dom/client";

import "./index.css";
import Root from "./routes/root/root.jsx";
import ErrorPage from "./routes/error.jsx";

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./routes/Home/Home.jsx";
import Admin from "./routes/Admin/Admin.jsx";
//import Dialogue from './routes/Admin/Dialogue/Dialogue.jsx'

import Popup from "./routes/Admin/Popup/Popup.jsx";
//import ListOverview from "./routes/ListOverview/ListOverview.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "Home",
        element: <Home />,
      },
    ],
  },
  {
    path: "Admin",
    element: <Admin />,
    children: [
      {
        path: "Popup",
        element: <Popup />,
      },
      {},
    ],
  },
]);
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
