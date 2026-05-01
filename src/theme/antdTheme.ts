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
    Table: {
      headerBg: "#F66F76",
      colorBgContainer: "#ffff",
      borderColor: "#ffff",
      headerColor: '#ffffff',
    },
    Empty: {
      colorText: "#ff4d4f",   // text "No Data"
      colorFill: "#ffeaea",   // icon/illustration color
    },
    Upload: {
      colorBorder: "#F66F76",
      colorPrimaryHover: "#F66F76",
      colorBorderHover: "#F66F76",
    }
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
    Table: {
      headerBg: "#F66F76",
      colorBgContainer: "#ffff",
      borderColor: "#ffff",
      headerColor: '#ffffff',
    },
    Empty: {
      colorText: "#ff4d4f",   // text "No Data"
      colorFill: "#ffeaea",   // icon/illustration color
    },
    Upload: {
      colorBorder: "#F66F76",
      colorPrimaryHover: "#F66F76",
      colorBorderHover: "#F66F76",
    }
  },
}
