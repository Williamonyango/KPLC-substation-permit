import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  Image,
  Alert,
  ActivityIndicator,
} from "react-native";
import logo from "../assets/images/LOGO3.png";
import Section from "../components/pages_components/Section";
import RadioGroup from "../components/pages_components/RadioGroup";
import { router } from "expo-router";
import { updatePermit, getHighestPermitNumber } from "../services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Cancel = () => {
  const [formData, setFormData] = useState({
    // clearance
    clearance_date: new Date().toISOString().split("T")[0],
    clearance_time: new Date().toLocaleTimeString("en-GB", { hour12: false }),
    clearance_signature: null,
    permit_number: "",

    // cancellation
    connections: "",
    cancellation_consent_person: "",
    submitted_at: new Date().toLocaleTimeString("en-GB", { hour12: false }),
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(true);

  const handleChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    const setNextPermitNumber = async () => {
      try {
        const highest = await getHighestPermitNumber();
        setFormData((prev) => ({
          ...prev,
          permit_number: String(highest),
        }));
      } catch (error) {
        console.error("Error setting permit number:", error);
      }
    };

    setNextPermitNumber();
  }, []);

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const token = await AsyncStorage.getItem("approvedPermitToken");

        if (!token) {
          Alert.alert(
            "Access Denied",
            "No approved permit found. Please submit and get approval for a permit first.",
            [
              {
                text: "OK",
                onPress: () => router.replace("/"),
              },
            ]
          );
          return;
        }

        const tokenData = JSON.parse(token);

        if (tokenData.status !== "approved") {
          Alert.alert(
            "Access Denied",
            "No approved permit found. Please submit and get approval for a permit first.",
            [
              {
                text: "OK",
                onPress: () => router.replace("/"),
              },
            ]
          );
          return;
        }

        setFormData((prev) => ({
          ...prev,
          permit_number: tokenData.permitNumber,
        }));
        setIsVerifying(false);
      } catch (error) {
        Alert.alert(
          "Error",
          "Failed to verify permit status. Please try again.",
          [
            {
              text: "OK",
              onPress: () => router.replace("/"),
            },
          ]
        );
      }
    };

    verifyToken();
  }, []);

  const handleSubmit = async () => {
    // Validate form
    if (!formData.clearance_signature) {
      Alert.alert("Error", "Please confirm clearance by selecting Yes or No");
      return;
    }

    if (!formData.connections) {
      Alert.alert("Error", "Please enter connections information");
      return;
    }

    if (!formData.cancellation_consent_person) {
      Alert.alert("Error", "Please enter the name of the consent person");
      return;
    }

    // Set loading state to true before submitting
    setIsLoading(true);

    try {
      const { permit_number, ...permitData } = formData; // Separate permit_number from the rest
      const response = await updatePermit(permit_number, permitData);

      // After successful submission, clear the token
      await AsyncStorage.removeItem("approvedPermitToken");

      // Set loading state to false after successful submission
      setIsLoading(false);
      alert("Permit cancelled successfully");
      router.replace("/success");
    } catch (error) {
      // Set loading state to false if there's an error
      setIsLoading(false);
      console.error("Error submitting form", error);
      Alert.alert("Error", "An error occurred while submitting the form");
    }

    // Reset form data
    setFormData({
      // Reset the form data to initial state
      clearance_date: new Date().toISOString().split("T")[0],
      clearance_time: new Date().toLocaleTimeString("en-GB", { hour12: false }),
      clearance_signature: null,
      permit_number: "",
      connections: "",
      cancellation_consent_person: "",
      submitted_at: new Date().toLocaleTimeString("en-GB", { hour12: false }),
    });
  };

  if (isVerifying) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#003366" />
        <Text style={styles.loadingText}>Verifying permit status...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="#003366" barStyle="light-content" />
      <View style={styles.container}>
        <View style={styles.header}>
          <Image source={logo} style={styles.logo} resizeMode="contain" />
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerTitle}>KENYA POWER</Text>
            <Text style={styles.headerSubtitle}>and LIGHTING COMPANY</Text>
          </View>
          <View style={styles.headerDecoration} />
        </View>

        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#003366" />
            <Text style={styles.loadingText}>Cancelling permit...</Text>
          </View>
        ) : (
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.keyboardView}
          >
            <ScrollView
              style={styles.scrollView}
              contentContainerStyle={styles.scrollContent}
            >
              <View style={styles.formContainer}>
                <View style={styles.formHeader}>
                  <View style={styles.companyInfo}>
                    <Text style={styles.companyTitle}>
                      The Kenya Power and Lighting Co. Ltd.
                    </Text>
                    <Text style={styles.companySubtitle}>
                      OTHER RELEVANT{"\n"}PERMIT NUMBERS
                    </Text>
                    <View style={styles.permitNumberBox}>
                      <Text style={styles.permitNumberLabel}>No.</Text>
                      <TextInput
                        style={styles.permitNumberInput}
                        value={formData.permit_number}
                        onChangeText={(value) =>
                          handleChange("permit_number", value)
                        }
                        keyboardType="numeric"
                      />
                    </View>
                  </View>
                </View>
                <Section title="3. CLEARANCE" style={styles.clearanceSection}>
                  <Text style={styles.declarationText}>
                    I hereby declare that all men under my charge have been
                    withdrawn and warned that it is NO LONGER SAFE to work on
                    the apparatus specified on the P.T.W. and that all gear,
                    tool and ADDITIONAL EARTH CONNECTION are clear and have been
                    checked in.
                  </Text>
                  <RadioGroup
                    options={[
                      { label: "Yes", value: "yes" },
                      { label: "No", value: "no" },
                    ]}
                    selected={formData.clearance_signature}
                    onSelect={(value) =>
                      handleChange("clearance_signature", value)
                    }
                    horizontal={true}
                    style={styles.radioGroup}
                  />
                  <View style={styles.datetimeContainer}>
                    <View style={styles.timeContainer}>
                      <Text style={styles.inputLabel}>Time</Text>
                      <TextInput
                        style={[styles.datetimeInput, styles.highlighted]}
                        value={formData.clearance_time}
                        onChangeText={(text) =>
                          handleChange("clearance_time", text)
                        }
                      />
                      <Text style={styles.inputLabel}>Hrs.</Text>
                    </View>

                    <View style={styles.dateContainer}>
                      <Text style={styles.inputLabel}>Date</Text>
                      <TextInput
                        style={[styles.datetimeInput, styles.highlighted]}
                        value={formData.clearance_date}
                        onChangeText={(text) =>
                          handleChange("clearance_date", text)
                        }
                      />
                    </View>
                  </View>
                </Section>

                <Section
                  title="4. CANCELLATION"
                  style={styles.cancellationSection}
                >
                  <View style={styles.cancellationTextContainer}>
                    <Text style={styles.cancellationText}>
                      I hereby declare that I have checked in
                    </Text>
                    <TextInput
                      style={styles.cancellationInput}
                      placeholder="connections"
                      onChangeText={(text) => handleChange("connections", text)}
                      value={formData.connections}
                    />
                    <Text style={styles.cancellationText}>
                      additional Earth Connections and that with the Consent of
                    </Text>
                    <TextInput
                      style={styles.cancellationInput}
                      placeholder="name"
                      onChangeText={(text) =>
                        handleChange("cancellation_consent_person", text)
                      }
                      value={formData.cancellation_consent_person}
                    />
                    <Text style={styles.cancellationText}>
                      System Control Engineer, this Permit and all copies are
                      cancelled.
                    </Text>
                  </View>
                </Section>

                <View style={styles.formFooter}>
                  <TouchableOpacity
                    style={styles.submitButton}
                    onPress={handleSubmit}
                    activeOpacity={0.8}
                    disabled={isLoading}
                  >
                    <Text style={styles.submitButtonText}>Cancel Permit</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        )}
      </View>
    </SafeAreaView>
  );
};

