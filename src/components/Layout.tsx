import React, { ReactNode } from 'react'
import Header from './Header'
import { Box, Container } from '@material-ui/core'
import styled, { ThemeProvider } from 'styled-components';
import { compose, css } from '@material-ui/system';
import Head from 'next/head'
 
type Props = {
    children: ReactNode
}
 
const Layout: React.FC<Props> = (props) => (
 
<Head>
  <style> {globalStyle}
    <Box  css={{ bgcolor: '#FFFFFF', width: '80%', margin: 'auto' }}>
        <Header />
        <Container className="layout" maxWidth="md">
            {props.children}
        </Container>
    </Box>
</style>
</Head>
)
 
const globalStyle = `
body {
    background-color: #D1C7AF;
}
`
 
export default Layout
