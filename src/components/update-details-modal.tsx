import React from 'react'
import { useForm } from '@mantine/form'
import { TextInput, Button, Stack, Text } from '@mantine/core'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { notifications } from '@mantine/notifications'
import { AxiosResponse } from 'axios'
import useRequest from '../hooks/use-request'

interface UpdateDetailsData {
	subscriptionId: string
	msisdn: string
	bnumber: string
	email: string
	salesAgentEmail: string
}

interface DetailsProp {
	detail: UpdateDetailsData | null
}

export default function UpdateDetailsModal({ detail }: DetailsProp) {
	const emailRegex = /^\S+@\S+\.\S+$/
	const msisdn = /^256(78|77|76)\d{7}$/

	const request = useRequest()

	const form = useForm({
		initialValues: {
			email: detail?.email || '',
			salesAgentEmail: detail?.salesAgentEmail || '',
			msisdn: detail?.msisdn || '',
			subscriptionId: detail?.subscriptionId || '',
			bnumber: detail?.bnumber || '',
		},

		validate: {
			subscriptionId: val => ((val as string).length <= 2 ? 'Should include at least 2 characters' : null),
			email: val => (emailRegex.test(val as string) ? null : 'Should be a valid email address'),
			msisdn: val => (msisdn.test(val as string) ? null : 'Should be a valid phone number'),
			bnumber: val => ((val as string).length <= 2 ? 'Should include at least 2 characters' : null),
		},
	})

	const queryClient = useQueryClient()

	const mutation = useMutation({
		mutationKey: ['details'],
		mutationFn: (data: UpdateDetailsData) => request.put(`/customers`, data).then(res => res.data),
		onSuccess: (response: AxiosResponse) => {
			queryClient.invalidateQueries({
				queryKey: ['details'],
			})
			notifications.show({
				title: 'SUCCESS',
				// @ts-ignore
				message: response?.message as React.ReactNode,
				color: 'green',
				withCloseButton: true,
				autoClose: 5000,
			})
		},
	})

	const handleSubmission = (event: React.FormEvent) => {
		event.preventDefault()
		mutation.mutate({
			subscriptionId: form.values.subscriptionId ?? '',
			msisdn: form.values.msisdn ?? '',
			bnumber: form.values.bnumber ?? '',
			email: form.values.email ?? '',
			salesAgentEmail: form.values.salesAgentEmail ?? '',
		})
	}

	return (
		<form onSubmit={handleSubmission}>
			<Stack>
				<Text ta="center" fz="xl" fw="lighter" c="dimmed">
					Edit Details
				</Text>
				<TextInput
					required
					label="Email"
					value={form.values.email}
					onChange={event => form.setFieldValue('email', event.currentTarget.value)}
					error={form.errors.email}
					radius="sm"
				/>
				<TextInput
					required
					label="MSISDN"
					value={form.values.msisdn}
					onChange={event => form.setFieldValue('msisdn', event.currentTarget.value)}
					error={form.errors.msisdn}
					radius="sm"
				/>
				<TextInput
					required
					label="SubscriptionId"
					value={form.values.subscriptionId}
					onChange={event => form.setFieldValue('subscriptionId', event.currentTarget.value)}
					error={form.errors.subscriptionId}
					radius="sm"
				/>
				<TextInput
					required
					label="Sales Agent Email"
					value={form.values.salesAgentEmail}
					onChange={event => form.setFieldValue('salesAgentEmail', event.currentTarget.value)}
					error={form.errors.salesAgentEmail}
					radius="sm"
				/>
				<Button onClick={handleSubmission} type="submit" radius={'sm'}>
					Edit
				</Button>
			</Stack>
		</form>
	)
}
