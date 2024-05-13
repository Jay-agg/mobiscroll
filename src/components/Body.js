import { Outlet, RouterProvider, createBrowserRouter } from "react-router-dom";

const Body = () => {
  const appRouter = createBrowserRouter([
    {
      path: "/",
      element: <Month />,
    },
  ]);

  return (
    <div>
      <RouterProvider router={appRouter}>
        <Outlet />
      </RouterProvider>
    </div>
  );
};

export default Body;
