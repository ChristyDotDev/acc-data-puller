import { Container } from "@chakra-ui/layout";
import { Table, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/table";
import { fetchEloRankings } from "../../utils/dataFetcher";

export async function getServerSideProps(context) {
  const rankings = await fetchEloRankings();
  console.log(rankings)
  return { props: { ratings: rankings } };
}

export default function Rating({ ratings }) {
  return (
    <Container maxW="750px" mt="20px">
      <Table mb="40px">
        <Thead>
          <Tr>
            <Th>Driver</Th>
            <Th>Elo Rating</Th>
            <Th>Races</Th>
          </Tr>
        </Thead>
        {console.log(ratings)}
        <Tbody>
          {ratings.map((l) => (
            <Tr key={l.driver_short_name}>
              <Td>{l.first_name} {l.last_name}</Td>
              <Td>{l.elo_rating}</Td>
              <Td>{l.races}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Container>
  );
}