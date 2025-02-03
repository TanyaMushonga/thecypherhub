"use client";

import { logout } from "../../actions/logout";
import { Settings } from "lucide-react";
import React from "react";

function LogoutBtn() {
  return (
    <button
      onClick={() => {
        logout();
      }}
      className="rounded-md hover:bg-slate-200 p-1 flex gap-3 w-full group"
    >
      <Settings className="group-hover:text-black" />
      <span className="group-hover:text-black">Logout</span>
    </button>
  );
}

export default LogoutBtn;
