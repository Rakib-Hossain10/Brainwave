import React from "react";
import Footer from "../components/HomePage/Footer";
import { Link } from "react-router-dom";
import { Mail, MessageSquare, User } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import Header from "../components/profilePage/Header";

const ProfilePage = () => {
  const { authUser } = useAuthStore();

  return (
    <div className="h-screen pt-20">
      <Header />

      <div className="max-w-2xl mx-auto p-4 py-8">
        <div className="bg-base-300 rounded-xl p-6 space-y-8">
          <div className="text-center">
            <h1 className="text-2xl font-semibold ">Profile</h1>
            <p className="mt-2">Your profile information</p>
          </div>

          {/* avatar upload section */}

          <div className="space-y-6">
            <div className="space-y-1.5">
              <div className="text-sm text-zinc-400 flex items-center gap-2">
                <User className="w-4 h-4" />
                Full Name
              </div>
              <p className="px-4 py-2.5 bg-base-200 rounded-lg border">{authUser?.fullName}</p>
            </div>

            <div className="space-y-1.5">
              <div className="text-sm text-zinc-400 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email Address
              </div>
              <p className="px-4 py-2.5 bg-base-200 rounded-lg border">{authUser?.email}</p>
            </div>
          </div>

          <div className="mt-6 bg-base-300 rounded-xl p-6">
            <h2 className="text-lg font-medium  mb-4 flex items-center gap-3">
              <User className="w-4 h-4 ml-4" />
              Account Information
            </h2>
            <div className="space-y-3 text-sm border-b-slate-800/50 border-b pb-4 mt-10">
              <div className="flex items-center justify-between py-2">
                <span className="left-0">Account Status</span>
                <span className="text-green-500 mr-0">Active</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ProfilePage;
