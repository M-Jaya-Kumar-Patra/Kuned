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

    <div className="max-w-4xl mx-auto p-6">

      <h1 className="text-2xl font-bold mb-6">
        Reports About Your Listings
      </h1>

      {reports.map((report) => (

        <div
          key={report._id}
          className="border p-4 rounded mb-4"
        >

          <p>
            <b>Reason:</b> {report.reason}
          </p>

          <p>
            <b>Description:</b> {report.description}
          </p>

          <p className="text-sm text-gray-500">
            Reported by: {report.reporterId?.email}
          </p>

          <p className="text-sm">
            Status: {report.status}
          </p>

        </div>

      ))}

    </div>

  );

}