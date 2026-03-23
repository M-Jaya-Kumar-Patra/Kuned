"use client";

import { useEffect, useState } from "react";
import api from "@/services/api";

type Report = {
  _id: string;
  reason: string;
  description?: string;
  status: string;
  reporterId?: {
    name?: string;
    email?: string;
  };
  createdAt: string;
};



export default function SellerReportsPage() {

  const [reports, setReports] = useState<Report[]>([]);

  useEffect(() => {

    const loadReports = async () => {

      const res = await api.get("/seller/reports");

      setReports(res.data);

    };

    loadReports();

  }, []);

  return (
  <div className="min-h-screen bg-gradient-to-br from-[#eef2ff] to-[#e9ecff] px-4 py-8">

    <div className="max-w-5xl mx-auto">

      {/* HEADER */}
      <h1 className="text-3xl font-semibold text-gray-800">
        My Reports
      </h1>
      <p className="text-gray-500 mb-6">
        Track the status of your submitted reports
      </p>

      {/* STATS */}
      <div className="grid grid-cols-3 gap-4 mb-6">

        <div className="bg-white/70 backdrop-blur-xl rounded-xl p-4 text-center shadow">
          <p className="text-yellow-600 font-semibold">
            {reports.filter(r => r.status === "pending").length}
          </p>
          <p className="text-sm text-gray-500">Pending</p>
        </div>

        <div className="bg-white/70 backdrop-blur-xl rounded-xl p-4 text-center shadow">
          <p className="text-green-600 font-semibold">
            {reports.filter(r => r.status === "resolved").length}
          </p>
          <p className="text-sm text-gray-500">Resolved</p>
        </div>

        <div className="bg-white/70 backdrop-blur-xl rounded-xl p-4 text-center shadow">
          <p className="text-red-600 font-semibold">
            {reports.filter(r => r.status === "rejected").length}
          </p>
          <p className="text-sm text-gray-500">Rejected</p>
        </div>

      </div>

      {/* FILTERS */}
      <div className="flex gap-2 mb-6">
        {["All", "Pending", "Resolved", "Rejected"].map((f) => (
          <button
            key={f}
            className="px-4 py-1 rounded-full bg-white/70 text-sm hover:bg-white"
          >
            {f}
          </button>
        ))}
      </div>

      {/* LIST */}
      {reports.length === 0 ? (
        <div className="text-center mt-20">
          <img
            src="/images/report/empty.png"
            className="w-40 mx-auto mb-4"
          />
          <p className="text-lg font-medium text-gray-600">
            You have not submitted any reports yet 🛡️
          </p>
          <p className="text-sm text-gray-400">
            If you find any issue, report it to help keep Kuned safe
          </p>

          <button
            onClick={() => (window.location.href = "/")}
            className="mt-4 px-6 py-2 rounded-lg bg-indigo-500 text-white"
          >
            Explore Listings
          </button>
        </div>
      ) : (
        <div className="space-y-4">

          {reports.map((report) => {

            const statusColor =
              report.status === "resolved"
                ? "bg-green-100 text-green-600"
                : report.status === "rejected"
                ? "bg-red-100 text-red-600"
                : "bg-yellow-100 text-yellow-600";

            const icon =
              report.status === "resolved"
                ? "✔️"
                : report.status === "rejected"
                ? "❌"
                : "⚠️";

            return (
              <div
                key={report._id}
                className="bg-white/70 backdrop-blur-xl rounded-xl p-4 flex justify-between items-center shadow-sm hover:shadow transition"
              >

                {/* LEFT */}
                <div className="flex items-center gap-3">

                  <div className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-200">
                    {icon}
                  </div>

                  <div>
                    <p className="font-semibold text-gray-800">
                      {report.reason}
                    </p>

                    <p className="text-sm text-gray-500">
                      {report.description || "No description"}
                    </p>

                    <p className="text-xs text-gray-400">
                      {new Date(report.createdAt).toDateString()}
                    </p>
                  </div>

                </div>

                {/* RIGHT */}
                <div className="text-right">

                  <span className={`text-xs px-3 py-1 rounded-full ${statusColor}`}>
                    {report.status}
                  </span>

                  <p className="text-xs text-gray-400 mt-2">
                    {new Date(report.createdAt).toLocaleTimeString()}
                  </p>

                </div>

              </div>
            );
          })}

        </div>
      )}

    </div>
  </div>
);

}