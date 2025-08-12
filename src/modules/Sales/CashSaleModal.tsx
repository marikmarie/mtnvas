import {
	Button,
	Group,
	Modal,
	NumberInput,
	Select,
	Stack,
	Text,
	TextInput,
	ThemeIcon,
	createStyles,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
	IconCash,
	IconDeviceMobile,
	IconHash,
	IconMail,
	IconPhone,
	IconUser,
} from '@tabler/icons-react';
import useRequest from '../../hooks/useRequest';
import { formatCurrency } from '../../utils/currenyFormatter';
import { CashSaleModalProps, CashSaleRequest, CashSaleResponse } from '../Dealer/types';

const useStyles = createStyles((theme) => ({
	header: {
		display: 'flex',
		alignItems: 'center',
		gap: theme.spacing.md,
		marginBottom: theme.spacing.xl,
	},

	formSection: {
		padding: `0 ${theme.spacing.xs}`,
	},

	formGroup: {
		marginBottom: theme.spacing.lg,
	},

	inputIcon: {
		color: theme.colorScheme === 'dark' ? theme.colors.dark[2] : theme.colors.gray[6],
	},

	actions: {
		padding: theme.spacing.md,
		paddingBottom: theme.spacing.lg,
		borderTop: `1px solid ${
			theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[3]
		}`,
		backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
	},

	infoCard: {
		padding: theme.spacing.md,
		backgroundColor: theme.colorScheme === 'dark' ? theme.colors.teal[9] : theme.colors.teal[0],
		borderRadius: theme.radius.md,
		border: `1px solid ${
			theme.colorScheme === 'dark' ? theme.colors.teal[8] : theme.colors.teal[2]
		}`,
		marginBottom: theme.spacing.lg,
	},

	paymentMethodCard: {
		padding: theme.spacing.md,
		backgroundColor: theme.colorScheme === 'dark' ? theme.colors.gray[9] : theme.colors.gray[0],
		borderRadius: theme.radius.md,
		border: `1px solid ${
			theme.colorScheme === 'dark' ? theme.colors.gray[7] : theme.colors.gray[3]
		}`,
		marginTop: theme.spacing.md,
	},
}));

