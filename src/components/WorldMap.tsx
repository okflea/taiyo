import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import { toast } from "sonner"
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Skeleton } from './ui/skeleton';
import { Button } from './ui/button';
import { ReloadIcon } from '@radix-ui/react-icons';
import L from 'leaflet';

interface CountryData {
  country: string;
  countryInfo: {
    _id: number;
    iso2: string;
    iso3: string;
    lat: number;
    long: number;
    flag: string;
  };
  cases: number;
  deaths: number;
  recovered: number;
}
function WorldMap() {
  const { data, isFetched, refetch } = useQuery({
    queryKey: ['worldMap'],
    queryFn: async () => {
      try {
        const response = await axios.get<CountryData[]>("https://disease.sh/v3/covid-19/countries")

        return response.data
      } catch (e) {
        console.log(e)
        toast.error("Something went wrong while fetching world map data")
      }
    }
  })
  return (
    <div className="border-2 dark:border-secondary gap-y-5 p-4">
      <h1 className="text-3xl font-bold mb-6 text-foreground text-center">
        Global COVID-19 Overview by Country

        <Button onClick={() => refetch()} variant={"ghost"} className="float-right">
          <ReloadIcon className="hover:animate-spin" /></Button>
      </h1>
      {!isFetched && (
        <Skeleton className="w-full h-[500px]" />
      )}
      {isFetched && (

        <MapContainer center={[20, 90]} zoom={4} style={{ height: "500px", width: "100%" }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {isFetched && data?.map((country) => (
            <Marker
              key={country.countryInfo._id}
              position={[country.countryInfo.lat, country.countryInfo.long]}
              icon={L.icon({
                iconUrl: country.countryInfo.flag,
                iconSize: [36, 24],
                iconAnchor: [16, 32],
                popupAnchor: [0, -32],
              })}
            >
              <Popup>
                <div>
                  <strong>{country.country}</strong><br />
                  Cases: {country.cases}<br />
                  Deaths: {country.deaths}<br />
                  Recovered: {country.recovered}
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      )}

      <p
        className="text-center text-muted-foreground"
      >Data provided by{" "}
        <a
          className="hover:underline underline-offset-4"
          href="https://disease.sh/"
        >Disease.sh
        </a></p>

      <p className="text-right text-sm font-thin text-muted-foreground">Click on a flag for details </p>
    </div>
  )
}

export default WorldMap
