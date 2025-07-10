"use client";

import { ColumnDef } from "@tanstack/react-table";

import { cn } from "@/lib/utils";
import { TListing } from "@/schema/table.schema";
import { DataTableRowAction } from "../../types/table";
import { DataTableColumnHeader } from "./DataTableColumnHeader";
import { DataTableRowActions } from "./DataTableRowActions";
import { statuses } from "@/constants";

export function getListingTableColumns({
  setRowAction,
}: {
  setRowAction: React.Dispatch<
    React.SetStateAction<DataTableRowAction<TListing> | null>
  >;
}): ColumnDef<TListing>[] {
  return [
    {
      accessorKey: "title",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Title" />
      ),
      cell: ({ row }) => {
        return (
          <div className="flex gap-2">
            <span className="max-w-[500px] truncate font-medium">
              {row.getValue("title")}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "description",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Desc" />
      ),
      cell: ({ row }) => {
        return (
          <div className="flex gap-2">
            <span className="max-w-[500px] flex text-wrap font-medium">
              {row.getValue("description")}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "status",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Status" />
      ),
      cell: ({ row }) => {
        const status = statuses.find(
          (status) => status.value === row.getValue("status")
        );

        if (!status) {
          return null;
        }

        return (
          <div className="flex w-[100px] items-center gap-2">
            {status.icon && (
              <status.icon
                className={cn(
                  `text-muted-foreground size-4`,
                  status.label === "Approved" && "text-green-500",
                  status.label === "Pending" && " text-yellow-500",
                  status.label === "Rejected" && "text-red-500"
                )}
              />
            )}
            <span>{status.label}</span>
          </div>
        );
      },
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id));
      },
    },
    {
      accessorKey: "pricePerDay",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Price Per Day" />
      ),
      cell: ({ row }) => {
        return (
          <div className="flex w-[100px] items-center gap-2">
            <span>${row.original.pricePerDay}</span>
          </div>
        );
      },
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id));
      },
    },
    {
      id: "actions",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Actions" />
      ),
      cell: ({ row, table }) => (
        <DataTableRowActions
          row={row}
          meta={table.options.meta}
          setRowAction={setRowAction}
        />
      ),
      enablePinning: true,
      size: 30,
    },
  ];
}
