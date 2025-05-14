
import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '../ui/button';
import { LoaderIcon } from 'lucide-react';
import Delete from '../custom ui/Delete';
import DropDown from '../custom ui/DropDown';
import { API_BASE } from '../../App';
import { useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

type OrderManageProps = {
  orderId: string;
  currentStatus: string;
};

const OrderManagement = ({ orderId, currentStatus }: OrderManageProps) => {
  const [loadingUp, setLoadingUp] = useState(false);
  const [newStatus, setNewStatus] = useState(currentStatus);
  const router = useNavigate();
  const queryClient = useQueryClient();

  const handleSubmit = async () => {
    if (!newStatus) return;
    const token = 'eyJhbGciOiJkaXIiLCJlbmMiOiJBMjU2Q0JDLUhTNTEyIiwia2lkIjoicGpJX044b3g3ZTRKWWswMHJ2QU5jd1E4M1YwRzZmOVpncGsyNmdJQ1dZbVMxaUNUUjNYTks4MjVjeWVSdlJFQlJFdlpaVFBwVlF1M2tjVjVaaGZyZkEifQ..siVmlS79miezBh2ebaNDLA.acDGuwb4noE1nQsYszlecDusuIs80suzBirCzKsw-fXghkf0h3dTwTHghOm5U1GjyysaroEVvBxjRp10VrB31MKKwsvQGcncpcdHS3EJnLfUCTOPU-dhG-j147XGHpVrl-ONYUXX8ij6wC6WdiBHOOyDaO9t7bi8DxgsaNis0mV15pwjSwiHVygWcApyBk0Ge_ksQwSilgdMAfKmj9pQH37mAYwZojsJxrnLBHC3gVCVzyykhGreFXDvkoDQWMfj.SjnJgcZYxoX-lmkIuaDgyXiwWs3Z7Oic6necHYDtGwY';
    // const token = localStorage.getItem("authjs.admin-session");

    try {
      if (!token) {
        toast.error("Admin session token not found.")
        throw new Error("Admin session token not found.");
      }
      setLoadingUp(true);
      toast.loading('Updating Order Status')
      const res = await fetch(`${API_BASE}/api/admin/orders/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) {
        const errorMessage = await res.text();
        setLoadingUp(false);
        throw new Error(errorMessage + res.statusText);
      }
      toast.success('Order status updated successfully');
      queryClient.invalidateQueries({ queryKey: ['orders'] });

      router(`/orders`);
    } catch (err) {
      console.error('Error updating order status:', err); // Avoid logging sensitive info
      toast.error((err as Error).message);
    } finally {
      setLoadingUp(false);
      toast.dismiss();
    }
  };

  const statusOptions = ["Delivered", "Canceled", "Shipped", "Processing"];

  return (
    <div className="flex flex-wrap gap-3 items-center py-5">
      <DropDown currentValue={newStatus} setSearchValue={setNewStatus} values={statusOptions} />
      <Delete item={"orders"} id={orderId} />
      {newStatus !== currentStatus && (
        <Button onClick={handleSubmit}>
          {loadingUp ? <LoaderIcon className='mx-[7px] animate-spin' /> : "Save"}
        </Button>
      )}
    </div>
  );
};

export default OrderManagement;