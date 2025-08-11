import {
	Modal,
	TextInput,
	Select,
	Button,
	Group,
	Stack,
	Title,
	Text,
	createStyles,
	Divider,
	Alert,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import { IconAlertCircle, IconEdit } from '@tabler/icons-react';
import useRequest from '../../hooks/useRequest';
import { AgentModalProps } from '../Dealer/types';

const useStyles = createStyles((theme) => ({
	modal: {
		'.mantine-Modal-body': {
			padding: theme.spacing.xl,
		},
	},

	header: {
		marginBottom: theme.spacing.lg,
	},

	form: {
		marginTop: theme.spacing.lg,
	},

	section: {
		marginBottom: theme.spacing.xl,
	},

	sectionTitle: {
		marginBottom: theme.spacing.md,
		fontWeight: 600,
		color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.colors.gray[8],
	},

	required: {
		color: theme.colors.red[6],
	},
}));

interface EditAgentFormValues {
	name: string;
	email: string;
	msisdn: string;
	userType: 'shop_agent' | 'dsa' | 'retailer';
	dealerId: string;
	shopId?: string;
	location: string;
	merchantCode?: string;
	idNumber?: string;
}

export function EditAgentModal({ opened, onClose, agent }: AgentModalProps) {
	const { classes } = useStyles();
	const [isSubmitting, setIsSubmitting] = useState(false);
	const request = useRequest(true);
	const queryClient = useQueryClient();

	// Mock data - replace with actual API calls
	const mockDealers = [
		{ value: 'dealer1', label: 'Tech Solutions Ltd' },
		{ value: 'dealer2', label: 'Digital Innovations' },
	];

	const mockShops = [
		{ value: 'shop1', label: 'Kampala Central Branch' },
		{ value: 'shop2', label: 'Entebbe Branch' },
	];

	const userTypes = [
		{ value: 'shop_agent', label: 'Shop Agent' },
		{ value: 'dsa', label: 'DSA' },
		{ value: 'retailer', label: 'Retailer' },
	];

	const form = useForm<EditAgentFormValues>({
		initialValues: {
			name: '',
			email: '',
			msisdn: '',
			userType: 'shop_agent',
			dealerId: '',
			shopId: '',
			location: '',
			merchantCode: '',
			idNumber: '',
		},
		validate: {
			name: (value) =>
				value.trim().length < 2 ? 'Name must be at least 2 characters' : null,
			email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email address'),
			msisdn: (value) =>
				value.trim().length < 10 ? 'Phone number must be at least 10 digits' : null,
			dealerId: (value) => (value ? null : 'Dealer is required'),
			location: (value) =>
				value.trim().length < 3 ? 'Location must be at least 3 characters' : null,
			shopId: (value, values) => {
				if (values.userType === 'shop_agent' && !value) {
					return 'Shop is required for shop agents';
				}
				return null;
			},
		},
	});

	// Update form when agent changes
	useEffect(() => {
		if (agent) {
			form.setValues({
				name: agent.name,
				email: agent.email,
				msisdn: agent.msisdn,
				userType: agent.userType,
				dealerId: agent.dealerId,
				shopId: agent.shopId || '',
				location: agent.location,
				merchantCode: agent.merchantCode || '',
				idNumber: '',
			});
		}
	}, [agent, form]);

	const updateAgentMutation = useMutation({
		mutationFn: (values: EditAgentFormValues) => request.put(`/agents/${agent?.id}`, values),
		onSuccess: () => {
			queryClient.invalidateQueries(['agents']);
			onClose();
		},
		onError: (error) => {
			console.error('Error updating agent:', error);
		},
	});

	const handleSubmit = async (values: EditAgentFormValues) => {
		if (!agent) return;

		setIsSubmitting(true);
		try {
			await updateAgentMutation.mutateAsync(values);
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleClose = () => {
		form.reset();
		onClose();
	};

	// Don't render if no agent is provided
	if (!agent) return null;

	return (
		<Modal
			opened={opened}
			onClose={handleClose}
			title={
				<div className={classes.header}>
					<Group spacing="sm">
						<IconEdit
							size={24}
							color="blue"
						/>
						<Title order={3}>Edit Agent</Title>
					</Group>
					<Text
						size="sm"
						color="dimmed"
					>
						Update agent information and settings
					</Text>
				</div>
			}
			size="lg"
			className={classes.modal}
		>
			<form
				onSubmit={form.onSubmit(handleSubmit)}
				className={classes.form}
			>
				{/* Basic Information */}
				<div className={classes.section}>
					<Title
						order={4}
						className={classes.sectionTitle}
					>
						Basic Information
					</Title>
					<Stack spacing="md">
						<TextInput
							label="Full Name"
							placeholder="Enter full name"
							required
							{...form.getInputProps('name')}
						/>
						<TextInput
							label="Email Address"
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
						<TextInput
							label="Location"
							placeholder="Enter location"
							required
							{...form.getInputProps('location')}
						/>
					</Stack>
				</div>

				<Divider my="md" />

				{/* Agent Type and Assignment */}
				<div className={classes.section}>
					<Title
						order={4}
						className={classes.sectionTitle}
					>
						Agent Type & Assignment
					</Title>
					<Stack spacing="md">
						<Select
							label="User Type"
							placeholder="Select user type"
							data={userTypes}
							required
							{...form.getInputProps('userType')}
						/>
						<Select
							label="Dealer"
							placeholder="Select dealer"
							data={mockDealers}
							required
							searchable
							{...form.getInputProps('dealerId')}
						/>
						<Select
							label="Shop (Optional)"
							placeholder="Select shop"
							data={mockShops}
							searchable
							clearable
							{...form.getInputProps('shopId')}
							disabled={form.values.userType !== 'shop_agent'}
						/>
					</Stack>
				</div>

				<Divider my="md" />

				{/* Additional Information */}
				<div className={classes.section}>
					<Title
						order={4}
						className={classes.sectionTitle}
					>
						Additional Information
					</Title>
					<Stack spacing="md">
						<TextInput
							label="Merchant Code"
							placeholder="Enter merchant code (optional)"
							{...form.getInputProps('merchantCode')}
						/>
						<TextInput
							label="ID Number"
							placeholder="Enter ID number (optional)"
							{...form.getInputProps('idNumber')}
						/>
					</Stack>
				</div>

				{/* Information Alert */}
				<Alert
					icon={<IconAlertCircle size={16} />}
					title="Important Information"
					color="blue"
					variant="light"
					mb="lg"
				>
					<Text size="sm">
						• Changes to user type may affect shop assignments
						<br />
						• Shop agents must be assigned to a specific shop
						<br />
						• DSAs and retailers operate independently of shops
						<br />• Updates will be applied immediately
					</Text>
				</Alert>

				{/* Form Actions */}
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
						color="blue"
						leftIcon={<IconEdit size={16} />}
					>
						Update Agent
					</Button>
				</Group>
			</form>
		</Modal>
	);
}
