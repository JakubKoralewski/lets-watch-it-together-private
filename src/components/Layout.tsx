import React, { ReactNode } from 'react'
import Header from './Header'
import { Box, Container } from '@material-ui/core'
import styled, { ThemeProvider } from 'styled-components';
import { compose, css } from '@material-ui/system';
import Head from 'next/head';
 
type Props = {
    children: ReactNode
}
 
const Layout: React.FC<Props> = (props) => (
    <Box css={{bgcolor: '#0000ff', minHeight: '100vh'}}>
        <Box css={{ bgcolor: '#cfe8fc', width: '80%', height: '100vh', margin: 'auto' }}>
            <Header />
            <Container className="layout" maxWidth="md">
                {props.children}
            </Container>
        </Box>
    </Box>
)
 
export default Layout
