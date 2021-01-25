import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'

export const useSectionStyles = makeStyles((theme: Theme) =>
	createStyles({
		sectionDesktop: {
			display: 'none',
			[theme.breakpoints.up('md')]: {
				display: 'flex'
			}
		},
		sectionMobile: {
			display: 'flex',
			[theme.breakpoints.up('md')]: {
				display: 'none'
			}
		}
	})
)