import { MongoClient, Collection } from 'mongodb'

export const MongoHelper = {
  client: null as unknown as MongoClient | null,
  uri: null as unknown as string,
  isConnected: null as unknown as boolean,

  async connect (uri: string): Promise<void> {
    this.uri = uri
    this.client = await MongoClient.connect(uri)
    this.isConnected = true
  },

  async disconnect (): Promise<void> {
    await this.client!.close()
    this.client = null
    this.isConnected = false
  },

  getCollection (name: string): Collection {
    return this.client!.db().collection(name)
  },

  map (data: any): any {
    const { _id, ...rest } = data
    return Object.assign({}, rest, { id: _id.toString() })
  },

  mapCollection (collection: any[]): any[] {
    return collection.map(c => MongoHelper.map(c))
  }
}
