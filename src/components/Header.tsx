import {
	Avatar,
	Box,
	Burger,
	Button,
	Collapse,
	Container,
	createStyles,
	Divider,
	Group,
	Indicator,
	Menu,
	Paper,
	rem,
	Stack,
	Text,
	Transition,
	UnstyledButton,
	Header as Wrapper,
} from '@mantine/core';
import { useDisclosure, useViewportSize } from '@mantine/hooks';
import {
	IconChevronDown,
	IconCircleCheck,
	IconDeviceMobile,
	IconEdit,
	IconLoader,
	IconLogout,
	IconNews,
	IconReport,
	IconRouter,
	IconUser,
	IconUsers,
} from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { signout } from '../app/slices/auth';
import { RootState } from '../app/store';
import UserManagementModal from '../modules/UserManagment/UserManagementModal';
import { ActionToggle } from './ActionToggle';

const HEADER_HEIGHT = rem(70);

const useStyles = createStyles((theme) => ({
	root: {
		position: 'sticky',
		top: 0,
		zIndex: 1000,
		backdropFilter: 'blur(10px)',
		backgroundColor:
			theme.colorScheme === 'dark' ? `${theme.colors.dark[8]}CC` : `${theme.white}F0`,
		borderBottom: `1px solid ${
			theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[3]
		}`,
	},

	inner: {
		height: HEADER_HEIGHT,
		display: 'flex',
		justifyContent: 'space-between',
		alignItems: 'center',
		padding: `0 ${theme.spacing.md}`,
		[theme.fn.smallerThan('sm')]: {
			padding: `0 ${theme.spacing.sm}`,
		},
	},

	logo: {
		display: 'flex',
		alignItems: 'center',
		textDecoration: 'none',
		padding: theme.spacing.xs,
		borderRadius: theme.radius.md,
		'&:hover': {
			textDecoration: 'none',
			backgroundColor:
				theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.gray[0],
			// transform: 'translateY(-1px)',
		},
	},

	logoImage: {
		'&:hover': {
			// transform: 'scale(1.05)',
		},
	},

	logoText: {
		fontWeight: 800,
		fontSize: rem(22),
		background: theme.colors.yellow[6],
		WebkitBackgroundClip: 'text',
		WebkitTextFillColor: 'transparent',
		marginLeft: theme.spacing.sm,
		letterSpacing: '0.5px',
		[theme.fn.smallerThan('sm')]: {
			fontSize: rem(18),
			marginLeft: theme.spacing.xs,
		},
	},

	navigation: {
		display: 'flex',
		alignItems: 'center',
		gap: theme.spacing.xs,
		[theme.fn.smallerThan('lg')]: {
			display: 'none',
		},
	},

	navItem: {
		position: 'relative',
		padding: `${rem(12)} ${rem(16)}`,
		borderRadius: theme.radius.lg,
		fontWeight: 500,
		cursor: 'pointer',
		color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.colors.gray[7],
		transition: 'all 0.2s ease',
		border: '1px solid transparent',
		'&:hover': {
			backgroundColor:
				theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
			// transform: 'translateY(-1px)',
			boxShadow: theme.shadows.sm,
		},
		userSelect: 'none',
	},

	navItemActive: {
		backgroundColor:
			theme.colorScheme === 'dark' ? theme.colors.yellow[9] : theme.colors.yellow[0],
		color: theme.colorScheme === 'dark' ? theme.colors.yellow[2] : theme.colors.yellow[7],
		fontWeight: 600,
	},

	navIcon: {
		marginRight: theme.spacing.xs,
		color: theme.colorScheme === 'dark' ? theme.colors.yellow[4] : theme.colors.yellow[6],
		transition: 'color 0.2s ease',
	},

	dropdown: {
		position: 'absolute',
		top: '100%',
		left: 0,
		right: 0,
		zIndex: 100,
		marginTop: theme.spacing.xs,
		borderRadius: theme.radius.lg,
		overflow: 'hidden',
		boxShadow: theme.shadows.xl,
		backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
		border: `1px solid ${
			theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[3]
		}`,
		minWidth: rem(280),
	},

	dropdownItem: {
		display: 'flex',
		alignItems: 'center',
		padding: `${rem(12)} ${rem(16)}`,
		textDecoration: 'none',
		color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.colors.gray[7],
		fontSize: theme.fontSizes.sm,
		transition: 'all 0.2s ease',
		'&:hover': {
			backgroundColor:
				theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
			// transform: 'translateX(4px)',
		},
	},

	dropdownItemActive: {
		backgroundColor:
			theme.colorScheme === 'dark' ? theme.colors.yellow[9] : theme.colors.yellow[0],
		color: theme.colorScheme === 'dark' ? theme.colors.yellow[2] : theme.colors.yellow[7],
		fontWeight: 600,
	},

	// Mobile styles
	mobileMenu: {
		[theme.fn.largerThan('lg')]: {
			display: 'none',
		},
	},

	mobileOverlay: {
		position: 'fixed',
		top: HEADER_HEIGHT,
		left: 0,
		right: 0,
		bottom: 0,
		backgroundColor: theme.colorScheme === 'dark' ? 'rgba(0, 0, 0, 0.7)' : 'rgba(0, 0, 0, 0.5)',
		zIndex: 999,
		backdropFilter: 'blur(4px)',
	},

	mobileNavContainer: {
		position: 'fixed',
		top: HEADER_HEIGHT,
		left: 0,
		right: 0,
		backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.white,
		borderBottom: `1px solid ${
			theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[3]
		}`,
		maxHeight: `calc(100vh - ${HEADER_HEIGHT})`,
		overflowY: 'auto',
		zIndex: 1000,
		boxShadow: theme.shadows.xl,
	},

	mobileNavItem: {
		padding: `${rem(16)} ${rem(20)}`,
		fontWeight: 500,
		display: 'flex',
		alignItems: 'center',
		width: '100%',
		color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.colors.gray[7],
		transition: 'all 0.2s ease',
		'&:hover': {
			backgroundColor:
				theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
		},
	},

	mobileSubItem: {
		padding: `${rem(12)} ${rem(20)} ${rem(12)} ${rem(50)}`,
		fontWeight: 400,
		fontSize: theme.fontSizes.sm,
		borderLeft: `3px solid ${
			theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[3]
		}`,
		marginLeft: rem(20),
		transition: 'all 0.2s ease',
		'&:hover': {
			borderLeftColor:
				theme.colorScheme === 'dark' ? theme.colors.yellow[4] : theme.colors.yellow[6],
		},
	},

	mobileSubItemActive: {
		backgroundColor:
			theme.colorScheme === 'dark' ? theme.colors.yellow[9] : theme.colors.yellow[0],
		color: theme.colorScheme === 'dark' ? theme.colors.yellow[2] : theme.colors.yellow[7],
		borderLeftColor:
			theme.colorScheme === 'dark' ? theme.colors.yellow[4] : theme.colors.yellow[6],
	},

	userSection: {
		display: 'flex',
		alignItems: 'center',
		gap: theme.spacing.sm,
		[theme.fn.smallerThan('md')]: {
			gap: theme.spacing.xs,
		},
	},

	userButton: {
		padding: theme.spacing.xs,
		borderRadius: theme.radius.xl,
		transition: 'all 0.2s ease',
		border: '2px solid transparent',
		'&:hover': {
			backgroundColor:
				theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
			borderColor:
				theme.colorScheme === 'dark' ? theme.colors.yellow[4] : theme.colors.yellow[6],
		},
	},

	adminButton: {
		background:
			theme.colorScheme === 'dark'
				? 'linear-gradient(45deg, #4DABF7, #69DB7C)'
				: 'linear-gradient(45deg, #1971C2, #2F9E44)',
		'&:hover': {
			background:
				theme.colorScheme === 'dark'
					? 'linear-gradient(45deg, #339AF0, #51CF66)'
					: 'linear-gradient(45deg, #1864AB, #2B8A3E)',
		},
	},

	burger: {
		color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.colors.gray[7],
		'&:hover': {
			backgroundColor:
				theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
		},
	},

	chevronIcon: {},

	chevronRotated: {},
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
];

export function Header() {
	const { classes, cx } = useStyles();
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const location = useLocation();
	const { width } = useViewportSize();
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

	useEffect(() => {
		const handleClickOutside = () => {
			setOpenDropdown(null);
		};

		document.addEventListener('click', handleClickOutside);
		return () => {
			document.removeEventListener('click', handleClickOutside);
		};
	}, []);

	// Get user display info
	const displayName = user?.email?.split('@')[0] || 'User';
	const avatarLetter = displayName[0]?.toUpperCase() || 'U';

	// Check if path is active
	const isActive = (path: string) => location.pathname === path;

	// Check if any sub-item is active
	const isParentActive = (items: any[]) => {
		return items.some((item) => isActive(item.path));
	};

	// Filter navigation items based on user role
	const getFilteredItems = (items: (typeof navItems)[0]['items']) => {
		return items.filter((item) => !item.officeRestricted || !isOfficeUser);
	};

	// Close mobile menu when clicking outside
	const handleMobileOverlayClick = () => {
		closeMobileMenu();
	};

	// Render desktop navigation
	const renderDesktopNav = () => {
		return navItems.map((item, index) => {
			const filteredSubItems = getFilteredItems(item.items);
			if (filteredSubItems.length === 0) return null;

			const isItemActive = isParentActive(filteredSubItems);

			return (
				<Box
					key={index}
					className={cx(classes.navItem, { [classes.navItemActive]: isItemActive })}
					onClick={(e) => {
						e.stopPropagation(); // prevent bubbling in case it's nested in a link or another handler
						setOpenDropdown(openDropdown === index ? null : index);
					}}
					role="button"
					aria-haspopup="true"
					aria-expanded={openDropdown === index}
				>
					<Group spacing="xs">
						<span className={classes.navIcon}>{item.icon}</span>
						<Text
							size="sm"
							weight={500}
						>
							{item.label}
						</Text>
						<IconChevronDown
							size={16}
							stroke={1.5}
							className={cx(classes.chevronIcon, {
								[classes.chevronRotated]: openDropdown === index,
							})}
						/>
					</Group>

					<Transition
						mounted={openDropdown === index}
						transition="scale-y"
						duration={200}
						timingFunction="ease"
					>
						{(styles) => (
							<Paper
								className={classes.dropdown}
								style={styles}
							>
								<Stack spacing={0}>
									{filteredSubItems.map((subItem) => (
										<Link
											key={subItem.key}
											to={subItem.path}
											className={cx(classes.dropdownItem, {
												[classes.dropdownItemActive]: isActive(
													subItem.path
												),
											})}
											onClick={() => setOpenDropdown(null)}
										>
											<span className={classes.navIcon}>{subItem.icon}</span>
											<Text size="sm">{subItem.label}</Text>
										</Link>
									))}
								</Stack>
							</Paper>
						)}
					</Transition>
				</Box>
			);
		});
	};

	// Render mobile navigation
	const renderMobileNav = () => {
		return (
			<Box className={classes.mobileMenu}>
				<Burger
					opened={mobileMenuOpened}
					onClick={toggleMobileMenu}
					className={classes.burger}
					size="sm"
				/>

				{mobileMenuOpened && (
					<>
						<Box
							className={classes.mobileOverlay}
							onClick={handleMobileOverlayClick}
						/>
						<Paper className={classes.mobileNavContainer}>
							<Stack spacing={0}>
								{navItems.map((category, index) => {
									const filteredSubItems = getFilteredItems(category.items);
									if (filteredSubItems.length === 0) return null;

									const isExpanded = mobileExpanded.includes(index);
									const isItemActive = isParentActive(filteredSubItems);

									return (
										<Box key={index}>
											<UnstyledButton
												className={cx(classes.mobileNavItem, {
													[classes.navItemActive]: isItemActive,
												})}
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
														<Text weight={500}>{category.label}</Text>
													</Group>
													<IconChevronDown
														size={16}
														stroke={1.5}
														className={cx(classes.chevronIcon, {
															[classes.chevronRotated]: isExpanded,
														})}
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
																	[classes.mobileSubItemActive]:
																		isActive(item.path),
																}
															)}
															onClick={closeMobileMenu}
														>
															<span className={classes.navIcon}>
																{item.icon}
															</span>
															<Text size="sm">{item.label}</Text>
														</Link>
													))}
												</Stack>
											</Collapse>
											<Divider />
										</Box>
									);
								})}

								{isAdmin && (
									<Box p="md">
										<Button
											leftIcon={<IconUsers size={16} />}
											variant="gradient"
											gradient={{ from: 'yellow', to: 'teal' }}
											onClick={() => {
												openUserManagement();
												closeMobileMenu();
											}}
											fullWidth
											radius="lg"
										>
											User Management
										</Button>
									</Box>
								)}
							</Stack>
						</Paper>
					</>
				)}
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
				withBorder={false}
			>
				<Container
					className={classes.inner}
					fluid
				>
					{/* Logo */}
					<Link
						to="/"
						className={classes.logo}
					>
						<img
							src="/Logo.png"
							alt="Logo"
							width={width < 768 ? 40 : 45}
							height={width < 768 ? 40 : 45}
							className={classes.logoImage}
						/>
						<Text className={classes.logoText}>
							{width < 480 ? '4G|5G' : '4G | 5G PORTAL'}
						</Text>
					</Link>

					{/* Desktop Navigation */}
					<Group className={classes.navigation}>{renderDesktopNav()}</Group>

					{/* Mobile Navigation */}
					{renderMobileNav()}

					{/* User Actions */}
					<Group className={classes.userSection}>
						{isAdmin && width >= 768 && (
							<Button
								radius="lg"
								variant="gradient"
								gradient={{ from: 'yellow', to: 'teal' }}
								leftIcon={<IconUsers size={16} />}
								onClick={openUserManagement}
								className={classes.adminButton}
								size={width < 1024 ? 'xs' : 'sm'}
							>
								{width < 1024 ? 'Users' : 'User Management'}
							</Button>
						)}

						<ActionToggle />

						<Menu
							shadow="xl"
							width={220}
							position="bottom-end"
							radius="lg"
							offset={8}
						>
							<Menu.Target>
								<UnstyledButton className={classes.userButton}>
									<Indicator
										inline
										size={8}
										color="green"
										position="bottom-end"
										offset={4}
									>
										<Avatar
											color="yellow"
											radius="xl"
											size={width < 768 ? 36 : 40}
											gradient={{ from: 'yellow', to: 'teal' }}
										>
											{avatarLetter}
										</Avatar>
									</Indicator>
								</UnstyledButton>
							</Menu.Target>

							<Menu.Dropdown>
								<Menu.Label>
									<Group spacing="xs">
										<IconUser size={14} />
										Account
									</Group>
								</Menu.Label>
								<Menu.Item>
									<Text
										size="sm"
										weight={500}
									>
										{displayName}
									</Text>
									<Text
										size="xs"
										color="dimmed"
									>
										{user?.email}
									</Text>
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
				</Container>
			</Wrapper>
		</>
	);
}
