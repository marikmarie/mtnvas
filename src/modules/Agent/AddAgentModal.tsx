import {
	Alert,
	Button,
	createStyles,
	Flex,
	Group,
	Modal,
	Select,
	Stack,
	Text,
	TextInput,
	Title,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconAlertCircle, IconUserPlus } from '@tabler/icons-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import useRequest from '../../hooks/useRequest';
import { formatPhoneNumber } from '../../utils/phone.util';
import { AgentModalProps, Dealer, Shop, UserType } from '../Dealer/types';

const useStyles = createStyles((theme) => ({
	modal: {
		'.mantine-Modal-body': {
			padding: theme.spacing.xl,
		},
	},
}));

interface AddAgentFormValues {
	agentName: string;
	email: string;
	msisdn: string;
	userType: UserType;
	dealerId: number;
	shopId: number;
	location: string;
	merchantCode?: string;
	NIN?: string;
	region: string;
}

export function AddAgentModal({ opened, onClose }: AgentModalProps) {
	const { classes } = useStyles();
	const [isSubmitting, setIsSubmitting] = useState(false);
	const request = useRequest(true);
	const queryClient = useQueryClient();

	const {
		data: dealers,
		isLoading: dealersLoading,
		error: dealersError,
	} = useQuery({
		queryKey: ['dealer'],
		queryFn: () => request.get('/dealer'),
		retry: false,
		refetchOnWindowFocus: false,
	});

	const {
		data: shops,
		isLoading: shopsLoading,
		error: shopsError,
	} = useQuery({
		queryKey: ['shops'],
		queryFn: () => request.get('/shops'),
		retry: false,
		refetchOnWindowFocus: false,
	});

	const userTypes = [
		{ value: 'ShopAgent', label: 'Shop Agent' },
		{ value: 'DSA', label: 'DSA' },
		{ value: 'Retailer', label: 'Retailer' },
	];

	const form = useForm<AddAgentFormValues>({
		initialValues: {
			shopId: 0,
			dealerId: 0,
			agentName: '',
			msisdn: '',
			email: '',
			userType: 'ShopAgent',
			merchantCode: '',
			region: '',
			location: '',
			NIN: '',
		},
		validate: {
			agentName: (value) =>
				value.trim().length < 2 ? 'Name must be at least 2 characters' : null,
			email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email address'),
			msisdn: (value) =>
				value.trim().length < 10 ? 'Phone number must be at least 10 digits' : null,
			dealerId: (value) => (value ? null : 'Dealer is required'),
			location: (value) => (value.trim().length < 3 ? 'Location is required' : null),
			region: (value) => (value.trim().length < 3 ? 'You need to add a region' : null),
			shopId: (value, values) => {
				if (values.userType === 'ShopAgent' && !value) {
					return 'Shop is required for shop agents';
				}
				return null;
			},
		},
	});

	const createAgentMutation = useMutation({
		mutationFn: (values: AddAgentFormValues) =>
			request.post('/agents', { ...values, msisdn: formatPhoneNumber(values.msisdn) }),
		onSuccess: () => {
			queryClient.invalidateQueries(['agents']);
			form.reset();
			onClose();
		},
		onError: (error) => {
			console.error('Error creating agent:', error);
		},
		retry: false,
	});

	const handleSubmit = async (values: AddAgentFormValues) => {
		setIsSubmitting(true);
		try {
			await createAgentMutation.mutateAsync(values);
		} catch (error) {
			// Error is already handled by the mutation
			console.error('Form submission error:', error);
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleClose = () => {
		form.reset();
		onClose();
	};

	return (
		<Modal
			opened={opened}
			onClose={handleClose}
			title={
				<div>
					<Group spacing="sm">
						<IconUserPlus
							size={24}
							color="yellow"
						/>
						<Title order={3}>Add New Agent</Title>
					</Group>
					<Text
						size="sm"
						color="dimmed"
					>
						Create a new agent, DSA, or retailer in your network
					</Text>
				</div>
			}
			size="lg"
			className={classes.modal}
			centered
		>
			<form onSubmit={form.onSubmit(handleSubmit)}>
				<Title
					order={4}
					my="sm"
				>
					Basic Information
				</Title>
				<Stack spacing="sm">
					<TextInput
						label="Agent Name"
						placeholder="Enter agent name"
						required
						{...form.getInputProps('agentName')}
					/>
					<TextInput
						label="Email"
						placeholder="Enter email address"
						type="email"
						required
						{...form.getInputProps('email')}
					/>
					<TextInput
						label="Phone Number (MSISDN)"
						placeholder="+256701234567"
						required
						{...form.getInputProps('msisdn')}
					/>
					<Flex
						gap="sm"
						align="center"
						justify="space-between"
					>
						<TextInput
							w="100%"
							label="Location"
							placeholder="Enter location"
							required
							{...form.getInputProps('location')}
						/>
						<Select
							w="100%"
							label="Region"
							placeholder="Select Region"
							data={['Central', 'Eastern', 'Northern', 'Western']}
							required
							{...form.getInputProps('region')}
						/>
					</Flex>
				</Stack>

				{Boolean(dealersError || shopsError) && (
					<Alert
						icon={<IconAlertCircle size={16} />}
						title="Connection Error"
						color="red"
						variant="light"
						mb="md"
					>
						<Text size="sm">
							Unable to load dealer and shop data. Please check your internet
							connection and try again.
						</Text>
					</Alert>
				)}

				<Title
					order={4}
					my="sm"
				>
					Agent Type & Assignment
				</Title>
				<Stack spacing="sm">
					<Select
						label="User Type"
						placeholder="Select user type"
						data={userTypes}
						required
						{...form.getInputProps('userType')}
					/>
					<Select
						label="Dealer"
						placeholder={
							dealersLoading
								? 'Loading dealers...'
								: dealersError
									? 'Error loading dealers'
									: 'Select dealer'
						}
						data={
							dealers?.data?.data?.map((dealer: Dealer) => ({
								value: dealer.id,
								label: dealer.dealerName,
							})) || []
						}
						required
						searchable
						disabled={dealersLoading || !!dealersError}
						{...form.getInputProps('dealerId')}
					/>
					<Select
						label="Shop (Required for Shop Agents)"
						placeholder={
							shopsLoading
								? 'Loading shops...'
								: shopsError
									? 'Error loading shops'
									: 'Select shop'
						}
						data={
							shops?.data?.data?.map((shop: Shop) => ({
								value: shop.id,
								label: shop.shopName,
							})) || []
						}
						searchable
						clearable
						disabled={
							shopsLoading || !!shopsError || form.values.userType !== 'ShopAgent'
						}
						{...form.getInputProps('shopId')}
					/>
				</Stack>

				<Title
					order={4}
					my="sm"
				>
					Additional Information
				</Title>
				<Stack spacing="sm">
					<TextInput
						label="Merchant Code"
						placeholder="Enter merchant code (optional)"
						{...form.getInputProps('merchantCode')}
					/>
					<TextInput
						label="NIN Number"
						placeholder="Enter NIN number (optional)"
						{...form.getInputProps('NIN')}
					/>
				</Stack>

				<Alert
					icon={<IconAlertCircle size={16} />}
					title="Important Information"
					color="yellow"
					variant="light"
					my="lg"
				>
					<Text size="sm">
						• New agents will be created with 'pending_approval' status
						<br />
						• Shop agents must be assigned to a specific shop
						<br />
						• DSAs and retailers operate independently of shops
						<br />• All agents will be verified before activation
					</Text>
				</Alert>

				{Boolean(dealersError || shopsError) && (
					<Alert
						icon={<IconAlertCircle size={16} />}
						title="Form Disabled"
						color="orange"
						variant="light"
						mb="lg"
					>
						<Text size="sm">
							The form is currently disabled due to connection issues. Please check
							your internet connection and refresh the page to try again.
						</Text>
					</Alert>
				)}

				{Boolean(createAgentMutation.error) && (
					<Alert
						icon={<IconAlertCircle size={16} />}
						title="Submission Error"
						color="red"
						variant="light"
						mb="lg"
					>
						<Text size="sm">
							Failed to create agent. Please check your connection and try again. If
							the problem persists, contact support.
						</Text>
					</Alert>
				)}

				<Group
					position="right"
					mt="xl"
				>
					<Button
						variant="outline"
						onClick={handleClose}
					>
						Cancel
					</Button>
					<Button
						type="submit"
						loading={isSubmitting}
						color="yellow"
						leftIcon={<IconUserPlus size={16} />}
						disabled={Boolean(dealersError || shopsError)}
					>
						Create Agent
					</Button>
				</Group>
			</form>
		</Modal>
	);
}
