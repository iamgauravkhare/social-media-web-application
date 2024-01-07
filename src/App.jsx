import axios from "../utilities/axios";
import React, { useEffect } from "react";
import toast from "react-hot-toast";
import { apiConnector } from "./services/apiConnector";
import { endpoints } from "./services/apis";
const { SERVER_CONNECTION_CHECK } = endpoints;

const App = () => {
  const BASE_URL_2 = import.meta.env.VITE_API_BASE_URL;
  const BASE_URL = "http://localhost:4500/api/v1";

  console.log(BASE_URL_2);
  useEffect(() => {
    const serverConnectionCheck = async () => {
      const response = await apiConnector("GET", SERVER_CONNECTION_CHECK);
      if (response.data.success === true) {
        toast("Server Connection Successfull");
        console.log(response.data.message);
      }
    };
    serverConnectionCheck();
  }, []);
  return (
    <div className="w-full min-h-screen flex items-center justify-center flex-col gap-10 bg-blue-100 text-center p-5 text-black">
      <img src="./logo.png" alt="logo" className="h-[150px] w-[150px] logo" />
      <h1 className="text-4xl font-extrabold">Instagram Clone</h1>
      <h3 className="text-3xl font-semibold">
        Currently this web application is under development! Please come back
        later 🥲.....
      </h3>
    </div>
  );
};

export default App;
