import {
	Modal,
	Select,
	Button,
	Group,
	Stack,
	Title,
	Text,
	createStyles,
	Divider,
	Alert,
	Badge,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import {
	IconAlertCircle,
	IconShield,
	IconUser,
	IconMail,
	IconPhone,
	IconMapPin,
} from '@tabler/icons-react';
import useRequest from '../../hooks/useRequest';
import { AddAgentCategoryModalProps, AddAgentCategoryPayload } from '../Dealer/types';

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

	agentInfo: {
		backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
		borderRadius: theme.radius.md,
		padding: theme.spacing.md,
		marginBottom: theme.spacing.lg,
	},

	infoRow: {
		display: 'flex',
		alignItems: 'center',
		gap: theme.spacing.sm,
		marginBottom: theme.spacing.xs,
	},

	statusBadge: {
		fontWeight: 600,
	},

	userTypeBadge: {
		fontWeight: 600,
		marginRight: theme.spacing.xs,
	},

	required: {
		color: theme.colors.red[6],
	},
}));

interface AddCategoryFormValues {
	userType: 'shop_agent' | 'dsa' | 'retailer';
	shopId?: string;
}

export function AddAgentCategoryModal({ opened, onClose, agent }: AddAgentCategoryModalProps) {
	const { classes } = useStyles();
	const [isSubmitting, setIsSubmitting] = useState(false);
	const request = useRequest(true);
	const queryClient = useQueryClient();

	// Don't render if no agent is provided
	if (!agent) return null;

	// Mock data - replace with actual API calls
	const mockShops = [
		{ value: 'shop1', label: 'Kampala Central Branch' },
		{ value: 'shop2', label: 'Entebbe Branch' },
	];

	const availableUserTypes = [
		{ value: 'shop_agent', label: 'Shop Agent' },
		{ value: 'dsa', label: 'DSA' },
		{ value: 'retailer', label: 'Retailer' },
	].filter((type) => type.value !== agent.userType); // Exclude current user type

	const form = useForm<AddCategoryFormValues>({
		initialValues: {
			userType: 'shop_agent',
			shopId: '',
		},
		validate: {
			userType: (value) => (value ? null : 'User type is required'),
			shopId: (value, values) => {
				if (values.userType === 'shop_agent' && !value) {
					return 'Shop is required for shop agents';
				}
				return null;
			},
		},
	});

	const addCategoryMutation = useMutation({
		mutationFn: (values: AddAgentCategoryPayload) =>
			request.post(`/agents/${agent.id}/add-category`, values),
		onSuccess: () => {
			queryClient.invalidateQueries(['agents']);
			onClose();
		},
		onError: (error) => {
			console.error('Error adding agent category:', error);
		},
	});

	const handleSubmit = async (values: AddCategoryFormValues) => {
		setIsSubmitting(true);
		try {
			const payload: AddAgentCategoryPayload = {
				userType: values.userType,
				shopId: values.shopId,
			};

			await addCategoryMutation.mutateAsync(payload);
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleClose = () => {
		form.reset();
		onClose();
	};

	const getUserTypeColor = (userType: string) => {
		switch (userType) {
			case 'shop_agent':
				return 'yellow';
			case 'dsa':
				return 'purple';
			case 'retailer':
				return 'orange';
			default:
				return 'gray';
		}
	};

	const getUserTypeLabel = (userType: string) => {
		switch (userType) {
			case 'shop_agent':
				return 'Shop Agent';
			case 'dsa':
				return 'DSA';
			case 'retailer':
				return 'Retailer';
			default:
				return userType;
		}
	};

	return (
		<Modal
			opened={opened}
			onClose={handleClose}
			title={
				<div className={classes.header}>
					<Group spacing="sm">
						<IconShield
							size={24}
							color="purple"
						/>
						<Title order={3}>Add Agent Category</Title>
					</Group>
					<Text
						size="sm"
						color="dimmed"
					>
						Add an additional user type category to this agent
					</Text>
				</div>
			}
			size="lg"
			className={classes.modal}
			centered
		>
			<form
				onSubmit={form.onSubmit(handleSubmit)}
				className={classes.form}
			>
				{/* Agent Information */}
				<div className={classes.section}>
					<Title
						order={4}
						className={classes.sectionTitle}
					>
						Agent Information
					</Title>
					<div className={classes.agentInfo}>
						<Stack spacing="sm">
							<div className={classes.infoRow}>
								<IconUser
									size={16}
									color="gray"
								/>
								<Text
									size="sm"
									weight={500}
								>
									{agent.name}
								</Text>
							</div>
							<div className={classes.infoRow}>
								<IconMail
									size={16}
									color="gray"
								/>
								<Text
									size="sm"
									color="dimmed"
								>
									{agent.email}
								</Text>
							</div>
							<div className={classes.infoRow}>
								<IconPhone
									size={16}
									color="gray"
								/>
								<Text
									size="sm"
									color="dimmed"
								>
									{agent.msisdn}
								</Text>
							</div>
							<div className={classes.infoRow}>
								<IconMapPin
									size={16}
									color="gray"
								/>
								<Text
									size="sm"
									color="dimmed"
								>
									{agent.location}
								</Text>
							</div>
							<div className={classes.infoRow}>
								<Text
									size="sm"
									weight={500}
								>
									Current Categories:
								</Text>
								<Badge
									color={getUserTypeColor(agent.userType)}
									variant="light"
									className={classes.userTypeBadge}
								>
									{getUserTypeLabel(agent.userType)}
								</Badge>
							</div>
						</Stack>
					</div>
				</div>

				<Divider my="md" />

				{/* New Category Selection */}
				<div className={classes.section}>
					<Title
						order={4}
						className={classes.sectionTitle}
					>
						New Category Details
					</Title>
					<Stack spacing="md">
						<Select
							label="New User Type"
							placeholder="Select new user type"
							data={availableUserTypes}
							required
							{...form.getInputProps('userType')}
						/>
						<Select
							label="Shop Assignment"
							placeholder="Select shop (required for shop agents)"
							data={mockShops}
							searchable
							clearable
							{...form.getInputProps('shopId')}
							disabled={form.values.userType !== 'shop_agent'}
							required={form.values.userType === 'shop_agent'}
						/>
					</Stack>
				</div>

				{/* Information Alert */}
				<Alert
					icon={<IconAlertCircle size={16} />}
					title="Important Information"
					color="purple"
					variant="light"
					mb="lg"
				>
					<Text size="sm">
						• Adding a new category allows the agent to operate in multiple roles
						<br />
						• Shop agents must be assigned to a specific shop
						<br />
						• DSAs and retailers operate independently of shops
						<br />
						• The agent will maintain their existing category while gaining the new one
						<br />• Commission rates may vary between different user types
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
						color="purple"
						leftIcon={<IconShield size={16} />}
					>
						Add Category
					</Button>
				</Group>
			</form>
		</Modal>
	);
}
