'use client'
import { useState } from 'react'
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Loader, RefreshCw, Search } from 'lucide-react';
import DropDown from './DropDown';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';


const ProductSearch = ({ item }: { item: string }) => {
    const router = useNavigate();
    const [query, setQuery] = useState('');
    const [load, setLoad] = useState(false);
    const queryClient = useQueryClient();

    const itemName = item === 'products' ? 'products' : item === 'orders' ? 'orders' : 'customers'

    const fields = {
        'products': ['title', 'category', '_id'],
        'orders': ['customerEmail', 'status', '_id', 'createdAt'],
        'customers': ['email', '_id', 'name'],
    }
    const values: string[] = fields[itemName]
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
            router(`/${itemName}?key=${key}&query=${query}`);
        } else router(`/${itemName}`);
    };
    const handleRefresh = () => {
        setLoad(true);
        queryClient.invalidateQueries({ queryKey: [itemName] });
        toast.success('Refreshed ' + itemName);
        setLoad(false);
    }
    return (
        <form action={handleSearch} className="flex items-center flex-col sm:flex-row gap-3">
            {key === 'createdAt' ?
                <>
                    <Input
                        placeholder={`Search by ${key}...`}
                        type='date'
                        onChange={(e) => setQuery(e.target.value)}
                        className="max-w-sm"
                    />
                </>
                : <Input
                    placeholder={`Search by ${key}...`}
                    type={key.toLowerCase().includes('email') ? 'email' : 'text'}
                    onChange={(e) => setQuery(e.target.value)}
                    className="max-w-sm"
                    required
                    minLength={key === '_id' ? 24 : 3}
                />}
            <Button type='submit' title='Click confirm search or press Enter'><Search /></Button>
            <Button title={"Refresh " + itemName} type='button' onClick={handleRefresh}>
                {load ? <Loader className='animate-spin' /> : <RefreshCw />}
            </Button>
            <DropDown currentValue={key} setSearchValue={setKey} values={values}></DropDown>
        </form>
    )
}

export default ProductSearch
