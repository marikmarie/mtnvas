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
	IconBuildingStore,
	IconGlobe,
	IconMapPin,
	IconPlus,
} from '@tabler/icons-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useMemo } from 'react';
import { Modal } from '../../components/Modal';
import useRequest from '../../hooks/useRequest';
import { Dealer } from '../Dealer/types';

interface AddShopModalProps {
	opened: boolean;
	onClose: () => void;
}

interface ShopFormValues {
	shopName: string;
	dealerId: string;
	location: string;
	region: string;
	adminName?: string;
	adminEmail?: string;
	adminMsisdn?: string;
	operatingHours?: string;
	latitude?: number;
	longitude?: number;
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
}));

export function AddShopModal({ opened, onClose }: AddShopModalProps) {
	const { classes } = useStyles();
	const request = useRequest(true);
	const queryClient = useQueryClient();

	const { data: dealers } = useQuery({
		queryKey: ['dealers'],
		queryFn: () => request.get('/dealer'),
	});

	const dealerList = useMemo(() => {
		return dealers?.data.data as Dealer[];
	}, [dealers?.data?.data]);

	const form = useForm<ShopFormValues>({
		initialValues: {
			shopName: '',
			dealerId: '',
			location: '',
			region: '',
			adminName: '',
			adminEmail: '',
			adminMsisdn: '',
			operatingHours: '',
			latitude: undefined,
			longitude: undefined,
		},
		validate: {
			shopName: (value) => (!value ? 'Shop name is required' : null),
			dealerId: (value) => (!value ? 'Dealer is required' : null),
			location: (value) => (!value ? 'Location is required' : null),
			region: (value) => (!value ? 'Region is required' : null),
		},
	});

	const mutation = useMutation({
		mutationFn: (values: ShopFormValues) => {
			const payload: any = {
				shopName: values.shopName,
				dealerId: values.dealerId,
				location: values.location,
				region: values.region,
			};

			if (values.adminName) payload.adminName = values.adminName;
			if (values.adminEmail) payload.adminEmail = values.adminEmail;
			if (values.adminMsisdn) payload.adminMsisdn = values.adminMsisdn;
			if (values.operatingHours) payload.operatingHours = values.operatingHours;
			if (values.latitude && values.longitude) {
				payload.coordinates = {
					latitude: values.latitude,
					longitude: values.longitude,
				};
			}

			return request.post('/shops', payload);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['shops'] });
			queryClient.invalidateQueries({ queryKey: ['dealer', form.values.dealerId] });
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
							Create a new shop location
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

				<form onSubmit={form.onSubmit(handleSubmit)}>
					<Stack spacing="sm">
						<Select
							label="Dealer"
							placeholder="Select dealer"
							required
							icon={
								<IconGlobe
									size={16}
									className={classes.inputIcon}
								/>
							}
							data={dealerList?.map((dealer: Dealer) => ({
								value: dealer.id.toString(),
								label: dealer.dealerName,
							}))}
							{...form.getInputProps('dealerId')}
							radius="md"
						/>
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

						<Select
							label="Region"
							placeholder="Select region"
							required
							icon={
								<IconGlobe
									size={16}
									className={classes.inputIcon}
								/>
							}
							data={[
								{ value: 'central', label: 'Central' },
								{ value: 'eastern', label: 'Eastern' },
								{ value: 'western', label: 'Western' },
								{ value: 'northern', label: 'Northern' },
							]}
							{...form.getInputProps('region')}
							radius="md"
						/>

						<TextInput
							label="Location"
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
						onClick={() => form.onSubmit(handleSubmit)()}
					>
						Add Shop
					</Button>
				</Group>
			</div>
		</Modal>
	);
}
