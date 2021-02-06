import React from 'react'
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'
import Stepper from '@material-ui/core/Stepper'
import Step from '@material-ui/core/Step'
import StepLabel from '@material-ui/core/StepLabel'
import type { DesktopStepperProps } from './stepper_props'
import MobileStepper from '@material-ui/core/MobileStepper'

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		root: {
			width: '100%'
		},
		backButton: {
			marginRight: theme.spacing(1)
		},
		instructions: {
			marginTop: theme.spacing(1),
			marginBottom: theme.spacing(1)
		}
	})
)
/**
 * @see https://material-ui.com/components/steppers/#linear-alternative-label
 */
export default function HorizontalLabelPositionBelowStepper(
	{
		activeStep, steps,
		className
	}: DesktopStepperProps
): JSX.Element {
	const classes = useStyles()

	return (
		<div
			className={
				[classes.root].concat(className ? [className] : []).join(' ')
			}
		>
			<Stepper
				activeStep={activeStep}
				alternativeLabel
			>
				{Object.keys(steps).map((key) => (
					<Step key={key}>
						<StepLabel>{steps[key]}</StepLabel>
					</Step>
				))}
			</Stepper>
		</div>
	)
}