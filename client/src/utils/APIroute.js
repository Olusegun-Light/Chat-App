import APP_HOST from "../configs/envVariables";
//auth routes :
export const registerRoute = `${APP_HOST}/api/auth/register`;
export const loginRoute = `${APP_HOST}/api/auth/login`;
export const logoutRoute = `${APP_HOST}/api/auth/logout`;
export const setAvatarRoute = `${APP_HOST}/api/auth/setavatar`;
export const updateProfileRoute = `${APP_HOST}/api/auth/update`;

export const allUsersRoute = `${APP_HOST}/api/auth/allusers`;

//message routes :
export const sendMessageRoute = `${APP_HOST}/api/messages/addmessage`;
export const getMessageRoute = `${APP_HOST}/api/messages/getmessage`;

export const createGroupRoute = `${APP_HOST}/api/groups/create`;

export const addGroupMessageRoute = `${APP_HOST}/api/groupmessages/addgroupmessage`;

export const getGroupMessages = `${APP_HOST}/api/groupmessages/getGroupMessages`;

//cloud routes :
export const uploadMedia = `${APP_HOST}/api/cloud/upload`;
