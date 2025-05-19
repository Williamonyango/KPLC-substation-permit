import { StyleSheet, Text, TextInput, View } from "react-native";
import React from "react";
import Section from "./Section";
import { TouchableOpacity } from "react-native";
import styles from "./Issue.styles";
import RadioGroup from "./RadioGroup";

const Issue = ({ formData, handleChange, handleArrayChange }) => {
  return (
    <Section title="1. ISSUE">
      <View style={styles.inputRow}>
        <Text style={styles.inputLabel}>To</Text>
        <TextInput
          style={styles.textInput}
          placeholder="Name of person"
          value={formData?.issued_to}
          onChangeText={(value) => handleChange("issued_to", value)}
        />
      </View>
      <View style={styles.inputRow}>
        <Text style={styles.inputLabel}>Substation</Text>
        <TextInput
          style={styles.textInput}
          placeholder="Substation"
          value={formData?.substation}
          onChangeText={(value) => handleChange("substation", value)}
        />
      </View>

      <Text style={styles.sectionText}>
        For the following work to be carried out:-
      </Text>

      {formData?.work_details?.map((detail, index) => (
        <View key={index} style={styles.workDetailContainer}>
          <TextInput
            style={styles.workDetailInput}
            placeholder={`Work detail ${index + 1}`}
            value={detail}
            onChangeText={(value) =>
              handleArrayChange("work_details", index, value)
            }
          />
        </View>
      ))}

      <View style={styles.declarationBox}>
        <View style={styles.declarationRow}>
          <View style={styles.declarationText}>
            <Text style={styles.declarationLetter}>A.</Text>
            <Text>
              I hereby declare that it is safe to work within the following
              defined limits in the Proximity of Live HV / MV Apparatus.
            </Text>
          </View>
          <RadioGroup
            options={[
              { label: "Yes", value: "yes" },
              { label: "No", value: "no" },
            ]}
            selected={formData?.safe_work_limits}
            onSelect={(value) => handleChange("safe_work_limits", value)}
            horizontal={true}
            style={styles.radioGroup}
          />
        </View>
        <Text style={styles.warning}>ALL OTHER PARTS ARE DANGEROUS</Text>
      </View>

      {/* Declaration Box B */}
      <View style={styles.declarationBox}>
        <View style={styles.declarationRow}>
          <View style={styles.declarationText}>
            <Text style={styles.declarationLetter}>B.</Text>
            <Text>
              I hereby declare that it is safe to work on the following H.V.
              Apparatus which is switched out, isolated from all live conductors
              and is connected to Earth.
            </Text>
          </View>
          <RadioGroup
            options={[
              { label: "Yes", value: "yes" },
              { label: "No", value: "no" },
            ]}
            selected={formData?.safe_hv_work_limits}
            onSelect={(value) => handleChange("safe_hv_work_limits", value)}
            horizontal={true}
            style={styles.radioGroup}
          />
        </View>
        <Text style={styles.warning}>ALL OTHER PARTS ARE DANGEROUS</Text>
      </View>

      <View style={styles.equipmentField}>
        <View>
          <Text style={styles.inputLabel}>
            MV/LV Equipment isolated and earthed
          </Text>
          <TextInput
            style={[styles.textInput, styles.fullWidthInput]}
            value={formData?.mv_lv_equipment}
            onChangeText={(value) => handleChange("mv_lv_equipment", value)}
          />
        </View>
      </View>

      <View style={styles.declarationBox}>
        <View style={styles.declarationRow}>
          <Text>Circuit Main Earths have been at the following points</Text>
          <View style={styles.earthPointsContainer}>
            {formData?.earth_points?.map((point, index) => (
              <TextInput
                key={index}
                style={[styles.textInput, styles.fullWidthInput]}
                placeholder={`Earth point ${index + 1}`}
                value={point}
                onChangeText={(text) =>
                  handleArrayChange("earth_points", index, text)
                }
              />
            ))}
          </View>
        </View>
      </View>
      <View style={styles.additionalInfo}>
        <View style={styles.inputRow}>
          <Text style={styles.inputLabel}>
            No. of additional earth connections issue
          </Text>
          <TextInput
            style={styles.textInput}
            value={formData?.additional_earth_connections}
            onChangeText={(value) =>
              handleChange("additional_earth_connections", value)
            }
            keyboardType="numeric"
          />
        </View>

        <View style={styles.consentContainer}>
          <View style={styles.inputRow}>
            <Text style={styles.inputLabel}>Issued with the consent of</Text>
            <TextInput
              style={styles.textInput}
              value={formData?.consent_person}
              onChangeText={(value) => handleChange("consent_person", value)}
            />
          </View>
          <Text style={styles.engineerText}>Senior Engineer.</Text>
        </View>

        <View style={styles.datetimeContainer}>
          <View style={styles.timeContainer}>
            <Text style={styles.inputLabel}>Time</Text>
            <TextInput
              style={[styles.datetimeInput, styles.highlighted]}
              value={formData?.issue_time}
              onChangeText={(value) => handleChange("issue_time", value)}
            />
            <Text style={styles.inputLabel}>Hrs.</Text>
          </View>

          <View style={styles.dateContainer}>
            <Text style={styles.inputLabel}>Date</Text>
            <TextInput
              style={[styles.datetimeInput, styles.highlighted]}
              value={formData?.issue_date}
              onChangeText={(value) => handleChange("issue_date", value)}
            />
          </View>
        </View>
      </View>
    </Section>
  );
};

export default Issue;