export default Cancel;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#003366",
    paddingVertical: 15,
    paddingHorizontal: 20,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    position: "relative",
  },
  logo: {
    height: 50,
    width: 50,
    borderRadius: 5,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#003366",
    fontWeight: "500",
  },
  formContainer: {
    backgroundColor: "white",
    margin: 15,
    borderRadius: 8,
    padding: 20,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    position: "relative",
  },
  formHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eaedf0",
  },
  companyInfo: {
    flex: 1,
  },
  companyTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#003366",
    marginBottom: 5,
  },
  companySubtitle: {
    fontSize: 12,
    color: "#555",
  },
  permitNumberContainer: {
    alignItems: "flex-end",
    marginBottom: 15,
    backgroundColor: "rgba(0, 58, 112, 0.03)",
  },
  permitNumberBox: {
    width: 120,
    marginLeft: 180,
    flexDirection: "row",
    marginTop: -30,
    alignItems: "center",
    backgroundColor: "rgba(0, 58, 112, 0.1)",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  permitNumberLabel: {
    fontSize: 14,
    color: "#003366",
    fontWeight: "500",
  },
  permitNumberInput: {
    width: 60,
    marginLeft: 5,
    borderBottomWidth: 2,
    borderBottomColor: "#003366",
    padding: 2,
    fontWeight: "600",
    color: "#003366",
  },
  headerTextContainer: {
    marginLeft: 15,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
    textTransform: "uppercase",
  },
  headerSubtitle: {
    fontSize: 12,
    color: "#ffc107",
    marginTop: 2,
  },
  headerDecoration: {
    position: "absolute",
    top: 0,
    right: 0,
    height: "100%",
    width: "30%",
    backgroundColor: "#ffc107",
    borderTopLeftRadius: 60,
    borderBottomLeftRadius: 60,
    zIndex: -1,
  },
  clearanceSection: {
    backgroundColor: "rgba(0, 166, 81, 0.05)",
    marginBottom: 20,
    padding: 15,
    borderRadius: 8,
  },
  declarationText: {
    fontSize: 14,
    marginVertical: 15,
    lineHeight: 20,
    color: "#333",
  },
  radioGroup: {
    marginVertical: 10,
  },
  datetimeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 15,
    flexWrap: "wrap",
  },
  timeContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  dateContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  inputLabel: {
    fontSize: 14,
    color: "#333",
    marginRight: 10,
  },
  datetimeInput: {
    width: 120,
    borderBottomWidth: 2,
    borderBottomColor: "#c8d0d9",
    marginHorizontal: 10,
    padding: 8,
    backgroundColor: "#f9fafc",
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    fontSize: 14,
  },
  highlighted: {
    backgroundColor: "rgba(255, 193, 7, 0.2)",
    borderBottomColor: "#ffc107",
  },
  cancellationSection: {
    backgroundColor: "rgba(255, 193, 7, 0.1)",
    marginBottom: 20,
    padding: 15,
    borderRadius: 8,
  },
  cancellationTextContainer: {
    marginVertical: 10,
  },
  cancellationText: {
    fontSize: 14,
    marginVertical: 5,
    color: "#333",
  },
  cancellationInput: {
    width: "100%",
    borderBottomWidth: 2,
    borderBottomColor: "rgba(0, 0, 0, 0.2)",
    padding: 8,
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    fontSize: 14,
    marginVertical: 5,
  },
  formFooter: {
    marginTop: 20,
    alignItems: "center",
    marginBottom: 20,
  },
  submitButton: {
    backgroundColor: "#003366",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    elevation: 5,
    shadowColor: "#003366",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  submitButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
