import { Button, Flex, Paper, Stack, Text, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AxiosResponse, AxiosError } from 'axios';
import React from 'react';
import useAxios from '../hooks/use-axios';
import ReactDataGrid from '@inovua/reactdatagrid-community';
import { toTitle } from '../utils/to-title';
import { IconPhone } from '@tabler/icons-react';

export default React.memo( function Signup() {

    const axios = useAxios();
    const form = useForm( {
        initialValues: {
            wakanetNumber: "",
        },

        validate: {
            wakanetNumber: ( val: string ) => val.length > 9 ? null : "Should be a valid wakanetNumber",
        },
    } );

    const mutation = useMutation( {
        mutationFn: () => axios.post( "/bundle-activations", form.values ),
        onSuccess: ( _: AxiosResponse ) => {
            notifications.show( {
                title: "Success",
                message: "starter bundle loaded",
                color: "green",
            } );
        },
        onError: ( error: AxiosError ) => {
            notifications.show( {
                title:
                    ( ( error.response?.data as { httpStatus: string } )
                        .httpStatus as unknown as React.ReactNode ) ||
                    ( (
                        error.response?.data as {
                            status: string;
                        }
                    ).status as unknown as React.ReactNode ),
                message:
                    ( (
                        error.response?.data as {
                            message: string;
                        }
                    ).message! as unknown as React.ReactNode ) ||
                    ( (
                        error.response?.data as {
                            error: string;
                        }
                    ).error as unknown as React.ReactNode ),
                color: "red",
            } );
        },
    } );


    return (
        <Paper p="lg" mt="xl" shadow='lg'>
            <Text fz="xl" fw="bold" c="dimmed" >
                Sign up and Load free starter bundle
            </Text>

            <form onSubmit={form.onSubmit( () => mutation.mutate() )}>
                <Stack my={"sm"}>
                    <Flex justify={"space-between"} align={"center"} gap="xl" >
                        <TextInput icon={<IconPhone />} label="WakaNet Number"
                            value={form.values.wakanetNumber}
                            onChange={( event ) =>
                                form.setFieldValue( "wakanetNumber", event.currentTarget.value )
                            }
                            error={form.errors.wakanetNumber}
                            placeholder="Forexample 2563945..."
                            withAsterisk
                            w="100%"
                        />
                        <Button
                            sx={{ alignSelf: "flex-end" }}
                            variant='light'
                            type='submit'
                        >
                            Activate
                        </Button>
                    </Flex>
                </Stack>
            </form>

            <ActivationTable />
        </Paper>
    )
} )

const ActivationTable = React.memo( () => {
    const qc = useQueryClient()
    const mutation = useMutation( {
        mutationFn: ( subscriptionId: number ) => axios.post( "/bundle-activations", { subscriptionId } ),
        onSuccess: ( _: AxiosResponse ) => {
            notifications.show( {
                title: "Success",
                message: "starter bundle loaded",
                color: "green",
            } );
            qc.invalidateQueries( {
                queryKey: ["activationData"]
            } )
        },
        onError: ( error: AxiosError ) => {
            notifications.show( {
                title:
                    ( ( error.response?.data as { httpStatus: string } )
                        .httpStatus as unknown as React.ReactNode ) ||
                    ( (
                        error.response?.data as {
                            status: string;
                        }
                    ).status as unknown as React.ReactNode ),
                message:
                    ( (
                        error.response?.data as {
                            message: string;
                        }
                    ).message! as unknown as React.ReactNode ) ||
                    ( (
                        error.response?.data as {
                            error: string;
                        }
                    ).error as unknown as React.ReactNode ),
                color: "red",
            } );
        },
    } );

    const axios = useAxios();
    const query = useQuery( {
        queryKey: ["activationData"],
        queryFn: () => axios.get( "/bundle-activations" ).then( ( res ) => res.data ),
    } );

    if ( query.isError ) {
        console.log( "Error:", query.error );
    }

    const columns = [
        "subscriptionId",
        "msisdn",
        "email",
    ].map( ( column ) => ( {
        name: column,
        header: toTitle( column ),
        defaultFlex: 2,
    } ) );

    columns.push( {
        name: "Action",
        header: "Action",
        // @ts-ignore
        render: function ( rowData ) {
            return (
                <Button
                    size="xs"
                    fullWidth
                    variant='light'
                    onClick={() => mutation.mutate( Number.parseInt( rowData?.data.subscriptionId ) )}
                >
                    Activate
                </Button>
            );
        },
        maxWidth: 150,
        defaultFlex: 1,
        headerAlign: "center",
    } );

    return (
        <ReactDataGrid
            idProperty="id"
            columns={columns}
            dataSource={query.data?.data || []}
            pagination={false}
            showCellBorders
            style={{ minHeight: "25vh" }}
            showHeader
            activateRowOnFocus
        />
    )
} )
