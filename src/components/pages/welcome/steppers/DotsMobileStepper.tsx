import React from 'react'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import MobileStepper from '@material-ui/core/MobileStepper'
import Button from '@material-ui/core/Button'
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft'
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight'
import type { MobileStepperProps } from './stepper_props'

const useStyles = makeStyles({
	root: {
		maxWidth: 400,
		flexGrow: 1
	}
})
/**
 * @see https://material-ui.com/components/steppers/#dots
 */
export default function DotsMobileStepper(
	{
		activeStep, steps,
		handleNext, handleBack,
		className
	}: MobileStepperProps
): JSX.Element {
	const classes = useStyles()
	const theme = useTheme()

	return (
		<MobileStepper
			variant="dots"
			// I don't know if Finished should be counted too?
			steps={Object.keys(steps).length}
			position="static"
			activeStep={activeStep}
			className={
				[classes.root].concat(className ? [className] : []).join(' ')
			}
			nextButton={
				<Button
					size="small"
					onClick={handleNext}
					disabled={activeStep === 5}
				>
					Next
					{theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
				</Button>
			}
			backButton={
				<Button
					size="small"
					onClick={handleBack}
					disabled={activeStep === 0}
				>
					{theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
					Back
				</Button>
			}
		/>
	)
}