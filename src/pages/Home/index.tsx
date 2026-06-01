import { Box, Container, Typography } from "@mui/material";
import { observer } from "mobx-react";
import React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import { Trans, useTranslation } from "react-i18next";

const Home = () => {
  const { t } = useTranslation("app");
  /**
   * @symptom   Switching to DE leaves the whole issues list in English.
   * @rootCause The list was a hardcoded English array, never sourced from i18n.
   * @fix       Source titles/descriptions from `home.issues`; keep emojis in code.
   * @tradeoff  returnObjects needs a cast; fine for a small, statically-typed list.
   * @verify    List re-renders in the selected language alongside the rest of the UI.
   */
  const icons = ["🐞", "🐞", "🐞", "🐞", "⭐️"];
  const issues = t("home.issues", { returnObjects: true }) as {
    title: string;
    description: string;
  }[];

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
          {issues.map((issue, i) => (
            <ListItem key={issue.title}>
              <Typography variant="h5" sx={{ p: 2 }}>
                {icons[i]}
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
