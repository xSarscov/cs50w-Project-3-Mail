import { customAlert } from './index.js'
import { sendEmailFetch } from '../helpers/index.js'

export const sendEmail = async () => {

  const recipients = document.querySelector('#compose-recipients').value;
  const subject = document.querySelector('#compose-subject').value;
  const body = document.querySelector('#compose-body').value;

  const newEmail = {
    recipients,
    subject,
    body,
  }

  const response = await sendEmailFetch(newEmail);

  const was_successful = response.hasOwnProperty("message");

  const alertInfo = {
    message: was_successful ? response.message : response.error,
    messageType: was_successful ? 'success' : 'danger',
  }

  customAlert(alertInfo);
}