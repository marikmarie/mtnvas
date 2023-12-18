import { Button, Stack, TextInput, Text, Paper, Badge, Flex } from '@mantine/core'
import { useForm } from '@mantine/form'
import { notifications } from '@mantine/notifications'
import { useMutation } from '@tanstack/react-query'
import { AxiosResponse, AxiosError } from 'axios'
import React from 'react'
import useAxios from '../hooks/use-axios'
import { toTitle } from '../utils/to-title'
import { IconPhone } from '@tabler/icons-react'
import ReactDataGrid from '@inovua/reactdatagrid-community'

export default React.memo( () => {
    return (
        <Paper p="lg" mt="xl" shadow="lg">
            <Text fz="xl" mb="sm" fw="bold" c="dimmed">
                Update Existing customer details
            </Text>
            <ActivationTable />
        </Paper>
    )
} )

const ActivationTable = React.memo( () => {
    const columns = ['subscriptionId', 'msisdn', 'email'].map( column => ( {
        name: column,
        header: toTitle( column ),
        defaultFlex: 2,
    } ) )

    const [subscriptionId, setSubscriptionId] = React.useState( '' )

    columns.push( {
        name: 'Action',
        header: 'Action',
        // @ts-ignore
        render: function ( row ) {
            console.log( row.data.subscriptionId )
            return (
                <Button
                    size="xs"
                    fullWidth
                    variant="light"
                    onClick={function () {
                        setSubscriptionId( row.data.subscriptionId )
                    }}
                >
                    Select
                </Button>
            )
        },
        maxWidth: 150,
        defaultFlex: 1,
        headerAlign: 'center',
    } )

    const axios = useAxios()

    const [data, setData] = React.useState<any>( null )

    React.useEffect( () => {
        async function getBundleActivations() {
            const result = await axios.get( "/bundle-activations" )
            setData( result.data )
        }
        getBundleActivations()
    }, [] )

    console.log( data?.data )

    return (
        <>
            <ReactDataGrid
                idProperty="id"
                columns={columns}
                dataSource={data?.data || []}
                pagination={false}
                showCellBorders
                style={{ minHeight: '25vh' }}
                showHeader
                activateRowOnFocus
            />

            {/* <SimpleGrid
                mt="md"
                cols={4}
            >
                {
                    Array.from( { length: 16 } ).map( () => (
                        <Badge>
                            {faker.person.firstName()}
                        </Badge>
                    ) )
                }

            </SimpleGrid> */}
        </>
    )
} )

const Form = () => {
    const form = useForm( {
        initialValues: {
            bnumber: '',
        },

        validate: {
            bnumber: ( val: string ) => ( val.length > 9 ? null : 'Should be a valid wakanetNumber' ),
        },
    } )

    const axios = useAxios()
    const mutation = useMutation( {
        mutationFn: () =>
            axios.post( '/bundle-activations', { subscriptionId: parseInt( "123" ), ...form.values } ),
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

    return (
        <form onSubmit={form.onSubmit( () => mutation.mutate() )}>
            <Stack my={'sm'}>
                <Flex justify={'start'} gap="xl" align={"center"}>
                    <Badge variant="light" size="xl">
                        Subscription Id
                    </Badge>
                    <Text>{""}</Text>
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
        </form>
    )
}

