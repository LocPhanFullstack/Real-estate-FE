import Navbar from "@/components/Navbar";
import { NAVBAR_HEIGHT } from "@/lib/constants";
import React from "react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div id="top" className="h-full w-full">
      <Navbar />
      <main
        className={`h-full flex w-full flex-col pt-[${NAVBAR_HEIGHT}px]`}
        style={{ paddingTop: `${NAVBAR_HEIGHT}px` }}
      >
        {children}
      </main>
    </div>
  );
};

export default Layout;
