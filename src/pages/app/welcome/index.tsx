import Protected from '../../../components/Protected'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/router'
import Layout from '../../../components/Layout'
import { AddFriends } from '../../../components/pages/welcome/AddFriends'
import { AddShows } from '../../../components/pages/welcome/AddShows'
import { AddMeeting } from '../../../components/pages/welcome/AddMeeting'


import { stagesToPathsMap } from './[welcome_stage]'
import { Stages } from '../../../components/pages/welcome/stages'
import { useSession } from '../../../lib/api/utils/useSession'
import { useHello } from '../../../lib/utils/useSpeech'


export function Finished(): JSX.Element {
	return <>{'That\'s all! Have fun! You are being redirected.'}</>
}

/**
 * Maps from each @see {@link Stages}
 * to a component responsible for that Stage.
 */
export const stagesMap = {
	[Stages.AddFriends]: AddFriends,
	[Stages.AddShows]: AddShows,
	[Stages.AddMeeting]: AddMeeting,
	[Stages.Finished]: Finished
}


/**
 * Right now this is also used by the index page
 * cause we have nothing else to show there anyway,
 * so thats why this is a separate function.
 */
export function WelcomeInner(
	{
		onFinish,
		stage: defaultStage = 0
	}: { onFinish: () => void, stage?: number }
): JSX.Element {
	const [stage, setStage] = useState<Stages>(defaultStage)

	const goToNextStage = () =>
		setStage((x) => Math.min(x + 1, Stages.Finished))
	const goToPrevStage = () =>
		setStage((x) => Math.max(x - 1, Stages.AddFriends))
	const CurrentComponent = stagesMap[stage]

	const isMount = useRef(true)

	useEffect(() => {
		if (stage === Stages.Finished) {
			onFinish()
		}
		if (isMount.current) {
			isMount.current = false
			return
		}
		if(window.location.pathname.includes('app/welcome')) {
			// only redirect if on /app/welcome cause i think it breaks
			// hmr in /app
			window.history.pushState(
				undefined,
				undefined,
				`/app/welcome/${stagesToPathsMap[stage]}`
			)
		}
	}, [stage])

	return (
		<>
			{
				<CurrentComponent
					nextStage={goToNextStage}
					currentStage={stage}
					maxStage={Stages.Finished}
					prevStage={goToPrevStage}
				/>
			}
		</>
	)
}

export default function Index(): JSX.Element {
	const router = useRouter()
	const onFinish = () => {
		setTimeout(() => {
			void router.push('/app')
		}, 1000)
	}
	const [session, loading] = useSession()
	useHello(
		useCallback(() => {
			if(!session) {
				return undefined
			}
			let firstName = session.user.name.split(' ')[0]
			if (firstName.length <= 3) {
				firstName = session.user.name
			}
			return `Welcome to our app, ${firstName}!
We hope you like it! Please proceed with the steps shown below:
First, send a friend request, then add a show you like and then create
a meeting to watch that show with that friend! Some stuff is still
a work in progress ${firstName} so be patient! We did our best.
Now enjoy this beatbox: asdluhali usdhasufsixash dbkashbninekaubsg tkuabtkashbkashbtkhua bxxxstkbtaktbastkhakujwehnah.
Now enjoy this:
Peter Piper picked a peck of pickled peppers
A peck of pickled peppers Peter Piper picked
If Peter Piper picked a peck of pickled peppers
Where’s the peck of pickled peppers Peter Piper picked?

Not enough? Now enjoy this:

But, lo! from forth a copse that neighbours by,
A breeding jennet, lusty, young, and proud,
Adonis' trampling courser doth espy,
And forth she rushes, snorts and neighs aloud;
     The strong-neck'd steed, being tied unto a tree,
     Breaketh his rein, and to her straight goes he.

Imperiously he leaps, he neighs, he bounds,
And now his woven girths he breaks asunder;
The bearing earth with his hard hoof he wounds,
Whose hollow womb resounds like heaven's thunder;
     The iron bit he crushes 'tween his teeth
     Controlling what he was controlled with.

His ears up-prick'd; his braided hanging mane
Upon his compass'd crest now stand on end;
His nostrils drink the air, and forth again,
As from a furnace, vapours doth he send:
     His eye, which scornfully glisters like fire,
     Shows his hot courage and his high desire.
Peace out.`.replaceAll('\n', ' ')
		}, [session]),
		[loading, session]
	)
	return (
		<Protected>
			<Layout>
				<WelcomeInner onFinish={onFinish} />
			</Layout>
		</Protected>
	)
}
