import React from "react";
import Footer from "../components/HomePage/Footer";
import Header from "../components/profilePage/Header";
import { useAuthStore } from "../store/useAuthStore";
import { LogOut } from "lucide-react";

const SettingsPage = () => {
  const { logout } = useAuthStore();
  return (
    <div className="h-screen pt-20">
      <Header />
      <h1 className="text-xl font-semibold mt-4 fixed flex justify-center w-full px-4">Settings Page</h1>
      <div className="mt-16 flex flex-col gap-4 max-w-2xl mx-auto p-4 py-8 bg-base-300 rounded-xl ">
      <button className="flex gap-2 items-center" onClick={logout}>
        <LogOut className="size-5 text-red-500" />
        <span className=" sm:inline text-red-500">Logout</span>
      </button>
      </div>
      <Footer />
    </div>
  );
};

export default SettingsPage;
