import type { ColumnDef } from "@tanstack/react-table";
import {Link} from "react-router-dom";
export const columns: ColumnDef<OrderItemType>[] = [
  {
    accessorKey: "product",
    header: "Product",
    cell: ({ row }) => {
      const product = row.original.product;
      return product ? (
        <Link
        title="Go To product"
          to={`/products/${product._id}`}
          className="hover:text-red-500"
        >
          {product.title}
        </Link>
      ) : (
        <span>Product not available</span>
      );
    },
  },
  {
    accessorKey: "color",
    header: "Color",
  },
  {
    accessorKey: "size",
    header: "Size",
  },
  {
    accessorKey: "quantity",
    header: "Quantity",
  },
];