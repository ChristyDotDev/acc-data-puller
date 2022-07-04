import { Flex, Heading } from "@chakra-ui/layout";
import { useRouter } from "next/router";

export default function Header() {
  const router = useRouter();
  return (
    <Flex
      p={3}
      borderBottom="2px"
      borderColor="red.300"
      cursor="pointer"
      onClick={() => router.push("/")}
    >
      <Heading as="h3" size="lg" m={1}>
        F1diots
      </Heading>
    </Flex>
  );
}