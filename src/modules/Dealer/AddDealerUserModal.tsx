import {
	Alert,
	Button,
	createStyles,
	Group,
	Select,
	Stack,
	Text,
	TextInput,
	ThemeIcon,
	Title,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import {
	IconAlertCircle,
	IconBuilding,
	IconMail,
	IconMapPin,
	IconPhone,
	IconShield,
	IconUser,
	IconUserPlus,
} from '@tabler/icons-react';
import { useMutation } from '@tanstack/react-query';
import { Modal } from '../../components/Modal';
import useRequest from '../../hooks/useRequest';
import { Dealer } from './types';

interface AddDealerUserModalProps {
	opened: boolean;
	onClose: () => void;
	dealer: Dealer;
	userType: 'DSA' | 'Retailer';
}

const useStyles = createStyles((theme) => ({
	header: {
		padding: theme.spacing.lg,
		borderBottom: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[2]}`,
		backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
	},

	headerContent: {
		display: 'flex',
		alignItems: 'center',
		gap: theme.spacing.md,
	},

	formSection: {
		padding: theme.spacing.lg,
	},

	formGroup: {
		marginBottom: theme.spacing.md,
	},

	formRow: {
		display: 'grid',
		gridTemplateColumns: '1fr 1fr',
		gap: theme.spacing.md,

		[theme.fn.smallerThan('sm')]: {
			gridTemplateColumns: '1fr',
		},
	},

	inputWrapper: {
		position: 'relative',
	},

	inputIcon: {
		color: theme.colors.gray[5],
	},

	actions: {
		padding: theme.spacing.lg,
		borderTop: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[2]}`,
		backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
	},

	submitButton: {
		transition: 'all 0.2s ease',

		'&:hover': {
			transform: 'translateY(-1px)',
			boxShadow: theme.shadows.md,
		},
	},

	errorAlert: {
		marginBottom: theme.spacing.md,
	},

	dealerInfo: {
		backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
		border: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[2]}`,
		borderRadius: theme.radius.md,
		padding: theme.spacing.md,
		marginBottom: theme.spacing.lg,
	},

	userTypeBadge: {
		marginTop: theme.spacing.xs,
	},
}));

export function AddDealerUserModal({ opened, onClose, dealer, userType }: AddDealerUserModalProps) {
	const { classes } = useStyles();
	const request = useRequest(true);

	const form = useForm({
		initialValues: {
			name: '',
			email: '',
			msisdn: '',
			username: '',
			department: 'WAKANET',
			category: 'CEX_PLUS',
			role: userType.toLowerCase(),
			location: '',
		},
		validate: {
			name: (value) => (!value ? 'Name is required' : null),
			email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
			msisdn: (value) => {
				if (!value) return 'Phone number is required';
				if (!/^256\d{9}$/.test(value))
					return 'Phone number must start with 256 followed by 9 digits';
				return null;
			},
			username: (value) => (!value ? 'Username is required' : null),
			location: (value) => (!value ? 'Location is required' : null),
		},
	});

	const mutation = useMutation({
		mutationFn: () =>
			request.post('/users', {
				...form.values,
				dealerGroup: dealer.dealerName,
			}),
		mutationKey: ['users'],
		onSuccess: () => {
			onClose();
			form.reset();
		},
	});

	const handleSubmit = form.onSubmit(() => mutation.mutate());

	const hasErrors = Object.keys(form.errors).length > 0;

	const getUserTypeColor = (type: string) => {
		return type === 'DSA' ? 'yellow' : 'green';
	};

	return (
		<Modal
			opened={opened}
			close={onClose}
			size="lg"
		>
			{/* Enhanced Header */}
			<div className={classes.header}>
				<div className={classes.headerContent}>
					<ThemeIcon
						size={40}
						radius="md"
						variant="light"
						color={getUserTypeColor(userType)}
					>
						<IconUserPlus size={20} />
					</ThemeIcon>
					<div>
						<Title
							order={3}
							size="h4"
						>
							Add {userType}
						</Title>
						<Text
							color="dimmed"
							size="sm"
						>
							Create a new {userType} account for {dealer.dealerName}
						</Text>
					</div>
				</div>
			</div>

			{/* Form Section */}
			<div className={classes.formSection}>
				{/* Dealer Information */}
				<div className={classes.dealerInfo}>
					<Text
						size="sm"
						weight={500}
						color="dimmed"
						mb="xs"
					>
						Parent Dealer
					</Text>
					<Text weight={600}>{dealer.dealerName}</Text>
					<Text
						size="sm"
						color="dimmed"
						className={classes.userTypeBadge}
					>
						User Type: <strong>{userType}</strong>
					</Text>
				</div>

				{hasErrors && (
					<Alert
						icon={<IconAlertCircle size={16} />}
						title="Please fix the following errors"
						color="red"
						className={classes.errorAlert}
					>
						Please correct the highlighted fields before submitting.
					</Alert>
				)}

				<form onSubmit={handleSubmit}>
					<Stack spacing="lg">
						{/* Personal Information */}
						<div className={classes.formGroup}>
							<Text
								size="sm"
								weight={500}
								color="dimmed"
								mb="xs"
							>
								Personal Information
							</Text>
							<div className={classes.formRow}>
								<div className={classes.inputWrapper}>
									<TextInput
										label="Full Name"
										placeholder="Enter full name"
										required
										icon={
											<IconUser
												size={16}
												className={classes.inputIcon}
											/>
										}
										{...form.getInputProps('name')}
										radius="md"
									/>
								</div>
								<div className={classes.inputWrapper}>
									<TextInput
										label="Username"
										placeholder="Enter username"
										required
										icon={
											<IconUser
												size={16}
												className={classes.inputIcon}
											/>
										}
										{...form.getInputProps('username')}
										radius="md"
									/>
								</div>
							</div>
						</div>

						{/* Contact Information */}
						<div className={classes.formGroup}>
							<Text
								size="sm"
								weight={500}
								color="dimmed"
								mb="xs"
							>
								Contact Information
							</Text>
							<div className={classes.formRow}>
								<div className={classes.inputWrapper}>
									<TextInput
										label="Email Address"
										placeholder="Enter email address"
										required
										icon={
											<IconMail
												size={16}
												className={classes.inputIcon}
											/>
										}
										{...form.getInputProps('email')}
										radius="md"
									/>
								</div>
								<div className={classes.inputWrapper}>
									<TextInput
										label="Phone Number"
										placeholder="Enter phone number (e.g., 256123456789)"
										required
										icon={
											<IconPhone
												size={16}
												className={classes.inputIcon}
											/>
										}
										{...form.getInputProps('msisdn')}
										radius="md"
									/>
								</div>
							</div>
						</div>

						{/* Location and Role */}
						<div className={classes.formGroup}>
							<Text
								size="sm"
								weight={500}
								color="dimmed"
								mb="xs"
							>
								Assignment Details
							</Text>
							<div className={classes.formRow}>
								<div className={classes.inputWrapper}>
									<TextInput
										label="Location"
										placeholder="Enter location"
										required
										icon={
											<IconMapPin
												size={16}
												className={classes.inputIcon}
											/>
										}
										{...form.getInputProps('location')}
										radius="md"
									/>
								</div>
								<div className={classes.inputWrapper}>
									<Select
										label="Department"
										placeholder="Select department"
										required
										icon={
											<IconBuilding
												size={16}
												className={classes.inputIcon}
											/>
										}
										data={[
											{ value: 'WAKANET', label: 'WakaNet' },
											{ value: 'ENTERPRISE', label: 'Enterprise' },
										]}
										{...form.getInputProps('department')}
										radius="md"
									/>
								</div>
							</div>
							<div className={classes.inputWrapper}>
								<Select
									label="Category"
									placeholder="Select category"
									required
									icon={
										<IconShield
											size={16}
											className={classes.inputIcon}
										/>
									}
									data={[
										{ value: 'CEX_PLUS', label: 'CEX Plus' },
										{ value: 'CEX_BASIC', label: 'CEX Basic' },
										{ value: 'CEX_PREMIUM', label: 'CEX Premium' },
									]}
									{...form.getInputProps('category')}
									radius="md"
								/>
							</div>
						</div>
					</Stack>
				</form>
			</div>

			{/* Enhanced Actions */}
			<div className={classes.actions}>
				<Group
					position="right"
					spacing="md"
				>
					<Button
						variant="subtle"
						onClick={onClose}
						radius="md"
					>
						Cancel
					</Button>
					<Button
						type="submit"
						loading={mutation.isLoading}
						leftIcon={<IconUserPlus size={16} />}
						className={classes.submitButton}
						radius="md"
						onClick={() => handleSubmit()}
					>
						Add {userType}
					</Button>
				</Group>
			</div>
		</Modal>
	);
}
