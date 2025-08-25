import {
	Alert,
	Badge,
	Box,
	Button,
	createStyles,
	Group,
	Loader,
	Paper,
	Select,
	Stack,
	Text,
	TextInput,
	ThemeIcon,
	Title,
	Transition,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import {
	IconAlertCircle,
	IconBuilding,
	IconCategory,
	IconCheck,
	IconMail,
	IconMapPin,
	IconPhone,
	IconPlus,
	IconUser,
	IconWorld,
	IconX,
} from '@tabler/icons-react';
import { useMutation } from '@tanstack/react-query';
import { Modal } from '../../components/Modal';
import useRequest from '../../hooks/useRequest';
import { formatPhoneNumber } from '../../utils/phone.util';
import { DealerModalProps } from './types';

const useStyles = createStyles((theme) => ({
	modalContent: {
		padding: 0,
		overflow: 'hidden',
	},
	header: {
		padding: `${theme.spacing.xl}px ${theme.spacing.xl}px ${theme.spacing.lg}px`,
		position: 'relative',
		overflow: 'hidden',
	},
	headerContent: {
		display: 'flex',
		alignItems: 'center',
		gap: theme.spacing.md,
		position: 'relative',
		zIndex: 1,
	},

	formSection: {
		padding: theme.spacing.xl,
	},
	formCard: {
		borderRadius: theme.radius.lg,
		overflow: 'hidden',
	},
	sectionHeader: {
		padding: theme.spacing.md,
		backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
		borderBottom: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[2]}`,
		display: 'flex',
		alignItems: 'center',
		gap: theme.spacing.sm,
	},
	sectionTitle: {
		fontSize: theme.fontSizes.sm,
		fontWeight: 600,
		color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.colors.gray[7],
		textTransform: 'uppercase',
		letterSpacing: '0.5px',
	},
	sectionContent: {
		padding: theme.spacing.lg,
	},
	formGrid: {
		display: 'grid',
		gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
		gap: theme.spacing.md,
	},
	inputWrapper: {
		position: 'relative',
	},
	enhancedInput: {
		'& .mantine-Input-input': {
			transition: 'all 0.2s ease',
			'&:focus': {
				borderColor: theme.colors.yellow[5],
				boxShadow: `0 0 0 2px ${theme.colors.yellow[1]}`,
			},
		},
		'& .mantine-Input-icon': {
			color: theme.colors.yellow[6],
		},
	},
	selectWrapper: {
		'& .mantine-Select-input': {
			transition: 'all 0.2s ease',
			'&:focus': {
				borderColor: theme.colors.yellow[5],
				boxShadow: `0 0 0 2px ${theme.colors.yellow[1]}`,
			},
		},
		'& .mantine-Select-icon': {
			color: theme.colors.yellow[6],
		},
	},
	departmentBadge: {
		position: 'absolute',
		top: -8,
		right: 8,
		fontSize: '10px',
		fontWeight: 500,
	},
	actions: {
		padding: theme.spacing.xl,
	},
	submitButton: {
		border: 0,
		transition: 'all 0.2s ease',
		'&:hover': {
			transform: 'translateY(-2px)',
			boxShadow: '0 8px 24px rgba(252, 196, 25, 0.3)',
		},
		'&:active': {
			transform: 'translateY(0)',
		},
	},
	cancelButton: {
		transition: 'all 0.2s ease',
		'&:hover': {
			backgroundColor:
				theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[1],
		},
	},
	errorAlert: {
		marginBottom: theme.spacing.lg,
		border: `1px solid ${theme.colors.red[3]}`,
		borderRadius: theme.radius.md,
		'& .mantine-Alert-icon': {
			color: theme.colors.red[6],
		},
	},
	successState: {
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		padding: theme.spacing.xl,
		textAlign: 'center',
	},
	successIcon: {
		marginBottom: theme.spacing.lg,
		backgroundColor: theme.colors.green[1],
		color: theme.colors.green[7],
	},
	loadingOverlay: {
		position: 'absolute',
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		backgroundColor: 'rgba(255, 255, 255, 0.8)',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		zIndex: 1000,
	},
}));

export function AddDealerModal({ opened, onClose }: DealerModalProps) {
	const { classes } = useStyles();
	const request = useRequest(true);

	const form = useForm({
		initialValues: {
			dealerName: '',
			email: '',
			msisdn: '',
			department: '',
			location: '',
			region: '',
		},
		validate: {
			dealerName: (value) => {
				if (!value) return 'Dealer name is required';
				if (value.length < 2) return 'Dealer name must be at least 2 characters';
				return null;
			},
			email: (value) => {
				if (!value) return 'Email is required';
				if (!/^\S+@\S+\.\S+$/.test(value)) return 'Please enter a valid email address';
				return null;
			},
			msisdn: (value) => {
				if (!value) return 'Phone number is required';
				if (value.replace(/\D/g, '').length < 10)
					return 'Please enter a valid phone number';
				return null;
			},
			department: (value) => (!value ? 'Department is required' : null),
			location: (value) => {
				if (!value) return 'Location is required';
				if (value.length < 2) return 'Location must be at least 2 characters';
				return null;
			},
			region: (value) => {
				if (!value) return 'Region is required';
				if (value.length < 2) return 'Region must be at least 2 characters';
				return null;
			},
		},
	});

	const mutation = useMutation({
		mutationFn: () =>
			request.post('/dealer', {
				...form.values,
				msisdn: formatPhoneNumber(form.values.msisdn),
			}),
		mutationKey: ['dealers'],
		onSuccess: () => {
			setTimeout(() => {
				onClose();
				form.reset();
			}, 1500);
		},
	});

	const handleSubmit = form.onSubmit(() => mutation.mutate());
	const hasErrors = Object.keys(form.errors).length > 0;

	if (mutation.isSuccess) {
		return (
			<Modal
				opened={opened}
				close={onClose}
				size="md"
			>
				<div className={classes.successState}>
					<ThemeIcon
						size={60}
						radius="xl"
						className={classes.successIcon}
					>
						<IconCheck size={30} />
					</ThemeIcon>
					<Title
						order={3}
						mb="sm"
					>
						Dealer Added Successfully!
					</Title>
					<Text
						color="dimmed"
						mb="xl"
					>
						{form.values.dealerName} has been added to the system.
					</Text>
					<Button
						onClick={() => {
							onClose();
							form.reset();
						}}
						variant="light"
						color="green"
					>
						Done
					</Button>
				</div>
			</Modal>
		);
	}

	return (
		<Modal
			opened={opened}
			close={onClose}
			size="xl"
		>
			<div className={classes.modalContent}>
				<div className={classes.header}>
					<div className={classes.headerContent}>
						<ThemeIcon
							size={50}
							radius="xl"
						>
							<IconPlus size={24} />
						</ThemeIcon>
						<div>
							<Title order={2}>Add New Dealer</Title>
							<Text>
								Create a new dealer account with complete business information
							</Text>
						</div>
					</div>
				</div>

				<div className={classes.formSection}>
					{hasErrors && (
						<Transition
							mounted={hasErrors}
							transition="slide-down"
							duration={200}
						>
							{(styles) => (
								<Alert
									style={styles}
									icon={<IconAlertCircle size={16} />}
									title="Please correct the following errors"
									color="red"
									className={classes.errorAlert}
									variant="light"
								>
									Some required fields are missing or contain invalid information.
								</Alert>
							)}
						</Transition>
					)}

					<form onSubmit={handleSubmit}>
						<Stack spacing="xl">
							<Paper className={classes.formCard}>
								<div className={classes.sectionHeader}>
									<IconUser size={16} />
									<Text className={classes.sectionTitle}>Basic Information</Text>
								</div>
								<div className={classes.sectionContent}>
									<div className={classes.formGrid}>
										<TextInput
											label="Dealer Name"
											placeholder="Enter dealer name"
											required
											icon={<IconBuilding size={16} />}
											{...form.getInputProps('dealerName')}
											radius="md"
											className={classes.enhancedInput}
											description="Full legal name of the dealership"
										/>
										<TextInput
											label="Email Address"
											placeholder="dealer@company.com"
											required
											icon={<IconMail size={16} />}
											{...form.getInputProps('email')}
											radius="md"
											className={classes.enhancedInput}
											description="Primary business email"
										/>
										<TextInput
											label="Phone Number"
											placeholder="+1 (555) 123-4567"
											required
											icon={<IconPhone size={16} />}
											{...form.getInputProps('msisdn')}
											radius="md"
											className={classes.enhancedInput}
											description="Primary contact number"
										/>
									</div>
								</div>
							</Paper>

							<Paper className={classes.formCard}>
								<div className={classes.sectionHeader}>
									<IconCategory size={16} />
									<Text className={classes.sectionTitle}>Business Details</Text>
								</div>
								<div className={classes.sectionContent}>
									<Box style={{ position: 'relative' }}>
										<Select
											label="Department"
											placeholder="Select business department"
											required
											icon={<IconCategory size={16} />}
											data={[
												{
													value: 'EBU',
													label: 'Enterprise Business Unit (EBU)',
												},
												{ value: 'Consumer', label: 'Consumer Division' },
												{ value: 'Both', label: 'Both Divisions' },
											]}
											{...form.getInputProps('department')}
											radius="md"
											className={classes.selectWrapper}
											description="Primary business focus area"
											mb="lg"
										/>
										{form.values.department && (
											<Badge
												className={classes.departmentBadge}
												color={
													form.values.department === 'Both'
														? 'green'
														: form.values.department === 'EBU'
															? 'blue'
															: 'orange'
												}
												variant="filled"
												size="xs"
											>
												{form.values.department}
											</Badge>
										)}
									</Box>

									<div className={classes.formGrid}>
										<TextInput
											label="Region"
											placeholder="e.g., North America, EMEA"
											required
											icon={<IconWorld size={16} />}
											{...form.getInputProps('region')}
											radius="md"
											className={classes.enhancedInput}
											description="Geographical region"
										/>
										<TextInput
											label="Location"
											placeholder="City, State/Province"
											required
											icon={<IconMapPin size={16} />}
											{...form.getInputProps('location')}
											radius="md"
											className={classes.enhancedInput}
											description="Primary business location"
										/>
									</div>
								</div>
							</Paper>
						</Stack>
					</form>
				</div>

				<div className={classes.actions}>
					<Group
						position="right"
						spacing="md"
					>
						<Button
							variant="subtle"
							onClick={onClose}
							leftIcon={<IconX size={16} />}
							className={classes.cancelButton}
							radius="md"
							size="md"
						>
							Cancel
						</Button>
						<Button
							type="submit"
							loading={mutation.isLoading}
							leftIcon={
								mutation.isLoading ? <Loader size={16} /> : <IconPlus size={16} />
							}
							className={classes.submitButton}
							radius="md"
							size="md"
							onClick={() => handleSubmit()}
							disabled={hasErrors}
						>
							{mutation.isLoading ? 'Adding Dealer...' : 'Add Dealer'}
						</Button>
					</Group>
				</div>

				{mutation.isLoading && (
					<div className={classes.loadingOverlay}>
						<Stack
							align="center"
							spacing="md"
						>
							<Loader
								size="lg"
								color="yellow"
							/>
							<Text color="dimmed">Adding dealer to system...</Text>
						</Stack>
					</div>
				)}
			</div>
		</Modal>
	);
}
