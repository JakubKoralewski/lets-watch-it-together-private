import React, { ReactNode } from 'react'
import Header from './Header'
import { Box, Container } from '@material-ui/core'
import styled, { ThemeProvider } from 'styled-components';
import { compose, css } from '@material-ui/system';
 
type Props = {
    children: ReactNode
}
 
const Layout: React.FC<Props> = (props) => (

    <Box  css={{ bgcolor: '#FFFFFF', width: '80%', margin: 'auto' }}>
        <Header />
        <Container className="layout" maxWidth="md">
            {props.children}
        </Container>
    </Box>
 
 <style jsx global>{`
  body {
    background: #D1C7AF;
  }
`}</style>
)
 
export default Layout
