import type { PropsWithChildren } from 'react'
import { Button, Container } from '@material-ui/core'
import { useSectionStyles } from '../../../theme/breakpoints'
import DotsMobileStepper from './steppers/DotsMobileStepper'
import AlternativeLabelStepper from './steppers/AlternativeLabelStepper'
import { stagesDescriptions } from './stages'
import ButtonWithSound from '../../sounds/ButtonWithSound'
import { SoundPaths } from '../../sounds/soundPaths'

export interface GoToNextStageProps {
	nextStage(): void,

	canGoForward?: boolean,
	currentStage: number,
	maxStage: number,

	prevStage(): void
}

/**
 * TODO: https://material-ui.com/components/steppers/
 */
export function NextOrSkipWrapper(
	{
		nextStage,
		children,
		canGoForward,
		currentStage,
		prevStage
	}: PropsWithChildren<GoToNextStageProps>
): JSX.Element {
	const canGoBack = currentStage >= 1
	const sectionStyles = useSectionStyles()

	return (
		<Container>
			<div>{children}</div>
			<div
				className={sectionStyles.sectionDesktop}
			>
				<ButtonWithSound
					source={SoundPaths.Dubstep}
					color="primary"
					disabled={!canGoBack}
					onClick={canGoBack ? prevStage : undefined}
				>
					BACK
				</ButtonWithSound>
				<ButtonWithSound
					source={SoundPaths.Dubstep}
					variant="contained"
					color="primary"
					onClick={nextStage}
				>
					NEXT
				</ButtonWithSound>
			</div>
			<DotsMobileStepper
				className={sectionStyles.sectionMobile}
				activeStep={currentStage}
				steps={stagesDescriptions}
				handleNext={nextStage}
				handleBack={prevStage}
			/>
			<AlternativeLabelStepper
				activeStep={currentStage}
				steps={stagesDescriptions}
				className={sectionStyles.sectionDesktop}
			/>
		</Container>
	)
}
