import {
	Modal,
	TextInput,
	Textarea,
	Button,
	Group,
	Stack,
	Title,
	Text,
	createStyles,
	Divider,
	Alert,
	Badge,
	ThemeIcon,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import {
	IconAlertCircle,
	IconCheck,
	IconX,
	IconUser,
	IconMail,
	IconPhone,
	IconMapPin,
} from '@tabler/icons-react';
import useRequest from '../../hooks/useRequest';
import { AgentApprovalModalProps, AgentApprovalPayload } from '../Dealer/types';

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

	required: {
		color: theme.colors.red[6],
	},
}));

interface ApprovalFormValues {
	reason?: string;
	name?: string;
	email?: string;
	msisdn?: string;
	location?: string;
}

export function AgentApprovalModal({ opened, onClose, agent, action }: AgentApprovalModalProps) {
	const { classes } = useStyles();
	const [isSubmitting, setIsSubmitting] = useState(false);
	const request = useRequest(true);
	const queryClient = useQueryClient();

	// Don't render if no agent is provided
	if (!agent) return null;

	const form = useForm<ApprovalFormValues>({
		initialValues: {
			reason: '',
			name: agent?.name || '',
			email: agent?.email || '',
			msisdn: agent?.msisdn || '',
			location: agent?.location || '',
		},
		validate: {
			reason: (value) => {
				if (action === 'reject' && !value?.trim()) {
					return 'Reason is required for rejection';
				}
				return null;
			},
			name: (value) => {
				if (value && value.trim().length < 2) {
					return 'Name must be at least 2 characters';
				}
				return null;
			},
			email: (value) => {
				if (value && !/^\S+@\S+$/.test(value)) {
					return 'Invalid email address';
				}
				return null;
			},
			msisdn: (value) => {
				if (value && value.trim().length < 10) {
					return 'Phone number must be at least 10 digits';
				}
				return null;
			},
			location: (value) => {
				if (value && value.trim().length < 3) {
					return 'Location must be at least 3 characters';
				}
				return null;
			},
		},
	});

	const approvalMutation = useMutation({
		mutationFn: (values: AgentApprovalPayload) =>
			request.post(`/agents/${agent.id}/approval`, values),
		onSuccess: () => {
			queryClient.invalidateQueries(['agents']);
			onClose();
		},
		onError: (error) => {
			console.error('Error processing approval:', error);
		},
	});

	const handleSubmit = async (values: ApprovalFormValues) => {
		setIsSubmitting(true);
		try {
			const payload: AgentApprovalPayload = {
				action,
				reason: values.reason,
			};

			// Only include editable fields if they were changed
			if (values.name !== agent.name) payload.name = values.name;
			if (values.email !== agent.email) payload.email = values.email;
			if (values.msisdn !== agent.msisdn) payload.msisdn = values.msisdn;
			if (values.location !== agent.location) payload.location = values.location;

			await approvalMutation.mutateAsync(payload);
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleClose = () => {
		form.reset();
		onClose();
	};

	const getActionColor = () => {
		return action === 'approve' ? 'green' : 'red';
	};

	const getActionIcon = () => {
		return action === 'approve' ? <IconCheck size={24} /> : <IconX size={24} />;
	};

	const getActionTitle = () => {
		return action === 'approve' ? 'Approve Agent' : 'Reject Agent';
	};

	const getActionDescription = () => {
		return action === 'approve'
			? 'Review and approve this agent application. You can also edit their information before approval.'
			: 'Provide a reason for rejecting this agent application.';
	};

	return (
		<Modal
			opened={opened}
			onClose={handleClose}
			title={
				<div className={classes.header}>
					<Group spacing="sm">
						<ThemeIcon
							size={40}
							radius="md"
							variant="light"
							color={getActionColor()}
						>
							{getActionIcon()}
						</ThemeIcon>
						<div>
							<Title order={3}>{getActionTitle()}</Title>
							<Text
								size="sm"
								color="dimmed"
							>
								{getActionDescription()}
							</Text>
						</div>
					</Group>
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
								<Badge
									color={action === 'approve' ? 'yellow' : 'red'}
									variant="light"
									className={classes.statusBadge}
								>
									{agent.status.replace('_', ' ').toUpperCase()}
								</Badge>
							</div>
						</Stack>
					</div>
				</div>

				<Divider my="md" />

				{/* Editable Information (for approval) */}
				{action === 'approve' && (
					<>
						<div className={classes.section}>
							<Title
								order={4}
								className={classes.sectionTitle}
							>
								Edit Information (Optional)
							</Title>
							<Text
								size="sm"
								color="dimmed"
								mb="md"
							>
								You can edit the agent's information before approval. Leave fields
								unchanged if no edits are needed.
							</Text>
							<Stack spacing="md">
								<TextInput
									label="Full Name"
									placeholder="Enter full name"
									{...form.getInputProps('name')}
								/>
								<TextInput
									label="Email Address"
									placeholder="Enter email address"
									type="email"
									{...form.getInputProps('email')}
								/>
								<TextInput
									label="Phone Number (MSISDN)"
									placeholder="+256701234567"
									{...form.getInputProps('msisdn')}
								/>
								<TextInput
									label="Location"
									placeholder="Enter location"
									{...form.getInputProps('location')}
								/>
							</Stack>
						</div>
						<Divider my="md" />
					</>
				)}

				{/* Reason (required for rejection) */}
				<div className={classes.section}>
					<Title
						order={4}
						className={classes.sectionTitle}
					>
						{action === 'approve' ? 'Approval Notes (Optional)' : 'Rejection Reason'}
						{action === 'reject' && <span className={classes.required}> *</span>}
					</Title>
					<Textarea
						placeholder={
							action === 'approve'
								? 'Add any notes about this approval...'
								: 'Please provide a reason for rejecting this application...'
						}
						minRows={3}
						maxRows={5}
						{...form.getInputProps('reason')}
					/>
				</div>

				{/* Information Alert */}
				<Alert
					icon={<IconAlertCircle size={16} />}
					title="Important Information"
					color={action === 'approve' ? 'green' : 'red'}
					variant="light"
					mb="lg"
				>
					<Text size="sm">
						{action === 'approve' ? (
							<>
								• Approved agents will be activated immediately
								<br />
								• They will receive access to the system
								<br />
								• Commission rates will be applied based on their user type
								<br />• You can edit their information before approval
							</>
						) : (
							<>
								• Rejected agents will remain inactive
								<br />
								• They will be notified of the rejection with your reason
								<br />
								• They can reapply with corrected information
								<br />• Reason is required for rejection
							</>
						)}
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
						color={getActionColor()}
						leftIcon={getActionIcon()}
					>
						{action === 'approve' ? 'Approve Agent' : 'Reject Agent'}
					</Button>
				</Group>
			</form>
		</Modal>
	);
}
