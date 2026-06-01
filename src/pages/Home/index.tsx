import { Box, Container, Typography } from "@mui/material";
import { observer } from "mobx-react";
import React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import { Trans, useTranslation } from "react-i18next";

const Home = () => {
  const { t } = useTranslation("app");
  const issues = [
    {
      icon: "🐞",
      title:
        'Console error: Warning: Each child in a list should have a unique "key" prop.',
      description:
        "Hope you are able to find what is causing this error, as it is annoying."
    },
    {
      icon: "🐞",
      title:
        'The word "known" should be displayed bold in the introduction text.',
      description:
        "When implementing a solution, please ensure to not change the i18n text."
    },
    {
      icon: "🐞",
      title:
        "User avatar in app bar is missing, although user should be fetched on app start correctly.",
      description:
        "On app start we load the current user object via a MobX store, but for any reason the user avatar is not displayed in the top right of the app bar. Attention: When solving this issue, you might will be confronted with a second bug."
    },
    {
      icon: "🐞",
      title: "Optional: Countdown is broken sometimes (hard to reproduce).",
      description:
        "Some developers mentioned that the countdown in the app header behaves strange sometimes, but unfortunately they were not able to reproduce this glitch reliably, maybe you find the root cause."
    },
    {
      icon: "⭐️",
      title: "Optional: It would be great to be able to switch the language.",
      description:
        "Please add a language select control in the app bar to swicth the UI language between english and german."
    }
  ];

  return (
    <Box p={2} maxHeight="calc(100vh - 64px)" overflow={["auto", "auto"]}>
      <Container>
        <Typography variant="h1" textAlign="center">
          {t("home.welcome")}
        </Typography>
        <Typography variant="subtitle1" textAlign="center">
          {/**
           * @symptom   The literal string "<b>known</b>" is shown instead of a bold word.
           * @rootCause {t("home.intro")} passes the markup to React as a plain string child.
           * @fix       Render via <Trans> so the existing <b> becomes a real element; en.json untouched.
           * @tradeoff  Chosen over dangerouslySetInnerHTML, which (with escapeValue:false) is an XSS sink.
           * @verify    "known" is bold; the i18n source string is unchanged.
           */}
          <Trans i18nKey="home.intro" ns="app" components={{ b: <b /> }} />
        </Typography>
        <Typography variant="body2" textAlign="center" color="textSecondary">
          {t("home.sidenote")}
        </Typography>
        <List>
          {/**
           * @symptom   Console: 'Each child in a list should have a unique "key" prop.'
           * @rootCause issues.map renders sibling <ListItem>s with no key.
           * @fix       Key each row by its stable, unique title.
           * @tradeoff  Title is unique here; swap to a dedicated id if titles could ever collide.
           * @verify    Warning gone; rows reconcile in place instead of remounting.
           */}
          {issues.map((issue) => (
            <ListItem key={issue.title}>
              <Typography variant="h5" sx={{ p: 2 }}>
                {issue.icon}
              </Typography>
              <ListItemText
                primary={issue.title}
                secondary={issue.description}
              />
            </ListItem>
          ))}
        </List>
      </Container>
    </Box>
  );
};

export default observer(Home);
