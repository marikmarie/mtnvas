import {
	Button,
	Group,
	NumberInput,
	Select,
	Stack,
	Switch,
	Text,
	TextInput,
	ThemeIcon,
	createStyles,
} from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { useForm } from '@mantine/form';
import {
	IconBuilding,
	IconCalendar,
	IconCurrencyDollar,
	IconDeviceMobile,
	IconPercentage,
	IconUser,
} from '@tabler/icons-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useMemo } from 'react';
import { Modal } from '../../components/Modal';
import useRequest from '../../hooks/useRequest';
import {
	Agent,
	CommissionRateModalProps,
	CommissionRateRequest,
	Dealer,
	Product,
} from '../Dealer/types';

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
		backgroundColor: theme.colorScheme === 'dark' ? theme.colors.blue[9] : theme.colors.blue[0],
		borderRadius: theme.radius.md,
		border: `1px solid ${
			theme.colorScheme === 'dark' ? theme.colors.blue[8] : theme.colors.blue[2]
		}`,
		marginBottom: theme.spacing.lg,
	},

	typeCard: {
		padding: theme.spacing.md,
		backgroundColor: theme.colorScheme === 'dark' ? theme.colors.gray[9] : theme.colors.gray[0],
		borderRadius: theme.radius.md,
		border: `1px solid ${
			theme.colorScheme === 'dark' ? theme.colors.gray[7] : theme.colors.gray[3]
		}`,
		marginTop: theme.spacing.md,
	},
}));

