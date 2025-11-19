import Facility from '#models/facility'

export default class FacilityService {
  /**
   * List all facilities, optional pagination
   */
  public async listFacilities(page?: number) {
    if (page) {
      return Facility.query().paginate(page)
    }
    return Facility.query().orderBy('name', 'asc')
  }

  /**
   * Get single facility by ID
   */
  public async getFacility(facilityId: number) {
    const facility = await Facility.find(facilityId)
    if (!facility) throw new Error('Facility not found')
    return facility
  }

  /**
   * Create a new facility
   */
  public async createFacility(data: Partial<Facility>) {
    const facility = await Facility.create({
      ...data,
      status: 'Available', // default status
    })
    return facility
  }

  /**
   * Update facility info and optionally status
   */
  public async updateFacility(facilityId: number, updateData: Partial<Facility>) {
    const facility = await Facility.find(facilityId)
    if (!facility) throw new Error('Facility not found')

    facility.merge(updateData)

    // Optional: validate status
    if (updateData.status) {
      const validStatuses = ['Available', 'Borrowed', 'Under Inspection', 'Maintenance', 'Damaged']
      if (!validStatuses.includes(updateData.status)) {
        throw new Error('Invalid facility status')
      }
    }

    await facility.save()
    return facility
  }

  /**
   * Delete a facility
   */
  public async deleteFacility(facilityId: number) {
    const facility = await Facility.find(facilityId)
    if (!facility) throw new Error('Facility not found')

    await facility.delete()
    return facility
  }

  /**
   * Mark facility as borrowed (used by BookingService)
   */
  public async markAsBorrowed(facilityId: number) {
    const facility = await this.getFacility(facilityId)
    facility.status = 'Borrowed'
    await facility.save()
    return facility
  }

  /**
   * Mark facility as under inspection (used when returned)
   */
  public async markAsUnderInspection(facilityId: number) {
    const facility = await this.getFacility(facilityId)
    facility.status = 'Under Inspection'
    await facility.save()
    return facility
  }

  /**
   * Reset facility to available (after Done or Cancelled)
   */
  public async resetToAvailable(facilityId: number) {
    const facility = await this.getFacility(facilityId)
    facility.status = 'Available'
    await facility.save()
    return facility
  }

  /**
   * Mark facility as damaged (Penalized)
   */
  public async markAsDamaged(facilityId: number) {
    const facility = await this.getFacility(facilityId)
    facility.status = 'Damaged'
    await facility.save()
    return facility
  }
}
