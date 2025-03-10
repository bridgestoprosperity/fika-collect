/*import {View, Text, Button} from 'react-native';
import {useAppSelector, useAppDispatch} from '../hooks';
import {
  selectCount,
  increment,
  decrement,
  incrementAsync,
} from '../features/counter';

export default function Counter() {
  // The `state` arg is correctly typed as `RootState` already
  const count = useAppSelector(selectCount);
  const dispatch = useAppDispatch();

  return (
    <View>
      <Text>{count}</Text>
      <Button title="increment" onPress={() => dispatch(increment())} />
      <Button title="decrement" onPress={() => dispatch(decrement())} />
      <Button
        title="increment async"
        onPress={() => dispatch(incrementAsync(5))}
      />
    </View>
  );
}

*/
