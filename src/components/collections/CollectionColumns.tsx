import type { ColumnDef } from "@tanstack/react-table";
import Delete from "../custom ui/Delete";
import { Link } from "react-router-dom";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";

export const columns: ColumnDef<CollectionType>[] = [
  {
    accessorKey: "title",
    header: "Title",
      enableColumnFilter: true,
    cell: ({ row }) => (
      <TooltipProvider >
        <Tooltip >
          <TooltipTrigger asChild>
            <Link
              title={"Edit " + row.original.title}
              to={`/collections/edit/${row.original.title}?id=${row.original._id}`}
              className="hover:text-blue-400 max-w-28 rounded-md"

            >
              {row.original.title.length > 30 ? row.original.title.slice(0, 30) + '...' : row.original.title}
            </Link>
          </TooltipTrigger>
          <TooltipContent side="right" className="sblock">
            <p
            >
              Edit {row.original.title} Collection
            </p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    ),
  },
  {
    accessorKey: "products",
    header: "Products",
    cell: ({ row }) => <p>{row.original.productCount}</p>,
  },
  {
    accessorKey: "_id",
    header: "_id",
    enableColumnFilter: true,
  },
  {
    id: "actions",
    cell: ({ row }) => <Delete item="collections" id={row.original._id} />,
  },
];
