import { MongoClient, Collection } from 'mongodb'

export const MongoHelper = {
  client: null as unknown as MongoClient,

  async connect (url: string): Promise<void> {
    this.client = await MongoClient.connect(url)
  },

  async disconnect (): Promise<void> {
    await this.client.close()
  },

  getCollection (name: string): Collection {
    return this.client.db().collection(name)
  },

  map (collection: any, data: any): any {
    const collectionId = collection.insertedId
    const dataWithoutId = data
    return Object.assign({}, dataWithoutId, { id: collectionId.toString() })
  }
}
