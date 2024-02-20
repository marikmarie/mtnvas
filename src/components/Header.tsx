import {
	createStyles,
	Header as Wrapper,
	Container,
	rem,
	ActionIcon,
	Avatar,
	Menu,
	Group,
	Flex,
	Title,
} from '@mantine/core'
import { IconLogout } from '@tabler/icons-react'

import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../app/store'
import { IconUser } from '@tabler/icons-react'
import { signout } from '../app/slices/auth'
import { useNavigate } from 'react-router-dom'
import { ActionToggle } from './action-toggle'
import { useCallback } from 'react'
import { ROUTES } from '../constants/routes'

const HEADER_HEIGHT = rem(60)

const useStyles = createStyles(theme => ({
	root: {
		position: 'sticky',
	},
	inner: {
		height: HEADER_HEIGHT,
		display: 'flex',
		justifyContent: 'space-between',
		alignItems: 'center',
	},

	links: {
		[theme.fn.smallerThan('sm')]: {
			display: 'none',
		},
	},

	burger: {
		[theme.fn.largerThan('sm')]: {
			display: 'none',
		},
	},

	link: {
		display: 'block',
		lineHeight: 1,
		padding: `${rem(8)} ${rem(12)}`,
		borderRadius: theme.radius.sm,
		textDecoration: 'none',
		color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.colors.gray[7],
		fontSize: theme.fontSizes.sm,
		fontWeight: 500,

		'&:hover': {
			backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
		},
	},

	linkLabel: {
		marginRight: rem(5),
	},
}))

export function Header() {
	const { classes } = useStyles()

	const dispatch = useDispatch()
	const user = useSelector((state: RootState) => state.auth.user)

	const navigate = useNavigate()

	const handleLogout = useCallback(() => {
		dispatch(signout())
		navigate(ROUTES.AUTH)
	}, [])

	const displayName = user?.name || 'Ian Balijawa'

	const avatar = displayName[0]?.toUpperCase() || 'I'

	return (
		<Wrapper withBorder zIndex={1} className={classes.root} height={HEADER_HEIGHT}>
			<Container className={classes.inner} fluid>
				<Flex justify={'space-between'} w="100%" align={'center'}>
					<Title c="dimmed">5G PORTAL</Title>
					<Group>
						<ActionToggle />
						<Menu shadow="md" width={200}>
							<Menu.Target>
								<ActionIcon>
									<Avatar color="cyan" radius="xl">
										{avatar}
									</Avatar>
								</ActionIcon>
							</Menu.Target>

							<Menu.Dropdown>
								<Menu.Label>Account</Menu.Label>
								<Menu.Item icon={<IconUser size={14} />}>{displayName}</Menu.Item>

								<Menu.Item onClick={handleLogout} color="red" icon={<IconLogout size={14} />}>
									Log out
								</Menu.Item>
							</Menu.Dropdown>
						</Menu>
					</Group>
				</Flex>
			</Container>
		</Wrapper>
	)
}
