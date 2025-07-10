import { Column } from "@tanstack/react-table";

export function getCommonPinningStyles<TData>({
  column,
  withBorder = false,
}: {
  column: Column<TData>;
  withBorder?: boolean;
}): React.CSSProperties {
  const isPinned = column.getIsPinned();
  const isLastLeftPinnedColumn =
    isPinned === "left" && column.getIsLastColumn("left");
  const isFirstRightPinnedColumn =
    isPinned === "right" && column.getIsFirstColumn("right");

  let boxShadow: string | undefined = undefined;

  if (withBorder) {
    if (isLastLeftPinnedColumn) {
      boxShadow = "-4px 0 4px -4px var(--border) inset";
    } else if (isFirstRightPinnedColumn) {
      boxShadow = "4px 0 4px -4px var(--border) inset";
    }
  }
  return {
    boxShadow: boxShadow,
    left: isPinned === "left" ? `${column.getStart("left")}px` : undefined,
    right: isPinned === "right" ? `${column.getAfter("right")}px` : undefined,
    opacity: isPinned ? 0.97 : 1,
    position: isPinned ? "sticky" : "relative",
    background: "var(--background)",
    width: column.getSize(),
    zIndex: isPinned ? 1 : 0,
  };
}
