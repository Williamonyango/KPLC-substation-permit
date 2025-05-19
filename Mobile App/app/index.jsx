import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  SafeAreaView,
  BackHandler,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Feather } from "@expo/vector-icons";
import logo from "../assets/images/LOGO3.png";
import { router } from "expo-router";
import { getUsers } from "../services/api";

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Handle hardware back button
  useEffect(() => {
    const backAction = () => {
      // If user is logged in, prevent going back
      if (isLoggedIn) {
        // Exit the app instead of going back
        BackHandler.exitApp();
        return true; // Prevents default behavior
      }
      return false; // Allows default behavior
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, [isLoggedIn]);

  // Check if user is logged in
  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        const token = await AsyncStorage.getItem("authToken");
        if (token) {
          setIsLoggedIn(true);
          router.replace("/(tabs)/LandingPage");
        }
      } catch (error) {
        console.error("Error checking auth status:", error);
      }
    };

    checkLoggedIn();
  }, []);

  const handleChange = (field, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
    setError("");
  };

  const handleSubmit = async () => {
    const { email, password } = formData;

    if (!email || !password) {
      setError("Please enter both email and password");
      return;
    }

    setIsLoading(true);
    try {
      const response = await getUsers(email, password);

      if (response && response.length > 0) {
        const user = response[0];
        const token = user.token;
        const name = user.Name;
        const email = user.Email;
        const userId = user.Id_number;

        // Store user data
        await AsyncStorage.setItem("authToken", token);
        await AsyncStorage.setItem("userName", name);
        await AsyncStorage.setItem("userEmail", email);
        await AsyncStorage.setItem("userId", JSON.stringify(userId));

        setIsLoggedIn(true);
        // Use replace instead of push to prevent going back to login
        router.replace("/(tabs)/LandingPage");
      } else {
        setError("Invalid username or password");
      }
    } catch (error) {
      if (error.message) {
        setError(error.message);
      } else {
        setError("An error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#004b87" barStyle="light-content" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollView}>
          <View style={styles.logoContainer}>
            <View style={styles.logoWrapper}>
              <Image source={logo} style={styles.logo} resizeMode="contain" />
            </View>
          </View>

          <View style={styles.formContainer}>
            <Text style={styles.formTitle}>KPLC Permit</Text>
            <Text style={styles.formSubtitle}>
              Sign in to access your account
            </Text>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email Address</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your email address"
                  value={formData.email}
                  onChangeText={(text) => handleChange("email", text)}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
                <Feather
                  name="mail"
                  size={20}
                  color="#aaa"
                  style={styles.inputIcon}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Password</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChangeText={(text) => handleChange("password", text)}
                  secureTextEntry={!showPassword}
                />
                <Feather
                  onPress={() => setShowPassword((prev) => !prev)}
                  name={showPassword ? "eye" : "eye-off"}
                  size={20}
                  color="#aaa"
                  style={styles.inputIcon}
                />
              </View>
            </View>

            <View style={styles.forgotPasswordContainer}>
              <Text style={styles.forgotPasswordText}>Forgot password? </Text>
              <TouchableOpacity>
                <Text style={styles.forgotPasswordLink}>Click here</Text>
              </TouchableOpacity>
            </View>

            {error ? (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null}

            <TouchableOpacity
              style={[
                styles.button,
                styles.primaryButton,
                isLoading && styles.disabledButton,
              ]}
              onPress={handleSubmit}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Sign In Securely</Text>
              )}
            </TouchableOpacity>

            <View style={styles.securityBadge}>
              <Feather name="lock" size={14} color="#004b87" />
              <Text style={styles.securityText}>
                Secured by 256-bit encryption
              </Text>
            </View>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>
              © 2025 Kenya Power & Lighting Company Ltd. All rights reserved.
            </Text>
            <View style={styles.footerLinks}>
              <TouchableOpacity>
                <Text style={styles.footerLink}>Terms of Service</Text>
              </TouchableOpacity>
              <Text style={styles.footerDot}>•</Text>
              <TouchableOpacity>
                <Text style={styles.footerLink}>Privacy Policy</Text>
              </TouchableOpacity>
              <Text style={styles.footerDot}>•</Text>
              <TouchableOpacity>
                <Text style={styles.footerLink}>Help Center</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#004b87",
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flexGrow: 1,
  },
  logoContainer: {
    alignItems: "center",
    paddingTop: 40,
    marginBottom: 20,
  },
  logoWrapper: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 4,
    borderColor: "#ffc72c",
  },
  logo: {
    width: 80,
    height: 80,
  },
  formContainer: {
    backgroundColor: "white",
    margin: 20,
    borderRadius: 12,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    borderTopWidth: 5,
    borderTopColor: "#ffc72c",
  },
  formTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#004b87",
    textAlign: "center",
    marginBottom: 5,
  },
  formSubtitle: {
    fontSize: 14,
    color: "#444",
    textAlign: "center",
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontWeight: "500",
    color: "#003b6a",
    marginBottom: 6,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
    borderWidth: 2,
    borderColor: "#e0e0e0",
    borderRadius: 6,
  },
  input: {
    flex: 1,
    padding: 12,
    fontSize: 16,
  },
  inputIcon: {
    marginRight: 12,
  },
  forgotPasswordContainer: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-end",
    marginBottom: 20,
  },
  forgotPasswordText: {
    fontSize: 14,
    color: "#444",
  },
  forgotPasswordLink: {
    color: "#004b87",
    fontWeight: "500",
  },
  button: {
    padding: 15,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryButton: {
    backgroundColor: "#004b87",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  disabledButton: {
    opacity: 0.7,
  },
  errorContainer: {
    backgroundColor: "rgba(229, 57, 53, 0.1)",
    padding: 10,
    borderRadius: 4,
    marginBottom: 15,
    borderLeftWidth: 3,
    borderLeftColor: "#e53935",
  },
  errorText: {
    color: "#e53935",
    fontSize: 14,
  },
  securityBadge: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 15,
  },
  securityText: {
    marginLeft: 6,
    fontSize: 12,
    color: "#444",
  },
  footer: {
    padding: 20,
    alignItems: "center",
  },
  footerText: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.7)",
    textAlign: "center",
  },
  footerLinks: {
    flexDirection: "row",
    justifyContent: "center",
    flexWrap: "wrap",
    marginTop: 5,
  },
  footerLink: {
    fontSize: 12,
    color: "#ffc72c",
    fontWeight: "500",
  },
  footerDot: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.7)",
    marginHorizontal: 5,
  },
});
