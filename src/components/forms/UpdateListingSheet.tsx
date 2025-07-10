"use client";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader } from "lucide-react";
import * as React from "react";
import { useForm } from "react-hook-form";

import { listingSchema, TListing } from "@/schema/table.schema";
import { TaskForm } from "./TaskForm";
import { fetchWrapper } from "@/lib/fetch-wrapper";
import { toast } from "sonner";
import { TableMeta } from "@tanstack/react-table";

interface UpdateListingSheetProps
  extends React.ComponentPropsWithRef<typeof Sheet> {
  task: TListing | null;
  meta?: TableMeta<TListing>;
}

export function UpdateListingSheet({
  task,
  meta,
  ...props
}: Readonly<UpdateListingSheetProps>) {
  const [isPending, startTransition] = React.useTransition();

  const form = useForm<TListing>({
    resolver: zodResolver(listingSchema),
    defaultValues: {
      title: task?.title ?? "",
      description: task?.description,
      status: task?.status,
      adminId: task?.adminId,
      pricePerDay: task?.pricePerDay,
      submittedBy: task?.submittedBy,
      createdAt: task?.createdAt,
      id: task?.id,
      submittedAt: task?.submittedAt,
      updatedAt: task?.updatedAt,
    },
  });

  React.useEffect(() => {
    if (task) {
      form.setValue("title", task.title);
      form.setValue("description", task.description);
      form.setValue("status", task.status);
      form.setValue("adminId", task.adminId);
      form.setValue("pricePerDay", task.pricePerDay);
      form.setValue("submittedBy", task.submittedBy);
      form.setValue("id", task.id);
      form.setValue("createdAt", task.createdAt);
      form.setValue("submittedAt", task.submittedAt);
      form.setValue("updatedAt", task.updatedAt);
    }
  }, [task, form]);
  const onSubmit = form.handleSubmit((input: TListing) => {
    startTransition(async () => {
      const { error } = await fetchWrapper(`/api/listings/${input.id}/update`, {
        method: "PUT",
        body: { ...input },
      });

      if (error) {
        toast.error(error);
        return;
      }

      form.reset(input);
      meta?.updateData(input.id, input);
      props.onOpenChange?.(false);
      toast.success("Task updated");
    });
  });
  return (
    <Sheet {...props}>
      <SheetContent className="flex flex-col gap-6 sm:max-w-md">
        <SheetHeader className="text-left">
          <SheetTitle>Update Listing</SheetTitle>
          <SheetDescription>
            Update the Listing details and save the changes
          </SheetDescription>
        </SheetHeader>
        <TaskForm<TListing> form={form} onSubmit={onSubmit}>
          <SheetFooter className="gap-2 pt-2 sm:space-x-0">
            <SheetClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </SheetClose>
            <Button disabled={isPending}>
              {isPending && (
                <Loader
                  className="mr-2 size-4 animate-spin"
                  aria-hidden="true"
                />
              )}
              Save
            </Button>
          </SheetFooter>
        </TaskForm>
      </SheetContent>
    </Sheet>
  );
}
