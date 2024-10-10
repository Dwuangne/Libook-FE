import axiosJWT from "./ConfigAxiosInterceptor";

const URL_MESSAGE = `https://localhost:7158/api/Message`;

// export const GetMessageByConversationIdApi = (conversationId) => {
//     return axiosJWT.get(`${URL_MESSAGE}/conversation/${conversationId}`);
// };

export const GetMessageByConversationIdApi = (conversationId, pageIndex, pageSize) => {
    return axiosJWT.get(`${URL_MESSAGE}/conversation/${conversationId}`, {
        params: {
            pageIndex: pageIndex,
            pageSize: pageSize
        }
    });
};