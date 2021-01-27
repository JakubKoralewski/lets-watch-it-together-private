import { Button } from '@material-ui/core'
import ButtonWithSound from '../sounds/ButtonWithSound'
import { SoundPaths } from '../sounds/soundPaths'

export interface CreateMeetingButtonProps {
	onClick(): void
}

export default function CreateMeetingButton({
	onClick
}: CreateMeetingButtonProps): JSX.Element
{
	return (
		<ButtonWithSound
			source={SoundPaths.SupposedlyNiceSounding}
			variant={'contained'}
			color={'primary'}
			disabled={false}
			onClick={onClick}
		>
			{`Create meeting`}
		</ButtonWithSound>
	)

}
