const SET_USER = "member/SET_USER";
const LOGIN = "member/LOGIN";
const LOGOUT = "member/LOGOUT";

export const setUser = (data) => ({ type: SET_USER, data });
export const login = () => ({ type: LOGIN });
export const logout = () => ({ type: LOGOUT });

const initialState = {
  name: "",
  email: "",
  phone: "",
  nickname: "",
};

export default function member(state = initialState, action) {
  switch (action.type) {
    case SET_USER:
      console.log(action);
      return {
        ...state,
        name: action.data.name,
        email: action.data.email,
        phone: action.data.phone,
        nickname: action.data.nickname,
      };
    case LOGIN:
      return {
        ...state,
      };
    case LOGOUT:
      return {
        ...state,
        name: "",
        email: "",
        phone: "",
        nickname: "",
      };
    default:
      return state;
  }
}
