import {
	Button,
	Group,
	NumberInput,
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
	IconSettings,
	IconBuilding,
	IconCategory,
	IconBox,
	IconDeviceMobile,
	IconAlertCircle,
	IconGauge,
} from '@tabler/icons-react';
import { Modal } from '../../components/Modal';
import useRequest from '../../hooks/useRequest';
import { StockThresholdModalProps } from '../Dealer/types';

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

	thresholdInput: {
		'& input': {
			fontSize: theme.fontSizes.lg,
			fontWeight: 600,
			textAlign: 'center',
		},
	},
}));

export function SetStockThresholdModal({ opened, onClose }: StockThresholdModalProps) {
	const { classes } = useStyles();
	const request = useRequest(true);

	const { data: dealers } = useQuery({
		queryKey: ['dealers/list'],
		queryFn: () => request.get('/lookups/dealers'),
	});

	const { data: products } = useQuery({
		queryKey: ['products'],
		queryFn: () => request.get('/lookups/products'),
	});

	const { data: devices } = useQuery({
		queryKey: ['devices'],
		queryFn: () => request.get('/lookups/devices'),
	});

	const form = useForm({
		initialValues: {
			dealerId: '',
			category: '',
			productId: '',
			deviceId: '',
			threshold: 100,
		},
		validate: {
			dealerId: (value) => (!value ? 'Dealer is required' : null),
			category: (value) => (!value ? 'Category is required' : null),
			productId: (value) => (!value ? 'Product is required' : null),
			deviceId: (value) => (!value ? 'Device is required' : null),
			threshold: (value) => {
				if (!value) return 'Threshold is required';
				if (value < 1) return 'Threshold must be greater than 0';
				return null;
			},
		},
	});

	const mutation = useMutation({
		mutationFn: (values: typeof form.values) => request.post('/stock-thresholds', values),
		onSuccess: () => {
			onClose();
			form.reset();
		},
	});

	const handleSubmit = form.onSubmit((values) => mutation.mutate(values));

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
						color="purple"
					>
						<IconSettings size={20} />
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
							Configure minimum stock levels for inventory management
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
						Threshold Information
					</Text>
					<Text size="sm">
						Set minimum stock levels to receive alerts when inventory falls below the
						threshold.
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

						{/* Threshold Setting */}
						<div className={classes.formGroup}>
							<Text
								size="sm"
								weight={500}
								color="dimmed"
								mb="xs"
							>
								Threshold Configuration
							</Text>
							<div className={classes.inputWrapper}>
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
									className={classes.thresholdInput}
									{...form.getInputProps('threshold')}
									radius="md"
									description="Minimum quantity before low stock alert"
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
						leftIcon={<IconSettings size={16} />}
						className={classes.submitButton}
						radius="md"
						onClick={() => handleSubmit()}
					>
						Set Threshold
					</Button>
				</Group>
			</div>
		</Modal>
	);
}
