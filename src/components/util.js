import { createBrowserHistory } from 'history';

export const history = createBrowserHistory({forceRefresh: true});

// TODO redirect to login if no token
export function getUserIdFromToken() {
  const token = localStorage.getItem('refresh_token');
  const encodedPayLoad = token.split('.')[1];
  const payloadObject = JSON.parse(atob(encodedPayLoad));
  const userId = payloadObject.user_id;
  return userId;
}

export function getUserTypeFromToken() {
  const token = localStorage.getItem('refresh_token');
  const encodedPayLoad = token.split('.')[1];
  const payloadObject = JSON.parse(atob(encodedPayLoad));
  const userType = payloadObject.user_type;
  return userType;
}