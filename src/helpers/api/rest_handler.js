import axios from 'axios';
import qs from 'query-string';
import { Alert } from 'react-native';
import endpoints from "../../constants/endpoints";
import AsyncStorage from '@react-native-async-storage/async-storage';

const RequestHandler = async (method, endpoint, body = null, contentType = "Application/json", auth = false) => {
    const options = {
        method: method,
        url: endpoint,
        baseURL: endpoints.BASE_URL,
        headers: {},
    };
    if (auth) {
        const accessToken = await AsyncStorage.getItem('access_token').catch(() => null);
        if (accessToken) {
            options.headers['Authorization'] = `Bearer ${accessToken}`;
        }
    }
    switch (contentType) {
        case "Application/json":
            options.headers["content-type"] = contentType;
            options.data = body;
            break;
        case "application/x-www-form-urlencoded":
            options.headers["content-type"] = contentType;
            options.data = qs.stringify(body);
            break;
    }

    const resp = await axios(options).catch(async (err) => { 
        if(!err.response) {
            Alert.alert("Error Connecting to Server", `There was an error connecting to our server. Please check our server status at status.greenclick.app.`)
        }
        switch (err.response.status) {
            case 429:
                Alert.alert("Slow down", `You are currently being rate-limited, please slow down.`);
                break;
            case 401:
                const refreshToken = await AsyncStorage.getItem('refresh_token').catch(() => null);
                if (refreshToken) {
                    const refresh = await RequestHandler("post", endpoints.TOKEN(), { refresh_token: refreshToken }, "application/x-www-form-urlencoded")
                       .catch((err) => err);

                    if ("access_token" in refresh) {
                        await AsyncStorage.setItem('access_token', refresh.access_token).catch(() => null);
                        return await RequestHandler(method, endpoint, body, contentType, auth)
                            .then((res) => ({ data: res }))
                            .catch((err) => err)
                    }
                }

                await AsyncStorage.multiRemove(["access_token", "refresh_token"]).catch((err) => Alert.alert("Something went wrong", `An error has occurred unexpectedly, please try again.`))
                break;
            case 500:
                Alert.alert("Something went wrong", `An error has occurred unexpectedly, please try again.`);
                break;
            // COMMENTED, BECAUSE BAD REQUEST SHOULD BE BLENDED WITH THE SCREEN CONTENTS ITSELF
            // SO THAT THE ERROR ISN'T JUST A USELESS POP UP/ALERT BOX
            // case 400:
            //     Alert.alert("Bad Request", `${err.response.data.error.message} Error Code: (${err.response.data.error.status})`)
            //     break;
        }

        return err.response.data;
    });
    if ("error" in resp) {
        return resp;
    }

    return resp.data;
}

export default RequestHandler;