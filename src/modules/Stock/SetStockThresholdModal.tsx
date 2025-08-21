import {
	ActionIcon,
	Alert,
	Button,
	createStyles,
	Divider,
	Grid,
	Group,
	NumberInput,
	Paper,
	Stack,
	Switch,
	Text,
	TextInput,
	ThemeIcon,
	Title,
	Tooltip,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import {
	IconAlertCircle,
	IconCheck,
	IconGauge,
	IconInfoCircle,
	IconMail,
	IconMinus,
	IconPhone,
	IconPlus,
	IconSettings,
	IconX,
} from '@tabler/icons-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../app/store';
import { Modal } from '../../components/Modal';
import useRequest from '../../hooks/useRequest';
import { formatPhoneNumber } from '../../utils/phone.util';
import { Stock, StockThresholdRequest } from '../Dealer/types';

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
		background: `linear-gradient(135deg, ${theme.colors.yellow[6]} 0%, ${theme.colors.yellow[7]} 100%)`,

		'&:hover': {
			transform: 'translateY(-1px)',
			boxShadow: theme.shadows.md,
		},
	},

	errorAlert: {
		marginBottom: theme.spacing.md,
	},

	infoCard: {
		backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
		border: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[2]}`,
		borderRadius: theme.radius.md,
		padding: theme.spacing.md,
		marginBottom: theme.spacing.lg,
	},

	thresholdInput: {
		'& input': {
			fontSize: theme.fontSizes.xl,
			fontWeight: 600,
			textAlign: 'center',
		},
	},

	notificationSection: {
		backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0],
		borderRadius: theme.radius.md,
		padding: theme.spacing.md,
		marginTop: theme.spacing.md,
	},

	stockInfoCard: {
		backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0],
		border: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[2]}`,
		borderRadius: theme.radius.md,
		padding: theme.spacing.md,
		marginBottom: theme.spacing.lg,
	},

	stockInfoHeader: {
		display: 'flex',
		alignItems: 'center',
		gap: theme.spacing.sm,
		marginBottom: theme.spacing.sm,
	},

	stockInfoValue: {
		fontSize: theme.fontSizes.lg,
		fontWeight: 600,
		color: theme.colors.yellow[6],
	},

	notificationToggle: {
		'& .mantine-Switch-track': {
			backgroundColor: theme.colors.gray[3],
		},
		'& .mantine-Switch-thumb': {
			borderColor: theme.colors.gray[4],
		},
		'&[data-checked] .mantine-Switch-track': {
			backgroundColor: theme.colors.green[6],
		},
		'&[data-checked] .mantine-Switch-thumb': {
			borderColor: theme.colors.green[6],
		},
	},

	emailToggle: {
		'&[data-checked] .mantine-Switch-track': {
			backgroundColor: theme.colors.yellow[6],
		},
		'&[data-checked] .mantine-Switch-thumb': {
			borderColor: theme.colors.yellow[6],
		},
	},

	smsToggle: {
		'&[data-checked] .mantine-Switch-track': {
			backgroundColor: theme.colors.green[6],
		},
		'&[data-checked] .mantine-Switch-thumb': {
			borderColor: theme.colors.green[6],
		},
	},

	formField: {
		'& .mantine-InputWrapper-label': {
			fontWeight: 600,
			marginBottom: theme.spacing.xs,
		},
	},

	helpText: {
		fontSize: theme.fontSizes.xs,
		color: theme.colors.gray[6],
		marginTop: theme.spacing.xs,
	},

	successMessage: {
		backgroundColor: theme.colors.green[0],
		border: `1px solid ${theme.colors.green[2]}`,
		color: theme.colors.green[7],
	},
}));

interface SetStockThresholdModalProps {
	opened: boolean;
	onClose: () => void;
	stock: Stock | null;
}

