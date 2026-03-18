"use client";

import { useEffect, useState } from "react";
import api from "@/services/api";

type Report = {
  _id: string;
  targetType: string;
  reason: string;
  status: string;
  createdAt: string;
};

export default function MyReportsPage() {

  const [reports, setReports] = useState<Report[]>([]);

  useEffect(() => {

    const loadReports = async () => {

      const res = await api.get("/report/my");

      setReports(res.data);

    };

    loadReports();

  }, []);

  return (

    <div className="max-w-3xl mx-auto p-6">

      <h1 className="text-2xl font-bold mb-6">
        My Reports
      </h1>

      {reports.length === 0 && (
        <p className="text-gray-500">
          You have not submitted any reports.
        </p>
      )}

      <div className="space-y-4">

        {reports.map((report) => (

          <div
            key={report._id}
            className="border rounded-lg p-4"
          >

            <p className="text-sm text-gray-500">
              Type: {report.targetType}
            </p>

            <p className="font-medium">
              Reason: {report.reason}
            </p>

            <p className="text-sm">
              Status: 
              <span className="ml-1 font-semibold">
                {report.status}
              </span>
            </p>

            <p className="text-xs text-gray-400">
              {new Date(report.createdAt).toLocaleDateString()}
            </p>

          </div>

        ))}

      </div>

    </div>

  );

}