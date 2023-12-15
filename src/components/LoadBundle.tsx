import { Button, Flex, Group, Paper, Radio, Stack, Text, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { IconPhone } from '@tabler/icons-react';
import { useMutation } from '@tanstack/react-query';
import { AxiosResponse, AxiosError } from 'axios';
import React from 'react';
import useAxios from '../hooks/use-axios';

export default React.memo( function LoadBundle() {
    const axios = useAxios();
    const form = useForm( {
        initialValues: {
            wakanetNumber: "",
            agentNumber: "",
            size: "",
        },

        validate: {
            wakanetNumber: ( val: string ) => val.length > 9 ? null : "Should be a valid wakanetNumber",
            agentNumber: ( val: string ) => val.length > 9 ? null : "Should be a valid wakanetNumber",
        },
    } );


    const mutation = useMutation( {
        mutationFn: () => axios.post( "", form.values ),
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
                Load new WakaNet bundle
            </Text>

            <form onSubmit={form.onSubmit( () => mutation.mutate() )}>
                <Stack mt={"sm"}>
                    <TextInput icon={<IconPhone />} label="WakaNet Number"
                        onChange={( event ) =>
                            form.setFieldValue( "wakanetNumber", event.currentTarget.value )
                        }
                        placeholder="Forexample 2563945 ..." withAsterisk />
                    <Radio.Group
                        name="bundle"
                        withAsterisk
                        value={form.values.size}
                        onChange={( value ) =>
                            form.setFieldValue( "size", value )
                        }
                    >
                        <Group mt="xs">
                            <Radio value="10GB" label="10GB" />
                            <Radio value="25GB" label="25GB" />
                            <Radio value="45GB" label="45GB" />
                            <Radio value="95GB" label="95GB" />
                            <Radio value="195GB" label="195GB" />
                        </Group>
                    </Radio.Group>
                    <TextInput icon={<IconPhone />} label="Agent/Customer Number" value={form.values.agentNumber}
                        onChange={( event ) =>
                            form.setFieldValue( "agentNumber", event.currentTarget.value )
                        }
                        placeholder="Forexample 2563945 ..." withAsterisk />
                </Stack>

                <Flex mt="md" w="100%" gap={"sm"} justify={"flex-end"}>
                    <Flex gap={"sm"} w="30%" >
                        <Button fullWidth variant="filled" type='submit' >Signup</Button>
                        <Button fullWidth variant="light" onClick={() => form.reset()} >Reset</Button>
                    </Flex>
                </Flex>
            </form>
        </Paper>
    )
} )
