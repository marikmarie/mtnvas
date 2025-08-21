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

export function CustomerActivationModal({ opened, onClose }: CustomerActivationModalProps) {
	const { classes } = useStyles();
	const request = useRequest(true);
	const queryClient = useQueryClient();

	const form = useForm<CustomerActivationRequest>({
		initialValues: {
			agentId: 0,
			receiptNumber: '',
			deviceMsisdn: '',
			imei: '',
			customerId: '',
			customerName: '',
			customerPhone: '',
		},
		validate: {
			agentId: (value) => (!value ? 'Agent is required' : null),
			receiptNumber: (value) => (!value ? 'Receipt number is required' : null),
			deviceMsisdn: (value) => {
				if (!value) return 'Device MSISDN is required';
				if (!/^\+?[1-9]\d{1,14}$/.test(value)) return 'Invalid phone number format';
				return null;
			},
			imei: (value) => {
				if (!value) return 'IMEI is required';
				if (!/^\d{15}$/.test(value)) return 'IMEI must be 15 digits';
				return null;
			},
			customerName: (value) => (!value ? 'Customer name is required' : null),
			customerPhone: (value) => {
				if (!value) return 'Customer phone is required';
				if (!/^\+?[1-9]\d{1,14}$/.test(value)) return 'Invalid phone number format';
				return null;
			},
		},
	});

	const { data: agentsData } = useQuery({
		queryKey: ['agents-lookup'],
		queryFn: () => request.get('/agents', { params: { status: 'active' } }),
	});

	const activationMutation = useMutation({
		mutationFn: async (data: CustomerActivationRequest) => {
			const response = await request.post('/transactions/activation', data);
			return response.data as CustomerActivationResponse;
		},
		onSuccess: (data) => {
			console.log('Activation successful:', data);

			queryClient.invalidateQueries(['transactions']);
			queryClient.invalidateQueries(['transactionSummary']);

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
					color="blue"
				>
					<IconDeviceMobile size={24} />
				</ThemeIcon>
				<div>
					<Text
						size="lg"
						weight={600}
					>
						Record Customer Activation
					</Text>
					<Text
						color="dimmed"
						size="sm"
					>
						Record a new customer activation transaction
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
							📋 Activation Requirements
						</Text>
						<Text
							size="xs"
							color="dimmed"
						>
							Ensure you have the customer's device MSISDN, IMEI, and receipt number
							before proceeding. This will activate the customer's device on the
							network.
						</Text>
					</div>

					<Stack spacing="lg">
						{/* Agent Selection */}
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
						</div>

						{/* Transaction Details */}
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
								/>

								<TextInput
									label="Device MSISDN"
									placeholder="Enter device phone number"
									icon={
										<IconPhone
											size={16}
											className={classes.inputIcon}
										/>
									}
									{...form.getInputProps('deviceMsisdn')}
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
									maxLength={15}
									required
								/>
							</Stack>
						</div>

						{/* Customer Information */}
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
							loading={activationMutation.isLoading}
							leftIcon={<IconDeviceMobile size={16} />}
							radius="md"
						>
							Record Activation
						</Button>
					</Group>
				</div>
			</form>
		</Modal>
	);
}
