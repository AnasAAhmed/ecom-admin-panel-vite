import type { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { Clipboard } from "lucide-react";
import { toast } from "sonner";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";


export const columns: ColumnDef<CustomerType>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-1">
          <TooltipProvider >
            <Tooltip >
              <p
                title={row.original.name}
                className="hover:text-blue-400 cursor-pointer max-w-20 rounded-md"

              >
                {row.original.name}
              </p>
              <TooltipTrigger asChild>
                <span title="Copy User _id" className="flex items-center gap-2 font-medium" onClick={() => { navigator.clipboard.writeText(row.original._id); toast.success('text copied') }}>
                  <Clipboard className="cursor-pointer h-3 w-3 " />
                </span>
              </TooltipTrigger>
              <TooltipContent side="right">
                Copy User _id
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      )
    }
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "googleId",
    header: "Google-Id",
    cell: ({ row }) => {
      return <>{row.original.googleId || 'null'}</>
    },
  },
  {
    accessorKey: "ordersCount",
    header: "Orders",
    cell: ({ row }) => {
      return <>{row.original.ordersCount}</>
    },
  },
  {
    accessorKey: "image",
    header: "Avatar",
    cell: ({ row }) => {
      return <><img src={row.original.image!} alt="avatar" className="w-8 h-8 rounded-full" /></>
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
