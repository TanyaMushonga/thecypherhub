import React from "react";
import dynamic from "next/dynamic";

const Notes = dynamic(() => import("@/components/othercomponents/notes"), {
  ssr: false,
});

function Page() {
  return (
    <div className="container ">
      <div className="flex flex-row flex-1 items-start">
        <div className="flex-1">
          <Notes />
        </div>
        <div className="flex-1">d</div>
      </div>
    </div>
  );
}

export default Page;
