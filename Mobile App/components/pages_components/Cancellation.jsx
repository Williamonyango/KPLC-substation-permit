import { StyleSheet, Text, TextInput, View } from "react-native";
import React from "react";
import Section from "./Section";
import RadioGroup from "./RadioGroup";
import styles from "./Cancellation.styles";

const Cancellation = ({ formData, handleChange }) => {
  return (
    <View>
      <Section title="3. CLEARANCE" style={styles.clearanceSection}>
        <Text style={styles.declarationText}>
          I hereby declare that all men under my charge have been withdrawn and
          warned that it is NO LONGER SAFE to work on the apparatus specified on
          the P.T.W. and that all gear, tool and ADDITIONAL EARTH CONNECTION are
          clear and have been checked in.
        </Text>
        <RadioGroup
          options={[
            { label: "Yes", value: "yes" },
            { label: "No", value: "no" },
          ]}
          selected={formData?.clearance_signature}
          onSelect={(value) => handleChange("clearance_signature", value)}
          horizontal={true}
          style={styles.radioGroup}
        />
        <View style={styles.datetimeContainer}>
          <View style={styles.timeContainer}>
            <Text style={styles.inputLabel}>Time</Text>
            <TextInput
              style={[styles.datetimeInput, styles.highlighted]}
              value={formData?.clearance_time}
              onChangeText={(text) => handleChange("clearance_time", text)}
            />
            <Text style={styles.inputLabel}>Hrs.</Text>
          </View>

          <View style={styles.dateContainer}>
            <Text style={styles.inputLabel}>Date</Text>
            <TextInput
              style={[styles.datetimeInput, styles.highlighted]}
              value={formData?.clearance_date}
              onChangeText={(text) => handleChange("clearance_date", text)}
            />
          </View>
        </View>
      </Section>

      <Section title="4. CANCELLATION" style={styles.cancellationSection}>
        <View style={styles.cancellationTextContainer}>
          <Text style={styles.cancellationText}>
            I hereby declare that I have checked in
          </Text>
          <TextInput
            style={styles.cancellationInput}
            placeholder="connections"
            onChangeText={(text) => handleChange("connections", text)}
            value={formData?.connections}
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
            value={formData?.cancellation_consent_person}
          />
          <Text style={styles.cancellationText}>
            System Control Engineer, this Permit and all copies are cancelled.
          </Text>
        </View>
      </Section>
    </View>
  );
};

export default Cancellation;
