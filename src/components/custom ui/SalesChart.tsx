import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts'

const SalesChart = ({ data }: { data: {name:string,total:number}[] }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart className='w-full h-full dark:text-gray-800' data={data} margin={{ top: 5, right:20, bottom: 5, left:0 }}>
        <Line type="monotone" dataKey="sales" stroke="#8884d8" />
        <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
      </LineChart>
    </ResponsiveContainer>
  )
}

export default SalesChart