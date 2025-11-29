import QRCode from 'qrcode'
import crypto from 'node:crypto'

class QrCodeService {
  public async generateQR(data: string): Promise<Buffer> {
    const secret = process.env.QR_SECRET || 'mysecretkey'
    const signature = crypto.createHmac('sha256', secret).update(data).digest('hex')
    const payload = JSON.stringify({ data, signature })
    const qrBuffer = await QRCode.toBuffer(payload)

    return qrBuffer
  }

  public verifyPayload(payloadString: string): boolean {
    try {
      const payload = JSON.parse(payloadString)
      const { data, signature } = payload
      const secret = process.env.QR_SECRET || 'mysecretkey'
      const expectedSignature = crypto.createHmac('sha256', secret).update(data).digest('hex')
      return expectedSignature === signature
    } catch {
      return false
    }
  }
}

export default new QrCodeService()
