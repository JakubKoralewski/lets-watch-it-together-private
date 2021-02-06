import { useEffect, useRef } from 'react'

/**
 * @example
 *   // true
 *   type ok = {xd: 2} extends Result<{xd: number}> ? true : false
 * @example
 *   // true
 *   type err = {err: 'xd'} extends Result<{xd: number}> ? true : false
 * */
type Result<Ok extends Omit<Record<string, unknown>, 'err'>,
	Err = string> = ({ err: Err; } & Partial<Ok>) |
	(Ok & Partial<{err: Err}>)

// type xd = {xd: 2} extends Omit<Record<string, unknown>, 'err'> ? true : false

function doChecks(): Result<{ success: true }> {
	if (!process.browser) {
		return {
			err: 'cant ssr voices',
			success: undefined
		}
	}
	if (!window.speechSynthesis) {
		const errMsg = 'speech synthesis not supported'
		console.error(errMsg)
		return {
			err: errMsg,
			success: undefined
		}
	}
	return {
		success: true
	}
}

export function useVoices():
	Result<{ voices: ReturnType<typeof window.speechSynthesis.getVoices> }> {
	const checks = doChecks()
	if ('err' in checks) {
		return {
			err: checks.err,
			voices: undefined
		}
	}
	return {
		voices: window.speechSynthesis.getVoices()
	}
}

export function useSpeech(
	{
		voice,
		rate = 1,
		pitch = 1
	}: {
		voice?: SpeechSynthesisVoice;
		rate?: number;
		pitch?: number;
	} = {
		rate: 1,
		pitch: 1
	}
): Result<{ speak: (text: string) => SpeechSynthesisUtterance }> {
	const checks = doChecks()
	if ('err' in checks && checks.err !== undefined) {
		return {
			err: checks.err,
			speak: undefined
		}
	}
	return {
		speak: (text: string) => {
			const utterance = new SpeechSynthesisUtterance(text)
			utterance.pitch = pitch
			utterance.rate = rate
			if(voice) {
				utterance.voice = voice
			}
			window.speechSynthesis.speak(utterance)
			return utterance
		}
	}
}

export function useHello(
	hello: string | (() => string | false | undefined),
	dependencies?: any[]
): Result<Record<string, any>> {
	let voice
	{
		const {err, voices} = useVoices()
		console.log({voices})

		if(err !== undefined) {
			return {
				err,
			}
		} else {
			voice = voices.find(v =>
				v.lang.includes('en')
			) || voices[0]
			console.log({voice})
		}
	}
	const {err, speak} = useSpeech({voice})
	const firstLoad = useRef(true)
	useEffect(() => {
		console.log('useHello useEffect')
		if(dependencies && dependencies.every(x => !!x)) {
			console.warn('not ready dependencies:', dependencies, dependencies.map(x => !!x))
			return
		}
		const onClick = () => {
			if(firstLoad.current) {
				let text: string
				if(typeof hello === 'function') {
					const textToBeSpoken = hello()
					if(!textToBeSpoken) {
						console.warn('no text to be spoken')
						return
					}
					text = textToBeSpoken
				} else {
					text = hello
				}
				console.log('speaking', text)
				console.log(speak && speak(text))
				firstLoad.current = false
			}
		}
		window.addEventListener('click', onClick)
		return () => window.removeEventListener('click', onClick)
	}, dependencies ? dependencies : [])
	return {
		err
	}
}