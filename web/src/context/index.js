import React, { useEffect, useState, useReducer, useCallback } from "react";
import { reducer, initialState } from './reducer';
import acts from './actions';

export const Context = React.createContext();

const Provider = ({ children }) => {

    const [state, dispatch] = useReducer(reducer, initialState);
    const actions = acts(state,dispatch);

    return(
        <Context.Provider
            value={{
                state,
                actions
            }}
      >
        {children}
      </Context.Provider>
    )
}

export default Provider;