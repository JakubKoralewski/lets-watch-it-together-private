import {useEffect, useRef} from 'react';

import useSound from 'use-sound';
import type { SoundPaths } from './soundPaths'

export default function BackgroundMusic(props: {source: SoundPaths}): null{
	const {source} = props;
	const [play, data] = useSound(
		source,
		{
			volume: 0.1,
			onload: () => {
				console.log('Background Music loaded.')
			},
			interrupt: false
		}
	)
	const audioContext = useRef<AudioContext | null>();
	const hasPlayed = useRef(false)
	
	useEffect(() => {
		if(!data.sound) {
			return
		}
		if(hasPlayed.current) {
			return
		}
		try {
			if(!data.isPlaying) {
				play()
				hasPlayed.current = true
				return
			}
		} catch (e) {
			console.warn('caught play error ', e)
		}

		audioContext.current = new AudioContext()
		const onClick = () => {
			console.log('User clicked on the window')
			console.log(`Playing background music for the next ${Math.round(data.duration/1000)} seconds.`)
			if(!data.isPlaying){
				play()
			}
		}
		window.addEventListener('click', onClick)
		return () => window.removeEventListener('click', onClick)
	}, [data])
  
	//it is not to render anything, therefore
	return null;
}