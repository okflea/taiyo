import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import { toast } from "sonner"
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend, ResponsiveContainer } from 'recharts';
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "./ui/button";
import { ReloadIcon } from "@radix-ui/react-icons";

interface CovidData {
  cases: Record<string, number>;
  deaths: Record<string, number>;
  recovered: Record<string, number>;
}
interface linegraphData {
  date: string;
  cases: number;
  deaths: number;
  recovered: number;
}

function LineGraph() {

  const { data, isFetched, refetch } = useQuery({
    queryKey: ['lineChart'],
    queryFn: async () => {
      try {
        const response = await axios.get<CovidData>("https://disease.sh/v3/covid-19/historical/all?lastdays=all")

        const { cases, deaths, recovered } = response.data;

        const chartData: linegraphData[] = Object.keys(cases).map(date => ({
          date,
          cases: cases[date],
          deaths: deaths[date] || 0,
          recovered: recovered[date] || 0,
        }));
        return chartData
      } catch (e) {
        console.log(e)
        toast.error("Something went wrong while fetching line graph data")
      }
    }
  })
  return (
    <div className="border-2 dark:border-secondary gap-y-5 p-4">
      <h1 className="text-3xl font-bold mb-6 text-foreground text-center">
        Global COVID-19 Statistics Over Time
        <Button onClick={() => refetch()} variant={"ghost"} className="float-right">
          <ReloadIcon className="hover:animate-spin" /></Button>
      </h1>
      {!isFetched && (
        <Skeleton className="w-full h-[500px]" />
      )}
      {isFetched && (
        <ResponsiveContainer width="100%" height={500}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 10 }} />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="cases" stroke="#5D2E8C" activeDot={{ r: 8 }} />
            <Line type="monotone" dataKey="deaths" stroke="#2EC4B6" />
            <Line type="monotone" dataKey="recovered" stroke="#FF6666" />
          </LineChart>
        </ResponsiveContainer>
      )}
      <p
        className="text-center text-muted-foreground"
      >Data provided by{" "}
        <a
          className="hover:underline underline-offset-4"
          href="https://disease.sh/"
        >Disease.sh
        </a></p>
      <p className="text-right text-sm font-thin text-muted-foreground">PS: there might be some null values </p>
    </div>
  )
}

export default LineGraph
