"use client";

import { Row, TableMeta } from "@tanstack/react-table";
import { Ellipsis } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TListing } from "@/schema/table.schema";
import { fetchWrapper } from "@/lib/fetch-wrapper";
import { useTransition } from "react";
import { toast } from "sonner";
import { DataTableRowAction } from "../../types/table";

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
  setRowAction: React.Dispatch<
    React.SetStateAction<DataTableRowAction<TData> | null>
  >;
  meta?: TableMeta<TListing>;
}

export function DataTableRowActions<TData extends TListing>({
  row,
  setRowAction,
  meta,
}: Readonly<DataTableRowActionsProps<TData>>) {
  const [isPending, startTransition] = useTransition();
  const handleStatusChange = (status: "APPROVED" | "REJECTED") => {
    startTransition(async () => {
      try {
        await new Promise((res) => setTimeout(res, 500));
        const { error } = await fetchWrapper(
          `/api/listings/${row.original.id}/update`,
          {
            method: "PUT",
            body: { status },
          }
        );
        if (error) {
          toast.error(error);
          return;
        }

        meta?.statusChange(row.original.id, status);
        toast.success(`Listing ${status.toLowerCase()} successfully`);
      } catch (error) {
        console.error(error);
        toast.error("Something went wrong");
      }
    });
  };

  const handleApprove = () => handleStatusChange("APPROVED");
  const handleReject = () => handleStatusChange("REJECTED");
  return (
    <div className="flex gap-x-2">
      <Button
        size={"sm"}
        variant={"outline"}
        onClick={() => setRowAction({ listing: row, variant: "update" })}
      >
        Edit
      </Button>
      {row.original.status === "PENDING" && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              aria-label="Open menu"
              variant="ghost"
              disabled={isPending}
              className="flex size-8 p-0 data-[state=open]:bg-muted"
            >
              <Ellipsis
                className={`size-4 ${isPending && "animate-spin"}`}
                aria-hidden="true"
              />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem onSelect={handleApprove}>
              Approve
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={handleReject}>Reject</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
}
