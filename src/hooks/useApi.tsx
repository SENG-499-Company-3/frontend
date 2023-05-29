import { useContext } from "react";

const useApi = () => {
    /**
     * For now, we'll use a hardcoded API host. But in the future, we will need to pull this in
     * from an environment variable of some kind.
     */
    const API_HOST = 'localhost:1234';
    const baseURL = `${API_HOST}`; // To be changed later if needed

    const authContext = useContext(AuthContext);
    const userToken = authContext.userToken();

    const axiosInstance = useMemo(() => {
        return axios.create({
            headers: {
              Authorization: `Bearer ${userToken}`
            },
            baseURL
          });
    }, [userToken, baseURL]);

    const auth = useAuthApi(axiosInstance);

    return {
        auth
    }
}
