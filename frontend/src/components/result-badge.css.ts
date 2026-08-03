import { styleVariants } from "@vanilla-extract/css";

import { statusColors } from "../styles/theme.css";

export const badge = styleVariants({
  OK: {
    backgroundColor: statusColors.passBg,
    color: statusColors.passFg,
  },
  NG: {
    backgroundColor: statusColors.failBg,
    color: statusColors.failFg,
  },
});
