import axiosJWT from "./ConfigAxiosInterceptor";

const URL_CONVERSATION = `https://localhost:7158/api/Conversation`;


export const CreateConversationApi = (
    name,
    messages,
    participants,
  ) => {
    return axiosJWT.post(URL_CONVERSATION, {
      name: name,
      messages: messages,
      participants: participants,
    });
  };

export const GetAllConversationsApi = (params) => {
    return axiosJWT.get(URL_CONVERSATION, {
        params: params
    })
}
export const GetConversationByIdApi = (conversationId) => {
    return axiosJWT.get(`${URL_CONVERSATION}/${conversationId}`);
};

export const GetConversationByUserIdApi = (userId) => {
    return axiosJWT.get(`${URL_CONVERSATION}/user/${userId}`);
};

