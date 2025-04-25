import { Button, Group, Stack, Text, Divider, Badge, Flex, Box, Title } from '@mantine/core';
import { Modal } from '../../components/Modal';
import { DealerModalProps } from './types';
import { IconBuilding, IconCalendar, IconMail, IconPhone, IconUser } from '@tabler/icons-react';

export function ViewDealerModal({ opened, onClose, dealer }: DealerModalProps) {
	if (!dealer) return null;

	const formatDate = (dateString: string | number | Date) => {
		const date = new Date(dateString);
		return date.toLocaleDateString(undefined, {
			year: 'numeric',
			month: 'long',
			day: 'numeric',
		});
	};

	return (
		<Modal
			opened={opened}
			close={onClose}
			size="md"
		>
			<Stack spacing="md">
				<Title>Dealer Details: {dealer.name}</Title>
				<Box
					p="md"
					bg="gray.0"
					style={{ borderRadius: '8px' }}
				>
					<Text
						size="xl"
						weight={700}
					>
						{dealer.name}
					</Text>
					<Badge
						color={dealer.status === 'active' ? 'green' : 'red'}
						variant="filled"
						mt="xs"
					>
						{dealer.status}
					</Badge>
				</Box>

				<Divider
					label="Contact Information"
					labelPosition="center"
				/>

				<Stack spacing="sm">
					<Flex
						align="center"
						gap="md"
					>
						<IconUser size={18} />
						<Text weight={500}>{dealer.contactPerson}</Text>
					</Flex>

					<Flex
						align="center"
						gap="md"
					>
						<IconMail size={18} />
						<Text
							component="a"
							href={`mailto:${dealer.email}`}
							color="blue"
						>
							{dealer.email}
						</Text>
					</Flex>

					<Flex
						align="center"
						gap="md"
					>
						<IconPhone size={18} />
						<Text
							component="a"
							href={`tel:${dealer.phone}`}
							color="blue"
						>
							{dealer.phone}
						</Text>
					</Flex>
				</Stack>

				<Divider
					label="Business Details"
					labelPosition="center"
				/>

				<Stack spacing="sm">
					<Flex
						align="center"
						gap="md"
					>
						<IconBuilding size={18} />
						<Text weight={500}>
							Category:{' '}
							<Text
								span
								color="dimmed"
								transform="capitalize"
							>
								{dealer.category}
							</Text>
						</Text>
					</Flex>

					<Flex
						align="center"
						gap="md"
					>
						<IconCalendar size={18} />
						<Text weight={500}>
							Registered:{' '}
							<Text
								span
								color="dimmed"
							>
								{formatDate(dealer.createdAt)}
							</Text>
						</Text>
					</Flex>
				</Stack>

				<Group
					position="right"
					mt="xl"
				>
					<Button
						variant="outline"
						onClick={onClose}
					>
						Close
					</Button>
					<Button>Edit Details</Button>
				</Group>
			</Stack>
		</Modal>
	);
}
