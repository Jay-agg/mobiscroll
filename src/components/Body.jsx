import { Outlet, RouterProvider, createBrowserRouter } from "react-router-dom";
import Month from "./Month";

const Body = () => {
  const appRouter = createBrowserRouter([
    {
      path: "/",
      element: <Month />,
    },
  ]);

  return (
    <>
      <RouterProvider router={appRouter}>
        <Outlet />
      </RouterProvider>
    </>
  );
};

export default Body;
