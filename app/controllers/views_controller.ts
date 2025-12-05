import Booking from '#models/booking'
import Facility from '#models/facility'
import Room from '#models/room'
import User from '#models/user'
import booking_service from '#services/booking_service'
// import FacilityService from '#services/fasility_service'
import type { HttpContext } from '@adonisjs/core/http'
import { ChartJSNodeCanvas } from 'chartjs-node-canvas'
import { DateTime } from 'luxon'

export default class ViewsController {
  private async generateLast7DaysGrowthChart() {
    const chart = new ChartJSNodeCanvas({ width: 1600, height: 700 })

    const labels: string[] = []
    const facilityCounts: number[] = []
    const bookingCounts: number[] = []
    const userCounts: number[] = []

    for (let i = 6; i >= 0; i--) {
      const date = DateTime.now().minus({ days: i })

      const start = date.startOf('day').toSQL()
      const end = date.endOf('day').toSQL()

      labels.push(date.toFormat('dd LLL'))

      const facilityCount = await Facility.query()
        .where('status', 'Damaged')
        .whereBetween('createdAt', [start, end])
        .count('* as total')

      facilityCounts.push(Number(facilityCount[0].$extras.total))

      const bookingCount = await Booking.query()
        .whereBetween('createdAt', [start, end])
        .count('* as total')

      bookingCounts.push(Number(bookingCount[0].$extras.total))

      const userCount = await User.query()
        .whereBetween('createdAt', [start, end])
        .count('* as total')

      userCounts.push(Number(userCount[0].$extras.total))
    }

    const buffer = await chart.renderToBuffer({
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: 'Facilities Damaged',
            data: facilityCounts,
            borderColor: '#fff04dff',
            backgroundColor: '#fff64d44',
            borderWidth: 3,
            fill: true,
            tension: 0.3,
          },
          {
            label: 'Booking Created',
            data: bookingCounts,
            borderColor: '#4e33ffff',
            backgroundColor: '#334eff44',
            borderWidth: 3,
            fill: true,
            tension: 0.3,
          },
          {
            label: 'User Registered',
            data: userCounts,
            borderColor: '#cc0000',
            backgroundColor: '#cc000044',
            borderWidth: 3,
            fill: true,
            tension: 0.3,
          },
        ],
      },
      options: {
        plugins: {
          legend: { display: true },
          title: {
            display: true,
            text: 'Growth in Last 7 Days',
            color: '#000',
            font: { size: 22, weight: 'bold' },
          },
        },
        scales: {
          x: {
            ticks: { color: '#000' },
          },
          y: {
            beginAtZero: true,
            ticks: { color: '#000' },
          },
        },
      },
    })

    return buffer.toString('base64')
  }

  async login(ctx: HttpContext) {
    return ctx.inertia.render('auth/login')
  }
  async register(ctx: HttpContext) {
    return ctx.inertia.render('auth/register')
  }

  async facility(ctx: HttpContext) {
    // const page = await ctx.request.input('page', 1)
    // const data = await FacilityService.listFacilities(page)

    const facilities = await Facility.query()

    return ctx.inertia.render('facility', { facilities, user: ctx.auth.user })
  }

  async bookingQR(ctx: HttpContext) {
    const id = ctx.params.id

    const data = await booking_service.getBooking(id)

    if (!['Confirmed', 'Picked Up'].includes(data.status))
      return ctx.inertia.render('errors/not_found')

    if (ctx.auth.user!.role !== 'admin') {
      if (ctx.auth.user!.id !== data.idUser)
        return ctx.inertia.render('errors/forbidden', { redirectUrl: '/user/dashboard' })
    }

    return ctx.inertia.render('qrcode', {
      idBooking: data.id,
      status: data.status,
    })
  }

  async qrReader({ inertia, auth }: HttpContext) {
    return inertia.render('qrcodeReader', { user: auth.user })
  }

  async map({ inertia, auth }: HttpContext) {
    const rooms = await Room.all()

    const mapData = await Promise.all(
      rooms.map(async (room) => {
        const activeBookings = await Booking.query()
          .where('id_room', room.id)
          .where('status', 'Picked Up')
          .preload('fasilitas')
          .preload('user')

        return {
          id: room.id,
          room_name: room.roomName,
          longitude: Number(room.longitude),
          latitude: Number(room.latitude),
          borrowed_facilities_count: activeBookings.length,
          active_bookings: activeBookings,
        }
      })
    )
    return inertia.render('map', { user: auth.user, mapData })
  }

  async dashboard({ inertia, auth }: HttpContext) {
    const grafik = await this.generateLast7DaysGrowthChart()
    const facilities = await Facility.query()
    const totalFacilities = facilities.length
    const availableFacilities = facilities.filter((i: any) => i.status === 'Available').length
    const bookedFacilities = facilities.filter((i: any) =>
      ['Booked', 'Borrowed', 'Under Inspection'].includes(i.status)
    ).length
    const maintenanceFacilities = facilities.filter((i: any) =>
      ['Maintenance', 'Damaged'].includes(i.status)
    ).length

    return inertia.render('dashboard', {
      grafik,
      stats: {
        totalFacilities,
        availableFacilities,
        bookedFacilities,
        maintenanceFacilities,
      },
      user: auth.user,
    })
  }

  async booking({ inertia, auth }: HttpContext) {
    const bookingsData = await Booking.query()
      .preload('approver')
      .preload('fasilitas')
      .preload('rooms')
      .preload('user')
    return inertia.render('booking', {
      bookingsData,
      user: auth.user,
    })
  }

  async bookingForm(ctx: HttpContext) {
    const facility = await Facility.findOrFail(ctx.params.facilityId)
    const rooms = await Room.query()
    if (facility.status !== 'Available') return ctx.inertia.render('errors/not_found')

    return ctx.inertia.render('bookingForm', { rooms, facility })
  }

  async bookingEdit(ctx: HttpContext) {
    const rooms = await Room.query()
    const booking = await Booking.findOrFail(ctx.params.bookingId)
    const facility = await Facility.findOrFail(booking.id)

    return ctx.inertia.render('bookingEdit', {
      facility,
      rooms,
      booking,
    })
  }

  async facilityForm(ctx: HttpContext) {
    return ctx.inertia.render('facilityCreate', { user: ctx.auth.user })
  }

  async facilityEdit(ctx: HttpContext) {
    const facility = await Facility.findOrFail(ctx.params.facilityId)

    return ctx.inertia.render('facilityEdit', { user: ctx.auth.user, facility })
  }

  async userFacilities(ctx: HttpContext) {
    const facilities = await Facility.query()

    return ctx.inertia.render('userFacility', { facilities, user: ctx.auth.user })
  }
  async userDashboard(ctx: HttpContext) {
    const userId = ctx.auth.user!.id
    const bookings = await Booking.query()
      .preload('user')
      .preload('fasilitas')
      .where('idUser', userId)
    const facilities = await Facility.query()

    return ctx.inertia.render('userDashboard', {
      bookings: bookings,
      facilities,
      user: ctx.auth.user,
    })
  }

  async userHistory(ctx: HttpContext) {
    const facilities = await Facility.query()
    const userId = ctx.auth.user!.id

    const bookings = await Booking.query()
      .preload('user')
      .preload('fasilitas')
      .where('idUser', userId)

    return ctx.inertia.render('bookingHistory', { bookings, facilities, user: ctx.auth.user })
  }

  async detailBooking(ctx: HttpContext) {
    const booking = await Booking.findOrFail(ctx.params.id)

    await booking.load('fasilitas')
    await booking.load('rooms')
    await booking.load('user')
    await booking.load('approver')

    if (ctx.auth.user!.role !== 'admin') {
      if (ctx.auth.user!.id !== booking.idUser)
        return ctx.inertia.render('errors/forbidden', { redirectUrl: '/user/dashboard' })
    }

    return ctx.inertia.render('detailBooking', { booking, user: ctx.auth.user })
  }
}
