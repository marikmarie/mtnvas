import {
	Alert,
	Button,
	createStyles,
	Group,
	Select,
	Stack,
	Text,
	Textarea,
	ThemeIcon,
	Title,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconAlertCircle, IconCheck, IconShield, IconX } from '@tabler/icons-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Modal } from '../../components/Modal';
import useRequest from '../../hooks/useRequest';
import { Shop } from '../Dealer/types';

interface ShopApprovalModalProps {
	opened: boolean;
	onClose: () => void;
	shop: Shop;
	action: 'Approve' | 'Reject';
}

interface ApprovalFormValues {
	reason?: string;
	assignToAdminId?: string;
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

	inputWrapper: {
		position: 'relative',
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

	approvalInfo: {
		backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
		border: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[2]}`,
		borderRadius: theme.radius.md,
		padding: theme.spacing.md,
		marginBottom: theme.spacing.lg,
	},
}));

export function ShopApprovalModal({ opened, onClose, shop, action }: ShopApprovalModalProps) {
	const { classes } = useStyles();
	const request = useRequest(true);
	const queryClient = useQueryClient();

	const form = useForm<ApprovalFormValues>({
		initialValues: {
			reason: '',
			assignToAdminId: '',
		},
		validate: {
			reason: (value) => {
				if (action === 'Reject' && !value) {
					return 'Reason is required for rejection';
				}
				return null;
			},
		},
	});

	const { data: dealerAdminsData } = useQuery({
		queryKey: ['dealer-admins', shop.dealerId],
		queryFn: () => request.get(`/dealer/${shop.dealerId}/admins`),
		enabled: action === 'Approve' && !!shop.dealerId,
	});

	const mutation = useMutation({
		mutationFn: (values: ApprovalFormValues) => {
			return request.post(
				`/shops/${shop.id}/approval?action=${action}&reason=${values.reason}&assignToAdminId=${values.assignToAdminId}`
			);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['shops'] });
			onClose();
			form.reset();
		},
	});

	const handleSubmit = () => {
		mutation.mutate(form.values);
	};

	const hasErrors = Object.keys(form.errors).length > 0;

	const adminOptions =
		dealerAdminsData?.data?.data
			?.filter((admin: any) => admin.status === 'active')
			?.map((admin: any) => ({
				value: admin.id,
				label: `${admin.name} (${admin.email})`,
			})) || [];

	const isApproval = action === 'Approve';
	const actionColor = isApproval ? 'green' : 'red';
	const actionIcon = isApproval ? <IconCheck size={20} /> : <IconX size={20} />;
	const actionTitle = isApproval ? 'Approve Shop' : 'Reject Shop';
	const actionDescription = isApproval
		? `Approve ${shop.shopName} and optionally assign an admin`
		: `Reject ${shop.shopName} with a reason`;

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
						color={actionColor}
					>
						{actionIcon}
					</ThemeIcon>
					<div>
						<Title
							order={3}
							size="h4"
						>
							{actionTitle}
						</Title>
						<Text
							color="dimmed"
							size="sm"
						>
							{actionDescription}
						</Text>
					</div>
				</div>
			</div>

			<div className={classes.formSection}>
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

				<div className={classes.approvalInfo}>
					<Text
						size="sm"
						weight={500}
						color="dimmed"
						mb="xs"
					>
						{action === 'Approve' ? 'Approval Details' : 'Rejection Details'}
					</Text>
					<Text
						size="sm"
						mb="xs"
					>
						<strong>Action:</strong> {action === 'Approve' ? 'Approve' : 'Reject'}
					</Text>
					<Text size="sm">
						<strong>Status:</strong> {shop.status?.replace('_', ' ')}
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

				<form onSubmit={form.onSubmit(handleSubmit)}>
					<Stack spacing="lg">
						{action === 'Reject' && (
							<div className={classes.formGroup}>
								<Text
									size="sm"
									weight={500}
									color="dimmed"
									mb="xs"
								>
									Rejection Reason
								</Text>
								<div className={classes.inputWrapper}>
									<Textarea
										label="Reason for rejection"
										placeholder="Please provide a reason for rejecting this shop"
										required
										minRows={3}
										{...form.getInputProps('reason')}
										radius="md"
									/>
								</div>
							</div>
						)}

						{action === 'Approve' && (
							<div className={classes.formGroup}>
								<Text
									size="sm"
									weight={500}
									color="dimmed"
									mb="xs"
								>
									Admin Assignment (Optional)
								</Text>
								<Text
									size="xs"
									color="dimmed"
									mb="xs"
								>
									You can optionally assign an admin to this shop during approval
								</Text>
								<div className={classes.inputWrapper}>
									<Select
										label="Assign Admin"
										placeholder="Select an admin to assign (optional)"
										icon={<IconShield size={16} />}
										data={adminOptions}
										value={form.values.assignToAdminId}
										onChange={(value) =>
											form.setFieldValue('assignToAdminId', value || '')
										}
										radius="md"
										searchable
										clearable
										nothingFound="No admins found"
									/>
								</div>
							</div>
						)}
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
						leftIcon={actionIcon}
						className={classes.submitButton}
						radius="md"
						onClick={() => handleSubmit()}
						color={actionColor}
					>
						{action === 'Approve' ? 'Approve Shop' : 'Reject Shop'}
					</Button>
				</Group>
			</div>
		</Modal>
	);
}
