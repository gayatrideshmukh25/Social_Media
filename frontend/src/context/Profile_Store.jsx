import { createContext, useReducer, useState, useEffect } from "react";
export const profileabout = createContext({});

export const ProfileProvider = ({ children }) => {
  const [profileLoading, setProfileLoading] = useState(true);

  const profileReducer = (currState, action) => {
    if (action.type === "edit_profile") {
      return {
        ...currState,
        ...action.payload.user,
      };
    } else if (action.type === "set_profile") {
      return action.payload.user;
    }
    return currState;
  };
  const editProfile = (user) => {
    const editProfile = {
      type: "edit_profile",
      payload: { user },
    };
    dispathchProfile(editProfile);
  };
  const setProfile = (user) => {
    const setProfile = {
      type: "set_profile",
      payload: { user },
    };
    dispathchProfile(setProfile);
  };
  const [profile, dispathchProfile] = useReducer(profileReducer, null);

  return (
    <profileabout.Provider
      value={{
        profile: profile,
        profileLoading,
        setProfile: setProfile,
        editProfile: editProfile,
        setProfileLoading: setProfileLoading,
      }}
    >
      {children}
    </profileabout.Provider>
  );
};
