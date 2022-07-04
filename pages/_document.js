import { ColorModeScript } from '@chakra-ui/react'
import NextDocument, { Html, Head, Main, NextScript } from 'next/document'
import Header from '/components/Header'

export default class Document extends NextDocument {
  render() {
    return (
      <Html lang='en'>
        <Head />
        <body>
          <ColorModeScript initialColorMode='dark' />
          <Header/>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}