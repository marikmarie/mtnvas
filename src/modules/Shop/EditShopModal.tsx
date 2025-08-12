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
import { IconBuildingStore, IconMapPin, IconEdit, IconAlertCircle } from '@tabler/icons-react';
import { Modal } from '../../components/Modal';
import useRequest from '../../hooks/useRequest';
import { Shop } from '../Dealer/types';

interface EditShopModalProps {
	opened: boolean;
	onClose: () => void;
	shop: Shop;
}

interface EditShopFormValues {
	shopName: string;
	location: string;
	region: string;
	adminId?: string;
	operatingHours?: string;
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

	shopInfo: {
		backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
		border: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[2]}`,
		borderRadius: theme.radius.md,
		padding: theme.spacing.md,
		marginBottom: theme.spacing.lg,
	},
}));

export function EditShopModal({ opened, onClose, shop }: EditShopModalProps) {
	const { classes } = useStyles();
	const request = useRequest(true);
	const queryClient = useQueryClient();

	const form = useForm<EditShopFormValues>({
		initialValues: {
			shopName: shop.shopName || '',
			location: shop.location || '',
			region: shop.region || '',
			adminId: shop.adminId || '',
			operatingHours: '',
		},
		validate: {
			shopName: (value) => (!value ? 'Shop name is required' : null),
			location: (value) => (!value ? 'Location is required' : null),
			region: (value) => (!value ? 'Region is required' : null),
		},
	});

	const mutation = useMutation({
		mutationFn: (values: EditShopFormValues) => {
			return request.put(`/shops/${shop.id}`, values);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['shops'] });
			onClose();
			form.reset();
		},
	});

	const handleSubmit = () => {
		mutation.mutate(form.values);
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
						color="yellow"
					>
						<IconEdit size={20} />
					</ThemeIcon>
					<div>
						<Title
							order={3}
							size="h4"
						>
							Edit Shop
						</Title>
						<Text
							color="dimmed"
							size="sm"
						>
							Update shop information for {shop.shopName}
						</Text>
					</div>
				</div>
			</div>

			{/* Form Section */}
			<div className={classes.formSection}>
				{/* Shop Information */}
				<div className={classes.shopInfo}>
					<Text
						size="sm"
						weight={500}
						color="dimmed"
						mb="xs"
					>
						Shop Details
					</Text>
					<Text
						size="sm"
						mb="xs"
					>
						<strong>Dealer:</strong> {shop.dealerName}
					</Text>
					<Text
						size="sm"
						mb="xs"
					>
						<strong>Status:</strong> {shop.status?.replace('_', ' ')}
					</Text>
					<Text size="sm">
						<strong>Created:</strong> {new Date(shop.createdAt).toLocaleDateString()}
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
									{...form.getInputProps('shopName')}
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
										label="Operating Hours"
										placeholder="e.g., 8:00 AM - 6:00 PM"
										icon={
											<IconBuildingStore
												size={16}
												className={classes.inputIcon}
											/>
										}
										{...form.getInputProps('operatingHours')}
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
									{...form.getInputProps('location')}
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
						leftIcon={<IconEdit size={16} />}
						className={classes.submitButton}
						radius="md"
						onClick={() => handleSubmit()}
					>
						Update Shop
					</Button>
				</Group>
			</div>
		</Modal>
	);
}
