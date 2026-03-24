"use client";

import { useEffect, useState } from "react";
import api from "@/services/api";
import { useRouter } from "next/navigation";
import { AxiosError } from "axios";


type Report = {
  _id: string;
  targetType: string;
  reason: string;
  status: string;
  createdAt: string;

  reporterId?: {
    _id: string;
    name?: string;
    email?: string;
  };

  targetId?: {
    _id: string;
    slug: string;
    title?: string;
  };
};
export default function AdminReportsPage() {

const router = useRouter();

  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  const loadReports = async () => {

    try {

      const res = await api.get("/admin/reports");

      setReports(res.data);

    } catch (err: unknown) {
  const error = err as AxiosError;

  if (error.response?.status === 404) {
    router.push("/404");
  } else {
    console.error("Failed to load reports", error);
  }
} finally {

      setLoading(false);

    }

  };

  useEffect(() => {

    loadReports();

  }, []);

  const updateStatus = async (id: string, status: string) => {

    try {

      await api.patch(`/admin/reports/${id}`, {
        status
      });

      setReports((prev) =>
        prev.map((r) =>
          r._id === id ? { ...r, status } : r
        )
      );

    } catch (err) {

      console.error("Failed to update report", err);

    }

  };

  const deleteListing = async (id: string) => {

  if (!confirm("Delete this listing?")) return;

  await api.delete(`/admin/listings/${id}`);

  alert("Listing deleted");

};

const banUser = async (id?: string) => {

  if (!id) return;

  if (!confirm("Ban this user?")) return;

  console.log("Banning user:", id);

  await api.patch(`/admin/users/${id}`);

  alert("User banned");

};

  if (loading) return <p className="p-6">Loading reports...</p>;

  return (
  <div className="min-h-screen bg-gradient-to-br from-[#eef2ff] to-[#e9ecff] px-4 py-8">

    <div className="max-w-6xl mx-auto">

      {/* HEADER */}
      <h1 className="text-3xl font-semibold text-gray-800">
        Reports About Your Listings
      </h1>
      <p className="text-gray-500 mb-6">
        Stay informed and resolve issues quickly
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

      {/* LIST */}
      {reports.length === 0 ? (
        <div className="text-center mt-20">
          <img src="/images/report/empty.png" className="w-40 mx-auto mb-4" />
          <p className="text-lg font-medium text-gray-600">
            No reports — you are doing great 🎉
          </p>
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

            return (
              <div
                key={report._id}
                className="bg-white/70 backdrop-blur-xl rounded-xl p-4 flex justify-between items-center shadow-sm hover:shadow transition"
              >

                {/* LEFT */}
                <div className="flex gap-4">

                  {/* TEXT */}
                  <div>
                    <p className="font-semibold text-gray-800">
                      {report.reason}
                    </p>

                    <p className="text-sm text-gray-500">
                      {report.targetType === "listing"
                        ? "Listing"
                        : "User"}{" "}
                      • {report.targetId?.title || "Unknown"}
                    </p>

                    <p className="text-sm text-gray-400">
                      {report.reporterId?.email}
                    </p>

                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(report.createdAt).toLocaleString()}
                    </p>
                  </div>

                </div>

                {/* RIGHT */}
                <div className="flex flex-col items-end gap-2">

                  {/* STATUS */}
                  <span className={`text-xs px-3 py-1 rounded-full ${statusColor}`}>
                    {report.status}
                  </span>

                  {/* ACTIONS */}
                  <div className="flex gap-2 flex-wrap justify-end">

                    <button
                      onClick={() => updateStatus(report._id, "resolved")}
                      className="bg-green-500 text-white px-3 py-1 rounded text-xs"
                    >
                      Resolve
                    </button>

                    <button
                      onClick={() => updateStatus(report._id, "rejected")}
                      className="bg-red-500 text-white px-3 py-1 rounded text-xs"
                    >
                      Reject
                    </button>

                    {report.targetId?.slug && (
                      <a
                        href={`/item/${report.targetId.slug}`}
                        className="border px-3 py-1 rounded text-xs"
                      >
                        View
                      </a>
                    )}

                    {report.targetId?._id && (
                      <button
                        onClick={() => deleteListing(report.targetId!._id)}
                        className="bg-black text-white px-3 py-1 rounded text-xs"
                      >
                        Delete
                      </button>
                    )}

                    <button
                      onClick={() => banUser(report.reporterId?._id)}
                      className="bg-orange-500 text-white px-3 py-1 rounded text-xs"
                    >
                      Ban User
                    </button>

                  </div>

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