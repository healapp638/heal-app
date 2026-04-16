// theme/antdTheme.ts
import { theme } from "antd"

export const lightTheme = {
  algorithm: theme.defaultAlgorithm,
  token: {
    colorPrimary: "#1DA57A",
    borderRadius: 8,
    fontSize: 16,
    colorText: "#333333",
    colorBgLayout: "#f0f2f5",
    controlHeight: 40,
  },
  components: {
    Button: {
      borderRadius: 10,
      colorPrimaryBg: "#ff0000",
    },
    Input: {
      borderRadius: 6,
    },
  },
}

export const darkTheme = {
  algorithm: theme.darkAlgorithm,
  token: {
    colorPrimary: "#1DA57A",
    borderRadius: 8,
    fontSize: 16,
    colorText: "#ffffff",
    colorBgLayout: "#141414",
    controlHeight: 40,
  },
  components: {
    Button: {
      borderRadius: 10,
      colorPrimaryBg: "#a30000",
    },
    Input: {
      borderRadius: 6,
    },
  },
}
