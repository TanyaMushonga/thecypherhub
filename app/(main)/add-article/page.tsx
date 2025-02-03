import CreateBlog from "../../../components/othercomponents/CreateBlog";
import { ScrollArea } from "../../../components/ui/scroll-area";
import React from "react";

function page() {
  return (
    <ScrollArea className="bg-primary pt-4">
      <CreateBlog />
    </ScrollArea>
  );
}

export default page;
