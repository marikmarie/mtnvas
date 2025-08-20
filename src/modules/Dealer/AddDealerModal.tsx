import {
	Alert,
	Button,
	createStyles,
	Group,
	Select,
	Stack,
	Text,
	TextInput,
	ThemeIcon,
	Title,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import {
	IconAlertCircle,
	IconBuilding,
	IconCategory,
	IconPhone,
	IconPlus,
	IconUser,
} from '@tabler/icons-react';
import { useMutation } from '@tanstack/react-query';
import { Modal } from '../../components/Modal';
import useRequest from '../../hooks/useRequest';
import { formatPhoneNumber } from '../../utils/phone.util';
import { DealerModalProps } from './types';

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

	formRow: {
		display: 'grid',
		gridTemplateColumns: '1fr 1fr',
		gap: theme.spacing.md,

		[theme.fn.smallerThan('sm')]: {
			gridTemplateColumns: '1fr',
		},
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
}));

export function AddDealerModal({ opened, onClose }: DealerModalProps) {
	const { classes } = useStyles();
	const request = useRequest(true);

	const form = useForm({
		initialValues: {
			dealerName: '',
			email: '',
			msisdn: '',
			department: '',
			location: '',
			region: '',
		},
		validate: {
			dealerName: (value) => (!value ? 'Dealer name is required' : null),
			email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
			msisdn: (value) => {
				if (!value) return 'Phone number is required';
				return null;
			},
			department: (value) => (!value ? 'Department is required' : null),
			location: (value) => (!value ? 'Location is required' : null),
			region: (value) => (!value ? 'Region is required' : null),
		},
	});

	const mutation = useMutation({
		mutationFn: () =>
			request.post('/dealer', {
				...form.values,
				msisdn: formatPhoneNumber(form.values.msisdn),
			}),
		mutationKey: ['dealers'],
		onSuccess: () => {
			onClose();
			form.reset();
		},
	});

	const handleSubmit = form.onSubmit(() => mutation.mutate());

	const hasErrors = Object.keys(form.errors).length > 0;

	return (
		<Modal
			opened={opened}
			close={onClose}
			size="lg"
		>
			<div className={classes.header}>
				<div className={classes.headerContent}>
					<ThemeIcon
						size={40}
						radius="md"
						variant="light"
						color="yellow"
					>
						<IconPlus size={20} />
					</ThemeIcon>
					<div>
						<Title
							order={3}
							size="h4"
						>
							Add New Dealer
						</Title>
						<Text
							color="dimmed"
							size="sm"
						>
							Create a new dealer account with company information
						</Text>
					</div>
				</div>
			</div>

			<div className={classes.formSection}>
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

				<form onSubmit={handleSubmit}>
					<Stack spacing="lg">
						<div className={classes.formRow}>
							<div className={classes.inputWrapper}>
								<TextInput
									label="Dealer Name"
									placeholder="Enter dealer name"
									required
									icon={
										<IconBuilding
											size={16}
											className={classes.inputIcon}
										/>
									}
									{...form.getInputProps('dealerName')}
									radius="md"
								/>
							</div>

							<TextInput
								label="Email"
								placeholder="Enter email address"
								required
								icon={
									<IconUser
										size={16}
										className={classes.inputIcon}
									/>
								}
								{...form.getInputProps('email')}
								radius="md"
							/>
							<TextInput
								label="Phone Number"
								placeholder="Enter phone number"
								required
								icon={
									<IconPhone
										size={16}
										className={classes.inputIcon}
									/>
								}
								{...form.getInputProps('msisdn')}
								radius="md"
							/>
						</div>

						<div className={classes.inputWrapper}>
							<Select
								label="Department"
								placeholder="Select dealer department"
								required
								icon={
									<IconCategory
										size={16}
										className={classes.inputIcon}
									/>
								}
								data={[
									{ value: 'EBU', label: 'EBU' },
									{ value: 'Consumer', label: 'Consumer' },
									{ value: 'Both', label: 'Both' },
								]}
								{...form.getInputProps('department')}
								radius="md"
							/>
						</div>
						<div className={classes.formRow}>
							<div className={classes.inputWrapper}>
								<TextInput
									label="Region"
									placeholder="Enter region"
									{...form.getInputProps('region')}
									radius="md"
								/>
							</div>
							<div className={classes.inputWrapper}>
								<TextInput
									label="Location"
									placeholder="Enter location"
									{...form.getInputProps('location')}
									radius="md"
								/>
							</div>
						</div>
					</Stack>
				</form>
			</div>

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
						leftIcon={<IconPlus size={16} />}
						className={classes.submitButton}
						radius="md"
						onClick={() => handleSubmit()}
					>
						Add Dealer
					</Button>
				</Group>
			</div>
		</Modal>
	);
}
