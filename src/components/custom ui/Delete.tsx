import { useState } from "react";
import { Loader } from "lucide-react";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { API_BASE } from "../../App";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

interface DeleteProps {
  item: 'products' | 'orders' | 'collections' | 'home-page';
  id: string;
}

const Delete: React.FC<DeleteProps> = ({ item, id }) => {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const router = useNavigate();
  const onDelete = async () => {
    try {
      setLoading(true);
      const itemType = item;
      toast.loading('Deleting ' + itemType + '...')
      const res = await fetch(`${API_BASE}/api/admin/${itemType}/${id}`, {
        method: "DELETE",
        credentials: 'include',
      });

      if (res.ok) {
        setLoading(false);
        setOpen(false);
        queryClient.invalidateQueries({ queryKey: [itemType] });
        toast.dismiss();
        toast.success(`${item} deleted`);
        router(`/${itemType}`);
      } else {
        throw new Error(res.statusText);
      }
    } catch (err) {
      setLoading(false);
      setOpen(false);
      console.log(err);
      toast.dismiss();
      toast.error((err as Error).message || "Something went wrong! Please try again. ");
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button size={'sm'} variant={'outline'} title={"Delete this " + item} onClick={() => setOpen(true)}>
          {/* <Trash className="h-4 w-4" /> */}
          Delete
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="bg-primary-foreground text-gray-500">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-red-500">Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete this {item}.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="text-gray-700 dark:text-gray-300" onClick={() => setOpen(false)}>Cancel</AlertDialogCancel>
          <Button disabled={loading} className="bg-red-600 hover:bg-red-500 disabled:opacity-35 text-white" onClick={onDelete}>
            {loading ? <Loader className="animate-spin mx-[0.8rem]" /> : "Delete"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default Delete;
