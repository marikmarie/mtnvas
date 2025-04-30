import {
	createStyles,
	Header as Wrapper,
	Container,
	rem,
	Avatar,
	Menu,
	Group,
	Flex,
	Button,
	Text,
	Stack,
	Box,
	Collapse,
	MediaQuery,
	Burger,
	Divider,
	UnstyledButton,
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
	IconListDetails,
	IconChevronDown,
	IconUser,
} from '@tabler/icons-react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../app/store';
import { signout } from '../app/slices/auth';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { ActionToggle } from './ActionToggle';
import { useState } from 'react';
import { useDisclosure } from '@mantine/hooks';
import UserManagementModal from '../modules/UserManagment/UserManagementModal';

const HEADER_HEIGHT = rem(60);

const useStyles = createStyles((theme) => ({
	root: {
		position: 'sticky',
		top: 0,
		zIndex: 200,
	},

	inner: {
		height: HEADER_HEIGHT,
		display: 'flex',
		justifyContent: 'space-between',
		alignItems: 'center',
	},

	logo: {
		display: 'flex',
		alignItems: 'center',
		textDecoration: 'none',

		'&:hover': {
			textDecoration: 'none',
		},
	},

	logoText: {
		fontWeight: 700,
		fontSize: rem(20),
		color: theme.colorScheme === 'dark' ? theme.white : theme.black,
		marginLeft: theme.spacing.xs,
	},

	links: {
		display: 'flex',
		gap: theme.spacing.sm,
		[theme.fn.smallerThan('md')]: {
			display: 'none',
		},
	},

	burger: {
		[theme.fn.largerThan('md')]: {
			display: 'none',
		},
	},

	mobileMenu: {
		[theme.fn.largerThan('md')]: {
			display: 'none',
		},
	},

	navItem: {
		padding: `${rem(8)} ${rem(12)}`,
		borderRadius: theme.radius.sm,
		fontWeight: 500,
		cursor: 'pointer',
		color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.colors.gray[7],
		position: 'relative',

		'&:hover': {
			backgroundColor:
				theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
		},
	},

	active: {
		backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
		fontWeight: 600,
	},

	navIcon: {
		marginRight: theme.spacing.xs,
		color: theme.colorScheme === 'dark' ? theme.colors.yellow[3] : theme.colors.yellow[6],
	},

	dropdown: {
		position: 'absolute',
		top: '100%',
		left: 0,
		right: 0,
		zIndex: 100,
		borderRadius: theme.radius.sm,
		overflow: 'hidden',
		boxShadow: theme.shadows.md,
		backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
		width: rem(250),
	},

	dropdownItem: {
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

	mobileNavItem: {
		padding: `${rem(12)} ${rem(8)}`,
		fontWeight: 500,
		display: 'flex',
		alignItems: 'center',
		width: '100%',
		color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.colors.gray[7],

		'&:hover': {
			backgroundColor:
				theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
		},
	},

	mobileSubItem: {
		padding: `${rem(8)} ${rem(8)} ${rem(8)} ${rem(36)}`,
		fontWeight: 400,
	},

	userButton: {
		padding: theme.spacing.xs,
		borderRadius: theme.radius.sm,
		transition: 'background-color 200ms ease',

		'&:hover': {
			backgroundColor:
				theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
		},
	},
}));

// Navigation structure
const navItems = [
	{
		label: 'Starter Packs',
		icon: <IconDeviceMobile size={20} />,
		items: [
			{
				key: 'signup',
				label: 'Signup',
				path: '/signup',
				icon: <IconDeviceMobile size={16} />,
			},
			{
				key: 'wakanet-activation',
				label: 'Wakanet Activation',
				path: '/wakanet-activation',
				icon: <IconRouter size={16} />,
				officeRestricted: true,
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
				officeRestricted: true,
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
				officeRestricted: true,
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
			{
				key: 'imei-list',
				label: 'IMEI List',
				path: '/imei-list',
				icon: <IconListDetails size={16} />,
			},
		],
	},
];

export function Header() {
	const { classes, cx } = useStyles();
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const location = useLocation();
	const user = useSelector((state: RootState) => state.auth.user);
	const isOfficeUser = user?.category === 'office';
	const isAdmin = user?.role === 'ADMIN';

	// State for dropdown menus
	const [openDropdown, setOpenDropdown] = useState<number | null>(null);
	const [mobileExpanded, setMobileExpanded] = useState<number[]>([]);

	// Mobile menu state
	const [mobileMenuOpened, { toggle: toggleMobileMenu, close: closeMobileMenu }] =
		useDisclosure(false);

	// User management modal state
	const [userManagementOpened, { open: openUserManagement, close: closeUserManagement }] =
		useDisclosure(false);

	const handleLogout = () => {
		dispatch(signout());
		navigate('/signin');
	};

	const toggleMobileExpand = (index: number) => {
		setMobileExpanded((current) =>
			current.includes(index) ? current.filter((item) => item !== index) : [...current, index]
		);
	};

	// Get user display info
	const displayName = user?.email?.split('@')[0] || 'User';
	const avatarLetter = displayName[0]?.toUpperCase() || 'U';

	// Check if path is active
	const isActive = (path: string) => location.pathname === path;

	// Filter navigation items based on user role
	const getFilteredItems = (items: (typeof navItems)[0]['items']) => {
		return items.filter((item) => !item.officeRestricted || !isOfficeUser);
	};

	// Render desktop navigation
	const renderDesktopNav = () => {
		return navItems.map((item, index) => {
			const filteredSubItems = getFilteredItems(item.items);

			if (filteredSubItems.length === 0) return null;

			return (
				<Box
					key={index}
					className={classes.navItem}
					onClick={() => setOpenDropdown(openDropdown === index ? null : index)}
					onMouseEnter={() => setOpenDropdown(index)}
					onMouseLeave={() => setOpenDropdown(null)}
					role="button"
					aria-haspopup="true"
					aria-expanded={openDropdown === index}
				>
					<Group spacing="xs">
						<span className={classes.navIcon}>{item.icon}</span>
						{item.label}
						<IconChevronDown
							size={16}
							stroke={1.5}
						/>
					</Group>

					{openDropdown === index && (
						<Box className={classes.dropdown}>
							<Stack spacing={0}>
								{filteredSubItems.map((subItem) => (
									<Link
										key={subItem.key}
										to={subItem.path}
										className={cx(classes.dropdownItem, {
											[classes.active]: isActive(subItem.path),
										})}
										onClick={() => setOpenDropdown(null)}
									>
										<span className={classes.navIcon}>{subItem.icon}</span>
										{subItem.label}
									</Link>
								))}
							</Stack>
						</Box>
					)}
				</Box>
			);
		});
	};

	// Render mobile navigation
	const renderMobileNav = () => {
		return (
			<Box className={classes.mobileMenu}>
				<MediaQuery
					largerThan="md"
					styles={{ display: 'none' }}
				>
					<Burger
						opened={mobileMenuOpened}
						onClick={toggleMobileMenu}
					/>
				</MediaQuery>

				<Collapse in={mobileMenuOpened}>
					<Stack
						spacing={0}
						py="md"
					>
						{navItems.map((category, index) => {
							const filteredSubItems = getFilteredItems(category.items);
							if (filteredSubItems.length === 0) return null;

							const isExpanded = mobileExpanded.includes(index);

							return (
								<Box key={index}>
									<UnstyledButton
										className={classes.mobileNavItem}
										onClick={() => toggleMobileExpand(index)}
									>
										<Group
											position="apart"
											w="100%"
										>
											<Group>
												<span className={classes.navIcon}>
													{category.icon}
												</span>
												<Text>{category.label}</Text>
											</Group>
											<IconChevronDown
												size={16}
												stroke={1.5}
												style={{
													transform: isExpanded
														? 'rotate(180deg)'
														: 'none',
												}}
											/>
										</Group>
									</UnstyledButton>

									<Collapse in={isExpanded}>
										<Stack spacing={0}>
											{filteredSubItems.map((item) => (
												<Link
													key={item.key}
													to={item.path}
													className={cx(
														classes.mobileNavItem,
														classes.mobileSubItem,
														{
															[classes.active]: isActive(item.path),
														}
													)}
													onClick={closeMobileMenu}
												>
													<span className={classes.navIcon}>
														{item.icon}
													</span>
													{item.label}
												</Link>
											))}
										</Stack>
									</Collapse>
									<Divider />
								</Box>
							);
						})}

						{isAdmin && (
							<>
								<Button
									leftIcon={<IconUsers size={16} />}
									variant="light"
									onClick={() => {
										openUserManagement();
										closeMobileMenu();
									}}
									fullWidth
									mt="md"
								>
									User Management
								</Button>
							</>
						)}
					</Stack>
				</Collapse>
			</Box>
		);
	};

	return (
		<>
			{/* User Management Modal */}
			<UserManagementModal
				opened={userManagementOpened}
				onClose={closeUserManagement}
			/>

			<Wrapper
				className={classes.root}
				height={HEADER_HEIGHT}
				withBorder
				mb={10}
			>
				<Container
					className={classes.inner}
					fluid
				>
					<Flex
						justify="space-between"
						align="center"
						w="100%"
					>
						{/* Logo */}
						<Group>
							<Link
								to="/"
								className={classes.logo}
							>
								<img
									src="/Logo.png"
									alt="Logo"
									width={45}
									height={45}
								/>
								<Text className={classes.logoText}>4G | 5G PORTAL</Text>
							</Link>
						</Group>

						{/* Desktop Navigation */}
						<Group className={classes.links}>{renderDesktopNav()}</Group>

						{/* Mobile Navigation */}
						{renderMobileNav()}

						{/* User Actions */}
						<Group spacing="sm">
							{isAdmin && (
								<MediaQuery
									smallerThan="md"
									styles={{ display: 'none' }}
								>
									<Button
										radius="md"
										variant="light"
										leftIcon={<IconUsers size={16} />}
										onClick={openUserManagement}
									>
										User Management
									</Button>
								</MediaQuery>
							)}

							<ActionToggle />

							<Menu
								shadow="md"
								width={200}
								position="bottom-end"
							>
								<Menu.Target>
									<Box className={classes.userButton}>
										<Avatar
											color="cyan"
											radius="xl"
										>
											{avatarLetter}
										</Avatar>
									</Box>
								</Menu.Target>

								<Menu.Dropdown>
									<Menu.Label>Account</Menu.Label>
									<Menu.Item icon={<IconUser size={14} />}>
										{displayName}
									</Menu.Item>
									<Menu.Divider />
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
