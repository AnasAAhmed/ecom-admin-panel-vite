import { ChevronsUpDown } from 'lucide-react';
import { Button } from '../ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';
type DropSearchProps = {
    setSearchValue: any;
    currentValue?: string;
    isOrderStatusUpdate?: boolean;
    values: string[]
}
const DropDown = ({ currentValue, setSearchValue, values, isOrderStatusUpdate = false }: DropSearchProps) => {
    return (

        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button title={`${isOrderStatusUpdate ? 'Status' : 'Search with'} ${currentValue}`} variant="outline" size="default">
                    <span>{currentValue ? isOrderStatusUpdate ? 'Update Status To: ' : 'Search:' + currentValue : "Filters"}</span>
                    <ChevronsUpDown className={`transition-all duration-200 h-5 w-5 `} />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                {values.map((value, index) => (
                    <DropdownMenuItem title={`${ isOrderStatusUpdate ? 'Update Status To:' : 'Search:'} ${value}`} className='cursor-pointer font-medium' key={index} onClick={() => setSearchValue(value)} >{value}</DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default DropDown
