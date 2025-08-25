import {
	ActionIcon,
	Badge,
	Button,
	createStyles,
	Flex,
	Group,
	NumberInput,
	Stack,
	Switch,
	Text,
	TextInput,
	ThemeIcon,
	Title,
	Tooltip,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';
import {
	IconAlertTriangle,
	IconBuilding,
	IconEdit,
	IconGauge,
	IconMail,
	IconMinus,
	IconPhone,
	IconPlus,
	IconSettings,
	IconTrash,
} from '@tabler/icons-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { Modal } from '../../components/Modal';
import { useDataGridTable } from '../../hooks/useDataGridTable';
import useRequest from '../../hooks/useRequest';
import { StockThresholdResponse, StockThresholdUpdateRequest } from '../Dealer/types';

const useStyles = createStyles((theme) => ({
	root: {
		padding: 0,
	},

	header: {
		marginBottom: theme.spacing.lg,
	},

	thresholdValue: {
		fontSize: theme.fontSizes.xl,
		fontWeight: 700,
		color: theme.colors.blue[6],
	},

	notificationIcon: {
		color: theme.colors.green[6],
	},

	formSection: {
		marginBottom: theme.spacing.lg,
	},

	formGroup: {
		marginBottom: theme.spacing.md,
	},

	notificationSection: {
		backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0],
		borderRadius: theme.radius.md,
		padding: theme.spacing.md,
		marginTop: theme.spacing.md,
	},

	statusBadge: {
		fontWeight: 600,
	},

	emptyState: {
		textAlign: 'center',
		padding: theme.spacing.xl,
		color: theme.colorScheme === 'dark' ? theme.colors.dark[2] : theme.colors.gray[6],
	},

	tableContainer: {
		overflowX: 'auto',
		width: '100%',
	},

	imeiText: {
		fontFamily: 'monospace',
		fontSize: '0.875rem',
		fontWeight: 600,
	},
}));

interface StockThresholdsListProps {
	opened: boolean;
	onClose: () => void;
}

