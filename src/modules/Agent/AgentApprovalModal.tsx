import {
	Alert,
	Badge,
	Button,
	Group,
	Modal,
	Stack,
	Text,
	ThemeIcon,
	Title,
	createStyles,
} from '@mantine/core';
import {
	IconAlertCircle,
	IconCheck,
	IconMail,
	IconMapPin,
	IconPhone,
	IconUser,
	IconX,
} from '@tabler/icons-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import useRequest from '../../hooks/useRequest';
import { AgentApprovalModalProps } from '../Dealer/types';

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

export function AgentApprovalModal({ opened, onClose, agent, action }: AgentApprovalModalProps) {
	const { classes } = useStyles();
	const [isSubmitting, setIsSubmitting] = useState(false);
	const request = useRequest(true);
	const queryClient = useQueryClient();

	if (!agent) return null;

	const approvalMutation = useMutation({
		mutationFn: () =>
			request.post(
				`/agents/${agent.id}/Approve?action=${action}&reason=${action === 'Approve' ? 'Approved by admin' : 'Rejected by admin'}`
			),
		onSuccess: () => {
			queryClient.invalidateQueries(['agents']);
			onClose();
		},
		retry: false,
	});

	const handleSubmit = () => {
		setIsSubmitting(true);
		try {
			approvalMutation.mutate();
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleClose = () => {
		onClose();
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
							color="green"
						>
							<IconCheck size={24} />
						</ThemeIcon>
						<div>
							<Title order={3}>
								{action === 'Approve' ? 'Approve Agent' : 'Reject Agent'}
							</Title>
							<Text
								size="sm"
								color="dimmed"
							>
								{action === 'Approve'
									? 'Review and approve this agent application. You can also edit their information before approval.'
									: 'Provide a reason for rejecting this agent application.'}
							</Text>
						</div>
					</Group>
				</div>
			}
			size="lg"
			className={classes.modal}
			centered
		>
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
							{agent.agentName}
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
							color="yellow"
							variant="light"
							className={classes.statusBadge}
						>
							{agent.status.replace('_', ' ').toUpperCase()}
						</Badge>
					</div>
				</Stack>
			</div>

			<Alert
				icon={<IconAlertCircle size={16} />}
				title="Important Information"
				color="green"
				variant="light"
				mb="lg"
			>
				<Text size="sm">
					• Approved agents will be activated immediately
					<br />
					• They will receive access to the system
					<br />
					• Commission rates will be applied based on their user type
					<br />• You can edit their information before approval • Rejected agents will
					remain inactive
					<br />
					• They will be notified of the rejection with your reason
					<br />
					• They can reapply with corrected information
					<br />• Reason is required for rejection
				</Text>
			</Alert>

			{Boolean(approvalMutation.error) && (
				<Alert
					icon={<IconAlertCircle size={16} />}
					title="Action Error"
					color="red"
					variant="light"
					mb="lg"
				>
					<Text size="sm">
						Failed to {action.toLowerCase()} agent. Please check your connection and try
						again. If the problem persists, contact support.
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
					loading={isSubmitting}
					color={action === 'Approve' ? 'green' : 'red'}
					leftIcon={action === 'Approve' ? <IconCheck size={24} /> : <IconX size={24} />}
					onClick={handleSubmit}
				>
					{action === 'Approve' ? 'Approve Agent' : 'Reject Agent'}
				</Button>
			</Group>
		</Modal>
	);
}