export function CashSaleModal({ opened, onClose }: CashSaleModalProps) {
	const { classes } = useStyles();
	const request = useRequest(true);
	const queryClient = useQueryClient();

	const form = useForm<CashSaleRequest>({
		initialValues: {
			agentId: '',
			customerId: '',
			customerName: '',
			customerPhone: '',
			customerEmail: '',
			productId: '',
			deviceId: '',
			imei: '',
			paymentMethod: 'cash',
			amount: 0,
			sponsorMsisdn: '',
		},
		validate: {
			agentId: (value) => (!value ? 'Agent is required' : null),
			customerName: (value) => (!value ? 'Customer name is required' : null),
			customerPhone: (value) => {
				if (!value) return 'Customer phone is required';
				if (!/^\+?[1-9]\d{1,14}$/.test(value)) return 'Invalid phone number format';
				return null;
			},
			customerEmail: (value) => {
				if (value && !/^\S+@\S+$/.test(value)) return 'Invalid email format';
				return null;
			},
			productId: (value) => (!value ? 'Product is required' : null),
			deviceId: (value) => (!value ? 'Device is required' : null),
			imei: (value) => {
				if (!value) return 'IMEI is required';
				if (!/^\d{15}$/.test(value)) return 'IMEI must be 15 digits';
				return null;
			},
			amount: (value) => {
				if (!value || value <= 0) return 'Amount must be greater than 0';
				return null;
			},
			sponsorMsisdn: (value, values) => {
				if (values.paymentMethod === 'mobile_money' && !value) {
					return 'Sponsor MSISDN is required for mobile money payments';
				}
				if (value && !/^\+?[1-9]\d{1,14}$/.test(value)) {
					return 'Invalid phone number format';
				}
				return null;
			},
		},
	});

	// Fetch lookup data
	const { data: agentsData } = useQuery({
		queryKey: ['agents-lookup'],
		queryFn: () => request.get('/agents', { params: { status: 'active' } }),
	});

	const { data: productsData } = useQuery({
		queryKey: ['products-lookup'],
		queryFn: () => request.get('/lookups/products'),
	});

	const { data: devicesData } = useQuery({
		queryKey: ['devices-lookup', form.values.productId],
		queryFn: () =>
			request.get('/lookups/devices', {
				params: { productId: form.values.productId },
			}),
		enabled: !!form.values.productId,
	});

	// Create cash sale mutation
	const cashSaleMutation = useMutation({
		mutationFn: async (data: CashSaleRequest) => {
			const response = await request.post('/transactions/cash-sale', data);
			return response.data as CashSaleResponse;
		},
		onSuccess: (data) => {
			// Show success notification
			console.log('Cash sale successful:', data);

			// Invalidate relevant queries
			queryClient.invalidateQueries(['transactions']);
			queryClient.invalidateQueries(['transactionSummary']);

			// Reset form and close modal
			form.reset();
			onClose();
		},
		onError: (error) => {
			console.error('Cash sale failed:', error);
		},
	});

	const handleSubmit = (values: CashSaleRequest) => {
		cashSaleMutation.mutate(values);
	};

	const handleClose = () => {
		form.reset();
		onClose();
	};

	const handleProductChange = (productId: string | null) => {
		form.setFieldValue('productId', productId || '');
		form.setFieldValue('deviceId', ''); // Reset device when product changes
	};

	return (
		<Modal
			opened={opened}
			onClose={handleClose}
			title={null}
			size="lg"
			radius="lg"
			padding={0}
			styles={{
				body: { padding: 0 },
				header: { display: 'none' },
			}}
		>
			{/* Custom Header */}
			<div
				className={classes.header}
				style={{ padding: '24px 24px 0' }}
			>
				<ThemeIcon
					size="lg"
					radius="md"
					color="teal"
				>
					<IconCash size={24} />
				</ThemeIcon>
				<div>
					<Text
						size="lg"
						weight={600}
					>
						Record Cash Sale
					</Text>
					<Text
						color="dimmed"
						size="sm"
					>
						Process a cash sale transaction for a customer
					</Text>
				</div>
			</div>

			<form onSubmit={form.onSubmit(handleSubmit)}>
				<div className={classes.formSection}>
					{/* Info Card */}
					<div className={classes.infoCard}>
						<Text
							size="sm"
							weight={500}
							mb="xs"
						>
							💰 Cash Sale Process
						</Text>
						<Text
							size="xs"
							color="dimmed"
						>
							Record cash sales for devices sold directly to customers. This will
							create a transaction record and may automatically activate the device if
							applicable.
						</Text>
					</div>

					<Stack spacing="lg">
						{/* Agent and Customer Information */}
						<div className={classes.formGroup}>
							<Text
								size="sm"
								weight={500}
								color="dimmed"
								mb="xs"
							>
								Agent & Customer Information
							</Text>
							<Stack spacing="md">
								<Select
									label="Select Agent"
									placeholder="Choose the agent processing this sale"
									icon={
										<IconUser
											size={16}
											className={classes.inputIcon}
										/>
									}
									data={
										agentsData?.data?.data?.map((agent: any) => ({
											value: agent.id,
											label: `${agent.name} (${agent.userType})`,
										})) || []
									}
									{...form.getInputProps('agentId')}
									radius="md"
									required
								/>

								<Group grow>
									<TextInput
										label="Customer Name"
										placeholder="Enter customer full name"
										icon={
											<IconUser
												size={16}
												className={classes.inputIcon}
											/>
										}
										{...form.getInputProps('customerName')}
										radius="md"
										required
									/>

									<TextInput
										label="Customer Phone"
										placeholder="Enter customer contact"
										icon={
											<IconPhone
												size={16}
												className={classes.inputIcon}
											/>
										}
										{...form.getInputProps('customerPhone')}
										radius="md"
										required
									/>
								</Group>

								<Group grow>
									<TextInput
										label="Customer ID (Optional)"
										placeholder="Enter customer ID if available"
										icon={
											<IconHash
												size={16}
												className={classes.inputIcon}
											/>
										}
										{...form.getInputProps('customerId')}
										radius="md"
									/>

									<TextInput
										label="Customer Email (Optional)"
										placeholder="Enter customer email"
										icon={
											<IconMail
												size={16}
												className={classes.inputIcon}
											/>
										}
										{...form.getInputProps('customerEmail')}
										radius="md"
									/>
								</Group>
							</Stack>
						</div>

						{/* Product and Device Information */}
						<div className={classes.formGroup}>
							<Text
								size="sm"
								weight={500}
								color="dimmed"
								mb="xs"
							>
								Product & Device Details
							</Text>
							<Stack spacing="md">
								<Group grow>
									<Select
										label="Product"
										placeholder="Select product"
										data={
											productsData?.data?.data?.map((product: any) => ({
												value: product.id,
												label: product.name,
											})) || []
										}
										value={form.values.productId}
										onChange={handleProductChange}
										radius="md"
										required
									/>

									<Select
										label="Device"
										placeholder="Select device"
										data={
											devicesData?.data?.data?.map((device: any) => ({
												value: device.id,
												label: device.name,
											})) || []
										}
										{...form.getInputProps('deviceId')}
										radius="md"
										disabled={!form.values.productId}
										required
									/>
								</Group>

								<TextInput
									label="IMEI"
									placeholder="Enter 15-digit IMEI number"
									icon={
										<IconHash
											size={16}
											className={classes.inputIcon}
										/>
									}
									{...form.getInputProps('imei')}
									radius="md"
									maxLength={15}
									required
								/>
							</Stack>
						</div>

						{/* Payment Information */}
						<div className={classes.formGroup}>
							<Text
								size="sm"
								weight={500}
								color="dimmed"
								mb="xs"
							>
								Payment Details
							</Text>
							<Stack spacing="md">
								<Group grow>
									<NumberInput
										label="Sale Amount"
										placeholder="Enter sale amount"
										icon={
											<IconCash
												size={16}
												className={classes.inputIcon}
											/>
										}
										{...form.getInputProps('amount')}
										radius="md"
										min={0}
										precision={2}
										formatter={(value) => formatCurrency(Number(value) || 0)}
										required
									/>

									<Select
										label="Payment Method"
										data={[
											{ value: 'cash', label: 'Cash' },
											{ value: 'mobile_money', label: 'Mobile Money' },
										]}
										{...form.getInputProps('paymentMethod')}
										radius="md"
										required
									/>
								</Group>

								{form.values.paymentMethod === 'mobile_money' && (
									<div className={classes.paymentMethodCard}>
										<Text
											size="sm"
											weight={500}
											mb="md"
										>
											Mobile Money Details
										</Text>
										<TextInput
											label="Sponsor MSISDN"
											placeholder="Enter mobile money number"
											icon={
												<IconDeviceMobile
													size={16}
													className={classes.inputIcon}
												/>
											}
											{...form.getInputProps('sponsorMsisdn')}
											radius="md"
											required
										/>
									</div>
								)}
							</Stack>
						</div>
					</Stack>
				</div>

				{/* Actions */}
				<div className={classes.actions}>
					<Group
						position="right"
						spacing="md"
					>
						<Button
							variant="subtle"
							onClick={handleClose}
							radius="md"
						>
							Cancel
						</Button>
						<Button
							type="submit"
							loading={cashSaleMutation.isLoading}
							leftIcon={<IconCash size={16} />}
							color="teal"
							radius="md"
						>
							Process Sale
						</Button>
					</Group>
				</div>
			</form>
		</Modal>
	);
}