export function CommissionRateModal({ opened, onClose, commissionRate }: CommissionRateModalProps) {
	const { classes } = useStyles();
	const request = useRequest(true);
	const queryClient = useQueryClient();
	const isEditing = !!commissionRate;

	const form = useForm<
		CommissionRateRequest & { isSystemWide: boolean; isAgentSpecific: boolean }
	>({
		initialValues: {
			dealerId: commissionRate?.dealerId || undefined,
			agentId: commissionRate?.agentId || undefined,
			isSystemWide: !commissionRate?.dealerId,
			isAgentSpecific: !!commissionRate?.agentId,
			userType: commissionRate?.userType || 'shop_agent',
			productId: commissionRate?.productId || 0,
			commissionType: commissionRate?.commissionType || 'fixed',
			amount: commissionRate?.amount || 0,
			currency: commissionRate?.currency || 'UGX',
			effectiveFrom: commissionRate?.effectiveFrom
				? new Date(commissionRate.effectiveFrom).toISOString().split('T')[0]
				: new Date().toISOString().split('T')[0],
			isActive: commissionRate?.isActive ?? true,
		},
		validate: {
			userType: (value) => (!value ? 'User type is required' : null),
			productId: (value) => (!value ? 'Product is required' : null),
			amount: (value) => {
				if (!value || value <= 0) return 'Amount must be greater than 0';
				if (form.values?.commissionType === 'percentage' && value > 100) {
					return 'Percentage cannot exceed 100%';
				}
				return null;
			},
			dealerId: (value, values) => {
				if (!values.isSystemWide && !value) {
					return 'Dealer is required when not system-wide';
				}
				return null;
			},
		},
	});

	const effectiveFromValue = useMemo(() => {
		return form.values.effectiveFrom ? new Date(form.values.effectiveFrom) : null;
	}, [form.values.effectiveFrom]);

	const { data: dealersData } = useQuery({
		queryKey: ['dealers'],
		queryFn: () => request.get('dealer'),
	});

	const { data: agentsData } = useQuery({
		queryKey: ['agents'],
		queryFn: () => request.get('/agents'),
	});

	const { data: productsData } = useQuery({
		queryKey: ['products'],
		queryFn: () => request.get('/products'),
	});

	const dealerOptions = useMemo(() => {
		if (!dealersData?.data?.data || !Array.isArray(dealersData.data.data)) return [];
		return dealersData.data.data
			.filter((dealer: Dealer) => dealer && dealer.id && dealer.dealerName)
			.map((dealer: Dealer) => ({
				value: dealer.id.toString(),
				label: dealer.dealerName?.toString().toUpperCase() || 'Unknown Dealer',
			}));
	}, [dealersData?.data?.data]);

	const agentOptions = useMemo(() => {
		if (!agentsData?.data?.data || !Array.isArray(agentsData.data.data)) return [];
		return agentsData.data.data
			.filter((agent: Agent) => agent && agent.id && agent.agentName)
			.map((agent: Agent) => ({
				value: agent.id.toString(),
				label: agent.agentName?.toString().toUpperCase() || 'Unknown Agent',
			}));
	}, [agentsData?.data?.data]);

	const productOptions = useMemo(() => {
		if (!productsData?.data?.data || !Array.isArray(productsData.data.data)) return [];
		return productsData.data.data
			.filter((product: Product) => product && product.id && product.productName)
			.map((product: Product) => ({
				value: product.id.toString(),
				label: product.productName?.toString().toUpperCase() || 'Unknown Product',
			}));
	}, [productsData?.data?.data]);

	const commissionRateMutation = useMutation({
		mutationFn: async (data: CommissionRateRequest) => {
			if (isEditing) {
				const response = await request.put(
					`/commissions/rates/${commissionRate?.id}`,
					data
				);
				return response.data;
			} else {
				const response = await request.post('/commissions/rates', data);
				return response.data;
			}
		},
		onSuccess: () => {
			queryClient.invalidateQueries(['commission-rates']);

			form.reset();
			onClose();
		},
		onError: (error) => {
			console.error('Commission rate operation failed:', error);
		},
	});

	const handleSubmit = (values: typeof form.values) => {
		const submitData: CommissionRateRequest = {
			userType: values.userType,
			productId: values.productId,
			commissionType: values.commissionType,
			amount: values.amount,
			currency: values.currency,
			effectiveFrom: values.effectiveFrom,
			isActive: values.isActive,
		};

		if (!values.isSystemWide && values.dealerId) {
			submitData.dealerId = values.dealerId;
		}

		if (values.isAgentSpecific && values.agentId) {
			submitData.agentId = values.agentId;
		}

		commissionRateMutation.mutate(submitData);
	};

	const handleClose = () => {
		form.reset();
		onClose();
	};

	const handleEffectiveFromChange = (date: Date | null) => {
		form.setFieldValue('effectiveFrom', date ? date.toISOString().split('T')[0] : '');
	};

	const handleSystemWideChange = (isSystemWide: boolean) => {
		form.setFieldValue('isSystemWide', isSystemWide);
		if (isSystemWide) {
			form.setFieldValue('dealerId', undefined);
		}
	};

	return (
		<Modal
			opened={opened}
			close={handleClose}
			size="xl"
		>
			<div
				className={classes.header}
				style={{ padding: '24px 24px 0' }}
			>
				<ThemeIcon
					size="lg"
					radius="md"
					color="blue"
				>
					<IconPercentage size={24} />
				</ThemeIcon>
				<div>
					<Text
						size="lg"
						weight={600}
					>
						{isEditing ? 'Edit Commission Rate' : 'Create Commission Rate'}
					</Text>
					<Text
						color="dimmed"
						size="sm"
					>
						{isEditing
							? 'Update an existing commission rate'
							: 'Set up a new commission rate for agents'}
					</Text>
				</div>
			</div>

			<form onSubmit={form.onSubmit(handleSubmit)}>
				<div className={classes.formSection}>
					<div className={classes.infoCard}>
						<Text
							size="sm"
							weight={500}
							mb="xs"
						>
							💰 Commission Rate Configuration
						</Text>
						<Text
							size="xs"
							color="dimmed"
						>
							Set commission rates for different user types and products. Rates can be
							applied system-wide or to specific dealers. Fixed amounts are in UGX,
							percentages are calculated from transaction amounts.
						</Text>
					</div>

					<Stack spacing="lg">
						<div className={classes.formGroup}>
							<Text
								size="sm"
								weight={500}
								color="dimmed"
								mb="xs"
							>
								Basic Configuration
							</Text>
							<Stack spacing="md">
								<Group grow>
									<Select
										label="User Type"
										placeholder="Select user type"
										icon={
											<IconUser
												size={16}
												className={classes.inputIcon}
											/>
										}
										data={[
											{ value: 'shop_agent', label: 'Shop Agent' },
											{ value: 'dsa', label: 'DSA' },
											{ value: 'retailer', label: 'Retailer' },
											{ value: 'agent', label: 'Agent' },
										]}
										{...form.getInputProps('userType')}
										radius="md"
										required
									/>

									<Select
										label="Product"
										placeholder="Select product"
										icon={
											<IconDeviceMobile
												size={16}
												className={classes.inputIcon}
											/>
										}
										data={productOptions}
										{...form.getInputProps('productId')}
										radius="md"
										required
									/>
								</Group>

								<Switch
									label="Apply system-wide (all dealers)"
									description="When enabled, this rate applies to all dealers. When disabled, select a specific dealer."
									checked={form.values.isSystemWide}
									onChange={(event) =>
										handleSystemWideChange(event.currentTarget.checked)
									}
								/>

								{!form.values.isSystemWide && (
									<Select
										label="Dealer"
										placeholder="Select specific dealer"
										icon={
											<IconBuilding
												size={16}
												className={classes.inputIcon}
											/>
										}
										data={dealerOptions}
										{...form.getInputProps('dealerId')}
										radius="md"
										required={!form.values.isSystemWide}
									/>
								)}

								<Switch
									label="Apply to specific agent"
									description="When enabled, this rate applies to a specific agent. When disabled, applies to all agents."
									checked={form.values.isAgentSpecific}
									onChange={(event) =>
										form.setFieldValue(
											'isAgentSpecific',
											event.currentTarget.checked
										)
									}
								/>

								{form.values.isAgentSpecific && (
									<Select
										label="Agent"
										placeholder="Select specific agent"
										icon={
											<IconUser
												size={16}
												className={classes.inputIcon}
											/>
										}
										data={agentOptions}
										{...form.getInputProps('agentId')}
										radius="md"
										required={form.values.isAgentSpecific}
									/>
								)}
							</Stack>
						</div>

						<div className={classes.formGroup}>
							<Text
								size="sm"
								weight={500}
								color="dimmed"
								mb="xs"
							>
								Commission Details
							</Text>
							<Stack spacing="md">
								<Select
									label="Commission Type"
									data={[
										{ value: 'fixed', label: 'Fixed Amount' },
										{ value: 'percentage', label: 'Percentage' },
									]}
									{...form.getInputProps('commissionType')}
									radius="md"
									required
								/>

								<Group grow>
									<NumberInput
										label={
											form.values.commissionType === 'fixed'
												? 'Fixed Amount (UGX)'
												: 'Percentage (%)'
										}
										placeholder={
											form.values.commissionType === 'fixed'
												? 'Enter amount in UGX'
												: 'Enter percentage'
										}
										icon={
											form.values.commissionType === 'fixed' ? (
												<IconCurrencyDollar
													size={16}
													className={classes.inputIcon}
												/>
											) : (
												<IconPercentage
													size={16}
													className={classes.inputIcon}
												/>
											)
										}
										{...form.getInputProps('amount')}
										radius="md"
										min={0}
										max={
											form.values.commissionType === 'percentage'
												? 100
												: undefined
										}
										precision={
											form.values.commissionType === 'percentage' ? 2 : 0
										}
										required
									/>

									<DatePickerInput
										label="Effective From"
										valueFormat="YYYY-MM-DD"
										locale="en"
										defaultDate={new Date()}
										dropdownType="modal"
										popoverProps={{
											offset: 8,
										}}
										icon={
											<IconCalendar
												size={16}
												className={classes.inputIcon}
											/>
										}
										value={effectiveFromValue}
										onChange={handleEffectiveFromChange}
										radius="md"
										required
									/>
								</Group>

								{form.values.commissionType === 'fixed' && (
									<TextInput
										label="Currency"
										value={form.values.currency}
										disabled
										radius="md"
									/>
								)}
							</Stack>
						</div>

						{form.values.amount > 0 && (
							<div className={classes.typeCard}>
								<Text
									size="sm"
									weight={500}
									mb="md"
								>
									Rate Preview
								</Text>
								<Text size="sm">
									<strong>User Type:</strong>{' '}
									{form.values.userType.replace('_', ' ').toUpperCase()}
								</Text>
								<Text size="sm">
									<strong>Commission:</strong>{' '}
									{form.values.commissionType === 'fixed'
										? `${form.values.amount.toLocaleString()} UGX per transaction`
										: `${form.values.amount}% of transaction amount`}
								</Text>
								<Text size="sm">
									<strong>Scope:</strong>{' '}
									{form.values.isSystemWide
										? 'System-wide (all dealers)'
										: 'Dealer-specific'}
								</Text>
								<Text size="sm">
									<strong>Agent Scope:</strong>{' '}
									{form.values.isAgentSpecific ? 'Agent-specific' : 'All agents'}
								</Text>
							</div>
						)}

						<Switch
							label="Active"
							description="Enable or disable this commission rate"
							checked={form.values.isActive}
							onChange={(event) =>
								form.setFieldValue('isActive', event.currentTarget.checked)
							}
						/>
					</Stack>
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
						>
							Cancel
						</Button>
						<Button
							type="submit"
							loading={commissionRateMutation.isLoading}
							leftIcon={<IconPercentage size={16} />}
							radius="md"
						>
							{isEditing ? 'Update Rate' : 'Create Rate'}
						</Button>
					</Group>
				</div>
			</form>
		</Modal>
	);
}
