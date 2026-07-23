import { Auth } from "aws-amplify"

const signIn = async (username, password) => {
    return await Auth.signIn(username, password)
}

export default {
    signIn,
}
