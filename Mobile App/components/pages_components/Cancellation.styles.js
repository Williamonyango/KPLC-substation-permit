import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  clearanceSection: {
    backgroundColor: "rgba(0, 166, 81, 0.05)",
  },
  declarationText: {
    fontSize: 14,
    marginVertical: 15,
    lineHeight: 20,
    color: "#333",
  },
  signatureLine: {
    marginVertical: 10,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 8,
    flexWrap: "wrap",
  },
  inputLabel: {
    fontSize: 14,
    color: "#333",
    marginRight: 10,
  },
  signatureInput: {
    flex: 1,
    borderBottomWidth: 2,
    borderBottomColor: "#c8d0d9",
    padding: 8,
    backgroundColor: "#f9fafc",
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    fontSize: 14,
  },
  roleText: {
    fontSize: 12,
    marginLeft: 40,
    color: "#555",
    fontStyle: "italic",
    marginTop: 4,
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

  cancellationSection: {
    backgroundColor: "rgba(255, 193, 7, 0.1)",
  },
});
export default styles;
