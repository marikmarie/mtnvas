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
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
	IconUserEdit,
	IconUser,
	IconMail,
	IconPhone,
	IconShield,
	IconCategory,
	IconAlertCircle,
} from '@tabler/icons-react';
import { Modal } from '../../components/Modal';
import useRequest from '../../hooks/useRequest';
import { DealerAdmin } from './types';

interface EditDealerAdminModalProps {
	opened: boolean;
	onClose: () => void;
	dealerId: string;
	admin: DealerAdmin;
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
}));

export function EditDealerAdminModal({
	opened,
	onClose,
	dealerId,
	admin,
}: EditDealerAdminModalProps) {
	const { classes } = useStyles();
	const request = useRequest(true);
	const queryClient = useQueryClient();

	const form = useForm({
		initialValues: {
			name: admin.name,
			email: admin.email,
			msisdn: admin.msisdn,
			role: admin.role as 'dealer_super_admin' | 'dealer_admin',
			department: admin.department as 'wakanet' | 'enterprise' | 'both',
			location: '',
		},
		validate: {
			name: (v) => (!v ? 'Name is required' : null),
			email: (v) => (/^\S+@\S+$/.test(v) ? null : 'Invalid email'),
			msisdn: (v) =>
				!/^256\d{9}$/.test(v) ? 'Phone must start with 256 followed by 9 digits' : null,
			role: (v) => (!v ? 'Role is required' : null),
			department: (v) => (!v ? 'Department is required' : null),
		},
	});

	const mutation = useMutation({
		mutationFn: () => request.put(`/dealer-groups/${dealerId}/admins/${admin.id}`, form.values),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['dealer-details', dealerId] });
			onClose();
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
			<div className={classes.header}>
				<div className={classes.headerContent}>
					<ThemeIcon
						size={40}
						radius="md"
						variant="light"
						color="blue"
					>
						<IconUserEdit size={20} />
					</ThemeIcon>
					<div>
						<Title
							order={3}
							size="h4"
						>
							Edit Dealer Admin
						</Title>
						<Text
							color="dimmed"
							size="sm"
						>
							Update admin details
						</Text>
					</div>
				</div>
			</div>

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
						<div className={classes.formGroup}>
							<Text
								size="sm"
								weight={500}
								color="dimmed"
								mb="xs"
							>
								Admin Information
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
										label="Email"
										placeholder="Enter email"
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
							<div className={classes.formRow}>
								<div className={classes.inputWrapper}>
									<TextInput
										label="Phone"
										placeholder="256XXXXXXXXX"
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
								<div className={classes.inputWrapper}>
									<TextInput
										label="Location"
										placeholder="Enter location"
										icon={
											<IconShield
												size={16}
												className={classes.inputIcon}
											/>
										}
										{...form.getInputProps('location')}
										radius="md"
									/>
								</div>
							</div>
						</div>

						<div className={classes.formGroup}>
							<Text
								size="sm"
								weight={500}
								color="dimmed"
								mb="xs"
							>
								Assignment
							</Text>
							<div className={classes.formRow}>
								<div className={classes.inputWrapper}>
									<Select
										label="Role"
										placeholder="Select role"
										required
										icon={
											<IconShield
												size={16}
												className={classes.inputIcon}
											/>
										}
										data={[
											{
												value: 'dealer_super_admin',
												label: 'Dealer Super Admin',
											},
											{ value: 'dealer_admin', label: 'Dealer Admin' },
										]}
										{...form.getInputProps('role')}
										radius="md"
									/>
								</div>
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
							</div>
						</div>
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
						radius="md"
					>
						Cancel
					</Button>
					<Button
						type="submit"
						loading={mutation.isLoading}
						leftIcon={<IconUserEdit size={16} />}
						className={classes.submitButton}
						radius="md"
						onClick={() => handleSubmit()}
					>
						Save Changes
					</Button>
				</Group>
			</div>
		</Modal>
	);
}
