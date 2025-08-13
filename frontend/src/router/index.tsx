import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { UploadPage } from '../pages/UploadPage';
import { ChatPage } from '../pages/ChatPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <UploadPage />,
      },
      {
        path: 'upload',
        element: <UploadPage />,
      },
      {
        path: 'chat/:id',
        element: <ChatPage />,
      },
    ],
  },
]);

export const AppRouter = () => {
  return <RouterProvider router={router} />;
}; 