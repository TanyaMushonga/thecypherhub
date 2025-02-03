"use client";
import { useFetchSubscribers } from "../../hooks/useFetchSubscribers";
import { formatDate } from "../../lib/utils";
import React from "react";

function LatestSubscribers() {
  const { loading, subscribers } = useFetchSubscribers();
  return (
    <>
      {loading ? (
        <p className="text-slate-200 text-md mt-5">Loading...</p>
      ) : subscribers?.length > 0 ? (
        <>
          {subscribers.slice(0, 5).map((subscriber) => (
            <div
              key={subscriber.id}
              className="flex items-center justify-between w-full mt-4 pb-3"
            >
              <div className="md:pr-5 md:w-2/3">
                <p className="text-white text-md md:text-lg">
                  {subscriber.email}
                </p>
              </div>
              <div className="md:w-1/3">
                <p className="text-slate-300">
                  {formatDate(new Date(subscriber.createdAt))}
                </p>
              </div>
            </div>
          ))}
        </>
      ) : (
        <p className="text-slate-200 text-md mt-5">No subscribers yet</p>
      )}
    </>
  );
}

export default LatestSubscribers;
