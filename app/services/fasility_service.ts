import Facility from '#models/facility'

class FacilityService {
  async listFacilities(page?: number) {
    if (page) {
      return Facility.query()
    }
    return Facility.query().orderBy('name', 'asc')
  }

  async getFacility(facilityId: number) {
    const facility = await Facility.find(facilityId)
    if (!facility) throw new Error('Facility not found')
    return facility
  }

  async createFacility(data: Partial<Facility>) {
    const facility = await Facility.create({
      ...data,
      status: 'Available',
    })
    return facility
  }

  async updateFacility(facilityId: number, updateData: Partial<Facility>) {
    const facility = await Facility.find(facilityId)
    if (!facility) throw new Error('Facility not found')

    facility.merge(updateData)

    if (updateData.status) {
      const validStatuses = ['Available', 'Borrowed', 'Under Inspection', 'Maintenance', 'Damaged']
      if (!validStatuses.includes(updateData.status)) {
        throw new Error('Invalid facility status')
      }
    }

    await facility.save()
    return facility
  }

  public async deleteFacility(facilityId: number) {
    const facility = await Facility.find(facilityId)
    if (!facility) throw new Error('Facility not found')

    await facility.delete()
    return facility
  }

  public async markAsBorrowed(facilityId: number) {
    const facility = await this.getFacility(facilityId)
    facility.status = 'Borrowed'
    await facility.save()
    return facility
  }

  public async markAsUnderInspection(facilityId: number) {
    const facility = await this.getFacility(facilityId)
    facility.status = 'Under Inspection'
    await facility.save()
    return facility
  }

  public async resetToAvailable(facilityId: number) {
    const facility = await this.getFacility(facilityId)
    facility.status = 'Available'
    await facility.save()
    return facility
  }

  public async markAsDamaged(facilityId: number) {
    const facility = await this.getFacility(facilityId)
    facility.status = 'Damaged'
    await facility.save()
    return facility
  }
}

export default new FacilityService()
