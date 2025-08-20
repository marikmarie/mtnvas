import {
	Alert,
	Button,
	createStyles,
	Group,
	Modal,
	Stack,
	Text,
	TextInput,
	Title,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconAlertCircle, IconEdit } from '@tabler/icons-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import useRequest from '../../hooks/useRequest';
import { formatPhoneNumber } from '../../utils/phone.util';
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
	agentName: string;
	email: string;
	msisdn: string;
	location: string;
	region: string;
	merchantCode?: string;
	idNumber?: string;
}

export function EditAgentModal({ opened, onClose, agent }: AgentModalProps) {
	const { classes } = useStyles();
	const [isSubmitting, setIsSubmitting] = useState(false);
	const request = useRequest(true);
	const queryClient = useQueryClient();

	const form = useForm<EditAgentFormValues>({
		initialValues: {
			agentName: '',
			email: '',
			msisdn: '',
			location: '',
			region: '',
			merchantCode: '',
			idNumber: '',
		},
		validate: {
			agentName: (value) =>
				value.trim().length < 2 ? 'Name must be at least 2 characters' : null,
			email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email address'),
			msisdn: (value) =>
				value.trim().length < 10 ? 'Phone number must be at least 10 digits' : null,
			location: (value) =>
				value.trim().length < 3 ? 'Location must be at least 3 characters' : null,
		},
	});

	useEffect(() => {
		if (agent) {
			form.setValues({
				agentName: agent.agentName,
				email: agent.email,
				msisdn: formatPhoneNumber(agent.msisdn),
				location: agent.location,
				region: agent.region,
				merchantCode: agent.merchantCode || '',
				idNumber: '',
			});
		}
	}, [agent]);

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
							color="yellow"
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
			centered
		>
			<form
				onSubmit={form.onSubmit(handleSubmit)}
				className={classes.form}
			>
				<div className={classes.section}>
					<Title
						order={4}
						className={classes.sectionTitle}
					>
						Basic Information
					</Title>
					<Stack spacing="md">
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
						<TextInput
							label="Location"
							placeholder="Enter location"
							required
							{...form.getInputProps('location')}
						/>
					</Stack>
				</div>

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

				<Alert
					icon={<IconAlertCircle size={16} />}
					title="Important Information"
					color="yellow"
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
						leftIcon={<IconEdit size={16} />}
					>
						Update Agent
					</Button>
				</Group>
			</form>
		</Modal>
	);
}
