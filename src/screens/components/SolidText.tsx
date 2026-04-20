import { useTheme } from "@react-navigation/native";
import React from "react";
import { Text, TextProps, StyleSheet, View } from "react-native";
import { useSelector } from "react-redux";

// Default font scaling (prevent breaking layouts with large accessibility text)
// You can tune this per design requirement

interface AppTextProps extends TextProps {
    children: React.ReactNode;
    maxFontScale?: number; // override per usage if needed
    variant?: "bold" | "medium" | "regular" | "semibold";
}

const SolidText: React.FC<AppTextProps> = ({
    children,
    maxFontScale,
    variant = "regular",
    style,
    ...props
}) => {
    const fontScaling = useSelector((state: any) => state.userData.fontScaling);
    const { colors } = useTheme();
    return (
        <Text
            {...props}
            style={[styles[variant], style]}
            adjustsFontSizeToFit
            maxFontSizeMultiplier={maxFontScale ?? fontScaling}
            allowFontScaling>
            {children}
        </Text>
    );
};

const styles = StyleSheet.create({
    bold: {
        fontWeight: "700",
        color: "white",
        fontSize: 17
    },
    medium: {
        fontWeight: "500",
        color: "white",
        fontSize: 17
    },
    regular: {
        fontWeight: "400",
        color: "white",
        fontSize: 17
    },
    semibold: {
        fontWeight: '600',
        color: "white",
        fontSize: 17
    },
});

export default SolidText;