export function SetStockThresholdModal({ opened, onClose, stock }: SetStockThresholdModalProps) {
	const { classes } = useStyles();
	const request = useRequest(true);
	const queryClient = useQueryClient();

	const [showSuccess, setShowSuccess] = useState(false);
	const user = useSelector((state: RootState) => state.auth.user);

	const form = useForm<StockThresholdRequest>({
		initialValues: {
			dealerId: stock?.dealerId || 0,
			productId: stock?.productId || 0,
			deviceId: stock?.deviceId || 0,
			threshold: 100,
			emailNotifications: true,
			smsNotifications: false,
			createdBy: user?.email || '',
			notificationEmails: [],
			notificationMsisdns: [],
		},
		validate: {
			threshold: (value) => {
				if (!value) return 'Threshold is required';
				if (value < 1) return 'Threshold must be greater than 0';
				return null;
			},
			notificationEmails: (value, values) => {
				if (values.emailNotifications && (!value || value.length === 0)) {
					return 'At least one email is required when email notifications are enabled';
				}
				return null;
			},
			notificationMsisdns: (value, values) => {
				if (values.smsNotifications && (!value || value.length === 0)) {
					return 'At least one phone number is required when SMS notifications are enabled';
				}
				return null;
			},
		},
	});

	useEffect(() => {
		if (stock) {
			form.setValues({
				dealerId: stock.dealerId,
				productId: stock.productId,
				deviceId: stock.deviceId,
				threshold: 100,
				emailNotifications: true,
				smsNotifications: false,
				createdBy: user?.email || '',
				notificationEmails: [],
				notificationMsisdns: [],
			});
		}
	}, [stock, user?.email]);

	const mutation = useMutation({
		mutationFn: (values: StockThresholdRequest) =>
			request.post('/stock-thresholds', {
				...values,
				notificationEmails: values.notificationEmails?.map((email) => email.trim()),
				notificationMsisdns: values.notificationMsisdns?.map((phone) =>
					formatPhoneNumber(phone)
				),
			}),
		onSuccess: () => {
			setShowSuccess(true);
			queryClient.invalidateQueries({ queryKey: ['stock-thresholds'] });
			setTimeout(() => {
				onClose();
				form.reset();
				setShowSuccess(false);
			}, 2000);
		},
	});

	const handleSubmit = form.onSubmit((values) => mutation.mutate(values));

	const hasErrors = Object.keys(form.errors).length > 0;

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
		form.setFieldValue('notificationMsisdns', [
			...form.values.notificationMsisdns.map((phone: string) => formatPhoneNumber(phone)),
			'',
		]);
	};

	const removeNotificationPhone = (index: number) => {
		form.setFieldValue(
			'notificationMsisdns',
			form.values.notificationMsisdns.filter((_, i) => i !== index)
		);
	};

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
						color="yellow"
					>
						<IconGauge size={20} />
					</ThemeIcon>
					<div>
						<Title
							order={3}
							size="h4"
						>
							Set Stock Threshold
						</Title>
						<Text
							color="dimmed"
							size="sm"
						>
							Configure minimum stock levels and notification preferences
						</Text>
					</div>
				</div>
			</div>

			<div className={classes.formSection}>
				{/* Stock Information Card */}
				<Paper
					className={classes.stockInfoCard}
					shadow="xs"
				>
					<div className={classes.stockInfoHeader}>
						<ThemeIcon
							size="md"
							radius="md"
							variant="light"
							color="yellow"
						>
							<IconInfoCircle size={16} />
						</ThemeIcon>
						<Text
							weight={600}
							size="sm"
						>
							Stock Information
						</Text>
					</div>
					<Grid>
						<Grid.Col span={6}>
							<Text
								size="xs"
								color="dimmed"
								mb={4}
							>
								Dealer
							</Text>
							<Text
								className={classes.stockInfoValue}
								size="sm"
							>
								{stock?.dealerName?.toUpperCase() || 'N/A'}
							</Text>
						</Grid.Col>
						<Grid.Col span={6}>
							<Text
								size="xs"
								color="dimmed"
								mb={4}
							>
								Product
							</Text>
							<Text
								className={classes.stockInfoValue}
								size="sm"
							>
								{stock?.productName?.toUpperCase() || 'N/A'}
							</Text>
						</Grid.Col>
						<Grid.Col span={6}>
							<Text
								size="xs"
								color="dimmed"
								mb={4}
							>
								Device
							</Text>
							<Text
								className={classes.stockInfoValue}
								size="sm"
							>
								{stock?.deviceName?.toUpperCase() || 'N/A'}
							</Text>
						</Grid.Col>
						<Grid.Col span={6}>
							<Text
								size="xs"
								color="dimmed"
								mb={4}
							>
								IMEI
							</Text>
							<Text
								className={classes.stockInfoValue}
								size="sm"
							>
								{stock?.imei || 'N/A'}
							</Text>
						</Grid.Col>
					</Grid>
				</Paper>

				{/* Information Card */}
				<Paper
					className={classes.infoCard}
					shadow="xs"
				>
					<Group
						spacing="xs"
						mb="xs"
					>
						<IconInfoCircle
							size={16}
							color="yellow"
						/>
						<Text
							size="sm"
							weight={500}
							color="dimmed"
						>
							Threshold Configuration
						</Text>
					</Group>
					<Text size="sm">
						Set minimum stock levels to receive alerts when inventory falls below the
						threshold. Configure email and SMS notifications for low stock alerts.
					</Text>
				</Paper>

				{showSuccess && (
					<Alert
						icon={<IconCheck size={16} />}
						title="Threshold Set Successfully!"
						color="green"
						className={classes.successMessage}
					>
						Stock threshold has been configured and notifications are now active.
					</Alert>
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

				<form onSubmit={handleSubmit}>
					<Stack spacing="lg">
						{/* Threshold Configuration */}
						<div className={classes.formGroup}>
							<NumberInput
								label="Stock Threshold"
								placeholder="Enter minimum stock level"
								required
								min={1}
								icon={
									<IconGauge
										size={16}
										className={classes.inputIcon}
									/>
								}
								className={`${classes.thresholdInput} ${classes.formField}`}
								{...form.getInputProps('threshold')}
								radius="md"
								description="Minimum quantity before low stock alert"
								styles={{
									label: { fontWeight: 600, marginBottom: 8 },
									description: { fontSize: '0.75rem', marginTop: 4 },
								}}
							/>
						</div>

						<Divider
							label="Notification Settings"
							labelPosition="center"
						/>

						{/* Email Notifications */}
						<div className={classes.notificationSection}>
							<Group
								position="apart"
								mb="md"
							>
								<Group spacing="xs">
									<IconMail
										size={18}
										color="yellow"
									/>
									<Text
										size="sm"
										weight={500}
									>
										Email Notifications
									</Text>
								</Group>
								<Switch
									{...form.getInputProps('emailNotifications', {
										type: 'checkbox',
									})}
									className={`${classes.notificationToggle} ${classes.emailToggle}`}
									size="md"
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
												color="yellow"
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
													onClick={() => removeNotificationEmail(index)}
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
						</div>

						{/* SMS Notifications */}
						<div className={classes.notificationSection}>
							<Group
								position="apart"
								mb="md"
							>
								<Group spacing="xs">
									<IconPhone
										size={18}
										color="green"
									/>
									<Text
										size="sm"
										weight={500}
									>
										SMS Notifications
									</Text>
								</Group>
								<Switch
									{...form.getInputProps('smsNotifications', {
										type: 'checkbox',
									})}
									className={`${classes.notificationToggle} ${classes.smsToggle}`}
									size="md"
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

									{form.values.notificationMsisdns.map((phone, index) => (
										<Group
											key={index}
											spacing="xs"
										>
											<TextInput
												placeholder="Enter phone number"
												value={phone}
												onChange={(e) => {
													const newPhones = [
														...form.values.notificationMsisdns,
													];
													newPhones[index] = e.currentTarget.value;
													form.setFieldValue(
														'notificationMsisdns',
														newPhones
													);
												}}
												style={{ flex: 1 }}
												radius="sm"
												error={form.errors.notificationMsisdns}
											/>
											<Tooltip label="Remove phone number">
												<ActionIcon
													size="sm"
													variant="light"
													color="red"
													onClick={() => removeNotificationPhone(index)}
												>
													<IconMinus size={14} />
												</ActionIcon>
											</Tooltip>
										</Group>
									))}
									{form.errors.notificationMsisdns && (
										<Text
											size="xs"
											color="red"
										>
											{form.errors.notificationMsisdns}
										</Text>
									)}
								</Stack>
							)}
						</div>

						{/* Help Text */}
						<Paper
							p="xs"
							bg="yellow.0"
							radius="sm"
						>
							<Text
								size="xs"
								color="yellow.7"
							>
								<IconInfoCircle
									size={12}
									style={{ marginRight: 6, verticalAlign: 'middle' }}
								/>
								You'll receive notifications when stock levels fall below the
								threshold. Make sure to add at least one contact method for each
								notification type you enable.
							</Text>
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
						radius="md"
						leftIcon={<IconX size={16} />}
					>
						Cancel
					</Button>
					<Button
						type="submit"
						loading={mutation.isLoading}
						leftIcon={<IconSettings size={16} />}
						className={classes.submitButton}
						radius="md"
						onClick={() => handleSubmit()}
						disabled={hasErrors}
					>
						{mutation.isLoading ? 'Setting Threshold...' : 'Set Threshold'}
					</Button>
				</Group>
			</div>
		</Modal>
	);
}
