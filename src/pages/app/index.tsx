import Protected from '../../components/Protected'
import Layout from '../../components/Layout'
import { WelcomeInner } from './welcome'
import { useCallback, useState } from 'react'
import { useHello } from '../../lib/utils/useSpeech'
import { useSession } from '../../lib/api/utils/useSession'
import BackgroundMusic from '../../components/sounds/BackgroundMusic'
import { SoundPaths } from '../../components/sounds/soundPaths'

export default function App(): JSX.Element {
	const [finished, setFinished] = useState(false)
	const [session, loading] = useSession()
	useHello(
		useCallback(() => {
			if (!session) {
				return undefined
			}
			let firstName = session.user.name.split(' ')[0]
			if (firstName.length <= 3) {
				firstName = session.user.name
			}
			return `Welcome back, ${firstName}`
		}, [session]),
		[loading, session]
	)

	return (
		<Protected>
			<Layout>
				<BackgroundMusic source={SoundPaths.BgMusic}>
					{
						!finished ?
							<WelcomeInner
								onFinish={() => setFinished(true)}
							/> :
							<>
								this is a work in progress wait till we add more stuff pls
							</>
					}
				</BackgroundMusic>
			</Layout>
		</Protected>
	)
}
