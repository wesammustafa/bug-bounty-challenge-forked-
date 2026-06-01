import { Grow, Box, MenuItem, Select, Theme, Toolbar, Typography } from "@mui/material";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import { styled, useTheme } from "@mui/material/styles";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { User } from "../../api/services/User/store";
import AvatarMenu from "../AvatarMenu";

interface AppBarProps extends MuiAppBarProps {
  theme?: Theme;
}

interface AppHeaderProps {
  user: User;
  pageTitle: string;
}

const typoStyle = {
  display: "flex",
  alignContent: "center",
  justifyContent: "center",
  lineHeight: 1
};

const AppBar = styled(MuiAppBar)<AppBarProps>(({ theme }) => ({
  zIndex: theme.zIndex.drawer + 1,
  backgroundColor: theme.palette.common.black,
  color: theme.palette.common.white,
  height: theme.tokens.header.height
}));

const AppHeader = React.forwardRef((props: AppHeaderProps, ref) => {
  const { user, pageTitle } = props;
  const { t, i18n } = useTranslation("app");
  const theme = useTheme();

  const [deadline] = useState(() => Date.now() + 60 * 60 * 1000); // 1h from mount
  const [remaining, setRemaining] = useState(deadline - Date.now());

  /**
   * @symptom   Countdown occasionally races/double-ticks, drifts after the tab is backgrounded, then goes negative.
   * @rootCause Uncleared setInterval stacks on Fast-Refresh/remount; counting ticks drifts vs the wall clock; no zero-stop.
   * @fix       Derive remaining from a fixed deadline, clean up on unmount, clamp >= 0, stop at zero, and show a localized end-state.
   * @tradeoff  250ms tick for a smooth, drift-free display instead of 1000ms; cost is negligible.
   * @verify    Steady in foreground and after backgrounding; shows a localized "time's up" at zero; no leaked timers.
   */
  useEffect(() => {
    const id = setInterval(() => {
      const ms = Math.max(0, deadline - Date.now());
      setRemaining(ms);
      if (ms === 0) clearInterval(id);
    }, 250);
    return () => clearInterval(id);
  }, [deadline]);

  const totalSeconds = Math.floor(remaining / 1000);
  const countdownMinutes = `${Math.floor(totalSeconds / 60)}`.padStart(2, "0");
  const countdownSeconds = `${totalSeconds % 60}`.padStart(2, "0");
  const isExpired = remaining <= 0;

  return (
    <AppBar ref={ref} position="fixed" sx={{ width: "100vw" }}>
      <Toolbar sx={{ background: "#08140C 0% 0% no-repeat padding-box" }}>
        <Box sx={{ width: "100%", flexDirection: "row", display: "flex" }}>
          <Box>
            <Typography
              variant="h6"
              component="div"
              color={isExpired ? "error" : "primary"}
            >
              {isExpired
                ? t("timesUp")
                : `${countdownMinutes}:${countdownSeconds}`}
            </Typography>
          </Box>
          <Box sx={{ width: 20, height: 20, flex: 1 }} />
          <Box sx={{ flex: 2 }}>
            <Typography
              sx={{
                ...typoStyle,
                color: theme.palette.primary.main,
                mb: theme.spacing(0.5)
              }}
              variant="h6"
              component="div"
            >
              {t("appTitle").toLocaleUpperCase()}
            </Typography>
            <Typography
              sx={{ ...typoStyle }}
              variant="overline"
              component="div"
              noWrap
            >
              {pageTitle.toLocaleUpperCase()}
            </Typography>
          </Box>
          <Box
            sx={{
              flex: 1,
              justifyContent: "flex-end",
              alignItems: "center",
              display: "flex",
              gap: 1
            }}
          >
            {/**
              * @symptom   No way to change the UI language.
              * @rootCause No control exists; i18n is only ever initialised in EN.
              * @fix       Allow-listed Select calling i18n.changeLanguage("en" | "de").
              * @tradeoff  Two fixed locales; extend the option list to add more.
              * @verify    Selecting DE/EN re-renders every i18n string immediately.
              */}
            <Select
              size="small"
              value={i18n.language?.startsWith("de") ? "de" : "en"}
              onChange={(e) => i18n.changeLanguage(e.target.value)}
              sx={{
                color: "white",
                ".MuiOutlinedInput-notchedOutline": {
                  borderColor: "rgba(255,255,255,0.5)"
                }
              }}
            >
              <MenuItem value="en">EN</MenuItem>
              <MenuItem value="de">DE</MenuItem>
            </Select>
            {user && user.eMail && (
              <Grow in={Boolean(user && user.eMail)}>
                <AvatarMenu user={user} />
              </Grow>
            )}
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
});

export default AppHeader;
