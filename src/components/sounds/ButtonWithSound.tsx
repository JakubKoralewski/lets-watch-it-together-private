import type { ButtonProps } from '@material-ui/core'
import { Button } from '@material-ui/core'
import type { PropsWithChildren } from 'react'
import useSound from 'use-sound'
import { SoundPaths } from './soundPaths'

interface ButtonWithSoundSpecificProps {
	source?: string;
	/** From 0 to 1 (I think) */
	volume?: number;
}

export default function ButtonWithSound(
	{
		volume=0.1,
		source=SoundPaths.Dubstep,
		children,
		...props
	}: PropsWithChildren<ButtonProps & ButtonWithSoundSpecificProps>
): JSX.Element {
	const [play, data] = useSound(source, {volume, interrupt: false})
	return <Button
		// the order here is important because the props object
		// most likely also has a `onClick` so we need to set
		// our `onClick` after the `props` to overwrite the previous one!
		{...props}
		onClick={(e) => {
			console.log('button-with-sound playing', data)
			if(!data.isPlaying) {
				play()
			}
			// FIXME: the below function may be a setstate and it somehow
			//         causes memory leaks? (according to console logs)
			props.onClick && props.onClick(e)
		}}
	>
		{children}
	</Button>
}