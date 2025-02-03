"use client";
import { columns } from "../../components/ui/subscribers/columns";
import { DataTable } from "../../components/ui/subscribers/data-table";
import { useFetchSubscribers } from "../../hooks/useFetchSubscribers";
import React from "react";

function SubscribersTable() {
  const { subscribers } = useFetchSubscribers();

  return (
    <div className="p-5 md:p-10 w-full bg-primary">
      <DataTable columns={columns} data={subscribers} />
    </div>
  );
}

export default SubscribersTable;
