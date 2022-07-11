import { Flex, Heading } from "@chakra-ui/layout";
import { useRouter } from "next/router";

function Header() {
  const router = useRouter();
  return (
    <Flex
      borderBottom="2px"
      borderColor="brand.orange"
    >
      <Flex>
        <Heading as="h3" size="lg" m={1} cursor="pointer" onClick={() => router.push("/")}>
          F1diots
        </Heading>
      </Flex>
      <Flex>
        <Heading as="h6" size="sm" m={1} onClick={() => router.push("/track")} cursor="pointer">
          Time Trial
        </Heading>
        <Heading as="h6" size="sm" m={1} onClick={() => router.push("/elo")} cursor="pointer">
          Elo Rankings
        </Heading>
    </Flex>
    </Flex>
  );
}

export default Header
