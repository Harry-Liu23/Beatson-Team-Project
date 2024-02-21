import StudiesTable from "../components/dataDiscoverability/StudiesTable";
import SearchBar from "../components/dataDiscoverability/SearchBar";

/* website.url/discover_studies */

export default function DiscoverStudies() {
  return (
    <div>
      <SearchBar />
      <StudiesTable />
    </div>
  );
}
