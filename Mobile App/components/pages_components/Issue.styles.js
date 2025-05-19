import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    inputRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 8,
        flexWrap: 'wrap',
      },
    inputLabel: {
        fontSize: 14,
        color: '#333',
        marginRight: 10,
      },
    textInput: {
        flex: 1,
        borderBottomWidth: 2,
        borderBottomColor: '#c8d0d9',
        padding: 8,
        backgroundColor: '#f9fafc',
        borderTopLeftRadius: 4,
        borderTopRightRadius: 4,
        fontSize: 14,
      },
    sectionText: {
        fontSize: 14,
        marginVertical: 10,
        color: '#333',
      },
    workDetailContainer: {
        marginLeft: 20,
        marginBottom: 10,
        position: 'relative',
      },
    workDetailInput: {
        width: '100%',
        borderBottomWidth: 2,
        borderBottomColor: '#c8d0d9',
        padding: 8,
        backgroundColor: '#f9fafc',
        borderTopLeftRadius: 4,
        borderTopRightRadius: 4,
        fontSize: 14,
      },
    declarationBox: {
        marginBottom: 15,
        padding: 12,
        backgroundColor: 'rgba(0, 58, 112, 0.03)',
        borderRadius: 8,
        borderLeftWidth: 4,
        borderLeftColor: '#003366',
      },
    declarationRow: {
        marginBottom: 10,
      },
      declarationText: {
        marginBottom: 10,
      },
    declarationLetter: {
        fontWeight: '600',
        color: '#003366',
        fontSize: 16,
      },
    radioGroup: {
        marginTop: 10,
      },
    radioOption: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
      },
    radioButton: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#003366',
        marginRight: 10,
      },
    radioSelected: {
        backgroundColor: '#003366',
      },
    warning: {
        textAlign: 'center',
        fontWeight: '600',
        fontSize: 13,
        marginVertical: 8,
        padding: 6,
        backgroundColor: '#fff3cd',
        color: '#856404',
        borderRadius: 4,
        borderLeftWidth: 4,
        borderLeftColor: '#ffc107',
      },
    equipmentField: {
        marginVertical: 15,
        padding: 15,
        backgroundColor: 'rgba(0, 166, 81, 0.05)',
        borderRadius: 8,
      },
    earthPointsContainer: {
        width: '100%',
      },
    earthPointInput: {
        width: '100%',
        marginVertical: 5,
        borderBottomWidth: 2,
        borderBottomColor: '#c8d0d9',
        padding: 8,
        backgroundColor: '#fff',
        borderTopLeftRadius: 4,
        borderTopRightRadius: 4,
        fontSize: 14,
      },
    additionalInfo: {
        marginTop: 15,
      },
    consentContainer: {
        marginVertical: 10,
      },
    engineerText: {
        textAlign: 'right',
        color: '#555',
        fontWeight: '500',
        fontSize: 12,
        marginTop: 5,
      },
    signatureLine: {
        marginVertical: 10,
      },
    signatureInput: {
        flex: 1,
        borderBottomWidth: 2,
        borderBottomColor: '#c8d0d9',
        padding: 8,
        backgroundColor: '#f9fafc',
        borderTopLeftRadius: 4,
        borderTopRightRadius: 4,
        fontSize: 14,
      },
    roleText: {
        fontSize: 12,
        marginLeft: 40,
        color: '#555',
        fontStyle: 'italic',
        marginTop: 4,
      },
    datetimeContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 15,
        flexWrap: 'wrap',
      },
    timeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
      },
    dateContainer: {
        flexDirection: 'row',
        alignItems: 'center',
      },
    datetimeInput: {
        width: 120,
        borderBottomWidth: 2,
        borderBottomColor: '#c8d0d9',
        marginHorizontal: 10,
        padding: 8,
        backgroundColor: '#f9fafc',
        borderTopLeftRadius: 4,
        borderTopRightRadius: 4,
        fontSize: 14,
      },
    highlighted: {
        backgroundColor: 'rgba(255, 193, 7, 0.2)',
        borderBottomColor: '#ffc107',
      },
    fullWidthInput: {
        width: '100%',
      },

});
export default styles;