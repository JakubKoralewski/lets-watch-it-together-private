import { Zoom } from '@material-ui/core';
import { Theme, makeStyles } from '@material-ui/core/styles'
import Tooltip, { TooltipProps } from '@material-ui/core/Tooltip';

const useStylesMaterial = makeStyles((theme: Theme) => ({
	tooltip: {
		backgroundColor: theme.palette.info.dark,
		color: theme.palette.info.contrastText,
		boxShadow: theme.shadows[1],
		fontSize: 20
	},
}));

export const StyledTooltip = (props: TooltipProps) => {
	const classes = useStylesMaterial();

	return <Tooltip 
		arrow 
		TransitionComponent={Zoom}
		classes={classes} 
		{...props}/>
}