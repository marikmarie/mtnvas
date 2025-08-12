import {
	Modal,
	TextInput,
	Button,
	Group,
	Stack,
	Title,
	Text,
	createStyles,
	Divider,
	Alert,
	Card,
	Badge,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import {
	IconAlertCircle,
	IconSearch,
	IconId,
	IconUser,
	IconMail,
	IconPhone,
} from '@tabler/icons-react';
import useRequest from '../../hooks/useRequest';
import {
	AgentDuplicateCheckModalProps,
	AgentDuplicateCheck,
	AgentDuplicateResponse,
} from '../Dealer/types';

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

	resultCard: {
		backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
		borderRadius: theme.radius.md,
		padding: theme.spacing.md,
		marginTop: theme.spacing.md,
	},

	resultHeader: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'space-between',
		marginBottom: theme.spacing.md,
	},

	resultContent: {
		display: 'flex',
		alignItems: 'center',
		gap: theme.spacing.sm,
		marginBottom: theme.spacing.xs,
	},

	required: {
		color: theme.colors.red[6],
	},

	searchButton: {
		transition: 'all 0.2s ease',
	},
}));

interface DuplicateCheckFormValues {
	msisdn?: string;
	email?: string;
	merchantCode?: string;
}

export function AgentDuplicateCheckModal({
	opened,
	onClose,
	onDuplicateFound,
}: AgentDuplicateCheckModalProps) {
	const { classes } = useStyles();
	const [isSearching, setIsSearching] = useState(false);
	const [searchResult, setSearchResult] = useState<AgentDuplicateResponse | null>(null);
	const request = useRequest(true);

	const form = useForm<DuplicateCheckFormValues>({
		initialValues: {
			msisdn: '',
			email: '',
			merchantCode: '',
		},
		validate: {
			msisdn: (value) => {
				if (!value && !form.values.email && !form.values.merchantCode) {
					return 'At least one field is required';
				}
				if (value && value.trim().length < 10) {
					return 'Phone number must be at least 10 digits';
				}
				return null;
			},
			email: (value) => {
				if (!value && !form.values.msisdn && !form.values.merchantCode) {
					return 'At least one field is required';
				}
				if (value && !/^\S+@\S+$/.test(value)) {
					return 'Invalid email address';
				}
				return null;
			},
			merchantCode: (value) => {
				if (!value && !form.values.msisdn && !form.values.email) {
					return 'At least one field is required';
				}
				return null;
			},
		},
	});

	const duplicateCheckMutation = useMutation({
		mutationFn: (values: AgentDuplicateCheck) =>
			request.post('/agents/check-duplicate', values),
		onSuccess: (response) => {
			const result = response.data;
			setSearchResult(result);
			if (result.exists) {
				onDuplicateFound(result);
			}
		},
		onError: (error) => {
			console.error('Error checking duplicates:', error);
		},
	});

	const handleSubmit = async (values: DuplicateCheckFormValues) => {
		setIsSearching(true);
		try {
			// Only send fields that have values
			const payload: AgentDuplicateCheck = {};
			if (values.msisdn?.trim()) payload.msisdn = values.msisdn.trim();
			if (values.email?.trim()) payload.email = values.email.trim();
			if (values.merchantCode?.trim()) payload.merchantCode = values.merchantCode.trim();

			await duplicateCheckMutation.mutateAsync(payload);
		} finally {
			setIsSearching(false);
		}
	};

	const handleClose = () => {
		form.reset();
		setSearchResult(null);
		onClose();
	};

	const handleNewSearch = () => {
		form.reset();
		setSearchResult(null);
	};

	const hasAtLeastOneField = () => {
		return (
			form.values.msisdn?.trim() ||
			form.values.email?.trim() ||
			form.values.merchantCode?.trim()
		);
	};

	return (
		<Modal
			opened={opened}
			onClose={handleClose}
			title={
				<div className={classes.header}>
					<Group spacing="sm">
						<IconSearch
							size={24}
							color="yellow"
						/>
						<Title order={3}>Check Agent Duplicates</Title>
					</Group>
					<Text
						size="sm"
						color="dimmed"
					>
						Check if an agent already exists with the same MSISDN, email, or merchant
						code
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
				{/* Search Form */}
				<div className={classes.section}>
					<Title
						order={4}
						className={classes.sectionTitle}
					>
						Search Criteria
					</Title>
					<Text
						size="sm"
						color="dimmed"
						mb="md"
					>
						Enter at least one field to search for duplicates. You can search by phone
						number, email, or merchant code.
					</Text>
					<Stack spacing="md">
						<TextInput
							label="Phone Number (MSISDN)"
							placeholder="+256701234567"
							icon={<IconPhone size={16} />}
							{...form.getInputProps('msisdn')}
						/>
						<TextInput
							label="Email Address"
							placeholder="agent@example.com"
							type="email"
							icon={<IconMail size={16} />}
							{...form.getInputProps('email')}
						/>
						<TextInput
							label="Merchant Code"
							placeholder="MC001"
							icon={<IconId size={16} />}
							{...form.getInputProps('merchantCode')}
						/>
					</Stack>
				</div>

				{/* Information Alert */}
				<Alert
					icon={<IconAlertCircle size={16} />}
					title="How Duplicate Checking Works"
					color="yellow"
					variant="light"
					mb="lg"
				>
					<Text size="sm">
						• The system will check for existing agents with matching information
						<br />
						• If a duplicate is found, you'll see details about the existing agent
						<br />
						• You can determine if they can add a new category or if it's a true
						duplicate
						<br />• This helps prevent duplicate registrations and fraud
					</Text>
				</Alert>

				{/* Search Button */}
				<Group
					position="center"
					mb="lg"
				>
					<Button
						type="submit"
						loading={isSearching}
						color="yellow"
						size="lg"
						leftIcon={<IconSearch size={20} />}
						className={classes.searchButton}
						disabled={!hasAtLeastOneField()}
					>
						{isSearching ? 'Searching...' : 'Check for Duplicates'}
					</Button>
				</Group>

				{/* Search Results */}
				{searchResult && (
					<>
						<Divider my="md" />
						<div className={classes.section}>
							<Title
								order={4}
								className={classes.sectionTitle}
							>
								Search Results
							</Title>

							{searchResult.exists ? (
								<Card
									className={classes.resultCard}
									withBorder
								>
									<div className={classes.resultHeader}>
										<Badge
											color="red"
											variant="filled"
											size="lg"
										>
											Duplicate Found
										</Badge>
										<Button
											variant="outline"
											size="sm"
											onClick={handleNewSearch}
										>
											New Search
										</Button>
									</div>

									<Stack spacing="md">
										<Text
											size="sm"
											weight={500}
											color="red"
										>
											An agent with matching information already exists:
										</Text>

										{searchResult.existingAgent && (
											<>
												<div className={classes.resultContent}>
													<IconUser
														size={16}
														color="gray"
													/>
													<Text size="sm">
														<strong>Name:</strong>{' '}
														{searchResult.existingAgent.name}
													</Text>
												</div>
												<div className={classes.resultContent}>
													<IconId
														size={16}
														color="gray"
													/>
													<Text size="sm">
														<strong>User Types:</strong>{' '}
														{searchResult.existingAgent.userTypes.join(
															', '
														)}
													</Text>
												</div>
												<div className={classes.resultContent}>
													<IconUser
														size={16}
														color="gray"
													/>
													<Text size="sm">
														<strong>Dealer ID:</strong>{' '}
														{searchResult.existingAgent.dealerId}
													</Text>
												</div>
											</>
										)}

										<Divider />

										<Text
											size="sm"
											weight={500}
										>
											Can Add New Category:{' '}
											{searchResult.canAddCategory ? 'Yes' : 'No'}
										</Text>

										{searchResult.canAddCategory ? (
											<Alert
												color="green"
												variant="light"
											>
												<Text size="sm">
													This agent can be assigned a new user type
													category. You can proceed with registration by
													adding them as a different type of agent.
												</Text>
											</Alert>
										) : (
											<Alert
												color="red"
												variant="light"
											>
												<Text size="sm">
													This appears to be a true duplicate. The agent
													already has all applicable user types. Please
													review the existing registration or contact the
													agent directly.
												</Text>
											</Alert>
										)}
									</Stack>
								</Card>
							) : (
								<Card
									className={classes.resultCard}
									withBorder
								>
									<div className={classes.resultHeader}>
										<Badge
											color="green"
											variant="filled"
											size="lg"
										>
											No Duplicates Found
										</Badge>
										<Button
											variant="outline"
											size="sm"
											onClick={handleNewSearch}
										>
											New Search
										</Button>
									</div>

									<Stack spacing="md">
										<Text
											size="sm"
											color="green"
										>
											Great! No existing agents were found with the provided
											information.
										</Text>
										<Text size="sm">
											You can proceed with creating a new agent account.
										</Text>
									</Stack>
								</Card>
							)}
						</div>
					</>
				)}

				{/* Form Actions */}
				<Group
					position="right"
					mt="xl"
				>
					<Button
						variant="outline"
						onClick={handleClose}
					>
						Close
					</Button>
				</Group>
			</form>
		</Modal>
	);
}
