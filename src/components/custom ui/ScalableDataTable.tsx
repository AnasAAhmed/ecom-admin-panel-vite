import { Button } from "../ui/button";

import {
  getFilteredRowModel,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  type ColumnDef,
  type ColumnFiltersState,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { useState } from 'react'
import { useNavigate, useSearchParams } from "react-router-dom";
import { Loader2 } from "./Loader";


interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  currentPage: number;
  isLoading: boolean;
  totalPage: number;
}

export function ScalableDataTable<TData, TValue>({
  columns,
  data,
  currentPage,
  isLoading = false,
  totalPage,
}: DataTableProps<TData, TValue>) {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      columnFilters,
    },
  });

  const setPageParam = (page: number) => {
    searchParams.set("page", page.toString());
    navigate(`?${searchParams.toString()}`);
  }
  const nextPage = () => {
    if (totalPage && currentPage > 1) {
      const page = currentPage + 1;
      setPageParam(page);
    }
  };

  const prevPage = () => {
    if (totalPage && currentPage > 1) {
      const page = currentPage - 1;
      setPageParam(page);
    }
  };
  return (
    <div className="py-5">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
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
            {!isLoading ? table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell className="text-[15px] font-medium text-gray-800 dark:text-gray-300" key={cell.id}>
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
                  className="h-24 text-xl font-medium text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            ) : <TableRow>
              <TableCell
                colSpan={columns.length}
              >
                <Loader2 />
              </TableCell>
            </TableRow>}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-1">
        <Button
          variant="outline"
          size="sm"
          onClick={() => prevPage()}
          disabled={currentPage < 2}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => nextPage()}
          disabled={totalPage < 2}
        >
          Next
        </Button>
      </div>
    </div>
  );
}


