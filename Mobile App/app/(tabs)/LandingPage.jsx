import React, { useState, useEffect } from "react";
import { StyleSheet } from "react-native";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  SafeAreaView,
  StatusBar,
  Image,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import logo from "../../assets/images/LOGO3.png";
import RenderFormContent from "../../components/pages_components/RenderFormContent";
import { submitPermit, getHighestPermitNumber } from "../../services/api";
import WaitingForApproval from "../../components/pages_components/WaitingForApproval";

const LandingPage = () => {
  const router = useRouter();
  const [userId, setUserId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [permitNumber, setPermitNumber] = useState("");
  const [isInitialized, setIsInitialized] = useState(false);
  const [hasApprovedPermit, setHasApprovedPermit] = useState(false);

  const getInitialFormState = (userId = null, permitNum = "") => ({
    permit_number: permitNum,
    issued_to: "",
    substation: "",
    work_details: ["", "", ""],
    safe_work_limits: "",
    safe_hv_work_limits: "",
    mv_lv_equipment: "",
    earth_points: ["", "", ""],
    additional_earth_connections: "",
    consent_person: "",
    issue_date: new Date().toISOString().split("T")[0],
    issue_time: new Date().toLocaleTimeString("en-GB", { hour12: false }),
    comments: null,
    approver_name: null,
    approval_date: null,
    approval_time: null,
    urgency: "",
    status: "pending",
    clearance_date: new Date().toISOString().split("T")[0],
    clearance_time: new Date().toLocaleTimeString("en-GB", { hour12: false }),
    clearance_signature: null,
    connections: "",
    cancellation_consent_person: "",
    submitted_at: new Date().toLocaleTimeString("en-GB", { hour12: false }),
    Id_number: userId,
  });

  const [formData, setFormData] = useState(getInitialFormState());
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    const checkApprovedPermit = async () => {
      try {
        const token = await AsyncStorage.getItem("approvedPermitToken");
        if (token) {
          setHasApprovedPermit(true);
          Alert.alert(
            "You can't apply for another permit",
            "You have an approved permit that needs to be cancelled first. Please complete the cancellation process.",
            [
              {
                text: "OK",
                onPress: () => router.replace("/cancel"),
              },
            ]
          );
          return true; // Return true if there's an approved permit
        }
        return false; // Return false if no approved permit
      } catch (error) {
        console.error("Error checking approved permit:", error);
        return false;
      }
    };

    const initialize = async () => {
      const hasApproved = await checkApprovedPermit();
      if (!hasApproved) {
        // Only proceed with other initialization if there's no approved permit
        const token = await AsyncStorage.getItem("authToken");
        if (!token) {
          router.replace("index");
          return;
        }
        const storedUserId = await AsyncStorage.getItem("userId");
        if (storedUserId) {
          setUserId(storedUserId);
        } else {
          Alert.alert("Error", "User ID not found. Please log in again.");
          router.replace("index");
        }
      }
    };

    initialize();
  }, []);

  useEffect(() => {
    let isMounted = true;
    const getPermitNumber = async () => {
      try {
        const highest = await getHighestPermitNumber();
        const nextPermit = String(highest + 1);
        if (isMounted) {
          setPermitNumber((prev) => (prev !== nextPermit ? nextPermit : prev));
        }
      } catch (error) {
        console.error("Error fetching permit number:", error);
      }
    };

    getPermitNumber();
    const interval = setInterval(getPermitNumber, 5000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    if (userId && permitNumber && !isInitialized) {
      setFormData(getInitialFormState(userId, permitNumber));
      setIsInitialized(true);
    }
  }, [userId, permitNumber, isInitialized]);

  useEffect(() => {
    setFormData((prev) => {
      if (prev.permit_number !== permitNumber && !isSubmitted) {
        return { ...prev, permit_number: permitNumber };
      }
      return prev;
    });
  }, [permitNumber, isSubmitted]);

  const handleChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleArrayChange = (field, index, value) => {
    setFormData((prev) => {
      const newArray = [...prev[field]];
      newArray[index] = value;
      return { ...prev, [field]: newArray };
    });
  };

  const resetForm = () => {
    setFormData(getInitialFormState(userId, permitNumber));
    setIsSubmitted(false);
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const submissionData = {
        ...formData,
        Id_number: userId || formData.Id_number,
      };

      if (!submissionData.Id_number) {
        Alert.alert("Error", "User ID not set. Please log in again.");
        setIsLoading(false);
        return;
      }

      console.log("Submitting permit with number:", formData.permit_number);
      await submitPermit(submissionData);
      setIsLoading(false);
      setIsSubmitted(true);
      console.log(
        "Navigating to waiting screen with permit number:",
        formData.permit_number
      );
      router.push({
        pathname: "/waiting",
        params: { permitNumber: formData.permit_number },
      });
    } catch (error) {
      setIsLoading(false);
      Alert.alert("Error", "Error submitting form. Please try again.");
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="#003366" barStyle="light-content" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
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
            <Text style={styles.loadingText}>Submitting permit form...</Text>
          </View>
        ) : (
          <ScrollView style={styles.scrollView}>
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

              <View style={styles.formTitleContainer}>
                <Text style={styles.formTitle}>Electrical Permit to Work</Text>
              </View>
              <RenderFormContent
                formData={formData}
                handleChange={handleChange}
                handleArrayChange={handleArrayChange}
                handleSubmit={handleSubmit}
                resetForm={resetForm}
                styles={styles}
                isLoading={isLoading}
              />
            </View>
          </ScrollView>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default LandingPage;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  container: {
    flex: 1,
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
  scrollView: {
    flex: 1,
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
  permitNumberBox: {
    width: 120,
    marginLeft: 200,
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
  formTitleContainer: {
    alignItems: "center",
    marginVertical: 20,
  },
  formTitle: {
    fontSize: 22,
    fontWeight: "700",
    textTransform: "uppercase",
    color: "#003366",
    marginBottom: 10,
    paddingBottom: 10,
    borderBottomWidth: 3,
    borderBottomColor: "#003366",
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
  sectionText: {
    fontSize: 14,
    marginVertical: 10,
    color: "#333",
  },
  formFooter: {
    marginTop: 20,
    alignItems: "center",
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
