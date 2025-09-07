import { ChevronsUpDown } from 'lucide-react';
import { Button } from '../ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';
type DropSearchProps = {
    setSearchValue: any;
    currentValue?: string;
    values: string[]
}
const DropDown = ({ currentValue, setSearchValue, values }: DropSearchProps) => {
    return (

        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button title={`Search with ${currentValue} field`} variant="outline" size="default">
                    <span>{currentValue ? 'Search: '+currentValue : "Filters"}</span>
                    <ChevronsUpDown className={`transition-all duration-200 h-5 w-5 `} />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                {values.map((value, index) => (
                    <DropdownMenuItem title={`Search with ${value} field`} className='cursor-pointer font-medium' key={index} onClick={() => setSearchValue(value)} >{value}</DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default DropDown
