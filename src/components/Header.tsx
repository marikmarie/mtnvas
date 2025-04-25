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
	Drawer,
	Button,
	Text,
	Stack,
	Center,
	Paper,
	Code,
	Image,
	Box,
	Popover,
} from '@mantine/core';
import {
	IconLogout,
	IconUsers,
	IconDeviceMobile,
	IconRouter,
	IconEdit,
	IconReport,
	IconNews,
	IconCircleCheck,
	IconLoader,
	IconBuildingStore,
} from '@tabler/icons-react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../app/store';
import { IconUser } from '@tabler/icons-react';
import { signout } from '../app/slices/auth';
import { useNavigate, Link } from 'react-router-dom';
import { ActionToggle } from './ActionToggle';
import { useCallback, useState } from 'react';
import { useDisclosure } from '@mantine/hooks';
import Adduser from '../modules/UserManagment/Adduser';
import ListUsers from '../modules/UserManagment/ListUsers';

const HEADER_HEIGHT = rem(60);

const useStyles = createStyles((theme) => ({
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
		display: 'flex',
		gap: theme.spacing.sm,
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
		display: 'flex',
		alignItems: 'center',
		height: '100%',
		lineHeight: 1,
		padding: `${rem(8)} ${rem(12)}`,
		borderRadius: theme.radius.sm,
		textDecoration: 'none',
		color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.colors.gray[7],
		fontSize: theme.fontSizes.sm,
		fontWeight: 500,

		'&:hover': {
			backgroundColor:
				theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
		},
	},

	linkLabel: {
		marginRight: rem(5),
	},

	navItem: {
		padding: `${rem(8)} ${rem(12)}`,
		borderRadius: theme.radius.sm,
		fontWeight: 500,
		cursor: 'pointer',
		color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.colors.gray[7],

		'&:hover': {
			backgroundColor:
				theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
		},
	},

	navIcon: {
		marginRight: theme.spacing.xs,
		color: theme.colorScheme === 'dark' ? theme.colors.yellow[3] : theme.colors.yellow[6],
	},

	megaMenu: {
		padding: theme.spacing.md,
		width: rem(300),
	},

	megaMenuItem: {
		display: 'flex',
		alignItems: 'center',
		padding: `${rem(8)} ${rem(12)}`,
		textDecoration: 'none',
		color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.colors.gray[7],
		borderRadius: theme.radius.sm,
		fontSize: theme.fontSizes.sm,

		'&:hover': {
			backgroundColor:
				theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
		},
	},
}));

const navItems = [
	{
		label: 'Starter Packs',
		icon: <IconDeviceMobile size={20} />,
		items: [
			{
				key: 'signup',
				label: 'Online Payments',
				path: '/signup',
				icon: <IconDeviceMobile size={16} />,
			},
			{
				key: 'wakanet-activation',
				label: 'Cash Payments',
				path: '/wakanet-activation',
				icon: <IconRouter size={16} />,
			},
		],
	},
	{
		label: 'Account Services',
		icon: <IconUser size={20} />,
		items: [
			{
				key: 'load-bundle',
				label: 'Load Bundle',
				path: '/load-bundle',
				icon: <IconLoader size={16} />,
			},
			{
				key: 'check-balance',
				label: 'Check Balance',
				path: '/check-balance',
				icon: <IconCircleCheck size={16} />,
			},
			{
				key: 'update-details',
				label: 'Update Details',
				path: '/update-details',
				icon: <IconEdit size={16} />,
			},
		],
	},
	{
		label: 'Reports',
		icon: <IconReport size={20} />,
		items: [
			{
				key: 'activations-report',
				label: 'StarterPack Activation Report',
				path: '/activations-report',
				icon: <IconReport size={16} />,
			},
			{
				key: 'renewals-report',
				label: 'Renewals Report',
				path: '/renewals-report',
				icon: <IconNews size={16} />,
			},
		],
	},
	{
		label: 'Management',
		icon: <IconBuildingStore size={20} />,
		items: [
			{
				key: 'dealer-management',
				label: 'Dealer Management',
				path: '/dealer-management',
				icon: <IconBuildingStore size={16} />,
			},
		],
	},
];

