import axios from "axios";

export default async function apiCall(props) {
    return await axios(props);
}
