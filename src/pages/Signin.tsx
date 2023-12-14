import { useForm } from "@mantine/form";
import {
  Button,
  Center,
  Container,
  createStyles,
  Flex,
  Image,
  LoadingOverlay,
  Paper,
  PaperProps,
  Stack,
  TextInput,
  ThemeIcon,
  Title,
} from "@mantine/core";
import { IconAt, IconLock } from "@tabler/icons-react";
import { useMutation } from "@tanstack/react-query";
import useAxios from "../hooks/use-axios";
import { notifications } from "@mantine/notifications";
import { AxiosError, AxiosResponse } from "axios";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../constants/routes";
import { useDispatch } from "react-redux";
import { signin, User } from "../app/slices/auth";
import React from "react";

const useStyles = createStyles( () => ( {
  root: {
    overflow: "hidden",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
  },
} ) );

export default React.memo( function Signin( props: PaperProps ) {
  const {
    classes: { root },
  } = useStyles();
  const axios = useAxios();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const mtnEmailRegex = /^\S+@mtn\.com$/;
  const gdeEmailRegex = /^\S+@gdexperts\.com$/;

  const form = useForm( {
    initialValues: {
      email: "",
      password: "",
    },

    validate: {
      email: ( val: string ) =>
        mtnEmailRegex.test( val ) || gdeEmailRegex.test( val )
          ? null
          : "Should be a valid MTN or GDExperts email",
      password: ( val: string | any[] ) =>
        val.length <= 6
          ? "Password should include at least 6 characters"
          : null,
    },
  } );

  const mutation = useMutation( {
    mutationFn: () => axios.post( "/signin", form.values ),
    onSuccess: ( res: AxiosResponse ) => {
      dispatch( signin( res.data as unknown as { user: User } ) );
      navigate( ROUTES.VIEW_INVOICES );
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
    <Container className={root} size="xs">
      <LoadingOverlay visible={mutation.isLoading} zIndex={1000} />
      <Paper
        mt="xl"
        withBorder
        p="xl"
        {...props}
        w={"100%"}
        sx={{ background: "transparent" }}
      >
        <Flex align={"center"} justify={"center"} gap="md">
          <Image src="/Logo.png" width={80} />
        </Flex>

        <Center>
          <Title c="dimmed" fz={"xl"} my="md">
            Signin
          </Title>
        </Center>

        <form onSubmit={form.onSubmit( () => mutation.mutate() )}>
          <Stack>
            <TextInput
              label="Email"
              icon={
                <ThemeIcon color="transparent" size="sm">
                  <IconAt color="gray" />
                </ThemeIcon>
              }
              placeholder="mail@mtn.com"
              value={form.values.email}
              onChange={( event ) =>
                form.setFieldValue( "email", event.currentTarget.value )
              }
              error={form.errors.email}
            />

            <TextInput
              value={form.values.password}
              onChange={( event ) =>
                form.setFieldValue( "password", event.currentTarget.value )
              }
              placeholder="Password"
              label="Password"
              mb="md"
              type="password"
              icon={
                <ThemeIcon color="transparent" size="sm">
                  <IconLock color="gray" />
                </ThemeIcon>
              }
              error={form.errors.password}
            />
          </Stack>
          <Stack>
            <Button type="submit">Sign In</Button>
          </Stack>
        </form>
      </Paper>
    </Container>
  );
} )
