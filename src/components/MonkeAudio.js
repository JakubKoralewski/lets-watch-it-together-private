//https://dev.to/vvo/how-to-solve-window-is-not-defined-errors-in-react-and-next-js-5f97
import React, { useEffect } from 'react';

export default function MonkeAudio(props) {
	let {source} = props;
	useEffect(function mount() {
		function onClick(){
			console.log('click');
			let audio = addAudioElementWith(source)
			console.log('audio added')
			audio.play()
		}
    
		function addAudioElementWith(audioSource){

			let root = document.getElementById('__next');
			let audio = document.createElement('audio');
			audio.src = audioSource;
			root.appendChild(audio);
			return audio;
		}
    
		let buttons = [...document.getElementsByTagName('button')]
    
		buttons.forEach(button => {
			button.addEventListener('click', onClick)
		})

		return function unMount() {
			buttons.forEach(button => {
				button.removeEventListener('click', onClick)
			})
		};
	});

	return null;
}