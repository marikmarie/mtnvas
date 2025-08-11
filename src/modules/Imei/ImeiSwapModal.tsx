import {
	Button,
	Group,
	Stack,
	TextInput,
	Textarea,
	Title,
	Text,
	createStyles,
	ThemeIcon,
	Alert,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
	IconRefresh,
	IconDeviceMobile,
	IconFileText,
	IconAlertCircle,
	IconArrowRight,
} from '@tabler/icons-react';
import { Modal } from '../../components/Modal';
import useRequest from '../../hooks/useRequest';

interface ImeiSwapModalProps {
	opened: boolean;
	onClose: () => void;
	oldImei: string;
}

interface ImeiSwapFormValues {
	newImei: string;
	reason: string;
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

	formSection: {
		padding: theme.spacing.lg,
	},

	formGroup: {
		marginBottom: theme.spacing.md,
	},

	inputWrapper: {
		position: 'relative',
	},

	inputIcon: {
		color: theme.colors.gray[5],
	},

	actions: {
		padding: theme.spacing.lg,
		borderTop: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[2]}`,
		backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
	},

	submitButton: {
		transition: 'all 0.2s ease',

		'&:hover': {
			transform: 'translateY(-1px)',
			boxShadow: theme.shadows.md,
		},
	},

	errorAlert: {
		marginBottom: theme.spacing.md,
	},

	imeiInfo: {
		backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
		border: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[2]}`,
		borderRadius: theme.radius.md,
		padding: theme.spacing.md,
		marginBottom: theme.spacing.lg,
	},

	swapArrow: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		margin: theme.spacing.md,
		color: theme.colors.blue[6],
	},

	imeiDisplay: {
		fontFamily: 'monospace',
		fontSize: theme.fontSizes.sm,
		fontWeight: 600,
		backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[1],
		padding: theme.spacing.xs,
		borderRadius: theme.radius.sm,
		border: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[3]}`,
	},
}));

export function ImeiSwapModal({ opened, onClose, oldImei }: ImeiSwapModalProps) {
	const { classes } = useStyles();
	const request = useRequest(true);
	const queryClient = useQueryClient();

	const form = useForm<ImeiSwapFormValues>({
		initialValues: {
			newImei: '',
			reason: '',
		},
		validate: {
			newImei: (value) => (!value ? 'New IMEI is required' : null),
			reason: (value) => (!value ? 'Reason is required' : null),
		},
	});

	const mutation = useMutation({
		mutationFn: (values: ImeiSwapFormValues) => {
			return request.post('/imei-swaps', {
				oldImei,
				...values,
			});
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['imeis'] });
			onClose();
			form.reset();
		},
	});

	const handleSubmit = (values: ImeiSwapFormValues) => {
		mutation.mutate(values);
	};

	const hasErrors = Object.keys(form.errors).length > 0;

	return (
		<Modal
			opened={opened}
			close={onClose}
			size="lg"
		>
			{/* Enhanced Header */}
			<div className={classes.header}>
				<div className={classes.headerContent}>
					<ThemeIcon
						size={40}
						radius="md"
						variant="light"
						color="orange"
					>
						<IconRefresh size={20} />
					</ThemeIcon>
					<div>
						<Title
							order={3}
							size="h4"
						>
							Swap IMEI
						</Title>
						<Text
							color="dimmed"
							size="sm"
						>
							Replace an existing IMEI with a new one
						</Text>
					</div>
				</div>
			</div>

			{/* Form Section */}
			<div className={classes.formSection}>
				{/* IMEI Information */}
				<div className={classes.imeiInfo}>
					<Text
						size="sm"
						weight={500}
						color="dimmed"
						mb="xs"
					>
						IMEI Swap Details
					</Text>
					<Text size="sm">
						You are about to swap IMEI <strong>{oldImei}</strong> with a new one.
					</Text>
				</div>

				{hasErrors && (
					<Alert
						icon={<IconAlertCircle size={16} />}
						title="Please fix the following errors"
						color="red"
						className={classes.errorAlert}
					>
						Please correct the highlighted fields before submitting.
					</Alert>
				)}

				<form onSubmit={form.onSubmit(handleSubmit)}>
					<Stack spacing="lg">
						{/* IMEI Swap */}
						<div className={classes.formGroup}>
							<Text
								size="sm"
								weight={500}
								color="dimmed"
								mb="xs"
							>
								IMEI Swap
							</Text>

							{/* Old IMEI */}
							<div className={classes.inputWrapper}>
								<TextInput
									label="Current IMEI"
									value={oldImei}
									disabled
									icon={
										<IconDeviceMobile
											size={16}
											className={classes.inputIcon}
										/>
									}
									className={classes.imeiDisplay}
									radius="md"
								/>
							</div>

							{/* Swap Arrow */}
							<div className={classes.swapArrow}>
								<IconArrowRight size={24} />
							</div>

							{/* New IMEI */}
							<div className={classes.inputWrapper}>
								<TextInput
									label="New IMEI"
									placeholder="Enter new IMEI number"
									required
									icon={
										<IconDeviceMobile
											size={16}
											className={classes.inputIcon}
										/>
									}
									{...form.getInputProps('newImei')}
									radius="md"
								/>
							</div>
						</div>

						{/* Reason for Swap */}
						<div className={classes.formGroup}>
							<Text
								size="sm"
								weight={500}
								color="dimmed"
								mb="xs"
							>
								Swap Reason
							</Text>
							<div className={classes.inputWrapper}>
								<Textarea
									label="Reason for Swap"
									placeholder="Enter detailed reason for swapping IMEI (e.g., device malfunction, upgrade, etc.)"
									required
									minRows={3}
									icon={
										<IconFileText
											size={16}
											className={classes.inputIcon}
										/>
									}
									{...form.getInputProps('reason')}
									radius="md"
								/>
							</div>
						</div>
					</Stack>
				</form>
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
						radius="md"
					>
						Cancel
					</Button>
					<Button
						type="submit"
						loading={mutation.isLoading}
						leftIcon={<IconRefresh size={16} />}
						className={classes.submitButton}
						radius="md"
						onClick={() => handleSubmit(form.values)}
					>
						Swap IMEI
					</Button>
				</Group>
			</div>
		</Modal>
	);
}
