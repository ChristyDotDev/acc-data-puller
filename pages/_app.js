import { ChakraProvider } from '@chakra-ui/react'
import { extendTheme } from '@chakra-ui/react'
import Header from "@components/Header";


//Extend the theme to include custom colors, fonts, etc
const colors = {
  brand: {
    orange: '#f8744c',
  },
}

const theme = extendTheme({ colors })

function MyApp({ Component, pageProps }) {
  return (
    <ChakraProvider theme={theme}>
      <Header/>
      <Component {...pageProps} />
    </ChakraProvider>
  )
}

export default MyApp;