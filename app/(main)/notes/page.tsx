import React from "react";
import dynamic from "next/dynamic";

const Notes = dynamic(() => import("@/components/othercomponents/notes"), {
  ssr: false,
});

function Page() {
  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col md:flex-row  flex-1 items-start">
        <div className="flex-1">
          <Notes />
        </div>
        <div className="flex-1">d</div>
      </div>
    </div>
  );
}

export default Page;
