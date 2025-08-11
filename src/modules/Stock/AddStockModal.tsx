import {
	Button,
	FileInput,
	Group,
	Select,
	Stack,
	Title,
	Text,
	createStyles,
	ThemeIcon,
	Alert,
	Paper,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useMutation, useQuery } from '@tanstack/react-query';
import {
	IconBox,
	IconBuilding,
	IconCategory,
	IconDeviceMobile,
	IconUpload,
	IconAlertCircle,
	IconPlus,
} from '@tabler/icons-react';
import { Modal } from '../../components/Modal';
import useRequest from '../../hooks/useRequest';
import { StockModalProps } from '../Dealer/types';

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
			borderColor: theme.colors.blue[4],
			backgroundColor:
				theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.blue[0],
		},
	},
}));

export function AddStockModal({ opened, onClose }: StockModalProps) {
	const { classes } = useStyles();
	const request = useRequest(true);

	const { data: dealers } = useQuery({
		queryKey: ['dealers/list'],
		queryFn: () => request.get('/dealers/list'),
	});

	const { data: products } = useQuery({
		queryKey: ['products'],
		queryFn: () => request.get('/products'),
	});

	const { data: devices } = useQuery({
		queryKey: ['devices'],
		queryFn: () => request.get('/devices'),
	});

	const form = useForm({
		initialValues: {
			dealerId: '',
			category: '',
			productId: '',
			deviceId: '',
			imeiFile: null as File | null,
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
			request.post('/stocks/upload', formData, {
				headers: {
					'Content-Type': 'multipart/form-data',
				},
			}),
		onSuccess: () => {
			onClose();
			form.reset();
		},
	});

	const handleSubmit = form.onSubmit((values) => {
		const formData = new FormData();
		Object.entries(values).forEach(([key, value]) => {
			if (value !== null) {
				formData.append(key, value);
			}
		});
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
						Upload IMEI data to add new stock items. Supported formats: CSV, XLSX, XLS
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
										data={dealers?.data?.data || []}
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
										data={products?.data?.data || []}
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
										data={devices?.data?.data || []}
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
									description="Upload IMEI file (CSV, XLSX, XLS)"
									accept=".csv,.xlsx,.xls"
									required
									icon={
										<IconUpload
											size={16}
											className={classes.inputIcon}
										/>
									}
									// @ts-ignore
									placeholder="Click to upload or drag and drop"
									className={classes.fileInput}
									{...form.getInputProps('imeiFile')}
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
						Add Stock
					</Button>
				</Group>
			</div>
		</Modal>
	);
}
