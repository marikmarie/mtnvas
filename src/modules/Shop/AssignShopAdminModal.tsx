import {
	Alert,
	Button,
	createStyles,
	Group,
	Select,
	Stack,
	Text,
	ThemeIcon,
	Title,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconAlertCircle, IconMail, IconPhone, IconShield, IconUser } from '@tabler/icons-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useMemo } from 'react';
import { Modal } from '../../components/Modal';
import useRequest from '../../hooks/useRequest';
import { Shop } from '../Dealer/types';

interface AssignShopAdminModalProps {
	opened: boolean;
	onClose: () => void;
	shop: Shop;
}

interface AssignAdminFormValues {
	adminId: string;
	adminName?: string;
	adminEmail?: string;
	adminMsisdn?: string;
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

	shopInfo: {
		backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
		border: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[2]}`,
		borderRadius: theme.radius.md,
		padding: theme.spacing.md,
		marginBottom: theme.spacing.lg,
	},

	currentAdminInfo: {
		backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
		border: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[2]}`,
		borderRadius: theme.radius.md,
		padding: theme.spacing.md,
		marginBottom: theme.spacing.lg,
	},

	infoRow: {
		display: 'flex',
		alignItems: 'center',
		gap: theme.spacing.xs,
		marginBottom: theme.spacing.xs,
	},
}));

export function AssignShopAdminModal({ opened, onClose, shop }: AssignShopAdminModalProps) {
	const { classes } = useStyles();
	const request = useRequest(true);
	const queryClient = useQueryClient();

	const form = useForm<AssignAdminFormValues>({
		initialValues: {
			adminId: shop.updatedBy || '',
			adminName: shop.updatedBy || '',
			adminEmail: '',
			adminMsisdn: '',
		},
		validate: {
			adminId: (value) => (!value ? 'Admin is required' : null),
		},
	});

	// Fetch dealer admins for assignment
	const { data: dealerAdminsData } = useQuery({
		queryKey: ['dealer-admins', 'all'],
		queryFn: () => request.get('/dealer/admins'),
	});

	const mutation = useMutation({
		mutationFn: (values: AssignAdminFormValues) => {
			return request.post(`/shops/${shop.id}/assign-admin`, {
				adminId: values.adminId,
			});
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['shops'] });
			queryClient.invalidateQueries({ queryKey: ['dealer', shop.dealerId] });
			onClose();
			form.reset();
		},
	});

	const handleSubmit = () => {
		mutation.mutate(form.values);
	};

	const hasErrors = Object.keys(form.errors).length > 0;

	// Prepare admin options
	const adminOptions = useMemo(() => {
		if (!dealerAdminsData?.data?.data) return [];

		return dealerAdminsData.data.data
			.filter((admin: any) => admin.status === 'active')
			.map((admin: any) => ({
				value: admin.id,
				label: `${admin.name} (${admin.email})`,
				admin: admin,
			}));
	}, [dealerAdminsData?.data?.data]);

	const selectedAdmin = adminOptions.find(
		(option: any) => option.value === form.values.adminId
	)?.admin;

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
						<IconShield size={20} />
					</ThemeIcon>
					<div>
						<Title
							order={3}
							size="h4"
						>
							Assign Shop Admin
						</Title>
						<Text
							color="dimmed"
							size="sm"
						>
							Assign an administrator to manage {shop.shopName}
						</Text>
					</div>
				</div>
			</div>

			{/* Form Section */}
			<div className={classes.formSection}>
				{/* Shop Information */}
				<div className={classes.shopInfo}>
					<Text
						size="sm"
						weight={500}
						color="dimmed"
						mb="xs"
					>
						Shop Details
					</Text>
					<Text
						size="sm"
						mb="xs"
					>
						<strong>Shop:</strong> {shop.shopName}
					</Text>
					<Text
						size="sm"
						mb="xs"
					>
						<strong>Dealer:</strong> {shop.dealerName}
					</Text>
					<Text size="sm">
						<strong>Location:</strong> {shop.location}, {shop.region}
					</Text>
				</div>

				{/* Current Admin Information */}
				{shop.updatedBy && (
					<div className={classes.currentAdminInfo}>
						<Text
							size="sm"
							weight={500}
							color="dimmed"
							mb="xs"
						>
							Current Admin
						</Text>
						<Text
							size="sm"
							mb="xs"
						>
							<strong>Name:</strong> {shop.updatedBy}
						</Text>
						<Text size="sm">
							<strong>ID:</strong> {shop.updatedBy}
						</Text>
					</div>
				)}

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
						{/* Admin Selection */}
						<div className={classes.formGroup}>
							<Text
								size="sm"
								weight={500}
								color="dimmed"
								mb="xs"
							>
								Select Administrator
							</Text>
							<div className={classes.inputWrapper}>
								<Select
									label="Admin User"
									placeholder="Select an admin to assign"
									required
									icon={
										<IconShield
											size={16}
											className={classes.inputIcon}
										/>
									}
									data={adminOptions}
									value={form.values.adminId}
									onChange={(value) => form.setFieldValue('adminId', value || '')}
									radius="md"
									searchable
									nothingFound="No admins found"
								/>
							</div>
						</div>

						{/* Selected Admin Details */}
						{selectedAdmin && (
							<div className={classes.currentAdminInfo}>
								<Text
									size="sm"
									weight={500}
									color="dimmed"
									mb="xs"
								>
									Selected Admin Details
								</Text>
								<div className={classes.formRow}>
									<div className={classes.infoRow}>
										<IconUser
											size={14}
											color="gray"
										/>
										<Text size="sm">
											<strong>Name:</strong> {selectedAdmin.name}
										</Text>
									</div>
									<div className={classes.infoRow}>
										<IconMail
											size={14}
											color="gray"
										/>
										<Text size="sm">
											<strong>Email:</strong> {selectedAdmin.email}
										</Text>
									</div>
								</div>
								<div className={classes.infoRow}>
									<IconPhone
										size={14}
										color="gray"
									/>
									<Text size="sm">
										<strong>Phone:</strong> {selectedAdmin.msisdn}
									</Text>
								</div>
								<div className={classes.infoRow}>
									<IconShield
										size={14}
										color="gray"
									/>
									<Text size="sm">
										<strong>Role:</strong>{' '}
										{selectedAdmin.role?.replace('_', ' ')}
									</Text>
								</div>
							</div>
						)}
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
						leftIcon={<IconShield size={16} />}
						className={classes.submitButton}
						radius="md"
						onClick={() => handleSubmit()}
						disabled={!form.values.adminId}
					>
						Assign Admin
					</Button>
				</Group>
			</div>
		</Modal>
	);
}
