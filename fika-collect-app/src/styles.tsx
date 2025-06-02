import {StyleSheet} from 'react-native';
import {Platform} from 'react-native';

export default StyleSheet.create({
  button: {
    backgroundColor: 'green',
    padding: 10,
    borderRadius: 5,
    marginLeft: 10,
    paddingLeft: 20,
    paddingRight: 20,
  },
  buttonSecondary: {
    backgroundColor: '#666',
  },
  buttonPressed: {
    backgroundColor: 'darkgreen',
  },
  buttonSecondaryPressed: {
    backgroundColor: '#444',
  },
  buttonText: {
    fontSize: 18,
    color: 'white',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  sectionHeaderContainer: {
    width: '100%',
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    marginBottom: 20,
  },
  sectionHeaderText: {
    textTransform: 'uppercase',
    marginBottom: 10,
  },
  picker: {
    color: 'black',
    borderWidth: 1,
    borderColor: '#cccccc',
    height: Platform.OS === 'android' ? 80 : 210,
    width: '100%',
    borderRadius: 3,
  },
});
