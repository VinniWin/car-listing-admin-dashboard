import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  PaginationState,
  SortingState,
  Updater,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import * as React from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PAGE_KEY, parseAsIntegerOptions, PER_PAGE_KEY } from "@/constants";
import { useSkipper } from "@/hooks/use-skipper";
import { TListing } from "@/schema/table.schema";
import { getCommonPinningStyles } from "@/lib/table-style";
import { parseAsInteger, useQueryState } from "nuqs";
import { UpdateListingSheet } from "../forms/UpdateListingSheet";
import { DataTableRowAction } from "../../types/table";
import { DataTablePagination } from "./DataTablePagination";
import { DataTableToolbar } from "./DataTableToolbar";
import { useRouter } from "next/router";

interface DataTableProps<TValue> {
  columns: ColumnDef<TListing, TValue>[];
  data: TListing[];
  rowAction: DataTableRowAction<TListing> | null;
  setRowAction: React.Dispatch<
    React.SetStateAction<DataTableRowAction<TListing> | null>
  >;
  serverPagination: {
    total: number;
    perPage: number;
    currentPage: number;
    totalPages: number;
  } | null;
}

export function DataTable<TValue>({
  columns,
  data: initialData,
  rowAction,
  setRowAction,
  serverPagination,
}: Readonly<DataTableProps<TValue>>) {
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const router = useRouter();
  const [data, setData] = React.useState(initialData);
  const [page] = useQueryState(
    PAGE_KEY,
    parseAsInteger.withOptions(parseAsIntegerOptions).withDefault(1)
  );
  const [perPage] = useQueryState(
    PER_PAGE_KEY,
    parseAsInteger.withOptions(parseAsIntegerOptions).withDefault(10)
  );

  const pagination: PaginationState = React.useMemo(() => {
    return {
      pageIndex: page - 1,
      pageSize: perPage,
    };
  }, [page, perPage]);

  const onPaginationChange = React.useCallback(
    (updaterOrValue: Updater<PaginationState>) => {
      let newPageIndex: number;
      let newPageSize: number;

      if (typeof updaterOrValue === "function") {
        const newPagination = updaterOrValue(pagination);
        newPageIndex = newPagination.pageIndex;
        newPageSize = newPagination.pageSize;
      } else {
        newPageIndex = updaterOrValue.pageIndex;
        newPageSize = updaterOrValue.pageSize;
      }

      router.push({
        pathname: router.pathname,
        query: {
          ...router.query,
          page: newPageIndex + 1,
          perPage: newPageSize,
        },
      });
    },
    [router, pagination]
  );
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [, skipAutoResetPageIndex] = useSkipper();

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      pagination,
    },
    rowCount: serverPagination?.total,
    initialState: {
      columnPinning: { right: ["actions"] },
    },
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    onPaginationChange,
    manualPagination: true,
    meta: {
      updateData: (listingId, value) => {
        skipAutoResetPageIndex();
        setData((old) =>
          old.map((row) => {
            if (row.id === listingId) {
              return {
                ...value,
              };
            }
            return row;
          })
        );
      },
      statusChange: (listingId, listingStatus) => {
        skipAutoResetPageIndex();
        setData((old) =>
          old.map((row) => {
            if (row.id === listingId) {
              return {
                ...row,
                status: listingStatus,
              };
            }
            return row;
          })
        );
      },
    },
  });

  React.useEffect(() => {
    setData(initialData);
  }, [initialData]);
  return (
    <div className="flex flex-col gap-4">
      <DataTableToolbar table={table} />
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      style={{
                        ...getCommonPinningStyles({ column: header.column }),
                      }}
                      key={header.id}
                      colSpan={header.colSpan}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      style={{
                        ...getCommonPinningStyles({ column: cell.column }),
                      }}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <UpdateListingSheet
        open={rowAction?.variant === "update"}
        onOpenChange={() => setRowAction(null)}
        task={rowAction?.listing?.original ?? null}
        meta={table.options.meta}
      />
      <DataTablePagination table={table} />
    </div>
  );
}
