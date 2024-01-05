import { Stack, Flex, Badge, TextInput, Button, Text } from '@mantine/core'
import { useForm } from '@mantine/form'
import { notifications } from '@mantine/notifications'
import { IconPhone } from '@tabler/icons-react'
import { useMutation } from '@tanstack/react-query'
import { AxiosResponse, AxiosError } from 'axios'
import { useSelector } from 'react-redux'
import { RootState } from '../../app/store'
import useAxios from '../../hooks/use-axios'

export const Form = () => {
    const axios = useAxios()

    const subscriptionId = useSelector( ( state: RootState ) => state.subId.subscriptionId )

    const form = useForm( {
        initialValues: {
            bnumber: '',
        },
        validate: {
            bnumber: ( val: string ) => ( val.length > 9 ? null : 'Should be a valid wakanetNumber' ),
        },
    } )

    const mutation = useMutation( {
        mutationFn: () =>
            axios.post( '/bundle-activations', { subscriptionId: parseInt( subscriptionId ), ...form.values } ),
        onSuccess: ( _: AxiosResponse ) => {
            notifications.show( {
                title: 'Success',
                message: 'starter bundle loaded',
                color: 'green',
            } )
        },
        onError: ( error: AxiosError ) => {
            notifications.show( {
                title:
                    ( ( error.response?.data as { httpStatus: string } ).httpStatus as unknown as React.ReactNode ) ||
                    ( (
                        error.response?.data as {
                            status: string
                        }
                    ).status as unknown as React.ReactNode ),
                message:
                    ( (
                        error.response?.data as {
                            message: string
                        }
                    ).message! as unknown as React.ReactNode ) ||
                    ( (
                        error.response?.data as {
                            error: string
                        }
                    ).error as unknown as React.ReactNode ),
                color: 'red',
            } )
        },
    } )

    console.log( "values: ", form.values )

    return (
        <div>
            {
                subscriptionId ? <form onSubmit={form.onSubmit( () => mutation.mutate() )}>
                    <Stack my={'sm'}>
                        <Flex justify={'start'} gap="xl" align={"center"}>
                            <Badge variant="light" size="xl">
                                Subscription Id
                            </Badge>
                            <Text>{subscriptionId}</Text>
                        </Flex>
                        <TextInput
                            icon={<IconPhone />}
                            label="WakaNet Number"
                            value={form.values.bnumber}
                            onChange={event => form.setFieldValue( 'bnumber', event.currentTarget.value )}
                            error={form.errors.bnumber}
                            placeholder="Forexample 2563945..."
                            withAsterisk
                            w="100%"
                        />
                        <Button type="submit">
                            Activate
                        </Button>
                    </Stack>
                </form> : null
            }
        </div>
    )
}
