import { createContext, Dispatch, FC, useReducer } from "react";

import { IRegistrationDto } from "@components/sections/registration/interfaces";

interface FormState {
  successId: string | null;
  data: IRegistrationDto | undefined;
  step: string | null;
  price: string | null;
}

interface FormAction {
  type: string;
  payload: string | null;
}

interface FormContextType {
  state: FormState;
  dispatch: Dispatch<FormAction>;
}

interface FormProps {
  children: JSX.Element;
}

// vytvoření kontextu pro data formuláře
export const FormContext = createContext<FormContextType | undefined>(
  undefined
);

const reducer = (state: FormState, action: FormAction) => {
  switch (action.type) {
    case "setPrice":
      return { ...state, price: action.payload };
    case "setStep":
      return { ...state, step: action.payload };
    case "setSuccessId":
      return { ...state, successId: action.payload };
    case "setData":
      return { ...state, data: JSON.parse(action.payload ?? "{}") };
    default:
      throw new Error(`Unknown action type: ${action.type}`);
  }
};

const initialState: FormState = {
  successId: "",
  data: undefined,
  step: "",
  price: null,
};
export const FormProvider: FC<FormProps> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <FormContext.Provider value={{ state, dispatch }}>
      {children}
    </FormContext.Provider>
  );
};
