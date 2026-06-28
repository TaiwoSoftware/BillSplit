"use client";

import { useState } from "react";
import Button from "@/app/components/ui/Button";

export default function ExportData() {
  const [loadingPDF, setLoadingPDF] = useState(false);
  const [loadingCSV, setLoadingCSV] = useState(false);

  // Sample data (replace with Supabase data later)
  const bills = [
    {
      title: "House Rent",
      amount: 150000,
      paid: 120000,
      status: "Pending",
    },
    {
      title: "Birthday Party",
      amount: 50000,
      paid: 50000,
      status: "Completed",
    },
    {
      title: "Vacation",
      amount: 250000,
      paid: 180000,
      status: "Ongoing",
    },
  ];

  const exportCSV = () => {
    setLoadingCSV(true);

    const headers = [
      "Title",
      "Amount",
      "Paid",
      "Status",
    ];

    const rows = bills.map((bill) => [
      bill.title,
      bill.amount,
      bill.paid,
      bill.status,
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "bills.csv";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);

    setTimeout(() => {
      setLoadingCSV(false);
    }, 700);
  };

  const exportPDF = () => {
    setLoadingPDF(true);

    const printWindow = window.open("", "_blank");

    if (!printWindow) return;

    printWindow.document.write(`
      <html>
      <head>
        <title>BillSplit Report</title>
        <style>
          body{
            font-family:Arial;
            padding:40px;
          }

          table{
            width:100%;
            border-collapse:collapse;
            margin-top:20px;
          }

          th,td{
            border:1px solid #ddd;
            padding:12px;
          }

          th{
            background:#2563eb;
            color:white;
          }
        </style>
      </head>

      <body>
        <h1>BillSplit Report</h1>

        <table>
          <thead>
            <tr>
              <th>Bill</th>
              <th>Amount</th>
              <th>Paid</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            ${bills
              .map(
                (bill) => `
                <tr>
                  <td>${bill.title}</td>
                  <td>₦${bill.amount.toLocaleString()}</td>
                  <td>₦${bill.paid.toLocaleString()}</td>
                  <td>${bill.status}</td>
                </tr>
              `
              )
              .join("")}
          </tbody>
        </table>

      </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.print();

    setTimeout(() => {
      setLoadingPDF(false);
    }, 700);
  };

  return (
    <section className="mt-8 rounded-3xl bg-white p-8 shadow-sm">
      <h2 className="text-xl font-bold">
        Export Data
      </h2>

      <p className="mt-3 text-slate-500">
        Download your bills, payments and
        account activity.
      </p>

      <div className="mt-8 flex flex-wrap gap-4">
        <Button
          onClick={exportPDF}
          loading={loadingPDF}
          disabled={loadingPDF || loadingCSV}
        >
          Export PDF
        </Button>

        <Button
          variant="outline"
          onClick={exportCSV}
          loading={loadingCSV}
          disabled={loadingPDF || loadingCSV}
        >
          Export CSV
        </Button>
      </div>
    </section>
  );
}