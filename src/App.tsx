import { ToastContainer } from "react-toastify";
import { router } from "./routers/router";
import { RouterProvider } from "react-router-dom";

function App() {
  return (
    <>
      <RouterProvider router={router} />
      <ToastContainer />
      {/* <Chat /> */}
      {/* {isOpen && user?.data?.role !== "admin" && (
        <ChatWindow onClose={() => setIsOpen(false)} />
      )} */}
    </>
  );
}

export default App;
