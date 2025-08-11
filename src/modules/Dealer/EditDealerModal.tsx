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
	Badge,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
	IconBuilding,
	IconUser,
	IconMail,
	IconPhone,
	IconCategory,
	IconEdit,
	IconAlertCircle,
	IconCheck,
} from '@tabler/icons-react';
import { Modal } from '../../components/Modal';
import useRequest from '../../hooks/useRequest';
import { Dealer } from './types';

interface EditDealerModalProps {
	opened: boolean;
	onClose: () => void;
	dealer: Dealer;
}

interface DealerFormValues {
	companyName: string;
	contactPerson: string;
	email: string;
	msisdn: string;
	department: 'wakanet' | 'enterprise' | 'both';
	location?: string;
	region?: string;
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

	dealerInfo: {
		display: 'flex',
		alignItems: 'center',
		gap: theme.spacing.sm,
		marginTop: theme.spacing.xs,
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

	statusBadge: {
		fontWeight: 600,
	},
}));

export function EditDealerModal({ opened, onClose, dealer }: EditDealerModalProps) {
	const { classes } = useStyles();
	const request = useRequest(true);
	const queryClient = useQueryClient();

	const form = useForm<DealerFormValues>({
		initialValues: {
			companyName: dealer.companyName || dealer.name,
			contactPerson: dealer.contactPerson,
			email: dealer.email,
			msisdn: dealer.msisdn || dealer.phone,
			department: dealer.department || dealer.category,
			location: dealer.location,
			region: dealer.region,
		},
		validate: {
			companyName: (value) => (!value ? 'Company name is required' : null),
			contactPerson: (value) => (!value ? 'Contact person is required' : null),
			email: (value) => (!value ? 'Email is required' : null),
			msisdn: (value) => (!value ? 'Phone number is required' : null),
			department: (value) => (!value ? 'Department is required' : null),
		},
	});

	const mutation = useMutation({
		mutationFn: (values: DealerFormValues) => {
			return request.put(`/dealer-groups/${dealer.id}`, values);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['dealer', dealer.id] });
			onClose();
		},
	});

	const handleSubmit = (values: DealerFormValues) => {
		mutation.mutate(values);
	};

	const hasErrors = Object.keys(form.errors).length > 0;

	const getStatusColor = (status: string) => {
		return status === 'active' ? 'green' : 'red';
	};

	const getCategoryColor = (category: string) => {
		switch (category?.toLowerCase()) {
			case 'wakanet':
				return 'blue';
			case 'enterprise':
				return 'purple';
			case 'both':
				return 'orange';
			default:
				return 'gray';
		}
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
						color="blue"
					>
						<IconEdit size={20} />
					</ThemeIcon>
					<div>
						<Title
							order={3}
							size="h4"
						>
							Edit Dealer
						</Title>
						<Text
							color="dimmed"
							size="sm"
						>
							Update dealer information and settings
						</Text>
						<div className={classes.dealerInfo}>
							<Badge
								color={getStatusColor(dealer.status)}
								variant="light"
								size="sm"
								className={classes.statusBadge}
							>
								{dealer.status?.charAt(0)?.toUpperCase() + dealer.status?.slice(1)}
							</Badge>
							<Badge
								color={getCategoryColor(dealer.category)}
								variant="light"
								size="sm"
							>
								{dealer.category?.charAt(0)?.toUpperCase() +
									dealer.category?.slice(1)}
							</Badge>
						</div>
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

				<form onSubmit={form.onSubmit(handleSubmit)}>
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
									placeholder="Enter phone number"
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
							<div className={classes.inputWrapper}>
								<Select
									label="Department"
									placeholder="Select department"
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
							<div className={classes.formRow}>
								<div className={classes.inputWrapper}>
									<TextInput
										label="Region"
										placeholder="Enter region"
										{...form.getInputProps('region')}
										radius="md"
									/>
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
						leftIcon={<IconCheck size={16} />}
						className={classes.submitButton}
						radius="md"
						onClick={() => form.onSubmit(handleSubmit)}
					>
						Save Changes
					</Button>
				</Group>
			</div>
		</Modal>
	);
}
