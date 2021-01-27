import React from 'react';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import ProTip from 'components/ProTip';
import Link from 'components/Link';
import Copyright from 'components/Copyright';
import ButtonWithSound from '../components/sounds/ButtonWithSound'
import { SoundPaths } from '../components/sounds/soundPaths'



export default function About(): JSX.Element {
	return (
		<Container maxWidth="sm">
			<Box my={4}>
				<Typography variant="h4" component="h1" gutterBottom>
          Next.js example
				</Typography>
				<Link href="/" color="secondary">
					<ButtonWithSound source={SoundPaths.SupposedlyNiceSounding} variant="contained" color="primary">
            Go to the main page
					</ButtonWithSound>
				</Link>
				<ProTip />
				<Copyright />
			</Box>
		</Container>
	);
}