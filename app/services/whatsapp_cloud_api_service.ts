import env from '#start/env'
import axios from 'axios'

const VERSION = 'v22.0'
const PHONE_NUMBER_ID = env.get('PHONE_NUMBER_ID')
const WA_ACCESS_TOKEN = env.get('WA_ACCESS_TOKEN')

export default async function sendMessege(recipentNumber: string, message: string) {
  const data = {
    messaging_product: 'whatsapp',
    to: recipentNumber,
    type: 'text',
    text: {
      body: message,
    },
  }

  axios
    .post(`https://graph.facebook.com/${VERSION}/${PHONE_NUMBER_ID}/messages`, data, {
      headers: {
        'Authorization': `Bearer ${WA_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
    })
    .then((response) => {
      console.log('Response:', response.data)
    })
    .catch((error) => {
      console.error('Error:', error.response ? error.response.data : error.message)
    })
}
