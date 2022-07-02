import { ChakraProvider } from '@chakra-ui/react'
import { extendTheme } from '@chakra-ui/react'

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
      <Component {...pageProps} />
    </ChakraProvider>
  )
}

export default MyApp;