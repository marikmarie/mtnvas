import { useCallback, useEffect } from 'react'
import { createStyles, Navbar as Wrapper, Group, Code, getStylesRef, rem, Image, Text } from '@mantine/core'

import { IconLogout, IconPlus } from '@tabler/icons-react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../app/store'
import { setActiveLink } from '../app/slices/nav'
import useRequest from '../hooks/use-request'
import { ROUTES } from '../constants/routes'

const useStyles = createStyles(theme => ({
	footer: {
		marginTop: theme.spacing.md,
		borderTop: `${rem(1)} solid ${theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[2]}`,
	},

	link: {
		...theme.fn.focusStyles(),
		display: 'flex',
		alignItems: 'center',
		textDecoration: 'none',
		fontSize: theme.fontSizes.sm,
		color: theme.white,
		padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
		fontWeight: 500,

		'&:hover': {
			backgroundColor: theme.colors.gray[9],
			bg: theme.colors.gray[1],
		},
	},

	linkIcon: {
		ref: getStylesRef('icon'),
		color: theme.white,
		marginRight: theme.spacing.sm,
	},

	linkActive: {
		'&, &:hover': {
			backgroundColor: theme.white,
			color: theme.black,
			[`& .${getStylesRef('icon')}`]: {
				color: theme.black,
			},
		},
	},
}))

const data = [
	{ link: ROUTES.DASHRBOARD, label: '4G/5G Wakanet Starterpack', icon: IconPlus },
	{ link: ROUTES.LIST_INVOICES, label: 'Wakanet Router Starterpack', icon: IconPlus },
	{ link: ROUTES.CREDIT_NOTES, label: 'Load Bundle', icon: IconPlus },
	{ link: ROUTES.CREDIT_NOTES, label: 'Check balance', icon: IconPlus },
	{ link: ROUTES.CREDIT_NOTES, label: 'Update Details', icon: IconPlus },
]

export default function Navbar(): JSX.Element {
	const { classes, cx } = useStyles()
	const active = useSelector((state: RootState) => state.nav.activeLink)
	const dispatch = useDispatch()
	const navigate = useNavigate()

	const request = useRequest()

	useEffect(() => {
		dispatch(setActiveLink(''))
	}, [])

	const handleLogout = useCallback(async () => {
		await request.post(`/auth/logout`)
		navigate(ROUTES.AUTH)
	}, [])

	const links = data.map(item => {
		return (
			<div onClick={() => console.log(item.link)}>
				<Link
					className={cx(classes.link, {
						[classes.linkActive]: item.link.split('/')[1] === active,
					})}
					// to={item.link}
					to=""
					key={item.label}
				>
					<item.icon className={classes.linkIcon} stroke={2} />
					<span>
						<Text fz={'md'}>{item.label}</Text>
					</span>
				</Link>
			</div>
		)
	})

	return (
		<Wrapper zIndex={1} h="100vh" bg={'yellow'} withBorder={false} width={{ sm: 200, md: 250, lg: 300 }}>
			<Wrapper.Section grow>
				<Group px="md" p="lg" position="apart">
					<Link to="/">
						<Image src={'/Logo.png'} width={85} />
					</Link>
					<Code sx={{ fontWeight: 700 }}>5G PORTAL</Code>
				</Group>
				{links}
			</Wrapper.Section>

			<Wrapper.Section className={classes.footer}>
				<Link to={''} onClick={() => handleLogout()} className={classes.link}>
					<IconLogout className={classes.linkIcon} stroke={1.5} />
					<span>Logout</span>
				</Link>
			</Wrapper.Section>
		</Wrapper>
	)
}
