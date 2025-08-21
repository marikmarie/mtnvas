import {
	Alert,
	Badge,
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
	IconBuildingStore,
	IconMail,
	IconMapPin,
	IconPhone,
	IconShield,
	IconUser,
	IconUserPlus,
} from '@tabler/icons-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Modal } from '../../components/Modal';
import useRequest from '../../hooks/useRequest';
import { formatPhoneNumber } from '../../utils/phone.util';
import { Dealer, Shop } from '../Dealer/types';

interface AddShopUserModalProps {
	opened: boolean;
	onClose: () => void;
	dealer: Dealer;
	shops: Shop[];
}

interface ShopUserFormValues {
	name: string;
	email: string;
	msisdn: string;
	userType: 'shop_agent' | 'dsa' | 'retailer';
	dealerId: number;
	shopId?: number;
	location: string;
	merchantCode?: string;
	idNumber?: string;
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
			name: '',
			email: '',
			msisdn: '',
			userType: 'shop_agent',
			dealerId: dealer.id,
			shopId: shops.length === 1 ? shops[0].id : undefined,
			location: '',
			merchantCode: '',
			idNumber: '',
		},
		validate: {
			name: (value) => (!value ? 'Name is required' : null),
			email: (value) => (!value ? 'Email is required' : null),
			msisdn: (value) => (!value ? 'Phone number is required' : null),
			userType: (value) => (!value ? 'User type is required' : null),
			dealerId: (value) => (!value ? 'Dealer is required' : null),
			shopId: (value) => {
				if (form.values.userType === 'shop_agent' && !value) {
					return 'Shop is required for shop agents';
				}
				return null;
			},
			location: (value) => (!value ? 'Location is required' : null),
		},
	});

	const mutation = useMutation({
		mutationFn: (values: ShopUserFormValues) => {
			return request.post('/agents', {
				...values,
				msisdn: formatPhoneNumber(values.msisdn),
			});
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['agents'] });
			queryClient.invalidateQueries({ queryKey: ['dealer', dealer.id] });
			onClose();
			form.reset();
		},
	});

	const handleSubmit = () => {
		mutation.mutate(form.values);
	};

	const shopOptions = shops.map((shop) => ({
		value: shop.id.toString(),
		label: shop.shopName,
	}));

	const selectedShop = shops.find((s) => s.id === form.values.shopId);
	const hasErrors = Object.keys(form.errors).length > 0;

	const handleUserTypeChange = (value: string) => {
		form.setFieldValue('userType', value as 'shop_agent' | 'dsa' | 'retailer');
		if (value !== 'shop_agent') {
			form.setFieldValue('shopId', undefined);
		} else if (shops.length === 1) {
			form.setFieldValue('shopId', shops[0].id);
		}
	};

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

			<div className={classes.formSection}>
				<div className={classes.dealerInfo}>
					<Text
						size="sm"
						weight={500}
						color="dimmed"
						mb="xs"
					>
						Parent Dealer
					</Text>
					<Text weight={600}>{dealer.dealerName}</Text>
				</div>

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
							<Text weight={600}>{selectedShop.shopName}</Text>
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
										label="Full Name"
										placeholder="Enter full name"
										required
										icon={
											<IconUser
												size={16}
												className={classes.inputIcon}
											/>
										}
										{...form.getInputProps('name')}
										radius="md"
									/>
								</div>
								<div className={classes.inputWrapper}>
									<TextInput
										label="ID Number"
										placeholder="Enter ID number (optional)"
										icon={
											<IconUser
												size={16}
												className={classes.inputIcon}
											/>
										}
										{...form.getInputProps('idNumber')}
										radius="md"
									/>
								</div>
							</div>
						</div>

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
										label="Email"
										placeholder="Enter email address"
										required
										type="email"
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
										{...form.getInputProps('msisdn')}
										radius="md"
									/>
								</div>
							</div>
						</div>

						<div className={classes.formGroup}>
							<Text
								size="sm"
								weight={500}
								color="dimmed"
								mb="xs"
							>
								User Type and Assignment
							</Text>
							<div className={classes.formRow}>
								<div className={classes.inputWrapper}>
									<Select
										label="User Type"
										placeholder="Select user type"
										required
										icon={
											<IconShield
												size={16}
												className={classes.inputIcon}
											/>
										}
										data={[
											{ value: 'shop_agent', label: 'Shop Agent' },
											{ value: 'dsa', label: 'DSA' },
											{ value: 'retailer', label: 'Retailer' },
										]}
										value={form.values.userType}
										onChange={handleUserTypeChange}
										radius="md"
									/>
								</div>
								<div className={classes.inputWrapper}>
									<Select
										label="Shop Assignment"
										placeholder={
											form.values.userType === 'shop_agent'
												? 'Select shop'
												: 'Not required for this user type'
										}
										required={form.values.userType === 'shop_agent'}
										disabled={form.values.userType !== 'shop_agent'}
										icon={
											<IconBuildingStore
												size={16}
												className={classes.inputIcon}
											/>
										}
										data={shopOptions}
										value={form.values.shopId?.toString() || undefined}
										onChange={(value) =>
											form.setFieldValue('shopId', Number(value) || undefined)
										}
										radius="md"
									/>
								</div>
							</div>
						</div>

						<div className={classes.formGroup}>
							<Text
								size="sm"
								weight={500}
								color="dimmed"
								mb="xs"
							>
								Business Information
							</Text>
							<div className={classes.formRow}>
								<div className={classes.inputWrapper}>
									<TextInput
										label="Location"
										placeholder="Enter business location"
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
								<div className={classes.inputWrapper}>
									<TextInput
										label="Merchant Code"
										placeholder="Enter merchant code (optional)"
										icon={
											<IconShield
												size={16}
												className={classes.inputIcon}
											/>
										}
										{...form.getInputProps('merchantCode')}
										radius="md"
									/>
								</div>
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
						leftIcon={<IconUserPlus size={16} />}
						className={classes.submitButton}
						radius="md"
						onClick={() => handleSubmit()}
					>
						Add User
					</Button>
				</Group>
			</div>
		</Modal>
	);
}
