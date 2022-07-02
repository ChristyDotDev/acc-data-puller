import { Table, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/table";
import { useRouter } from "next/router";
import { fetchTracks } from "../../utils/dataFetcher";

export async function getServerSideProps(context) {
  const tracks = await fetchTracks();
  return { props: { tracks: tracks } };
}

export default function Home({ tracks }) {
  const router = useRouter();

  const handleTrackClick = (e, id) => {
    e.stopPropagation();
    router.push(`/track/${id}`);
  };

  return (
    <Table variant="simple" size="md" width="750px" m="0 auto">
      <Thead>
        <Tr>
          <Th>Tracks</Th>
        </Tr>
      </Thead>
      <Tbody>
        {tracks.map((track) => (
          <Tr
            key={track}
            cursor="pointer"
            data-id={track}
          >
            <Td
              textTransform="capitalize"
              _hover={{ textDecoration: "underline", color: "brand.orange" }}
              onClick={(e) => handleTrackClick(e, track)}
            >
              {track.split("_").join(" ")}
            </Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
}