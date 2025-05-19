import { StyleSheet, Text, View } from "react-native";
import React from "react";
import Section from "./Section";
import { TextInput } from "react-native-paper";
import styles from "./Reciept.styles";
import RadioGroup from "./RadioGroup";

const Reciept = ({ formData, handleChange }) => {
  return (
    <Section title="2. RECEIPT" style={styles.receiptSection}>
      <Text style={styles.declarationText}>
        I hereby declare that I accept responsibility for carrying out the work
        on the Apparatus detailed on this Permit, and that no attempt will be
        made by me, or by any man under my control, to carry out work on any
        other apparatus.
      </Text>
      <RadioGroup
        options={[
          { label: "Yes", value: "yes" },
          { label: "No", value: "no" },
        ]}
        selected={formData?.signature}
        onSelect={(value) => handleChange("signature", value)}
        horizontal={true}
        style={styles.radioGroup}
      />
      <View style={styles.datetimeContainer}>
        <View style={styles.timeContainer}>
          <Text style={styles.inputLabel}>Time</Text>
          <TextInput
            style={styles.datetimeInput}
            onChangeText={(value) => handleChange("issue_time", value)}
            value={formData.issue_time}
          />
          <Text style={styles.inputLabel}>Hrs.</Text>
        </View>

        <View style={styles.dateContainer}>
          <Text style={styles.inputLabel}>Date</Text>
          <TextInput
            style={styles.datetimeInput}
            onChangeText={(value) => handleChange("issue_date", value)}
            value={formData.issue_date}
          />
        </View>
      </View>
    </Section>
  );
};

export default Reciept;
