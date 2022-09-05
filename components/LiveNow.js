import { Flex, Heading } from "@chakra-ui/layout";
import { useRouter } from "next/router";
import {
  List,
  ListItem,
  ListIcon,
  OrderedList,
  UnorderedList,
} from '@chakra-ui/react'


function LiveNow() {
  const router = useRouter();
  //See: https://github.com/christytc10/twitch-vods-viewer/blob/master/components/VodPanel.js
  //const live = fetchCars();
  //console.log(live)

  return (
    <Flex
      borderBottom="2px"
      borderColor="brand.orange"
    >
      <Heading as="h6" size="lg" m={1} cursor="pointer">
          Live Now
      </Heading>

      <UnorderedList p={2}>
        <ListItem>Lorem ipsum dolor sit amet</ListItem>
        <ListItem>Consectetur adipiscing elit</ListItem>
        <ListItem>Integer molestie lorem at massa</ListItem>
        <ListItem>Facilisis in pretium nisl aliquet</ListItem>
      </UnorderedList>
    </Flex>
  );
}

export default LiveNow
