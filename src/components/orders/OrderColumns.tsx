import type { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { Clipboard } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";

export const columns: ColumnDef<OrderColumnType>[] = [
  {
    accessorKey: "_id",
    header: "Order",
    cell: ({ row }) => {
      return (
        <TooltipProvider >
          <Tooltip >
            <TooltipTrigger asChild>
              <Link
                title={"Edit " + row.original._id}
                to={`/orders/manage/${row.original._id}`}
                className="hover:text-blue-400 max-w-28 rounded-md"

              >
                {row.original._id}
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right" className="sblock">
              <Link
                title={"Edit " + row.original._id}
                to={`/orders/${row.original._id}`}
                className="hover:text-blue-400 max-w-28 rounded-md"

              >
                See Details of Order {row.original._id}
              </Link>
              <hr className="my-1" />
              <span title="Copy Order _id" className="flex items-center gap-2 font-medium" onClick={() => { navigator.clipboard.writeText(row.original._id); toast.success('text copied') }}>
                Copy Order _id <Clipboard className="cursor-pointer h-3 w-3 " />
              </span>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    },
  },
  {
    accessorKey: "customerEmail",
    header: "Customer",
  },
  {
    accessorKey: "isPaid",
    header: "Paid",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      return <span style={{ color: row.original.status.startsWith('Canceled') ? 'red' : '' }}
      >{row.original.status}</span>;
    },
  },
  {
    accessorKey: "products",
    header: "Products",
    cell: ({ row }) => {
      const totalProducts = row.original.products.reduce((acc, item) => acc + item.quantity, 0);
      return <>{totalProducts}</>;
    }

  },
  {
    accessorKey: "totalAmount",
    header: "Total ($)",
    cell: ({ row }) => {
      return (
        <TooltipProvider >
          <Tooltip >
            <TooltipTrigger asChild>
              <p
                title={`${(row.original.exchangeRate * row.original.totalAmount).toFixed()} ${row.original.currency}`}
                className="hover:text-blue-400 max-w-28 rounded-md cursor-pointer"

              >
                {row.original.totalAmount} x ({row.original.currency})
              </p>
            </TooltipTrigger>
            <TooltipContent side="right" >
              <span title="Copy Order _id" className="flex items-center gap-2 font-medium" onClick={() => { navigator.clipboard.writeText(row.original._id); toast.success('text copied') }}>
                {`${(row.original.exchangeRate * row.original.totalAmount).toFixed()} ${row.original.currency}`}
              </span>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )
    },
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) => {
      return <>{format(row.original.createdAt, "MMM do, yyyy")}</>;
    },
  },
];