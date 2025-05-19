import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Issue from "./Issue";
import Reciept from "./Reciept";
import Section from "./Section";
import RadioGroup from "./RadioGroup";
import Cancellation from "./Cancellation";

const RenderFormContent = ({
  formData,
  handleChange,
  handleArrayChange,
  handleSubmit,
  styles,
}) => {
  return (
    <>
      <Issue
        formData={formData}
        handleChange={handleChange}
        handleArrayChange={handleArrayChange}
      />
      <Reciept formData={formData} handleChange={handleChange} />

      <Section title="3 Urgency">
        <View style={styles.urgencyOptions}>
          <RadioGroup
            options={[
              { label: "High", value: "high" },
              { label: "Medium", value: "medium" },
              { label: "Low", value: "low" },
            ]}
            selected={formData.urgency}
            onSelect={(value) => handleChange("urgency", value)}
            horizontal={true}
          />
        </View>
      </Section>

      <View style={styles.formFooter}>
        <TouchableOpacity
          style={styles.submitButton}
          onPress={() => {
            handleSubmit();
          }}
          activeOpacity={0.8}
        >
          <Text style={styles.submitButtonText}>Submit Permit Form</Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

export default RenderFormContent;
