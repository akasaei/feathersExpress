import { healthCheck } from './health.js'

export class HealthService {
  constructor(app) {
    this.app = app
  }

  async find() {
    // call healthCheck function
    const health = await healthCheck(this.app)

    return health
  }
}
