import { Button, Group, Text, Title, createStyles, ThemeIcon, Alert } from '@mantine/core';
import { useMutation } from '@tanstack/react-query';
import { IconAlertTriangle, IconCheck, IconPower, IconTrash, IconX } from '@tabler/icons-react';
import { Modal } from '../../components/Modal';
import useRequest from '../../hooks/useRequest';
import { Dealer } from './types';

interface ConfirmationModalProps {
	opened: boolean;
	onClose: () => void;
	action: 'activate' | 'deactivate' | 'delete';
	dealer: Dealer;
}

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

	content: {
		padding: theme.spacing.lg,
	},

	iconContainer: {
		display: 'flex',
		justifyContent: 'center',
		marginBottom: theme.spacing.md,
	},

	actionIcon: {
		width: 64,
		height: 64,
		borderRadius: '50%',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
	},

	title: {
		textAlign: 'center',
		marginBottom: theme.spacing.sm,
	},

	description: {
		textAlign: 'center',
		marginBottom: theme.spacing.md,
		color: theme.colorScheme === 'dark' ? theme.colors.dark[1] : theme.colors.gray[7],
	},

	dealerInfo: {
		backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
		border: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[2]}`,
		borderRadius: theme.radius.md,
		padding: theme.spacing.md,
		marginBottom: theme.spacing.lg,
		textAlign: 'center',
	},

	warningText: {
		textAlign: 'center',
		fontSize: theme.fontSizes.sm,
		color: theme.colorScheme === 'dark' ? theme.colors.dark[2] : theme.colors.gray[6],
		marginBottom: theme.spacing.lg,
	},

	actions: {
		padding: theme.spacing.lg,
		borderTop: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[2]}`,
		backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
	},

	confirmButton: {
		transition: 'all 0.2s ease',

		'&:hover': {
			transform: 'translateY(-1px)',
			boxShadow: theme.shadows.md,
		},
	},

	cancelButton: {
		transition: 'all 0.2s ease',

		'&:hover': {
			transform: 'translateY(-1px)',
		},
	},
}));

export function ConfirmationModal({ opened, onClose, action, dealer }: ConfirmationModalProps) {
	const { classes } = useStyles();
	const request = useRequest(true);

	const mutation = useMutation({
		mutationFn: () => {
			if (action === 'delete') {
				return request.delete(`/dealer-groups/${dealer.id}`);
			}
			return request.post(`/dealer-groups/${dealer.id}/status`, {
				status: action === 'activate' ? 'active' : 'inactive',
			});
		},
		onSuccess: () => {
			onClose();
		},
	});

	const getActionColor = () => {
		switch (action) {
			case 'activate':
				return 'green';
			case 'deactivate':
			case 'delete':
				return 'red';
			default:
				return 'blue';
		}
	};

	const getActionIcon = () => {
		switch (action) {
			case 'activate':
				return <IconCheck size={32} />;
			case 'deactivate':
				return <IconPower size={32} />;
			case 'delete':
				return <IconTrash size={32} />;
			default:
				return <IconAlertTriangle size={32} />;
		}
	};

	const getActionTitle = () => {
		switch (action) {
			case 'activate':
				return 'Activate Dealer';
			case 'deactivate':
				return 'Deactivate Dealer';
			case 'delete':
				return 'Delete Dealer';
			default:
				return 'Confirm Action';
		}
	};

	const getActionDescription = () => {
		switch (action) {
			case 'activate':
				return `Are you sure you want to activate "${dealer.name}"? This will enable the dealer to access the system.`;
			case 'deactivate':
				return `Are you sure you want to deactivate "${dealer.name}"? This will temporarily disable the dealer's access.`;
			case 'delete':
				return `Are you sure you want to permanently delete "${dealer.name}"? This action cannot be undone.`;
			default:
				return `Are you sure you want to ${action} the dealer "${dealer.name}"?`;
		}
	};

	const getWarningText = () => {
		switch (action) {
			case 'delete':
				return '⚠️ This action is permanent and cannot be undone. All associated data will be lost.';
			case 'deactivate':
				return '⚠️ The dealer will lose access to the system until reactivated.';
			case 'activate':
				return '✅ The dealer will gain full access to the system.';
			default:
				return '';
		}
	};

	const handleConfirm = () => {
		mutation.mutate();
	};

	return (
		<Modal
			opened={opened}
			close={onClose}
			size="md"
		>
			{/* Enhanced Header */}
			<div className={classes.header}>
				<div className={classes.headerContent}>
					<ThemeIcon
						size={40}
						radius="md"
						variant="light"
						color={getActionColor()}
					>
						<IconAlertTriangle size={20} />
					</ThemeIcon>
					<div>
						<Title
							order={3}
							size="h4"
						>
							{getActionTitle()}
						</Title>
						<Text
							color="dimmed"
							size="sm"
						>
							Confirm your action
						</Text>
					</div>
				</div>
			</div>

			{/* Content */}
			<div className={classes.content}>
				{/* Action Icon */}
				<div className={classes.iconContainer}>
					<div
						className={classes.actionIcon}
						style={{
							backgroundColor: `var(--mantine-color-${getActionColor()}-1)`,
							color: `var(--mantine-color-${getActionColor()}-6)`,
						}}
					>
						{getActionIcon()}
					</div>
				</div>

				{/* Title and Description */}
				<Title
					order={4}
					className={classes.title}
				>
					{getActionTitle()}
				</Title>
				<Text className={classes.description}>{getActionDescription()}</Text>

				{/* Dealer Information */}
				<div className={classes.dealerInfo}>
					<Text
						size="sm"
						weight={500}
						color="dimmed"
						mb="xs"
					>
						Dealer Details
					</Text>
					<Text
						weight={600}
						size="lg"
					>
						{dealer.name}
					</Text>
					<Text
						size="sm"
						color="dimmed"
					>
						{dealer.contactPerson} • {dealer.email}
					</Text>
				</div>

				{/* Warning Text */}
				{getWarningText() && (
					<Alert
						color={
							action === 'delete'
								? 'red'
								: action === 'deactivate'
									? 'orange'
									: 'green'
						}
						variant="light"
						className={classes.warningText}
					>
						{getWarningText()}
					</Alert>
				)}
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
						leftIcon={<IconX size={16} />}
						className={classes.cancelButton}
						radius="md"
					>
						Cancel
					</Button>
					<Button
						color={getActionColor()}
						onClick={handleConfirm}
						loading={mutation.isLoading}
						leftIcon={getActionIcon()}
						className={classes.confirmButton}
						radius="md"
					>
						{action.charAt(0).toUpperCase() + action.slice(1)}
					</Button>
				</Group>
			</div>
		</Modal>
	);
}
