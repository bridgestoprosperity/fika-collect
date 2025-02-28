import {StyleSheet} from 'react-native';

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
});
