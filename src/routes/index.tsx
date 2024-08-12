import ChartMap from "@/pages/Chart-Map";
import ColorPalette from "@/pages/Colors";
import Contact from "@/pages/Contact";
import { RouterProvider, createBrowserRouter } from "react-router-dom";

const Routes = () => {

  // Define public routes accessible to all users
  const routesForPublic = [
    {
      path: "/",
      element: <Contact />
    },
    {
      path: "/charts-maps",
      element: <ChartMap />
    },

    {
      path: "/colors",
      element: <ColorPalette />
    },
  ];


  // Combine and conditionally include routes based on authentication status
  const router = createBrowserRouter([
    ...routesForPublic,
    // ...routesForAuthenticatedOnly,
  ]);

  return <RouterProvider router={router} />;
};

export default Routes;
