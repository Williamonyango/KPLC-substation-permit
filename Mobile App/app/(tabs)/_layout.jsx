import React from "react";
import { View, Platform } from "react-native";
import { Tabs } from "expo-router";
import { FontAwesome5 } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import Colors from "@/constants/Colors";
import { useColorScheme } from "@/components/useColorScheme";
import { useClientOnlyValue } from "@/components/useClientOnlyValue";

function TabBarIcon({ name, color, focused }) {
  return (
    <View
      style={{
        alignItems: "center",
        justifyContent: "center",
        height: 36,
        width: 36,
        borderRadius: 18,
        backgroundColor: focused ? `${color}20` : "transparent",
      }}
    >
      <FontAwesome5
        name={name}
        size={focused ? 18 : 16}
        color={color}
        solid={focused}
      />
    </View>
  );
}

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const insets = useSafeAreaInsets();

  const isDark = colorScheme === "dark";
  const tintColor = Colors[colorScheme ?? "light"].tint || "#007AFF";

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: tintColor,
        tabBarInactiveTintColor: isDark ? "#8E8E93" : "#8E8E93",
        headerShown: useClientOnlyValue(false, true),
        tabBarShowLabel: true,
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "500",
          marginBottom: Platform.OS === "ios" ? 0 : 3,
        },
        // Regular tab bar that doesn't overlay content
        tabBarStyle: {
          borderTopWidth: isDark ? 0.5 : 0.5,
          borderTopColor: isDark ? "#2C2C2E" : "#E5E5EA",
          height: 55 + insets.bottom,
          paddingBottom: insets.bottom,
          backgroundColor: isDark ? "#1C1C1E" : "#FFFFFF",
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.05,
          shadowRadius: 3,
          elevation: 5,
        },
        // Add bottom padding to screens to account for tab bar
        contentStyle: {
          paddingBottom: 55 + insets.bottom,
        },
      }}
    >
      <Tabs.Screen
        name="LandingPage"
        options={{
          headerShown: false,
          title: "Home",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name="home" color={color} focused={focused} />
          ),
        }}
      />

      <Tabs.Screen
        name="History"
        options={{
          headerShown: false,
          title: "History",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name="history" color={color} focused={focused} />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          headerShown: false,
          title: "Profile",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name="user" color={color} focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
}
