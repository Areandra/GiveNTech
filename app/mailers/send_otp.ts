import User from '#models/user'
import { BaseMail } from '@adonisjs/mail'

export default class SendOtpMail extends BaseMail {
  constructor(
    public user: User,
    public otpCode: string
  ) {
    super()
  }
  prepare() {
    this.message
      .to(this.user.email)
      .from('no-reply@giventech.com', 'GivenTech')
      .subject('Kode Verifikasi OTP Anda').html(`
        <p>Halo ${this.user.username},</p>
        <p>Kode Verifikasi (OTP) Anda adalah: <strong>${this.otpCode}</strong></p>
        <p>Kode ini berlaku selama 5 menit.</p>
        <p>Jangan berikan kode ini kepada siapapun.</p>
      `)
  }
}
