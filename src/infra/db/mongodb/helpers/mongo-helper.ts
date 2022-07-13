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

  async getCollection (name: string): Promise<Collection> {
    if (!this.client || !this.isConnected) {
      await this.connect(this.uri)
    }
    return this.client!.db().collection(name)
  },

  map (collection: any, data: any): any {
    const collectionId = collection.insertedId
    const dataWithoutId = data
    return Object.assign({}, dataWithoutId, { id: collectionId.toString() })
  }
}
