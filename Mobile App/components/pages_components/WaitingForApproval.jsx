import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ActivityIndicator, Alert } from "react-native";
import { useRouter } from "expo-router";
import { checkPermitStatus } from "../../services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

const WaitingForApproval = ({ permitNumber }) => {
  const router = useRouter();
  const [status, setStatus] = useState("pending");
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const permit = await checkPermitStatus(permitNumber);
        const status = permit.status.toLowerCase();

        if (status === "approved") {
          setMessage({
            text: "Your permit has been approved!",
            type: "success",
          });
          try {
            const tokenData = {
              permitNumber,
              timestamp: new Date().toISOString(),
              status: "approved",
            };
            await AsyncStorage.setItem(
              "approvedPermitToken",
              JSON.stringify(tokenData)
            );
          } catch (error) {
            Alert.alert(
              "Error",
              "Failed to save permit status. Please try again.",
              [
                {
                  text: "OK",
                  onPress: () => router.replace("/"),
                },
              ]
            );
            return;
          }
          setTimeout(() => {
            router.replace("/cancel");
          }, 10000);
        } else if (status === "rejected") {
          setMessage({
            text: "Your permit has been rejected.",
            reason: permit.comments || "No reason provided",
            type: "error",
          });
          setTimeout(() => {
            router.replace("/");
          }, 10000);
        } else {
          setStatus(permit.status);
          setMessage(null);
        }
      } catch (error) {
        setError(error.message);
        if (error.message.includes("not found")) {
          Alert.alert(
            "Error",
            "Permit not found. Please check the permit number and try again."
          );
        } else {
          Alert.alert(
            "Error",
            "Failed to check permit status. Please try again later."
          );
        }
      }
    };

    const interval = setInterval(checkStatus, 5000);
    checkStatus();

    return () => clearInterval(interval);
  }, [permitNumber]);

  return (
    <View style={styles.container}>
      {message ? (
        <View style={styles.messageContainer}>
          <Text
            style={[
              styles.messageText,
              message.type === "error"
                ? styles.errorMessage
                : styles.successMessage,
            ]}
          >
            {message.text}
          </Text>
          {message.type === "error" && message.reason && (
            <Text style={styles.reasonText}>Reason: {message.reason}</Text>
          )}
          <Text style={styles.navigationText}>
            {message.type === "error"
              ? "Returning to home page..."
              : "Redirecting to cancel page..."}
          </Text>
        </View>
      ) : (
        <>
          <ActivityIndicator size="large" color="#003366" />
          <Text style={styles.text}>Waiting for approval...</Text>
          <Text style={styles.subText}>
            Please wait while we check the status of your permit
          </Text>
          {error && <Text style={styles.errorText}>Error: {error}</Text>}
          <Text style={styles.statusText}>Current Status: {status}</Text>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    padding: 20,
  },
  messageContainer: {
    alignItems: "center",
    padding: 20,
  },
  messageText: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  successMessage: {
    color: "#28a745",
  },
  errorMessage: {
    color: "#dc3545",
  },
  navigationText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#003366",
    marginTop: 20,
    marginBottom: 10,
  },
  subText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 10,
  },
  errorText: {
    fontSize: 14,
    color: "red",
    textAlign: "center",
    marginTop: 10,
  },
  statusText: {
    fontSize: 16,
    color: "#003366",
    fontWeight: "500",
    marginTop: 10,
  },
  reasonText: {
    fontSize: 16,
    color: "#dc3545",
    textAlign: "center",
    marginTop: 10,
    marginBottom: 20,
    fontStyle: "italic",
  },
});

export default WaitingForApproval;
