
import request from 'supertest'
import app from '../../index'
import userRouter from './users'

describe('User routes', () => {
  describe('GET /', () => {
    it('should respond with status code 200', async () => {
      const res = await request(app.use(userRouter)).get('/')
      expect(res.statusCode).toBe(200)
    })
  })
})
