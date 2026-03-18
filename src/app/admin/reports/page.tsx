"use client";

import { useEffect, useState } from "react";
import api from "@/services/api";

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

  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  const loadReports = async () => {

    try {

      const res = await api.get("/admin/reports");

      setReports(res.data);

    } catch (err) {

      console.error("Failed to load reports", err);

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

console.log("Reportsssssssssssssssssss", reports)


  if (loading) return <p className="p-6">Loading reports...</p>;

  return (

    <div className="max-w-5xl mx-auto p-6">

      <h1 className="text-2xl font-bold mb-6">
        Reports Dashboard
      </h1>

      <div className="space-y-4">

        {reports.map((report) => (

          <div
            key={report._id}
            className="border rounded-lg p-4 flex justify-between items-center"
          >

            <div>

              <p className="font-semibold">
                Reason: {report.reason}
              </p>

              <p className="text-sm text-gray-500">
                Type: {report.targetType}
              </p>

              <p className="text-sm text-gray-500">
                Reporter: {report.reporterId?.email}
              </p>

              <p className="text-sm text-gray-400">
                {new Date(report.createdAt).toLocaleDateString()}
              </p>

              <p className="mt-1">
                Status:
                <span className="ml-2 font-semibold">
                  {report.status}
                </span>
              </p>

            </div>

            <div className="flex gap-2 flex-wrap">

<button
onClick={() => updateStatus(report._id, "resolved")}
className="bg-green-500 text-white px-3 py-1 rounded"
>
Resolve
</button>

<button
onClick={() => updateStatus(report._id, "rejected")}
className="bg-red-500 text-white px-3 py-1 rounded"
>
Reject
</button>

<a
href={`/item/${report?.targetId?.slug}`}
className="border px-3 py-1 rounded"
>
View Listing
</a>

<button
onClick={() => {
  if (report.targetId?._id) {
    deleteListing(report.targetId._id);
  }
}}
className="bg-black text-white px-3 py-1 rounded"
>
Delete Listing
</button>

<button
onClick={() => banUser(report.reporterId?._id)}
className="bg-orange-500 text-white px-3 py-1 rounded"
>
Ban User
</button>

</div>

          </div>

        ))}

      </div>

    </div>

  );

}