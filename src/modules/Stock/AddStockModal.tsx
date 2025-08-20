import {
	Alert,
	Button,
	createStyles,
	FileInput,
	Group,
	MultiSelect,
	Paper,
	Select,
	Stack,
	Switch,
	Text,
	ThemeIcon,
	Title,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import {
	IconAlertCircle,
	IconBox,
	IconBuilding,
	IconCategory,
	IconDeviceMobile,
	IconMail,
	IconPhone,
	IconPlus,
	IconUpload,
} from '@tabler/icons-react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { Modal } from '../../components/Modal';
import useRequest from '../../hooks/useRequest';
import { formatPhoneNumber } from '../../utils/phone.util';
import { Dealer, Device, Product } from '../Dealer/types';

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

	infoCard: {
		backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
		border: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[2]}`,
		borderRadius: theme.radius.md,
		padding: theme.spacing.md,
		marginBottom: theme.spacing.lg,
	},

	fileInput: {
		border: `2px dashed ${theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[3]}`,
		borderRadius: theme.radius.md,
		padding: theme.spacing.lg,
		textAlign: 'center',
		transition: 'all 0.2s ease',

		'&:hover': {
			borderColor: theme.colors.yellow[4],
			backgroundColor:
				theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.yellow[0],
		},
	},

	notificationSection: {
		backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0],
		borderRadius: theme.radius.md,
		padding: theme.spacing.md,
		marginTop: theme.spacing.md,
	},
}));

interface AddStockModalProps {
	opened: boolean;
	onClose: () => void;
}

interface StockFormValues {
	dealerId: string;
	category: 'wakanet' | 'enterprise' | 'both';
	productId: string;
	deviceId: string;
	imeiFile: File | null;
	emailNotifications: boolean;
	smsNotifications: boolean;
	notificationEmails: string[];
	notificationMsisdns: string[];
}

export function AddStockModal({ opened, onClose }: AddStockModalProps) {
	const { classes } = useStyles();
	const request = useRequest(true);

	const { data: dealers } = useQuery({
		queryKey: ['dealer'],
		queryFn: () => request.get('/dealer'),
	});

	const { data: products } = useQuery({
		queryKey: ['products'],
		queryFn: () => request.get('/lookups/products'),
	});

	const { data: devices } = useQuery({
		queryKey: ['devices'],
		queryFn: () => request.get('/lookups/devices'),
	});

	// Transform data for Select components
	const dealerOptions = useMemo(() => {
		if (!dealers?.data?.data) return [];
		return dealers.data.data.map((dealer: Dealer) => ({
			value: dealer.id?.toString() || '',
			label: dealer.dealerName.toUpperCase() || 'Unknown Dealer',
		}));
	}, [dealers?.data?.data]);

	const productOptions = useMemo(() => {
		if (!products?.data?.data) return [];
		return products.data.data.map((product: Product) => ({
			value: product.id?.toString() || '',
			label: product.productName.toUpperCase() || 'Unknown Product',
		}));
	}, [products?.data?.data]);

	const deviceOptions = useMemo(() => {
		if (!devices?.data?.data) return [];
		return devices.data.data.map((device: Device) => ({
			value: device.id?.toString() || '',
			label: device.deviceName.toUpperCase() || 'Unknown Device',
		}));
	}, [devices?.data?.data]);

	const form = useForm<StockFormValues>({
		initialValues: {
			dealerId: '',
			category: 'wakanet',
			productId: '',
			deviceId: '',
			imeiFile: null,
			emailNotifications: true,
			smsNotifications: false,
			notificationEmails: [],
			notificationMsisdns: [],
		},
		validate: {
			dealerId: (value) => (!value ? 'Dealer is required' : null),
			category: (value) => (!value ? 'Category is required' : null),
			productId: (value) => (!value ? 'Product is required' : null),
			deviceId: (value) => (!value ? 'Device is required' : null),
			imeiFile: (value) => (!value ? 'IMEI file is required' : null),
		},
	});

	const mutation = useMutation({
		mutationFn: (formData: FormData) =>
			request.post('/stock/upload', formData, {
				headers: {
					'Content-Type': 'multipart/form-data',
				},
			}),
		onSuccess: () => {
			onClose();
			form.reset();
		},
	});

	const handleSubmit = form.onSubmit((values: StockFormValues) => {
		const formData = new FormData();
		formData.append('DealerId', values.dealerId);
		formData.append('ProductId', values.productId);
		formData.append('DeviceId', values.deviceId);
		if (values.imeiFile) {
			formData.append('ImeiFile', values.imeiFile);
		}

		// Add notification settings if enabled
		if (values.emailNotifications) {
			formData.append('emailNotifications', 'true');
			if (values.notificationEmails.length > 0) {
				formData.append(
					'notificationEmails',
					JSON.stringify(values.notificationEmails.map(formatPhoneNumber))
				);
			}
		}

		if (values.smsNotifications) {
			formData.append('smsNotifications', 'true');
			if (values.notificationMsisdns.length > 0) {
				formData.append(
					'notificationMsisdns',
					JSON.stringify(values.notificationMsisdns.map(formatPhoneNumber))
				);
			}
		}

		mutation.mutate(formData);
	});

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
						color="orange"
					>
						<IconPlus size={20} />
					</ThemeIcon>
					<div>
						<Title
							order={3}
							size="h4"
						>
							Add Stock
						</Title>
						<Text
							color="dimmed"
							size="sm"
						>
							Add new inventory items with IMEI data
						</Text>
					</div>
				</div>
			</div>

			{/* Form Section */}
			<div className={classes.formSection}>
				{/* Information Card */}
				<Paper
					className={classes.infoCard}
					shadow="xs"
				>
					<Text
						size="sm"
						weight={500}
						color="dimmed"
						mb="xs"
					>
						Stock Information
					</Text>
					<Text size="sm">
						Upload IMEI data to add new stock items. Supported formats: CSV, XLSX, XLS.
						The file should contain one IMEI or serial number per row.
					</Text>
				</Paper>

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
						{/* Dealer and Category Selection */}
						<div className={classes.formGroup}>
							<Text
								size="sm"
								weight={500}
								color="dimmed"
								mb="xs"
							>
								Dealer Assignment
							</Text>
							<div className={classes.formRow}>
								<div className={classes.inputWrapper}>
									<Select
										label="Dealer"
										placeholder="Select dealer"
										required
										icon={
											<IconBuilding
												size={16}
												className={classes.inputIcon}
											/>
										}
										data={dealerOptions}
										searchable
										nothingFound="No dealers found"
										{...form.getInputProps('dealerId')}
										radius="md"
									/>
								</div>
								<div className={classes.inputWrapper}>
									<Select
										label="Category"
										placeholder="Select category"
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
										{...form.getInputProps('category')}
										radius="md"
									/>
								</div>
							</div>
						</div>

						{/* Product and Device Selection */}
						<div className={classes.formGroup}>
							<Text
								size="sm"
								weight={500}
								color="dimmed"
								mb="xs"
							>
								Product Details
							</Text>
							<div className={classes.formRow}>
								<div className={classes.inputWrapper}>
									<Select
										label="Product"
										placeholder="Select product"
										required
										icon={
											<IconBox
												size={16}
												className={classes.inputIcon}
											/>
										}
										data={productOptions}
										searchable
										nothingFound="No products found"
										disabled={!form.values.category}
										{...form.getInputProps('productId')}
										radius="md"
									/>
								</div>
								<div className={classes.inputWrapper}>
									<Select
										label="Device"
										placeholder="Select device"
										required
										icon={
											<IconDeviceMobile
												size={16}
												className={classes.inputIcon}
											/>
										}
										data={deviceOptions}
										searchable
										nothingFound="No devices found"
										disabled={!form.values.category}
										{...form.getInputProps('deviceId')}
										radius="md"
									/>
								</div>
							</div>
						</div>

						{/* File Upload */}
						<div className={classes.formGroup}>
							<Text
								size="sm"
								weight={500}
								color="dimmed"
								mb="xs"
							>
								IMEI Data Upload
							</Text>
							<div className={classes.inputWrapper}>
								<FileInput
									label="IMEI File"
									description="Upload IMEI file (CSV, XLSX, XLS) - one IMEI per row"
									accept=".csv,.xlsx,.xls"
									required
									icon={
										<IconUpload
											size={16}
											className={classes.inputIcon}
										/>
									}
									// @ts-ignore
									placeholder="Click to upload the IMEI file"
									className={classes.fileInput}
									{...form.getInputProps('imeiFile')}
									radius="md"
								/>
							</div>
						</div>

						{/* Notification Settings */}
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
									<MultiSelect
										label="Notification Emails"
										placeholder="Add email addresses for notifications"
										icon={<IconMail size={16} />}
										data={form.values.notificationEmails}
										searchable
										creatable
										getCreateLabel={(query) => `+ Add ${query}`}
										onCreate={(query) => {
											const item = { value: query, label: query };
											form.setFieldValue('notificationEmails', [
												...form.values.notificationEmails,
												query,
											]);
											return item;
										}}
										{...form.getInputProps('notificationEmails')}
										radius="md"
									/>
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
									<MultiSelect
										label="Notification Phone Numbers"
										placeholder="Add phone numbers for SMS notifications"
										icon={<IconPhone size={16} />}
										data={form.values.notificationMsisdns}
										searchable
										creatable
										getCreateLabel={(query) => `+ Add ${query}`}
										onCreate={(query) => {
											const item = { value: query, label: query };
											form.setFieldValue('notificationMsisdns', [
												...form.values.notificationMsisdns,
												query,
											]);
											return item;
										}}
										{...form.getInputProps('notificationMsisdns')}
										radius="md"
									/>
								)}
							</Stack>
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
						Add Stock
					</Button>
				</Group>
			</div>
		</Modal>
	);
}
