"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export type Invoice = {
  id: number;
  invoiceNumber: string;
  client: string;
  service: string;
  date: string;
  amount: number;
  status: "Paid" | "Pending" | "Overdue";
};

type ProfileInvoicesProps = {
  invoices: Invoice[];
};

function getStatusVariant(status: Invoice["status"]) {
  switch (status) {
    case "Paid":
      return "secondary" as const;
    case "Pending":
      return "default" as const;
    case "Overdue":
      return "destructive" as const;
  }
}

export function ProfileInvoices({ invoices }: ProfileInvoicesProps) {
  const totalAmount = invoices.reduce((sum, inv) => sum + inv.amount, 0);
  const paidAmount = invoices
    .filter((inv) => inv.status === "Paid")
    .reduce((sum, inv) => sum + inv.amount, 0);

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle>Invoices</CardTitle>
          <div className="flex items-center gap-4">
            <p className="text-sm text-muted-foreground">
              ${paidAmount.toLocaleString()} paid of $
              {totalAmount.toLocaleString()} total
            </p>
            <Button variant="outline" size="sm" asChild>
              <Link href="/invoices">View all invoices</Link>
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {invoices.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              No invoices yet.
            </p>
          ) : (
            invoices.map((invoice) => (
              <div
                key={invoice.id}
                className="flex items-center justify-between p-4 border border-border rounded-lg"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-semibold text-foreground">
                      {invoice.invoiceNumber}
                    </h3>
                    <Badge variant={getStatusVariant(invoice.status)}>
                      {invoice.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {invoice.client} &middot; {invoice.service}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {invoice.date}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-foreground">
                    ${invoice.amount}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
