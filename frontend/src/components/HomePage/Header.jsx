

// src/components/Header.jsx
import React from "react";
import { Link } from "react-router-dom";
import { MessageSquare } from "lucide-react";
import SearchBar from "../SearchBar";

const Header = () => {
  const handleSearchSubmit = (q, item) => {
    console.log("SUBMIT SEARCH:", q, item);
  };

  return (
    <header
      className="bg-base-100 fixed w-full top-0 z-40
                 backdrop-blur-lg bg-base-100/80"
    >
      {/* ⬇️ change: remove fixed h-16 on mobile; use padding + min height.   border-b border-base-900 
          Keep h-16 on md+ so desktop stays identical */}
      <div className="container mx-auto px-4 py-2 min-h-16 md:h-16">
       
        <div className="flex items-center justify-center h-full">
          
          <div className="flex flex-col md:flex-row items-center gap-3 md:gap-8 w-full md:w-auto">
            <Link to="/home" className="flex items-center justify-center gap-2.5 hover:opacity-80 transition-all">
              <div className="size-9 rounded-lg bg-primary/10 flex items-center justify-center ring-1 ring-primary/30">
                <MessageSquare className="w-5 h-5 text-primary" />
              </div>
              <h1 className="text-lg font-bold">Software Name</h1>
            </Link>

            {/* search keeps full width on mobile, 384px on md+ */}
            <div className="w-full md:w-96">
              <SearchBar onSubmit={handleSearchSubmit} />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;






