import {
	Button,
	Group,
	Select,
	Stack,
	TextInput,
	Title,
	Text,
	createStyles,
	ThemeIcon,
	Alert,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useMutation } from '@tanstack/react-query';
import {
	IconBuilding,
	IconUser,
	IconMail,
	IconPhone,
	IconCategory,
	IconPlus,
	IconAlertCircle,
} from '@tabler/icons-react';
import { Modal } from '../../components/Modal';
import useRequest from '../../hooks/useRequest';
import { DealerModalProps } from './types';

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
}));

export function AddDealerModal({ opened, onClose }: DealerModalProps) {
	const { classes } = useStyles();
	const request = useRequest(true);

	const form = useForm({
		initialValues: {
			companyName: '',
			contactPerson: '',
			email: '',
			msisdn: '',
			department: '',
			location: '',
			region: '',
			adminName: '',
			adminEmail: '',
			adminMsisdn: '',
		},
		validate: {
			companyName: (value) => (!value ? 'Company name is required' : null),
			contactPerson: (value) => (!value ? 'Contact person is required' : null),
			email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
			msisdn: (value) => {
				if (!value) return 'MSISDN is required';
				if (!/^256\d{9}$/.test(value))
					return 'Phone number must start with 256 followed by 9 digits';
				return null;
			},
			department: (value) => (!value ? 'Department is required' : null),
			adminName: (value) => (!value ? 'Initial admin name is required' : null),
			adminEmail: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid admin email'),
			adminMsisdn: (value) => {
				if (!value) return 'Initial admin MSISDN is required';
				if (!/^256\d{9}$/.test(value))
					return 'Admin phone must start with 256 followed by 9 digits';
				return null;
			},
		},
	});

	const mutation = useMutation({
		mutationFn: () => request.post('/dealer-groups', form.values),
		mutationKey: ['dealers'],
		onSuccess: () => {
			onClose();
			form.reset();
		},
	});

	const handleSubmit = form.onSubmit(() => mutation.mutate());

	const hasErrors = Object.keys(form.errors).length > 0;

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
						color="yellow"
					>
						<IconPlus size={20} />
					</ThemeIcon>
					<div>
						<Title
							order={3}
							size="h4"
						>
							Add New Dealer
						</Title>
						<Text
							color="dimmed"
							size="sm"
						>
							Create a new dealer account with company information
						</Text>
					</div>
				</div>
			</div>

			{/* Form Section */}
			<div className={classes.formSection}>
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
						{/* Company Information */}
						<div className={classes.formGroup}>
							<Text
								size="sm"
								weight={500}
								color="dimmed"
								mb="xs"
							>
								Company Information
							</Text>
							<div className={classes.inputWrapper}>
								<TextInput
									label="Company Name"
									placeholder="Enter company name"
									required
									icon={
										<IconBuilding
											size={16}
											className={classes.inputIcon}
										/>
									}
									{...form.getInputProps('companyName')}
									radius="md"
								/>
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
										label="Contact Person"
										placeholder="Enter contact person name"
										required
										icon={
											<IconUser
												size={16}
												className={classes.inputIcon}
											/>
										}
										{...form.getInputProps('contactPerson')}
										radius="md"
									/>
								</div>
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

						{/* Department & Location */}
						<div className={classes.formGroup}>
							<Text
								size="sm"
								weight={500}
								color="dimmed"
								mb="xs"
							>
								Department & Location
							</Text>
							<div className={classes.formRow}>
								<div className={classes.inputWrapper}>
									<Select
										label="Department"
										placeholder="Select dealer department"
										required
										icon={
											<IconCategory
												size={16}
												className={classes.inputIcon}
											/>
										}
										data={[
											{ value: 'wakanet', label: 'WakaNet' },
											{ value: 'enterprise', label: 'Enterprise' },
											{ value: 'both', label: 'Both' },
										]}
										{...form.getInputProps('department')}
										radius="md"
									/>
								</div>
								<div className={classes.inputWrapper}>
									<TextInput
										label="Region"
										placeholder="Enter region"
										{...form.getInputProps('region')}
										radius="md"
									/>
								</div>
							</div>
							<div className={classes.inputWrapper}>
								<TextInput
									label="Location"
									placeholder="Enter location"
									{...form.getInputProps('location')}
									radius="md"
								/>
							</div>
						</div>

						{/* Initial Admin Details */}
						<div className={classes.formGroup}>
							<Text
								size="sm"
								weight={500}
								color="dimmed"
								mb="xs"
							>
								Initial Admin Details
							</Text>
							<div className={classes.formRow}>
								<div className={classes.inputWrapper}>
									<TextInput
										label="Admin Name"
										placeholder="Enter initial admin name"
										icon={
											<IconUser
												size={16}
												className={classes.inputIcon}
											/>
										}
										required
										{...form.getInputProps('adminName')}
										radius="md"
									/>
								</div>
								<div className={classes.inputWrapper}>
									<TextInput
										label="Admin Email"
										placeholder="Enter admin email"
										icon={
											<IconMail
												size={16}
												className={classes.inputIcon}
											/>
										}
										required
										{...form.getInputProps('adminEmail')}
										radius="md"
									/>
								</div>
							</div>
							<div className={classes.inputWrapper}>
								<TextInput
									label="Admin Phone"
									placeholder="Enter admin phone (e.g., 256123456789)"
									icon={
										<IconPhone
											size={16}
											className={classes.inputIcon}
										/>
									}
									required
									{...form.getInputProps('adminMsisdn')}
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
						leftIcon={<IconPlus size={16} />}
						className={classes.submitButton}
						radius="md"
						onClick={() => handleSubmit()}
					>
						Add Dealer
					</Button>
				</Group>
			</div>
		</Modal>
	);
}
