import React, { useContext, useEffect, useMemo } from "react";

const ContextProvider = React.createContext({
  auth: () => {},
  setAuth: () => {},
  jwtStatus: () => {},
  setJwtStatus: () => {},
  setOrgStatus: () => {},
  orgStatus: () => {},
});

const DataContextAPI = (props) => {
  const [auth, setAuth] = React.useState(false);
  const [jwtStatus, setJwtStatus] = React.useState(false);
  const [orgStatus, setOrgStatus] = React.useState("");

  useEffect(() => {
    const org_status_val = localStorage.getItem("organizer_status");
    if (org_status_val) {
      setOrgStatus(org_status_val);
    }
  }, [orgStatus]);

  const values = useMemo(() => {
    return {
      auth,
      setAuth,
      jwtStatus,
      setJwtStatus,
      setOrgStatus,
      orgStatus,
    };
  }, [auth, jwtStatus, orgStatus]);
  return (
    <ContextProvider.Provider value={values}>
      {props.children}
    </ContextProvider.Provider>
  );
};

export default DataContextAPI;

export const useContextAPI = () => {
  return useContext(ContextProvider);
};
