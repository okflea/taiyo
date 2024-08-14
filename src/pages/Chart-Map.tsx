
import NavbarSidebar from "@/components/NavbarSidebar";
import LineGraph from "@/components/Linegraph";
import WorldMap from "@/components/WorldMap";


function ChartMap() {
  return (
    <>
      <NavbarSidebar >
        <div className="space-y-2">
          <LineGraph />
          <WorldMap />
        </div>
      </NavbarSidebar>
    </>
  )
}

export default ChartMap
