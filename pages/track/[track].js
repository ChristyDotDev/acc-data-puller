import { Container } from "@chakra-ui/layout";
import { Table, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/table";
import { fetchTrackLeaderboard, fetchCars } from "../../utils/dataFetcher";

export async function getServerSideProps(context) {
  const leaderboard = await fetchTrackLeaderboard(context.params.track);
  const cars = await fetchCars();
  const bestLaps = leaderboard.sort((a, b) => a.bestLap < b.bestLap ? - 1 : 1)  
  return { props: { bestLaps: bestLaps, cars: cars } };
}

export default function Track({ bestLaps, cars }) {
  function idToCarName(id){
    const car = cars.find(c => c.id == id);
    if (!car){
      return "Car " + id
    }
    return car.name
  }

  function toLapTime(millis){
    const time = new Date(millis)
    const minutes = "" + time.getMinutes()
    const seconds = "" + time.getSeconds()
    const milliPart = "" + time.getMilliseconds()
    return "" + minutes + ":"+ seconds.padStart(2, '0') + ":"+ milliPart.padStart(3, '0');
  }

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
              <Td>{l.driver_first_name} {l.driver_last_name} {l.session_is_wet ? "(W)":""}</Td>
              <Td>{idToCarName(l.carModel)}</Td>
              <Td fontWeight="bold">{toLapTime(l.bestLap)}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Container>
  );
}