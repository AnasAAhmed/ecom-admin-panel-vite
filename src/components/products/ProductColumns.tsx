import Delete from "../custom ui/Delete";
import { Link } from "react-router-dom";
import { Clipboard } from "lucide-react";
import { toast } from "sonner";
import type { ColumnDef } from "@tanstack/react-table";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";

export const columns: ColumnDef<ProductType>[] = [
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) => (
      <TooltipProvider >
        <Tooltip >
          <TooltipTrigger asChild>
            <Link
              title={"Edit " + row.original.title}
              to={`/products/edit/${row.original.slug}?id=${row.original._id}`}
              className="hover:text-blue-400 max-w-28 rounded-md"

            >
              {row.original.title.length > 30 ? row.original.title.slice(0, 30) + '...' : row.original.title}
            </Link>
          </TooltipTrigger>
          <TooltipContent side="right" className="sblock">
            <Link
              title={"Edit " + row.original.title}
              to={'/products/edit/'+row.original?.title+'?id='+row.original._id}
              className="hover:text-blue-400 max-w-28 rounded-md"

            >
              Edit {row.original.title}
            </Link>
            <hr className="my-1" />
            <span title="Copy product _id" className="flex items-center gap-2 font-medium" onClick={() => { navigator.clipboard.writeText(row.original._id); toast.success('text copied') }}>
              Copy product _id <Clipboard className="cursor-pointer h-3 w-3 " />
            </span>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    ),
  },
  {
    accessorKey: "category",
    header: "Category",
  },
  {
    accessorKey: "collections",
    header: "Collections",
    cell: ({ row }) => row.original.collections.map((collection) => collection.title).join(", "),
  },
  {
    accessorKey: "price",
    header: "Price ($)",
  },
  {
    accessorKey: "stock",
    header: "Stock/Sold",
    cell: ({ row }) => <>{row.original.stock}/{row.original.sold}</>,

  },
  {
    id: "actions",
    header: "actions",
    cell: ({ row }) => <Delete item="products" id={row.original._id} />,
  },
];
