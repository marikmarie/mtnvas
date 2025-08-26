import {
	Button,
	Group,
	Select,
	Stack,
	Text,
	TextInput,
	ThemeIcon,
	createStyles,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconDeviceMobile, IconHash, IconPhone, IconReceipt, IconUser } from '@tabler/icons-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { Modal } from '../../components/Modal';
import useRequest from '../../hooks/useRequest';
import {
	CustomerActivationModalProps,
	CustomerActivationRequest,
	CustomerActivationResponse,
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
}));

export function CustomerActivationModal({
	opened,
	onClose,
	transaction,
}: CustomerActivationModalProps) {
	const { classes } = useStyles();
	const request = useRequest(true);
	const queryClient = useQueryClient();

	const form = useForm<CustomerActivationRequest>({
		initialValues: {
			agentId: transaction?.agentId || 0,
			receiptNumber: transaction?.receiptNumber || '',
			imei: transaction?.imei || '',
			customerId: transaction?.customerId || '',
			customerName: transaction?.customerName || '',
			customerPhone: transaction?.customerPhone || '',
		},
		validate: {
			agentId: (value) => (!value ? 'Agent is required' : null),
			receiptNumber: (value) => (!value ? 'Receipt number is required' : null),
			imei: (value) => {
				if (!value) return 'IMEI is required';
				if (!/^\d{15}$/.test(value)) return 'IMEI must be 15 digits';
				return null;
			},
			customerId: (value) => (!value ? 'Customer ID is required' : null),
			customerName: (value) => (!value ? 'Customer name is required' : null),
			customerPhone: (value) => {
				if (!value) return 'Customer phone is required';
				return null;
			},
		},
	});

	const { data: agentsData } = useQuery({
		queryKey: ['agents'],
		queryFn: () => request.get('/agents', { params: { status: 'active' } }),
	});

	const agentOptions =
		agentsData?.data?.data?.map((agent: any) => ({
			value: agent.id,
			label: agent.agentName.toUpperCase() || 'Unknown Agent',
		})) || [];

	// Update form when transaction changes
	useEffect(() => {
		if (transaction) {
			form.setValues({
				agentId: transaction.agentId,
				receiptNumber: transaction.receiptNumber || '',
				imei: transaction.imei,
				customerId: transaction.customerId || '',
				customerName: transaction.customerName || '',
				customerPhone: transaction.customerPhone,
			});
		}
	}, [transaction, form]);

	const activationMutation = useMutation({
		mutationFn: async (data: CustomerActivationRequest) => {
			const response = await request.post('/transactions/activation', data);
			return response.data as CustomerActivationResponse;
		},
		onSuccess: (data) => {
			console.log('Activation successful:', data);

			queryClient.invalidateQueries(['transactions']);
			queryClient.invalidateQueries(['transactionSummary']);

			// Show success message
			if (transaction) {
				alert(
					`Successfully activated transaction ${transaction.receiptNumber || transaction.id} for ${transaction.customerName}`
				);
			} else {
				alert('Successfully recorded new activation');
			}

			form.reset();
			onClose();
		},
		onError: (error) => {
			console.error('Activation failed:', error);
		},
	});

	const handleSubmit = (values: CustomerActivationRequest) => {
		activationMutation.mutate(values);
	};

	const handleClose = () => {
		form.reset();
		onClose();
	};

	return (
		<Modal
			opened={opened}
			close={handleClose}
			size="lg"
		>
			<div
				className={classes.header}
				style={{ padding: '24px 24px 0', marginBottom: 0 }}
			>
				<ThemeIcon
					size="lg"
					radius="md"
					color={transaction ? 'green' : 'blue'}
				>
					<IconDeviceMobile size={24} />
				</ThemeIcon>
				<div>
					<Text
						size="lg"
						weight={600}
					>
						{transaction ? 'Activate Transaction' : 'Record Customer Activation'}
					</Text>
					<Text
						color="dimmed"
						size="sm"
					>
						{transaction
							? `Activate transaction for ${transaction.customerName || 'customer'}`
							: 'Record a new customer activation transaction'}
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
							{transaction
								? '📋 Transaction Activation'
								: '📋 Activation Requirements'}
						</Text>
						<Text
							size="xs"
							color="dimmed"
						>
							{transaction
								? `Activating transaction ${transaction.receiptNumber || transaction.id} for customer ${transaction.customerName}. This will activate the customer's device on the network.`
								: "Ensure you have the customer's device MSISDN, IMEI, and receipt number before proceeding. This will activate the customer's device on the network."}
						</Text>
						{transaction && (
							<Text
								size="xs"
								color="green"
								mt="xs"
								weight={500}
							>
								✓ Transaction data pre-filled from existing record
							</Text>
						)}
					</div>

					<Stack spacing="lg">
						<div className={classes.formGroup}>
							<Text
								size="sm"
								weight={500}
								color="dimmed"
								mb="xs"
							>
								Agent Information
							</Text>
							<Select
								label="Select Agent"
								placeholder="Choose the agent processing this activation"
								icon={
									<IconUser
										size={16}
										className={classes.inputIcon}
									/>
								}
								data={agentOptions}
								{...form.getInputProps('agentId')}
								radius="md"
								required
								disabled={!!transaction}
							/>
						</div>

						<div className={classes.formGroup}>
							<Text
								size="sm"
								weight={500}
								color="dimmed"
								mb="xs"
							>
								Transaction Details
							</Text>
							<Stack spacing="md">
								<TextInput
									label="Receipt Number"
									placeholder="Enter unique receipt number"
									icon={
										<IconReceipt
											size={16}
											className={classes.inputIcon}
										/>
									}
									{...form.getInputProps('receiptNumber')}
									radius="md"
									required
									readOnly={!!transaction}
								/>

								<TextInput
									label="Customer ID"
									placeholder="Enter customer ID"
									icon={
										<IconHash
											size={16}
											className={classes.inputIcon}
										/>
									}
									{...form.getInputProps('customerId')}
									radius="md"
									required
								/>

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
									required
									readOnly={!!transaction}
								/>
							</Stack>
						</div>

						<div className={classes.formGroup}>
							<Text
								size="sm"
								weight={500}
								color="dimmed"
								mb="xs"
							>
								Customer Information
							</Text>
							<Stack spacing="md">
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
									placeholder="Enter customer contact number"
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
							</Stack>
						</div>
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
							loading={activationMutation.isLoading}
							leftIcon={<IconDeviceMobile size={16} />}
							radius="md"
						>
							{transaction ? 'Activate Transaction' : 'Record Activation'}
						</Button>
					</Group>
				</div>
			</form>
		</Modal>
	);
}
