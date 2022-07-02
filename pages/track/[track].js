import { Container } from "@chakra-ui/layout";
import { Table, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/table";
import { fetchTrackLeaderboard } from "../../utils/dataFetcher";

export async function getServerSideProps(context) {
  const leaderboard = await fetchTrackLeaderboard(context.params.track);
  const bestLaps = leaderboard.sort((a, b) => a.bestLap < b.bestLap ? - 1 : 1)  
  return { props: { bestLaps: bestLaps } };
}

export default function Track({ bestLaps }) {
  return (
    <Container maxW="750px" mt="20px">
      <Table mb="40px">
        <Thead>
          <Tr>
            <Th>Driver</Th>
            <Th>Car</Th>
            <Th>LapTime</Th>
          </Tr>
        </Thead>
        {console.log(bestLaps)}
        <Tbody>
          {bestLaps.map((l) => (
            <Tr key={l.driver_short_name}>
              <Td>{l.driver_first_name} {l.driver_last_name}</Td>
              <Td>{l.carModel}</Td>
              <Td fontWeight="bold">{l.bestLap}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Container>
  );
}