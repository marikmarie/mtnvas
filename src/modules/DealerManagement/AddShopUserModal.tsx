import {
	Button,
	Group,
	Select,
	Stack,
	Text,
	TextInput,
	Title,
	createStyles,
	ThemeIcon,
	Alert,
	Badge,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
	IconUserPlus,
	IconUser,
	IconMail,
	IconPhone,
	IconBuildingStore,
	IconShield,
	IconAlertCircle,
} from '@tabler/icons-react';
import { Modal } from '../../components/Modal';
import useRequest from '../../hooks/useRequest';
import { Dealer } from './types';

interface Shop {
	id: string;
	name: string;
}

interface AddShopUserModalProps {
	opened: boolean;
	onClose: () => void;
	dealer: Dealer;
	shops: Shop[];
}

interface ShopUserFormValues {
	firstName: string;
	lastName: string;
	email: string;
	phone: string;
	shopId: string;
	role: string;
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

	shopInfo: {
		backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
		border: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[2]}`,
		borderRadius: theme.radius.md,
		padding: theme.spacing.md,
		marginBottom: theme.spacing.lg,
	},
}));

export function AddShopUserModal({ opened, onClose, dealer, shops }: AddShopUserModalProps) {
	const { classes } = useStyles();
	const request = useRequest(true);
	const queryClient = useQueryClient();

	const form = useForm<ShopUserFormValues>({
		initialValues: {
			firstName: '',
			lastName: '',
			email: '',
			phone: '',
			shopId: '',
			role: 'shop_user',
		},
		validate: {
			firstName: (value) => (!value ? 'First name is required' : null),
			lastName: (value) => (!value ? 'Last name is required' : null),
			email: (value) => (!value ? 'Email is required' : null),
			phone: (value) => (!value ? 'Phone number is required' : null),
			shopId: (value) => (!value ? 'Shop is required' : null),
		},
	});

	const mutation = useMutation({
		mutationFn: (values: ShopUserFormValues) => {
			return request.post(`/dealer-groups/${dealer.id}/users`, values);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['dealer', dealer.id] });
			onClose();
			form.reset();
		},
	});

	const handleSubmit = (values: ShopUserFormValues) => {
		mutation.mutate(values);
	};

	const shopOptions = shops.map((shop) => ({
		value: shop.id,
		label: shop.name,
	}));

	const selectedShop = shops.find((s) => s.id === form.values.shopId);
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
						<IconUserPlus size={20} />
					</ThemeIcon>
					<div>
						<Title
							order={3}
							size="h4"
						>
							Add Shop User
						</Title>
						<Text
							color="dimmed"
							size="sm"
						>
							Create a new user account for shop management
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

				{/* Shop Selection Info */}
				{selectedShop && (
					<div className={classes.shopInfo}>
						<Text
							size="sm"
							weight={500}
							color="dimmed"
							mb="xs"
						>
							Selected Shop
						</Text>
						<Group spacing="xs">
							<IconBuildingStore size={16} />
							<Text weight={600}>{selectedShop.name}</Text>
							<Badge
								color="green"
								variant="light"
								size="sm"
							>
								Active
							</Badge>
						</Group>
					</div>
				)}

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
						{/* Personal Information */}
						<div className={classes.formGroup}>
							<Text
								size="sm"
								weight={500}
								color="dimmed"
								mb="xs"
							>
								Personal Information
							</Text>
							<div className={classes.formRow}>
								<div className={classes.inputWrapper}>
									<TextInput
										label="First Name"
										placeholder="Enter first name"
										required
										icon={
											<IconUser
												size={16}
												className={classes.inputIcon}
											/>
										}
										{...form.getInputProps('firstName')}
										radius="md"
									/>
								</div>
								<div className={classes.inputWrapper}>
									<TextInput
										label="Last Name"
										placeholder="Enter last name"
										required
										icon={
											<IconUser
												size={16}
												className={classes.inputIcon}
											/>
										}
										{...form.getInputProps('lastName')}
										radius="md"
									/>
								</div>
							</div>
						</div>

						{/* Contact Information */}
						<div className={classes.formGroup}>
							<Text
								size="sm"
								weight={500}
								color="dimmed"
								mb="xs"
							>
								Contact Information
							</Text>
							<div className={classes.formRow}>
								<div className={classes.inputWrapper}>
									<TextInput
										label="Email Address"
										placeholder="Enter email address"
										required
										icon={
											<IconMail
												size={16}
												className={classes.inputIcon}
											/>
										}
										{...form.getInputProps('email')}
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
						</div>

						{/* Shop Assignment */}
						<div className={classes.formGroup}>
							<Text
								size="sm"
								weight={500}
								color="dimmed"
								mb="xs"
							>
								Shop Assignment
							</Text>
							<div className={classes.formRow}>
								<div className={classes.inputWrapper}>
									<Select
										label="Shop"
										placeholder="Select shop"
										required
										icon={
											<IconBuildingStore
												size={16}
												className={classes.inputIcon}
											/>
										}
										data={shopOptions}
										{...form.getInputProps('shopId')}
										radius="md"
									/>
								</div>
								<div className={classes.inputWrapper}>
									<Select
										label="Role"
										placeholder="Select role"
										required
										icon={
											<IconShield
												size={16}
												className={classes.inputIcon}
											/>
										}
										data={[
											{ value: 'shop_user', label: 'Shop User' },
											{ value: 'shop_admin', label: 'Shop Admin' },
											{ value: 'shop_manager', label: 'Shop Manager' },
										]}
										{...form.getInputProps('role')}
										radius="md"
									/>
								</div>
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
						leftIcon={<IconUserPlus size={16} />}
						className={classes.submitButton}
						radius="md"
						onClick={form.onSubmit(handleSubmit)}
					>
						Add User
					</Button>
				</Group>
			</div>
		</Modal>
	);
}
