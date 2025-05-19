import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  receiptSection: {
    backgroundColor: "rgba(0, 114, 188, 0.05)",
  },

  declarationText: {
    marginBottom: 10,
  },
  signatureLine: {
    marginVertical: 10,
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
    padding: 2,
    backgroundColor: "#f9fafc",
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    fontSize: 14,
  },
  highlighted: {
    backgroundColor: "rgba(255, 193, 7, 0.2)",
    borderBottomColor: "#ffc107",
  },
});
export default styles;
