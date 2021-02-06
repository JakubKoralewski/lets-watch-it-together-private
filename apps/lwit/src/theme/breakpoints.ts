import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'

export const useSectionStyles = makeStyles((theme: Theme) =>
	createStyles({
		sectionDesktop: {
			display: 'flex',
			[theme.breakpoints.down('md')]: {
				display: 'none !important'
			}
		},
		sectionMobile: {
			display: 'flex',
			[theme.breakpoints.up('md')]: {
				display: 'none !important'
			}
		}
	})
)