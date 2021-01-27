import {useEffect, useRef} from 'react';

import useSound from 'use-sound';

export default function BackgroundMusic(props){
	const {source} = props;
	const [play, data] = useSound(
		source,
		{
			volume: 0.1,
			onload: () => {
				console.log('Background Music loaded.')
			}
		}
	)
	const audioContext = useRef<AudioContext | null>();
	
	useEffect(() => {
		if(!data.sound) {
			return
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