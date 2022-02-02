import { useReducer, useEffect } from "react";
import {
  Platform,
  View,
  Text,
  TextInput,
  StyleSheet,
  TextInputComponent,
  TextInputProps,
} from "react-native";
import Colors from "../../constants/Colors";
import { StateKeys } from "../../screens/user/EditProductsScreen";

interface Props extends TextInputProps {
  label?: string | undefined;
  errorText?: string | undefined;
  value?: string | undefined;
  isValid?: boolean | undefined;
  touched?: boolean | undefined;
  initialValue?: string;
  initialyValid?: boolean | undefined;
  required?: boolean | undefined;
  email?: boolean | undefined;
  min?: number | undefined;
  max?: number | undefined;
  minLength?: number | undefined;
  onInputChange: (
    inputIdentifier: string,
    value: string,
    isValid: boolean
  ) => void;
  id: string;
}

type State = {
  value: string;
  isValid: boolean;
  touched: boolean;
};
type Actions = {
  type: "INPUT_CHANGE" | "INPUT_BLUR";
  value: string;
  isValid: boolean;
};

const inputReducer = (state: State, action: Actions) => {
  if (action.type === "INPUT_CHANGE") {
    return {
      ...state,
      value: action.value,
      isValid: action.isValid,
    };
  } else if (action.type === "INPUT_BLUR") {
    return {
      ...state,
      touched: true,
    };
  }
  return state;
};

const Input = (props: Props) => {
  const [inputState, dispatch] = useReducer(inputReducer, {
    value: props.initialValue ? props.initialValue : "",
    isValid: props.initialyValid ? true : false,
    touched: false,
  });

  const { onInputChange, id } = props;
  useEffect(() => {
    if (inputState.touched) {
      onInputChange(id, inputState.value, inputState.isValid);
    }
  }, [inputState, onInputChange, id]);

  const textChangeHandler = (text: string) => {
    const emailRegex =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    let isValid = true;
    if (props.required && text.trim().length === 0) {
      isValid = false;
    }
    if (props.email && !emailRegex.test(text.toLowerCase())) {
      isValid = false;
    }
    if (props.min != null && +text < props.min) {
      isValid = false;
    }
    if (props.max != null && +text > props.max) {
      isValid = false;
    }
    if (props.minLength != null && text.length < props.minLength) {
      isValid = false;
    }
    dispatch({ type: "INPUT_CHANGE", value: text, isValid });
  };

  const lostFocusHandler = () => {
    dispatch({
      type: "INPUT_BLUR",
      value: inputState.value,
      isValid: inputState.isValid,
    });
  };

  return (
    <View style={styles.formControl}>
      <Text style={styles.label}>{props.label}</Text>
      <TextInput
        {...props}
        style={styles.input}
        value={inputState.value}
        onChangeText={textChangeHandler}
        onBlur={lostFocusHandler}
      />
      {!inputState.isValid && inputState.touched && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{props.errorText}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  formControl: {
    width: "100%",
  },
  label: {
    fontFamily: "open-sans-bold",
    marginVertical: 8,
  },
  input: {
    paddingHorizontal: 2,
    paddingVertical: 5,
    borderBottomColor: "#ccc",
    borderBottomWidth: 1,
  },
  errorContainer: {
    marginVertical: 5,
  },
  errorText: {
    fontFamily: "open-sans",
    color: "red",
    fontSize: 13,
  },
});

export default Input;
