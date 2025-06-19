import { createBrowserRouter, RouterProvider } from "react-router-dom";
import RootLayout from "./layout/RootLayout";
import HomePage from "./pages/Homepage";
import LoginPage from "./pages/Loginpage";
import NotFound from "./pages/NotFound";
import SignupPage from "./pages/Signuppage";
import ProtectedRoute from "./components/ProtectedRoute";
import Mypage from "./pages/Mypage";
import DailyNewsListPage from "./pages/DailyNewsListPage";
import UrgentNewsListPage from "./pages/UrgentNewsListPage";
import PracticeNewsListPage from "./pages/PracticeNewsListPage";
import CuttoonViewer from "./pages/CuttoonViewer";
import CollectionPage from "./pages/CollectionPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <NotFound />,
    children: [
      {
        index: true,
        element: (
          <ProtectedRoute>
            <HomePage />
          </ProtectedRoute>
        ),
      },
      { path: "login", element: <LoginPage /> },
      { path: "signup", element: <SignupPage /> },

      {
        path: "urgent",
        element: (
          <ProtectedRoute>
            <UrgentNewsListPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "daily",
        element: (
          <ProtectedRoute>
            <DailyNewsListPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "practice",
        element: (
          <ProtectedRoute>
            <PracticeNewsListPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "mypage",
        element: (
          <ProtectedRoute>
            <Mypage />
          </ProtectedRoute>
        ),
      },
      {
        path: "collection",
        element: (
          <ProtectedRoute>
            <CollectionPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "news/:cardNewsId",
        element: (
          <ProtectedRoute>
            <CuttoonViewer />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
