import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  SafeAreaView,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import logo from "../../assets/images/LOGO3.png";

const ProfilePage = () => {
  const [userName, setUserName] = useState(null);
  const [userEmail, setUserEmail] = useState(null);
  const router = useRouter();

  const logout = async () => {
    await AsyncStorage.removeItem("authToken");
    await AsyncStorage.removeItem("userName");
    await AsyncStorage.removeItem("userEmail");
    router.push("/"); // Redirect to the login page
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const storedUserName = await AsyncStorage.getItem("userName");
        const storedUserEmail = await AsyncStorage.getItem("userEmail");

        if (storedUserName) setUserName(storedUserName);
        if (storedUserEmail) setUserEmail(storedUserEmail);
      } catch (error) {
        console.error("Error retrieving user data:", error);
      }
    };

    fetchUserData();
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#002855" />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Modern Header with Gradient-like Effect */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Image source={logo} style={styles.logo} resizeMode="contain" />
            <View style={styles.headerTextContainer}>
              <Text style={styles.headerTitle}>KENYA POWER</Text>
              <Text style={styles.headerSubtitle}>and LIGHTING COMPANY</Text>
            </View>
          </View>
          <View style={styles.headerDecoration} />
        </View>

        {/* Profile Content */}
        <View style={styles.profileContainer}>
          {/* Profile Card */}
          <View style={styles.profileCard}>
            <View style={styles.profileImageContainer}>
              <Image
                source={{
                  uri: "https://randomuser.me/api/portraits/men/1.jpg",
                }}
                style={styles.profileImage}
              />
            </View>
            <Text style={styles.username}>
              {userName ? userName : "Loading..."}
            </Text>
            <Text style={styles.email}>
              {userEmail ? userEmail : "Loading..."}
            </Text>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionsContainer}>
            <TouchableOpacity style={styles.actionButton}>
              <View style={styles.actionIconContainer}>
                <FontAwesome name="eye" size={20} color="#fff" />
              </View>
              <Text style={styles.actionText}>View Profile</Text>
              <FontAwesome
                name="chevron-right"
                size={16}
                color="#A0A0A0"
                style={styles.actionArrow}
              />
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton}>
              <View style={styles.actionIconContainer}>
                <FontAwesome name="cog" size={20} color="#fff" />
              </View>
              <Text style={styles.actionText}>Settings</Text>
              <FontAwesome
                name="chevron-right"
                size={16}
                color="#A0A0A0"
                style={styles.actionArrow}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, styles.logoutButton]}
              onPress={logout}
            >
              <View
                style={[styles.actionIconContainer, styles.logoutIconContainer]}
              >
                <FontAwesome name="sign-out" size={20} color="#fff" />
              </View>
              <Text style={styles.actionText}>Log Out</Text>
              <FontAwesome
                name="chevron-right"
                size={16}
                color="#A0A0A0"
                style={styles.actionArrow}
              />
            </TouchableOpacity>
          </View>

          {/* Additional Card - Account Info */}
          <View style={styles.infoCard}>
            <Text style={styles.infoCardTitle}>Account Info</Text>
            <View style={styles.infoRow}>
              <FontAwesome name="user" size={16} color="#002855" />
              <Text style={styles.infoText}>Personal Account</Text>
            </View>
            <View style={styles.infoRow}>
              <FontAwesome name="calendar" size={16} color="#002855" />
              <Text style={styles.infoText}>Member since 2023</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F5F7FA",
  },
  scrollContainer: {
    flexGrow: 1,
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
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  logo: {
    height: 40,
    width: 40,
    borderRadius: 10,
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
    color: "#FFD700", // Gold color for subtitle
    marginTop: 2,
    fontWeight: "500",
  },
  headerDecoration: {
    position: "absolute",
    top: 0,
    right: 0,
    height: "100%",
    width: "35%",
    backgroundColor: "rgba(255, 215, 0, 0.6)", // Semi-transparent gold
    borderTopLeftRadius: 80,
    borderBottomLeftRadius: 80,
    zIndex: -1,
  },
  profileContainer: {
    padding: 20,
    paddingTop: 5,
  },
  profileCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 20,
  },
  profileImageContainer: {
    padding: 3,
    borderRadius: 75,
    backgroundColor: "#FFFFFF",
    shadowColor: "#002855",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
    marginBottom: 15,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: "#FFD700",
  },
  username: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#002855",
    marginBottom: 5,
  },
  email: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 5,
  },
  actionsContainer: {
    marginBottom: 20,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    paddingVertical: 15,
    paddingHorizontal: 15,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  actionIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#002855",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  logoutIconContainer: {
    backgroundColor: "#D10000", // Red for logout
  },
  actionText: {
    fontSize: 16,
    color: "#1F2937",
    fontWeight: "500",
    flex: 1,
  },
  actionArrow: {
    opacity: 0.7,
  },
  logoutButton: {
    marginTop: 10,
  },
  infoCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 20,
  },
  infoCardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#002855",
    marginBottom: 15,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F2F5",
  },
  infoText: {
    fontSize: 14,
    color: "#4B5563",
    marginLeft: 15,
  },
});

export default ProfilePage;
