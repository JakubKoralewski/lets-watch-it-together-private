export type DesktopStepperProps = {
	activeStep: number;
	steps: Record<number | string, string>;
	className?: string;
}

export type MobileStepperProps = DesktopStepperProps & {
	handleNext: () => void;
	handleBack: () => void;
}