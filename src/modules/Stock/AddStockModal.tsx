import {
	Alert,
	Button,
	createStyles,
	FileInput,
	Group,
	MultiSelect,
	Paper,
	Progress,
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
	IconCheck,
	IconDeviceMobile,
	IconMail,
	IconPhone,
	IconPlus,
	IconUpload,
} from '@tabler/icons-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
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
	successAlert: {
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
	uploadProgress: {
		marginTop: theme.spacing.md,
	},
}));

interface AddStockModalProps {
	opened: boolean;
	onClose: () => void;
	onSuccess?: () => void;
}

interface StockFormValues {
	dealerId: string;
	productId: string;
	deviceId: string;
	imeiFile: File | null;
	emailNotifications: boolean;
	smsNotifications: boolean;
	notificationEmails: string[];
	notificationMsisdns: string[];
}

interface StockUploadResponse {
	success: boolean;
	message: string;
	data?: {
		uploadedCount: number;
		totalCount: number;
		errors?: string[];
	};
}

export function AddStockModal({ opened, onClose, onSuccess }: AddStockModalProps) {
	const { classes } = useStyles();
	const request = useRequest(true);
	const queryClient = useQueryClient();
	const [uploadProgress, setUploadProgress] = useState(0);
	const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);

	const { data: dealers, isLoading: dealersLoading } = useQuery({
		queryKey: ['dealer'],
		queryFn: () => request.get('/dealer'),
		staleTime: 5 * 60 * 1000,
	});

	const { data: products, isLoading: productsLoading } = useQuery({
		queryKey: ['products'],
		queryFn: () => request.get('/shops'),
		staleTime: 5 * 60 * 1000,
	});

	const { data: devices, isLoading: devicesLoading } = useQuery({
		queryKey: ['devices'],
		queryFn: () => request.get('/lookups/devices'),
		staleTime: 5 * 60 * 1000,
	});

	const dealerOptions = useMemo(() => {
		if (!dealers?.data?.data) return [];
		return dealers.data.data.map((dealer: Dealer) => ({
			value: dealer.id?.toString() || '',
			label: dealer.dealerName?.toUpperCase() || 'Unknown Dealer',
		}));
	}, [dealers?.data?.data]);

	const productOptions = useMemo(() => {
		if (!products?.data?.data) return [];
		return products.data.data.map((product: Product) => ({
			value: product.id?.toString() || '',
			label: product.productName?.toUpperCase() || 'Unknown Product',
		}));
	}, [products?.data?.data]);

	const deviceOptions = useMemo(() => {
		if (!devices?.data?.data) return [];
		return devices.data.data.map((device: Device) => ({
			value: device.id?.toString() || '',
			label: device.deviceName?.toUpperCase() || 'Unknown Device',
		}));
	}, [devices?.data?.data]);

	const form = useForm<StockFormValues>({
		initialValues: {
			dealerId: '',
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
			productId: (value) => (!value ? 'Product is required' : null),
			deviceId: (value) => (!value ? 'Device is required' : null),
			imeiFile: (value) => {
				if (!value) return 'IMEI file is required';

				const allowedTypes = [
					'text/csv',
					'application/vnd.ms-excel',
					'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
				];

				if (!allowedTypes.includes(value.type)) {
					return 'File must be CSV, XLS, or XLSX format';
				}

				if (value.size > 10 * 1024 * 1024) {
					return 'File size must be less than 10MB';
				}

				return null;
			},
			notificationEmails: (value, values) => {
				if (values.emailNotifications && value.length === 0) {
					return 'At least one email is required when email notifications are enabled';
				}

				const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
				for (const email of value) {
					if (!emailRegex.test(email)) {
						return `Invalid email format: ${email}`;
					}
				}

				return null;
			},
			notificationMsisdns: (value, values) => {
				if (values.smsNotifications && value.length === 0) {
					return 'At least one phone number is required when SMS notifications are enabled';
				}

				const phoneRegex = /^\+?[\d\s\-\(\)]{10,15}$/;
				for (const phone of value) {
					if (!phoneRegex.test(phone)) {
						return `Invalid phone format: ${phone}`;
					}
				}

				return null;
			},
		},
	});

	const mutation = useMutation({
		mutationFn: (formData: FormData) => {
			setUploadProgress(0);

			return request.post('/stock/upload', formData, {
				headers: {
					'Content-Type': 'multipart/form-data',
				},
				onUploadProgress: (progressEvent) => {
					if (progressEvent.total) {
						const progress = (progressEvent.loaded / progressEvent.total) * 100;
						setUploadProgress(Math.round(progress));
					}
				},
			});
		},
		onSuccess: (response) => {
			const data: StockUploadResponse = response.data;

			if (data.success) {
				setUploadSuccess(
					`Successfully uploaded ${data.data?.uploadedCount || 0} items out of ${data.data?.totalCount || 0}`
				);

				queryClient.invalidateQueries(['stock']);
				queryClient.invalidateQueries(['inventory']);

				onSuccess?.();

				setTimeout(() => {
					handleClose();
				}, 2000);
			}
		},
		onError: (error: any) => {
			console.error('Stock upload failed:', error);
			setUploadProgress(0);
		},
	});

	const handleSubmit = form.onSubmit((values: StockFormValues) => {
		setUploadSuccess(null);

		const formData = new FormData();

		formData.append('DealerId', values.dealerId);
		formData.append('ProductId', values.productId);
		formData.append('DeviceId', values.deviceId);

		if (values.imeiFile) {
			formData.append('ImeiFile', values.imeiFile);
		}

		if (values.emailNotifications && values.notificationEmails.length > 0) {
			formData.append('emailNotifications', 'true');
			formData.append('notificationEmails', JSON.stringify(values.notificationEmails));
		}

		if (values.smsNotifications && values.notificationMsisdns.length > 0) {
			formData.append('smsNotifications', 'true');
			formData.append(
				'notificationMsisdns',
				JSON.stringify(values.notificationMsisdns.map(formatPhoneNumber))
			);
		}

		mutation.mutate(formData);
	});

	const handleClose = () => {
		form.reset();
		setUploadProgress(0);
		setUploadSuccess(null);
		onClose();
	};

	const hasErrors = Object.keys(form.errors).length > 0;
	const isLoading = mutation.isLoading || dealersLoading || productsLoading || devicesLoading;

	return (
		<Modal
			opened={opened}
			close={handleClose}
			size="lg"
		>
			<div className={classes.header}>
				<div className={classes.headerContent}>
					<ThemeIcon
						size={40}
						radius="md"
						variant="light"
						color={uploadSuccess ? 'green' : 'orange'}
					>
						{uploadSuccess ? <IconCheck size={20} /> : <IconPlus size={20} />}
					</ThemeIcon>
					<div>
						<Title
							order={3}
							size="h4"
						>
							{uploadSuccess ? 'Upload Complete' : 'Add Stock'}
						</Title>
						<Text
							color="dimmed"
							size="sm"
						>
							{uploadSuccess
								? 'Stock items added successfully'
								: 'Add new inventory items with IMEI data'}
						</Text>
					</div>
				</div>
			</div>

			<div className={classes.formSection}>
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

				{uploadSuccess && (
					<Alert
						icon={<IconCheck size={16} />}
						title="Upload Successful"
						color="green"
						className={classes.successAlert}
					>
						{uploadSuccess}
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

				{mutation.error && (
					<Alert
						icon={<IconAlertCircle size={16} />}
						title="Upload Failed"
						color="red"
						className={classes.errorAlert}
					>
						{mutation.error?.response?.data?.message ||
							'An error occurred during upload'}
					</Alert>
				)}

				{mutation.isLoading && (
					<div className={classes.uploadProgress}>
						<Text
							size="sm"
							mb="xs"
						>
							Uploading... {uploadProgress}%
						</Text>
						<Progress
							value={uploadProgress}
							color="orange"
							size="lg"
							radius="md"
						/>
					</div>
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
										disabled={isLoading}
									/>
								</div>
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
										{...form.getInputProps('productId')}
										radius="md"
										disabled={isLoading}
									/>
								</div>
							</div>
						</div>

						<div className={classes.formGroup}>
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
								{...form.getInputProps('deviceId')}
								radius="md"
								disabled={isLoading}
							/>
						</div>

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
									description="Upload IMEI file (CSV, XLSX, XLS) - one IMEI per row, max 10MB"
									accept=".csv,.xlsx,.xls"
									// @ts-expect-error - FileInput props are not typed correctly
									placeholder="Upload IMEI file (CSV, XLSX, XLS) - one IMEI per row, max 10MB"
									required
									icon={
										<IconUpload
											size={16}
											className={classes.inputIcon}
										/>
									}
									className={classes.fileInput}
									{...form.getInputProps('imeiFile')}
									radius="md"
									disabled={isLoading}
								/>
							</div>
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
										disabled={isLoading}
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
										disabled={isLoading}
									/>
								)}

								<Group position="apart">
									<Text size="sm">SMS Notifications</Text>
									<Switch
										{...form.getInputProps('smsNotifications', {
											type: 'checkbox',
										})}
										disabled={isLoading}
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
										disabled={isLoading}
									/>
								)}
							</Stack>
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
						onClick={handleClose}
						radius="md"
						disabled={mutation.isLoading}
					>
						{uploadSuccess ? 'Close' : 'Cancel'}
					</Button>
					{!uploadSuccess && (
						<Button
							type="submit"
							loading={mutation.isLoading}
							leftIcon={<IconPlus size={16} />}
							className={classes.submitButton}
							radius="md"
							onClick={() => handleSubmit()}
							disabled={isLoading}
						>
							{mutation.isLoading ? `Uploading... ${uploadProgress}%` : 'Add Stock'}
						</Button>
					)}
				</Group>
			</div>
		</Modal>
	);
}
