


import React from "react";
import { NavLink } from "react-router-dom";
import { HouseIcon, User, Settings2 } from "lucide-react";

const Footer = () => {
  const baseBtn =
    "flex flex-col items-center justify-center gap-1 w-full py-2.5 sm:py-3 rounded-xl transition";
  const iconCls = "w-5 h-5 sm:w-6 sm:h-6";
  const labelCls = "text-[10px] sm:text-xs font-medium leading-none";

  return (
    <>
      {/* Reserve space so content isn't hidden behind the fixed footer */}
      <div className="h-16 sm:h-20" aria-hidden="true" />

      <footer
        className="
          fixed inset-x-0 bottom-0 z-50
          bg-slate-950/90 backdrop-blur
          border-t border-slate-800
          text-slate-200
        "
        // Safe-area padding for iOS home indicator
        style={{ paddingBottom: "max(env(safe-area-inset-bottom), 0px)" }}
      >
        <nav className="max-w-3xl mx-auto px-3 sm:px-4">
          <ul className="grid grid-cols-3 gap-2 py-2">
            <li>
              <NavLink
                to="/home"
                className={({ isActive }) =>
                  `${baseBtn} ${
                    isActive
                      ? " text-white"
                      : "hover:bg-slate-800/60 hover:text-white focus:bg-slate-800/60"
                  } `
                }
                aria-label="Home"
              >
                <HouseIcon className={iconCls} />
                <span className={labelCls}>Home</span>
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/profile"
                className={({ isActive }) =>
                  `${baseBtn} ${
                    isActive
                      ? " text-white"
                      : "hover:bg-slate-800/60 hover:text-white focus:bg-slate-800/60"
                  } `
                }
                aria-label="Profile"
              >
                <User className={iconCls} />
                <span className={labelCls}>Profile</span>
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/settings"
                className={({ isActive }) =>
                  `${baseBtn} ${
                    isActive
                      ? " text-white"
                      : "hover:bg-slate-800/60 hover:text-white focus:bg-slate-800/60"
                  }`
                }
                aria-label="Settings"
              >
                <Settings2 className={iconCls} />
                <span className={labelCls}>Settings</span>
              </NavLink>
            </li>
          </ul>
        </nav>
      </footer>
    </>
  );
};

export default Footer;





