import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { RadioButton } from "react-native-paper";
const RadioGroup = ({ options, selected, onSelect, horizontal = false }) => {
  return (
    <View
      style={[
        styles.radioContainer,
        horizontal && styles.radioContainerHorizontal,
      ]}
    >
      {options.map((option, index) => (
        <View key={index} style={styles.radioOption}>
          <RadioButton
            value={option.value}
            status={selected === option.value ? "checked" : "unchecked"}
            onPress={() => onSelect(option.value)}
            color="#003366"
          />
          <Text style={styles.radioLabel}>{option.label}</Text>
        </View>
      ))}
    </View>
  );
};

export default RadioGroup;

const styles = StyleSheet.create({
  radioContainer: {
    marginVertical: 5,
  },
  radioContainerHorizontal: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  radioOption: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5,
  },
  radioLabel: {
    marginLeft: 8,
    fontSize: 14,
    color: "#555",
  },
});
