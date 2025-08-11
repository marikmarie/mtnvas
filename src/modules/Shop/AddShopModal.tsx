import {
	Button,
	Group,
	Stack,
	TextInput,
	Title,
	Text,
	createStyles,
	ThemeIcon,
	Alert,
	Select,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
	IconBuildingStore,
	IconMapPin,
	IconPhone,
	IconPlus,
	IconAlertCircle,
} from '@tabler/icons-react';
import { Modal } from '../../components/Modal';
import useRequest from '../../hooks/useRequest';
import { Dealer } from '../Dealer/types';

interface AddShopModalProps {
	opened: boolean;
	onClose: () => void;
	dealer: Dealer;
}

interface ShopFormValues {
	name: string;
	address: string;
	phone: string;
	region: string;
}

const useStyles = createStyles((theme) => ({
	modalContent: {
		padding: 0,
	},

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

	dealerInfo: {
		backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
		border: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[2]}`,
		borderRadius: theme.radius.md,
		padding: theme.spacing.md,
		marginBottom: theme.spacing.lg,
	},
}));

export function AddShopModal({ opened, onClose, dealer }: AddShopModalProps) {
	const { classes } = useStyles();
	const request = useRequest(true);
	const queryClient = useQueryClient();

	const form = useForm<ShopFormValues>({
		initialValues: {
			name: '',
			address: '',
			phone: '',
			region: '',
		},
		validate: {
			name: (value) => (!value ? 'Shop name is required' : null),
			address: (value) => (!value ? 'Address is required' : null),
			phone: (value) => (!value ? 'Phone number is required' : null),
			region: (value) => (!value ? 'Region is required' : null),
		},
	});

	const mutation = useMutation({
		mutationFn: (values: ShopFormValues) => {
			return request.post(`/dealer-groups/${dealer.id}/shops`, values);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['dealer', dealer.id] });
			onClose();
			form.reset();
		},
	});

	const handleSubmit = (values: ShopFormValues) => {
		mutation.mutate(values);
	};

	const hasErrors = Object.keys(form.errors).length > 0;

	return (
		<Modal
			opened={opened}
			close={onClose}
			size="lg"
			classNames={{
				content: classes.modalContent,
			}}
		>
			{/* Enhanced Header */}
			<div className={classes.header}>
				<div className={classes.headerContent}>
					<ThemeIcon
						size={40}
						radius="md"
						variant="light"
						color="green"
					>
						<IconPlus size={20} />
					</ThemeIcon>
					<div>
						<Title
							order={3}
							size="h4"
						>
							Add New Shop
						</Title>
						<Text
							color="dimmed"
							size="sm"
						>
							Create a new shop location for {dealer.name}
						</Text>
					</div>
				</div>
			</div>

			{/* Form Section */}
			<div className={classes.formSection}>
				{/* Dealer Information */}
				<div className={classes.dealerInfo}>
					<Text
						size="sm"
						weight={500}
						color="dimmed"
						mb="xs"
					>
						Parent Dealer
					</Text>
					<Text weight={600}>{dealer.name}</Text>
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
						{/* Shop Information */}
						<div className={classes.formGroup}>
							<Text
								size="sm"
								weight={500}
								color="dimmed"
								mb="xs"
							>
								Shop Information
							</Text>
							<div className={classes.inputWrapper}>
								<TextInput
									label="Shop Name"
									placeholder="Enter shop name"
									required
									icon={
										<IconBuildingStore
											size={16}
											className={classes.inputIcon}
										/>
									}
									{...form.getInputProps('name')}
									radius="md"
								/>
							</div>
						</div>

						{/* Location Information */}
						<div className={classes.formGroup}>
							<Text
								size="sm"
								weight={500}
								color="dimmed"
								mb="xs"
							>
								Location Details
							</Text>
							<div className={classes.formRow}>
								<div className={classes.inputWrapper}>
									<Select
										label="Region"
										placeholder="Select region"
										required
										data={[
											{ value: 'central', label: 'Central' },
											{ value: 'eastern', label: 'Eastern' },
											{ value: 'western', label: 'Western' },
											{ value: 'northern', label: 'Northern' },
											{ value: 'southern', label: 'Southern' },
										]}
										{...form.getInputProps('region')}
										radius="md"
									/>
								</div>
								<div className={classes.inputWrapper}>
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
										{...form.getInputProps('phone')}
										radius="md"
									/>
								</div>
							</div>
							<div className={classes.inputWrapper}>
								<TextInput
									label="Address"
									placeholder="Enter shop address"
									required
									icon={
										<IconMapPin
											size={16}
											className={classes.inputIcon}
										/>
									}
									{...form.getInputProps('address')}
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
						leftIcon={<IconPlus size={16} />}
						className={classes.submitButton}
						radius="md"
						onClick={form.onSubmit(handleSubmit)}
					>
						Add Shop
					</Button>
				</Group>
			</div>
		</Modal>
	);
}
