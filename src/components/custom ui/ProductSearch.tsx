import { useState } from 'react'
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Loader, RefreshCw, Search } from 'lucide-react';
import DropDown from './DropDown';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';

const fields = {
    'products': ['title', 'category', '_id'],
    'orders': ['customerEmail', 'status', '_id', 'createdAt'],
    'customers': ['email', '_id', 'name','googleId'],
    'collections': ['title', '_id'],
}

const sortFields = {
    'products': [
        { 'option': 'createdAt|asc', 'title': 'Oldest' },
        { 'option': 'createdAt|desc', 'title': 'Newest' },
        { 'option': 'stock|desc', 'title': 'More On Stock' },
        { 'option': 'stock|asc', 'title': 'Less On Stock' },
        { 'option': 'price|desc', 'title': 'High-to-low Price' },
        { 'option': 'price|asc', 'title': 'low-to-high Price' },
        { 'option': 'ratings|desc', 'title': 'Most Rated' },
        { 'option': 'ratings|asc', 'title': 'Less Rated' },
        { 'option': 'expense|desc', 'title': 'High-to-low Expense' },
        { 'option': 'expense|asc', 'title': 'low-to-high Expense' },
        { 'option': 'sold|desc', 'title': 'Most Sold' },
        { 'option': 'sold|asc', 'title': 'Less Sold' },
        { 'option': 'weight|desc', 'title': 'Heaviest' },
        { 'option': 'weight|asc', 'title': 'Lightest' },
        { 'option': 'numOfReviews|desc', 'title': 'Hight num of reviews' },
        { 'option': 'numOfReviews|asc', 'title': 'Low numof reviews' },
    ],
    'orders': [
        { 'option': 'method|desc', 'title': 'Online Orders' },
        { 'option': 'method|asc', 'title': 'C.O.D Orders' },
        { 'option': 'isPaid|desc', 'title': 'Paid' },
        { 'option': 'isPaid|asc', 'title': 'Not Paid' },
        { 'option': 'totalAmount|desc', 'title': 'High-to-low totalAmount' },
        { 'option': 'totalAmount|asc', 'title': 'low-to-high totalAmount' },
    ],
    'customers': [
        { 'option': 'createdAt|asc', 'title': 'Oldest' },
        { 'option': 'createdAt|desc', 'title': 'Newest' },
        { 'option': 'googleId|desc', 'title': 'Logged in via Google' },
        { 'option': 'googleId|asc', 'title': 'Logged in via Email/Password' },
        { 'option': 'ordersCount|desc', 'title': 'Most Orders' },
        { 'option': 'ordersCount|asc', 'title': 'Less Orders' },
    ],
    'collections': [
        { 'option': 'createdAt|asc', 'title': 'Oldest' },
        { 'option': 'createdAt|desc', 'title': 'Newest' },
        { 'option': 'productCount|desc', 'title': 'Number of products' },
        { 'option': 'productCount|asc', 'title': 'Number of products' },
    ],
}

const ProductSearch = ({ item }: { item: 'products' | 'orders' | 'customers' | 'collections' }) => {
    const router = useNavigate();
    const [query, setQuery] = useState('');
    const [load, setLoad] = useState(false);
    const queryClient = useQueryClient();


    const values: string[] = fields[item]
    const sortOptions: {
        option: string;
        title: string;
    }[] = sortFields[item]
    const [key, setKey] = useState(values[0]);

    const handleSearch = () => {
        function isHex24(str: string) {
            return /^[a-fA-F0-9]{24}$/.test(str);
        }

        if (key === '_id' && !isHex24(query)) {
            toast.error("Invalid Order ID format.");
            return;
        }

        if (query) {
            router(`/${item}?key=${key}&query=${query}`);
        } else router(`/${item}`);
    };
    const handleRefresh = () => {
        setLoad(true);
        queryClient.invalidateQueries({ queryKey: [item] });
        toast.success('Refreshed ' + item);
        setLoad(false);
    }

    const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const searchParams = new URLSearchParams(window.location.search);
        const [field, order] = e.target.value.split("|");
        if (!field || !order) {
            searchParams.delete('sortField');
            searchParams.delete('sort');
            const newUrl = `?${searchParams.toString()}`;
            router(newUrl);

        } else {
            searchParams.set('sortField', field.toString());
            searchParams.set('sort', order.toString());
            const newUrl = `?${searchParams.toString()}`;
            router(newUrl);

        }
    };

    return (
        <>
            <form action={handleSearch} className="flex items-center flex-wrap gap-3">
                <DropDown currentValue={key} setSearchValue={setKey} values={values}></DropDown>
                {key === 'createdAt' ?
                    <>
                        <Input
                            placeholder={`Search by ${key}...`}
                            type='date'
                            onChange={(e) => setQuery(e.target.value)}
                            className="max-w-sm"
                        />
                    </>
                    : 
                    <>
                    <Input
                        placeholder={`Search by ${key}...`}
                        type={key.toLowerCase().includes('email') ? 'email' : 'text'}
                        onChange={(e) => setQuery(e.target.value)}
                        className="max-w-sm"
                        required
                        list={key==='status'?'status':''}
                        minLength={key === '_id' ? 24 : 3}
                        />
                        <datalist id='status'> 
                            <option value="refunded">refunded</option>
                            <option value="pending">pending</option>
                            <option value="delivered">delivered</option>
                            <option value="canceled">canceled</option>
                            <option value="shipped">shipped</option>
                        </datalist>
                        </>}
                <Button type='submit' title='Click confirm search or press Enter'><Search /></Button>
                <Button title={"Refresh " + item} type='button' onClick={handleRefresh}>
                    {load ? <Loader className='animate-spin' /> : <RefreshCw />}
                </Button>
            </form>
            <select
                className="h-9 px-2 py-2 has-[>svg]:px-3 mt-3 border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive"
                // value={`${sortField}|${sort}`}
                onChange={handleSortChange}
            >
                <option value="">Sort</option>
                {sortOptions.map((i) => (
                    <option key={i.option} value={i.option}>{i.title}</option>
                ))}
                <option value="">None</option>
            </select>
        </>
    )
}

export default ProductSearch
