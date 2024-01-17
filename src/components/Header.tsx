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
	Image,
} from '@mantine/core'
import { IconLogout } from '@tabler/icons-react'

import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../app/store'
import { IconUser } from '@tabler/icons-react'
import { ActionToggle } from './action-toggle'
import { signout } from '../app/slices/auth'

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

	const displayName = user?.name

	const avatar = user
		? `${user?.name?.toUpperCase().split(' ')[0][0]} ${user?.name?.toUpperCase().split(' ')[1][0]}`
		: 'U'

	return (
		<Wrapper withBorder zIndex={1} className={classes.root} height={HEADER_HEIGHT}>
			<Container className={classes.inner} fluid>
				<Flex justify={'space-between'} w="100%" align={'center'}>
					<Image src="/Logo.png" width={50} />
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

								<Menu.Item
									onClick={() => dispatch(signout())}
									color="red"
									icon={<IconLogout size={14} />}
								>
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
