import { PrismaClient } from '@prisma/client'
import { describe, it, expect, beforeAll } from 'vitest'

import supertest from 'supertest'
import { app } from '@infra/http/app'

import { InvalidRangeDateParamsError } from '@infra/http/errors/invalid-range-date-params'

import { truncateDatabase } from '@tests/db/truncate'

import { userSeed } from '@tests/db/seeds/user.seed'
import { eventSeed } from '@tests/db/seeds/event.seed'

describe('List events by date route', () => {
  const prisma = new PrismaClient()
  const [firstEvent, secondEvent, thirdEvent] = eventSeed

  beforeAll(async () => {
    await truncateDatabase(prisma)
    await prisma.user.create({ data: userSeed[0] })
    await prisma.event.createMany({ data: eventSeed })
  })

  it('should return error if date params is invalid', async () => {
    const { status, body } = await supertest(app)
      .get('/events/search/date')

    expect(status).toBe(400)
    expect(body).toEqual(
      expect.objectContaining({
        error: InvalidRangeDateParamsError.name
      })
    )
  })

  it('should filter events with inclusive date', async () => {
    const firstEndDate = new Date()
    firstEndDate.setDate(firstEndDate.getDate() - 1)

    const { body: firstEventList } = await supertest(app)
      .get(`/events/search/date?endDate=${firstEndDate.toISOString()}`)

    expect(firstEventList.length).toBe(1)
    expect(firstEventList).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: firstEvent.id, completed: true })
      ])
    )

    const secondEndDate = new Date()
    secondEndDate.setDate(secondEndDate.getDate() + 1)

    const { body: secondEventList } = await supertest(app)
      .get(`/events/search/date?endDate=${secondEndDate.toISOString()}`)

    expect(secondEventList.length).toBe(1)
    expect(secondEventList).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: secondEvent.id })
      ])
    )

    const thirdStartDate = new Date()
    const thirdEndDate = new Date()
    thirdStartDate.setDate(thirdEndDate.getDate() + 2)
    thirdEndDate.setDate(thirdEndDate.getDate() + 7)

    const { body: thirdEventList } = await supertest(app)
      .get(`/events/search/date?startDate=${thirdStartDate.toISOString()}&endDate=${thirdEndDate.toISOString()}`)

    expect(thirdEventList.length).toBe(1)
    expect(thirdEventList).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: thirdEvent.id })
      ])
    )

    const fourthStartDate = new Date()
    const fourthEndDate = new Date()
    fourthStartDate.setDate(fourthEndDate.getDate() - 1)
    fourthEndDate.setDate(fourthEndDate.getDate() + 7)

    const { body: fourthEventList } = await supertest(app)
      .get(`/events/search/date?startDate=${fourthStartDate.toISOString()}&endDate=${fourthEndDate.toISOString()}`)

    expect(fourthEventList.length).toBe(3)
    expect(fourthEventList).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: firstEvent.id, completed: true }),
        expect.objectContaining({ id: secondEvent.id }),
        expect.objectContaining({ id: thirdEvent.id })
      ])
    )
  })
})
