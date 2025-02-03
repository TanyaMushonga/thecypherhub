"use client";
import { useFetchSubscribers } from "../../hooks/useFetchSubscribers";
import { Loader2 } from "lucide-react";
import React from "react";

function SubscribersBadge() {
  const { loading, subscribers } = useFetchSubscribers();
  return (
    <>
      {loading ? (
        <Loader2 className="size-5 animate-spin" />
      ) : (
        <p className="text-slate-200">{subscribers.length}</p>
      )}
    </>
  );
}

export default SubscribersBadge;
