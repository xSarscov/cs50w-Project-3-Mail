import { showEmailDetailsFetch } from "../helpers/index.js"
import { createEmailDetails } from "./index.js";

export const showEmailDetails = async(id, load_mailbox, compose_email) => {
    const email = await showEmailDetailsFetch(id);

    const emailDiv = createEmailDetails(email, load_mailbox, compose_email);

    return emailDiv;
}