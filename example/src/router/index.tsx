import { UserRuler } from "@c/user-ruler";
import { Navigate, RouteObject, useRoutes } from "react-router-dom";
import { BaseLayout } from "../layout";
import { Home } from "../views/home";
import { TreeDemo } from "../views/tree";


export const rootRouter: RouteObject[] = [
	{
		path: "/",
    element: <Navigate to="/component/sketch" />,
  },
  {
    path: "/component",
    element: <BaseLayout></BaseLayout>,
    children: [
      {
        path: "sketch",
        element: <UserRuler />,
        handle: {
          requiresAuth: false,
          title: "标尺组件",
          key: "sketch"
        }
      },
      {
        path: "tree",
        element: <TreeDemo />,
      },
    ]
  },
	// {
	// 	path: "/sketch",
	// 	element: <UserRuler />,
	// 	handle: {
	// 		requiresAuth: false,
	// 		title: "标尺组件",
	// 		key: "sketch"
	// 	}
	// },
	{
		path: "*",
		element: <Navigate to="/404" />
	}
];

const Router = () => {
	const routes = useRoutes(rootRouter);
	return routes;
};

export default Router;
