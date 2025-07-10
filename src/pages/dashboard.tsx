import AdminLayout from "@/components/sidebar-comp/AdminLayout";
import { getListingTableColumns } from "@/components/table/column";
import { DataTable } from "@/components/table/DataTable";
import { DataTableRowAction } from "@/types/table";
import { SiteHeader } from "@/components/ui/site-header";
import { listingSchema, TListing } from "@/schema/table.schema";
import { fetchWrapper } from "@/lib/fetch-wrapper";
import type { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { useMemo, useState } from "react";
import z from "zod";
import { Listing } from "@/db/schema";

export const getServerSideProps = (async (ctx) => {
  try {
    const query = ctx.query;
    const pageno = parseInt(query.page as string) || 1;
    const perPage = parseInt(query.perPage as string) || 10;
    const base =
      process.env.NODE_ENV == "production"
        ? `https://${ctx.req.headers.host}`
        : "";
    const { data, error } = await fetchWrapper<{
      data?: {
        listings: Listing[];
        pagination?: {
          total: number;
          perPage: number;
          currentPage: number;
          totalPages: number;
        };
      };
    }>(`${base}/api/listings/getlisting?pageno=${pageno}&perPage=${perPage}`, {
      method: "GET",
      headers: {
        Authorization: `${ctx.req.cookies?.auth_token}`,
      },
    });

    if (error) {
      console.error("Error fetching listings:", error);
      return { props: { resData: [], pagination: null } };
    }

    if (data?.data?.listings) {
      const resData = z.array(listingSchema).parse(data.data.listings);
      return { props: { resData, pagination: data.data.pagination || null } };
    }

    return { props: { resData: [], pagination: null } };
  } catch (error) {
    console.error("Error during server-side data fetching:", error);
    return { props: { resData: [], pagination: null } };
  }
}) satisfies GetServerSideProps<{
  resData: TListing[] | [];
  pagination?: {
    total: number;
    perPage: number;
    currentPage: number;
    totalPages: number;
  } | null;
}>;

export default function Home({
  resData,
  pagination,
}: Readonly<InferGetServerSidePropsType<typeof getServerSideProps>>) {
  const [rowAction, setRowAction] =
    useState<DataTableRowAction<TListing> | null>(null);
  const columns = useMemo(
    () =>
      getListingTableColumns({
        setRowAction,
      }),
    []
  );

  return (
    <AdminLayout>
      <SiteHeader title="Dashboard" />
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <DataTable
              data={resData}
              columns={columns}
              rowAction={rowAction}
              setRowAction={setRowAction}
              serverPagination={pagination}
            />
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