export function Header() {
	const { classes } = useStyles();
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const user = useSelector((state: RootState) => state.auth.user);
	const isOfficeUser = user?.category === 'office';

	const [hoveredItem, setHoveredItem] = useState<number | null>(null);

	const handleLogout = useCallback(() => {
		dispatch(signout());
		navigate('/signin');
	}, []);

	const displayName = user?.email?.split('@')[0] || 'Wakanet user';
	const avatar = displayName[0]?.toUpperCase() || 'I';
	const [opened, { open, close }] = useDisclosure(false);

	const renderNavItems = () => {
		return navItems.map((item, index) => {
			// Filter items based on office user status
			const filteredItems = item.items.filter((subItem) => {
				if (
					subItem.key === 'wakanet-activation' ||
					subItem.key === 'load-bundle' ||
					subItem.key === 'update-details'
				) {
					return !isOfficeUser;
				}
				return true;
			});

			if (filteredItems.length === 0) return null;

			return (
				<Popover
					key={index}
					position="bottom"
					shadow="md"
					opened={hoveredItem === index}
				>
					<Popover.Target>
						<Box
							className={classes.navItem}
							onMouseEnter={() => setHoveredItem(index)}
							onMouseLeave={() => setHoveredItem(null)}
						>
							<Group spacing="xs">
								<span className={classes.navIcon}>{item.icon}</span>
								{item.label}
							</Group>
						</Box>
					</Popover.Target>
					<Popover.Dropdown
						onMouseEnter={() => setHoveredItem(index)}
						onMouseLeave={() => setHoveredItem(null)}
						className={classes.megaMenu}
					>
						<Stack spacing="xs">
							{filteredItems.map((subItem) => (
								<Link
									key={subItem.key}
									to={subItem.path}
									className={classes.megaMenuItem}
								>
									<span className={classes.navIcon}>{subItem.icon}</span>
									{subItem.label}
								</Link>
							))}
						</Stack>
					</Popover.Dropdown>
				</Popover>
			);
		});
	};

	return (
		<>
			<Drawer
				opened={opened}
				onClose={close}
				size={'100%'}
				position="left"
				title="User managment"
				overlayProps={{ opacity: 0.5, blur: 4 }}
				transitionProps={{
					transition: 'pop',
					duration: 300,
					timingFunction: 'linear',
				}}
			>
				<Center>
					<Stack w="90vw">
						<Paper
							withBorder
							p="md"
						>
							<Center>
								<IconUsers size={50} />
							</Center>
							<Text
								tt="uppercase"
								fw={'bold'}
								fz={'lg'}
							>
								Add user
							</Text>
							<Adduser />
						</Paper>
						<Text
							tt="uppercase"
							fw={'bold'}
							fz={'lg'}
						>
							View users
						</Text>
						<ListUsers />
					</Stack>
				</Center>
			</Drawer>
			<Wrapper
				withBorder
				zIndex={1}
				className={classes.root}
				height={HEADER_HEIGHT}
				mb={10}
			>
				<Container
					className={classes.inner}
					fluid
				>
					<Flex
						justify={'space-between'}
						w="100%"
						align={'center'}
					>
						<Link to="/">
							<Group h="100%">
								<Image
									src="/Logo.png"
									width={70}
								/>
								<Code
									sx={{ fontWeight: 700 }}
									fz={'xl'}
								>
									4G | 5G PORTAL
								</Code>
							</Group>
						</Link>

						<Group className={classes.links}>{renderNavItems()}</Group>

						<Group>
							{user?.role === 'ADMIN' ? (
								<Button
									radius="md"
									variant="light"
									onClick={open}
								>
									User managment
								</Button>
							) : null}
							<ActionToggle />
							<Menu
								shadow="md"
								width={200}
							>
								<Menu.Target>
									<ActionIcon>
										<Avatar
											color="cyan"
											radius="xl"
										>
											{avatar}
										</Avatar>
									</ActionIcon>
								</Menu.Target>

								<Menu.Dropdown>
									<Menu.Label>Account</Menu.Label>
									<Menu.Item icon={<IconUser size={14} />}>
										{displayName}
									</Menu.Item>
									<Menu.Item
										onClick={handleLogout}
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
		</>
	);
}
