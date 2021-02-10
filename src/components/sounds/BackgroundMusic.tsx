import { useEffect, useRef, createContext, PropsWithChildren, useState } from 'react'

import useSound from 'use-sound'
import type { SoundPaths } from './soundPaths'

interface MusicContextData {
	canSoundPlay: boolean;
	isBgMusicPlaying: boolean;
}
const defaultMusicContext = {
	canSoundPlay: true,
	isBgMusicPlaying: false
}

const MusicContext = createContext<MusicContextData>(
	defaultMusicContext
)

export default function MusicProvider(
	{source, children}: PropsWithChildren<{ source: SoundPaths }>
): JSX.Element {
	const [rawPlay, data] = useSound(
		source,
		{
			volume: 0.1,
			onload: () => {
				console.log('Background Music loaded.')
			},
			interrupt: false
		}
	)
	const [options, _setOptions] = useState<MusicContextData>(defaultMusicContext)
	const hasPlayed = useRef(false)
	const play = () => {
		console.log('BackgroundMusic playing', { hasPlayed, data })
		rawPlay()
	}

	useEffect(() => {
		if (!data.sound) {
			return
		}
		if (hasPlayed.current) {
			return
		}
		try {
			if (!data.isPlaying) {
				play()
				hasPlayed.current = true
				return
			}
		} catch (e) {
			console.warn('caught play error ', e)
		}

		const onClick = () => {
			console.log('User clicked on the window')
			console.log(`Playing background music for the next ${Math.round(data.duration / 1000)} seconds.`)
			if (!data.isPlaying) {
				play()
				hasPlayed.current = true
			}
		}
		window.addEventListener('click', onClick)
		return () => {
			window.removeEventListener('click', onClick)
			data.stop()
		}
	}, [data])

	//it is not to render anything, therefore
	return <MusicContext.Provider value={options}>
		{children}
	</MusicContext.Provider>
}