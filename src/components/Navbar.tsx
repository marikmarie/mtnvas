import {
  ActionIcon,
  createStyles,
  Group,
  Image,
  Navbar as Wrapper,
  rem,
  ThemeIcon,
  Tooltip,
  UnstyledButton,
} from "@mantine/core";
import {
  IconCreditCard,
  IconFileInvoice,
  IconLogout,
  IconMenu2,
} from "@tabler/icons-react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SEGMENT, setActiveLink, toggleNav } from "../app/slices/nav";
import { RootState } from "../app/store";
import { ROUTES } from "../constants/routes";
import { Link } from "react-router-dom";

const useStyles = createStyles( ( theme ) => ( {
  root: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    height: "100vh",
  },
  wrapper: {
    display: "flex",
  },

  aside: {
    flex: `0 0 ${rem( 60 )}`,
    backgroundColor:
      theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.white,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  main: {
    flex: 1,
  },
  mainLink: {
    width: rem( 44 ),
    height: rem( 44 ),
    borderRadius: theme.radius.md,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color:
      theme.colorScheme === "dark"
        ? theme.colors.dark[0]
        : theme.colors.gray[7],

    "&:hover": {
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.dark[5]
          : theme.colors.gray[0],
    },
  },

  mainLinkActive: {
    "&, &:hover": {
      backgroundColor: theme.fn.variant( {
        variant: "light",
        color: theme.primaryColor,
      } ).background,
      color: theme.fn.variant( {
        variant: "light",
        color: theme.primaryColor,
      } ).color,
    },
  },

  title: {
    boxSizing: "border-box",
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    marginBottom: theme.spacing.xl,
    backgroundColor:
      theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.white,
    padding: theme.spacing.md,
    paddingTop: rem( 18 ),
    height: rem( 60 ),
  },

  logo: {
    boxSizing: "border-box",
    width: "100%",
    display: "flex",
    justifyContent: "center",
    height: rem( 60 ),
    paddingTop: theme.spacing.md,
    marginBottom: theme.spacing.xl,
  },

  link: {
    boxSizing: "border-box",
    display: "block",
    textDecoration: "none",
    borderTopRightRadius: theme.radius.md,
    borderBottomRightRadius: theme.radius.md,
    color:
      theme.colorScheme === "dark"
        ? theme.colors.dark[0]
        : theme.colors.gray[7],
    padding: `0 ${theme.spacing.md}`,
    fontSize: theme.fontSizes.sm,
    marginRight: theme.spacing.md,
    fontWeight: 500,
    height: rem( 44 ),
    lineHeight: rem( 44 ),

    "&:hover": {
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.dark[5]
          : theme.colors.gray[1],
      color: theme.colorScheme === "dark" ? theme.white : theme.black,
    },
  },

  linkActive: {
    "&, &:hover": {
      borderLeftColor: theme.fn.variant( {
        variant: "filled",
        color: theme.primaryColor,
      } ).background,
      backgroundColor: theme.fn.variant( {
        variant: "filled",
        color: theme.primaryColor,
      } ).background,
      color: theme.white,
    },
  },

  footer: {
    display: "flex",
    position: "absolute",
    bottom: "1%",
  },
} ) );

const mainLinksMockdata = [
  { icon: IconFileInvoice, label: "Invoice " },
  { icon: IconCreditCard, label: "Create Credit Note " },
  { icon: IconCreditCard, label: "Create bulk Invoices" },
  { icon: IconLogout, label: "Account" },
];

const linksMockdata = [
  { label: "Invoices", link: ROUTES.VIEW_INVOICES },
  { label: "Credit Notes", link: ROUTES.CREDIT_NOTES },
  { label: "Upload Sheet", link: ROUTES.UPLOAD },
  { label: "Account", link: ROUTES.ACCOUNT },
];

export default function Navbar() {
  const { classes, cx } = useStyles();

  const activeLink = useSelector( ( state: RootState ) => state.nav.activeLink );
  const dispatch = useDispatch();

  useEffect( () => {
    const segment = window.location.pathname.split( "/" )[1] as SEGMENT;
    dispatch( setActiveLink( segment ) );
  }, [] );

  const mainLinks = mainLinksMockdata
    .slice( 0, mainLinksMockdata.length - 1 )
    .map( ( link ) => (
      <Tooltip
        label={link.label}
        position="right"
        withArrow
        transitionProps={{ duration: 0 }}
        key={link.label}
      >
        <UnstyledButton className={cx( classes.mainLink, {} )}>
          <link.icon size="1.4rem" stroke={1.5} />
        </UnstyledButton>
      </Tooltip>
    ) );

  const footerLinks = mainLinksMockdata
    .slice( mainLinksMockdata.length - 1 )
    .map( ( link ) => (
      <Tooltip
        label={link.label}
        position="right"
        withArrow
        transitionProps={{ duration: 0 }}
        key={link.label}
      >
        <UnstyledButton className={cx( classes.mainLink, {} )}>
          <link.icon size="1.4rem" stroke={1.5} />
        </UnstyledButton>
      </Tooltip>
    ) );

  const links = linksMockdata
    .slice( 0, linksMockdata.length - 1 )
    .map( ( element ) => (
      <Link
        className={cx( classes.link, {
          [classes.linkActive]: activeLink === element.label,
        } )}
        to={element.link}
        onClick={() =>
          setActiveLink(
            element.link.toLowerCase().split( " " ).join( "-" ) as SEGMENT,
          )
        }
        key={element.link}
      >
        {element.label}
      </Link>
    ) );

  const footerLabelLinks = linksMockdata
    .slice( linksMockdata.length - 1 )
    .map( ( element ) => (
      <a
        className={cx( classes.link, {
          [classes.linkActive]: activeLink === element.label,
        } )}
        href={element.link}
        onClick={( event ) => {
          event.preventDefault();
          setActiveLink(
            element.link.toLowerCase().split( " " ).join( "-" ) as SEGMENT,
          );
        }}
        key={element.link}
      >
        {element.label}
      </a>
    ) );

  return (
    <Wrapper
      h="100vh"
      bg="transparent"
      className={classes.root}
      zIndex={1}
      width={{ sm: 300 }}
    >
      <Wrapper.Section grow className={classes.wrapper}>
        <div className={classes.aside}>
          <div className={classes.logo}>
            <Image src="/Logo.png" width={50} />
          </div>
          {mainLinks}
        </div>
        <div className={classes.main}>
          <Group position="right" mr="sm" align="self-start">
            <ActionIcon
              className={classes.title}
              onClick={() => dispatch( toggleNav() )}
              size={"xl"}
            >
              <ThemeIcon color="transparent" size="xl">
                <IconMenu2 color="gray" />
              </ThemeIcon>
            </ActionIcon>
          </Group>
          {links}
        </div>
      </Wrapper.Section>
      <Wrapper.Section grow className={classes.footer}>
        <div className={classes.aside}>{footerLinks}</div>
        <div className={classes.main}>{footerLabelLinks}</div>
      </Wrapper.Section>
    </Wrapper>
  );
}
