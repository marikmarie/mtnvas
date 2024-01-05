import { Button, Flex, Group, Paper, Radio, Stack, Text, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { IconPhone } from '@tabler/icons-react';
import { useMutation } from '@tanstack/react-query';
import axios, { AxiosResponse, AxiosError } from 'axios';
import React from 'react';

export default React.memo( () => {
    const form = useForm( {
        initialValues: {
            wakanetNumber: "",
            agentNumber: "",
            package: "",
        },

        validate: {
            wakanetNumber: ( val: string ) => val.length > 9 ? null : "Should be a valid wakanetNumber",
            agentNumber: ( val: string ) => val.length > 9 ? null : "Should be a valid custmer/agent number",
        },
    } );


    const mutation = useMutation( {
        mutationFn: () => axios.post( import.meta.env.VITE_APP_BASE_URL! + "/load-bundle", form.values ),
        onSuccess: ( _: AxiosResponse ) => {
            notifications.show( {
                title: "Success",
                message: "starter bundle loaded",
                color: "green",
            } );
            console.log( "error: " )
        },
        onError: ( error: AxiosError ) => {
            console.log( "error: " )
            console.log( "error: " )
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
            <Text
                fz="xl"
                fw="bold"
                c="dimmed" >
                Load new WakaNet bundle
            </Text>

            <form onSubmit={form.onSubmit( () => mutation.mutate() )}>
                <Stack mt={"sm"}>
                    <TextInput
                        icon={<IconPhone />}
                        label="WakaNet Number"
                        onChange={( event ) =>
                            form.setFieldValue( "wakanetNumber", event.currentTarget.value )
                        }
                        error={form.errors.wakanetNumber}
                        placeholder="Forexample 2563945..." withAsterisk />
                    <Radio.Group
                        name="bundle"
                        withAsterisk
                        value={form.values.package}
                        onChange={( value ) =>
                            form.setFieldValue( "package", value )
                        }
                    >
                        <Group mt="xs">
                            <Radio value="FWA_40MBPS" label="40MBPS" />
                            <Radio value="FWA_60MBPS" label="60MBPS" />
                            <Radio value="FWA_80MBPS" label="80MBPS" />
                            <Radio value="FWA_100MBPS" label="100MBPS" />
                            <Radio value="FWA_150MBPS" label="150MBPS" />
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
                        <Button
                            fullWidth
                            variant="filled"
                            type='submit'>Signup</Button>
                        <Button
                            fullWidth
                            variant="light"
                            onClick={() => form.reset()} >Reset</Button>
                    </Flex>
                </Flex>
            </form>
        </Paper>
    )
} )
