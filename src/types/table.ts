import { Row, RowData } from "@tanstack/react-table";

declare module "@tanstack/react-table" {
  interface TableMeta<TData extends RowData> {
    updateData: (listingid: string, value: TData) => void;
    statusChange: (listingid: string, status: "APPROVED" | "REJECTED") => void;
  }
}

export interface DataTableRowAction<TData> {
  listing: Row<TData>;
  variant: "update" | "APPROVED" | "REJECTED";
}