export function StockThresholdsList({ opened, onClose }: StockThresholdsListProps) {
	const { classes } = useStyles();
	const request = useRequest(true);
	const queryClient = useQueryClient();

	const [editingThreshold, setEditingThreshold] = useState<StockThresholdResponse | null>(null);
	const [editModalOpened, { open: openEditModal, close: closeEditModal }] = useDisclosure(false);

	const { data: thresholdsData, isLoading } = useQuery<{
		data: { data: StockThresholdResponse[] };
	}>({
		queryKey: ['stock-thresholds'],
		queryFn: () => request.get('/stock-thresholds'),
	});

	const updateMutation = useMutation({
		mutationFn: (values: { id: number; data: StockThresholdUpdateRequest }) =>
			request.put(`/stock-thresholds/${values.id}`, values.data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['stock-thresholds'] });
			closeEditModal();
			setEditingThreshold(null);
		},
	});

	const deleteMutation = useMutation({
		mutationFn: (id: number) => request.delete(`/stock-thresholds/${id}`),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['stock-thresholds'] });
		},
	});

	const form = useForm<StockThresholdUpdateRequest>({
		initialValues: {
			threshold: 0,
			emailNotifications: false,
			smsNotifications: false,
			notificationEmails: [],
			notificationMsisdns: [],
		},
		validate: {
			threshold: (value) => {
				if (!value) return 'Threshold is required';
				if (value < 1) return 'Threshold must be greater than 0';
				return null;
			},
		},
	});

	const handleEdit = (threshold: StockThresholdResponse) => {
		setEditingThreshold(threshold);
		form.setValues({
			threshold: threshold.threshold,
			emailNotifications: threshold.emailNotifications,
			smsNotifications: threshold.smsNotifications,
			notificationEmails: [],
			notificationMsisdns: [],
		});
		openEditModal();
	};

	const handleUpdate = form.onSubmit((values) => {
		if (editingThreshold) {
			updateMutation.mutate({
				id: editingThreshold.id,
				data: values,
			});
		}
	});

	const handleDelete = (id: number) => {
		if (confirm('Are you sure you want to delete this threshold?')) {
			deleteMutation.mutate(id);
		}
	};

	const addNotificationEmail = () => {
		form.setFieldValue('notificationEmails', [...form.values.notificationEmails, '']);
	};

	const removeNotificationEmail = (index: number) => {
		form.setFieldValue(
			'notificationEmails',
			form.values.notificationEmails.filter((_, i) => i !== index)
		);
	};

	const addNotificationPhone = () => {
		form.setFieldValue('notificationMsisdns', [...form.values.notificationMsisdns, '']);
	};

	const thresholds = thresholdsData?.data?.data || [];

	const columns = [
		{
			name: 'productDevice',
			header: 'Product - Device',
			defaultFlex: 1,
			minWidth: 200,
			render: ({ data }: { data: StockThresholdResponse }) => (
				<Group spacing="xs">
					<ThemeIcon
						size="md"
						radius="md"
						variant="light"
						color="blue"
					>
						<IconGauge size={16} />
					</ThemeIcon>
					<Text
						weight={600}
						size="sm"
					>
						{data.productName?.toUpperCase() || 'Product'} -{' '}
						{data.deviceName?.toUpperCase() || 'Device'}
					</Text>
				</Group>
			),
		},
		{
			name: 'dealer',
			header: 'Dealer',
			defaultFlex: 1,
			minWidth: 150,
			render: ({ data }: { data: StockThresholdResponse }) => (
				<Group spacing="xs">
					<IconBuilding
						size={14}
						color="gray"
					/>
					<Text size="sm">{data.dealerName?.toUpperCase() || 'Unknown Dealer'}</Text>
				</Group>
			),
		},
		{
			name: 'threshold',
			header: 'Threshold',
			defaultFlex: 1,
			minWidth: 100,
			render: ({ data }: { data: StockThresholdResponse }) => (
				<Text className={classes.thresholdValue}>{data.threshold}</Text>
			),
		},
		{
			name: 'currentStock',
			header: 'Current Stock',
			defaultFlex: 1,
			minWidth: 120,
			render: ({ data }: { data: StockThresholdResponse }) => (
				<Text className={classes.thresholdValue}>{data.currentStock}</Text>
			),
		},
		{
			name: 'status',
			header: 'Status',
			defaultFlex: 1,
			minWidth: 120,
			render: ({ data }: { data: StockThresholdResponse }) => (
				<Badge
					color={data.emailNotifications || data.smsNotifications ? 'green' : 'gray'}
					size="sm"
					leftSection={
						data.emailNotifications || data.smsNotifications ? (
							<IconAlertTriangle size={12} />
						) : (
							<IconSettings size={12} />
						)
					}
				>
					{data.emailNotifications || data.smsNotifications ? 'Active' : 'Inactive'}
				</Badge>
			),
		},
		{
			name: 'notifications',
			header: 'Notifications',
			defaultFlex: 1,
			minWidth: 120,
			render: ({ data }: { data: StockThresholdResponse }) => (
				<Group spacing="xs">
					{data.emailNotifications && (
						<Tooltip
							label="Email Notifications enabled"
							position="top"
							withArrow
						>
							<ThemeIcon
								radius="xl"
								variant="light"
								color="blue"
							>
								<IconMail size={12} />
							</ThemeIcon>
						</Tooltip>
					)}
					{data.smsNotifications && (
						<Tooltip
							label="SMS Notifications enabled"
							position="top"
							withArrow
						>
							<ThemeIcon
								radius="xl"
								variant="light"
								color="green"
							>
								<IconPhone size={12} />
							</ThemeIcon>
						</Tooltip>
					)}
				</Group>
			),
		},
		{
			name: 'createdBy',
			header: 'Created By',
			defaultFlex: 1,
			minWidth: 150,
			render: ({ data }: { data: StockThresholdResponse }) => (
				<Text
					size="sm"
					color="dimmed"
				>
					{data.setBy || 'N/A'}
				</Text>
			),
		},
		{
			name: 'lastNotified',
			header: 'Last Notified',
			defaultFlex: 1,
			minWidth: 120,
			render: ({ data }: { data: StockThresholdResponse }) => (
				<Text
					size="sm"
					color="dimmed"
				>
					{data.lastNotifiedAt
						? new Date(data.lastNotifiedAt).toLocaleDateString()
						: 'Never'}
				</Text>
			),
		},
		{
			name: 'actions',
			header: 'Actions',
			defaultFlex: 1,
			minWidth: 100,
			render: ({ data }: { data: StockThresholdResponse }) => (
				<Flex
					gap={10}
					justify="center"
				>
					<ActionIcon
						variant="subtle"
						size="xs"
						color="blue"
						onClick={() => handleEdit(data)}
					>
						<IconEdit size={16} />
					</ActionIcon>
					<ActionIcon
						variant="subtle"
						size="xs"
						color="red"
						onClick={() => handleDelete(data.id)}
					>
						<IconTrash size={16} />
					</ActionIcon>
				</Flex>
			),
		},
	];

	const thresholdsTable = useDataGridTable<StockThresholdResponse>({
		columns,
		data: thresholds,
		loading: isLoading,
		mih: '50vh',
	});

	return (
		<Modal
			opened={opened}
			close={onClose}
			size="xl"
		>
			<div className={classes.root}>
				<div className={classes.header}>
					<Title
						order={3}
						mb="xs"
					>
						Stock Thresholds
					</Title>
					<Text
						color="dimmed"
						size="sm"
					>
						Manage inventory thresholds and notification settings
					</Text>
				</div>

				{thresholds.length === 0 && !isLoading ? (
					<div className={classes.emptyState}>
						<IconSettings
							size={48}
							color="gray"
						/>
						<Text
							size="lg"
							mt="md"
						>
							No thresholds configured
						</Text>
						<Text
							size="sm"
							color="dimmed"
						>
							Set up stock thresholds to receive low stock alerts
						</Text>
					</div>
				) : (
					<div className={classes.tableContainer}>{thresholdsTable}</div>
				)}
			</div>

			<Modal
				opened={editModalOpened}
				close={closeEditModal}
				size="lg"
			>
				<form onSubmit={handleUpdate}>
					<Stack spacing="lg">
						<div className={classes.formGroup}>
							<Text
								size="sm"
								weight={500}
								color="dimmed"
								mb="xs"
							>
								Product Details
							</Text>
							<Text size="sm">
								{editingThreshold?.productName?.toUpperCase() || 'Unknown Product'}{' '}
								- {editingThreshold?.deviceName?.toUpperCase() || 'Unknown Device'}
							</Text>
						</div>

						<div className={classes.formGroup}>
							<Text
								size="sm"
								weight={500}
								color="dimmed"
								mb="xs"
							>
								Dealer
							</Text>
							<Text size="sm">
								{editingThreshold?.dealerName?.toUpperCase() || 'Unknown Dealer'}
							</Text>
						</div>

						<div className={classes.formGroup}>
							<NumberInput
								label="Stock Threshold"
								placeholder="Enter minimum stock level"
								required
								min={1}
								icon={<IconGauge size={16} />}
								{...form.getInputProps('threshold')}
								radius="md"
								description="Minimum quantity before low stock alert"
							/>
						</div>

						<div className={classes.notificationSection}>
							<Text
								size="sm"
								weight={500}
								color="dimmed"
								mb="xs"
							>
								Notification Settings
							</Text>
							<Stack spacing="md">
								<Group position="apart">
									<Text size="sm">Email Notifications</Text>
									<Switch
										{...form.getInputProps('emailNotifications', {
											type: 'checkbox',
										})}
									/>
								</Group>

								{form.values.emailNotifications && (
									<Stack spacing="sm">
										<Group position="apart">
											<Text
												size="xs"
												color="dimmed"
											>
												Notification Emails
											</Text>
											<Tooltip label="Add email address">
												<ActionIcon
													size="sm"
													variant="light"
													color="blue"
													onClick={addNotificationEmail}
												>
													<IconPlus size={14} />
												</ActionIcon>
											</Tooltip>
										</Group>

										{form.values.notificationEmails.map((email, index) => (
											<Group
												key={index}
												spacing="xs"
											>
												<TextInput
													placeholder="Enter email address"
													value={email}
													onChange={(e) => {
														const newEmails = [
															...form.values.notificationEmails,
														];
														newEmails[index] = e.currentTarget.value;
														form.setFieldValue(
															'notificationEmails',
															newEmails
														);
													}}
													style={{ flex: 1 }}
													radius="sm"
													error={form.errors.notificationEmails}
												/>
												<Tooltip label="Remove email">
													<ActionIcon
														size="sm"
														variant="light"
														color="red"
														onClick={() =>
															removeNotificationEmail(index)
														}
													>
														<IconMinus size={14} />
													</ActionIcon>
												</Tooltip>
											</Group>
										))}
										{form.errors.notificationEmails && (
											<Text
												size="xs"
												color="red"
											>
												{form.errors.notificationEmails}
											</Text>
										)}
									</Stack>
								)}

								<Group position="apart">
									<Text size="sm">SMS Notifications</Text>
									<Switch
										{...form.getInputProps('smsNotifications', {
											type: 'checkbox',
										})}
									/>
								</Group>

								{form.values.smsNotifications && (
									<Stack spacing="sm">
										<Group position="apart">
											<Text
												size="xs"
												color="dimmed"
											>
												Notification Phone Numbers
											</Text>
											<Tooltip label="Add phone number">
												<ActionIcon
													size="sm"
													variant="light"
													color="green"
													onClick={addNotificationPhone}
												>
													<IconPlus size={14} />
												</ActionIcon>
											</Tooltip>
										</Group>
									</Stack>
								)}
							</Stack>
						</div>

						<Group
							position="right"
							spacing="md"
						>
							<Button
								variant="subtle"
								onClick={closeEditModal}
								radius="md"
							>
								Cancel
							</Button>
							<Button
								type="submit"
								loading={updateMutation.isLoading}
								leftIcon={<IconEdit size={16} />}
								radius="md"
							>
								Update Threshold
							</Button>
						</Group>
					</Stack>
				</form>
			</Modal>
		</Modal>
	);
}
