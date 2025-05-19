import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  Image,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import logo from "../../assets/images/LOGO3.png";
import { getPermitsById } from "../../services/api";

const PermitHistoryScreen = () => {
  const [permitHistory, setPermitHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let interval;

    const fetchUserIdAndPermits = async () => {
      try {
        const userId = await AsyncStorage.getItem("userId");
        if (userId) {
          const response = await getPermitsById(userId);
          const sortedPermits = response.sort(
            (a, b) => new Date(b.issue_date) - new Date(a.issue_date)
          );
          setPermitHistory(sortedPermits);
        } else {
          console.warn("No userId found in AsyncStorage.");
        }
      } catch (error) {
        console.error("Error fetching permits for userId:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserIdAndPermits();
    interval = setInterval(fetchUserIdAndPermits, 20000);

    return () => clearInterval(interval);
  }, []);

  const renderStatusBadge = (status) => {
    let backgroundColor;
    switch (status.toLowerCase()) {
      case "approved":
        backgroundColor = "#28a745";
        break;
      case "pending":
        backgroundColor = "#ffc107";
        break;
      case "rejected":
      default:
        backgroundColor = "#dc3545";
        break;
    }

    return (
      <View style={[styles.statusBadge, { backgroundColor }]}>
        <Text style={styles.statusText}>{status}</Text>
      </View>
    );
  };

  const renderItem = ({ item }) => (
    <View style={styles.permitCard}>
      <View style={styles.cardHeader}>
        <Text style={styles.permitNumber}>Permit No: {item.permit_number}</Text>
        {renderStatusBadge(item.status)}
      </View>
      <Text style={styles.permitLabel}>Submitted on:</Text>

      <Text style={styles.permitDate}>
        {new Date(item.issue_date).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
        ,{"    "}
        At: {item.issue_time}
      </Text>
    </View>
  );

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

        <Text style={styles.title}>Permit History</Text>

        {loading ? (
          <ActivityIndicator
            size="large"
            color="#003366"
            style={{ marginTop: 50 }}
          />
        ) : (
          <FlatList
            contentContainerStyle={styles.flatListContent}
            data={permitHistory}
            renderItem={renderItem}
            keyExtractor={(item, index) =>
              item.permit_number || index.toString()
            }
            ListEmptyComponent={
              <Text style={styles.emptyText}>No permit history available.</Text>
            }
          />
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default PermitHistoryScreen;

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
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    color: "#003366",
    marginVertical: 20,
  },
  flatListContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  permitCard: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  permitNumber: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#003366",
  },
  permitLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#555",
  },
  permitDate: {
    fontSize: 14,
    color: "#333",
  },
  statusBadge: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  statusText: {
    color: "#fff",
    fontWeight: "600",
    textTransform: "capitalize",
    fontSize: 12,
  },
  emptyText: {
    textAlign: "center",
    color: "#555",
    fontSize: 16,
    marginTop: 50,
  },
});
