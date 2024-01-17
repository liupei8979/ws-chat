import { RoomDocument } from '../../common/document/document.chatroom'
import { UserDocument } from '../../common/document/document.user'

export const FirestoreDatabaseProvider = 'firestoredb'
export const FirestoreOptionsProvider = 'firestoreOptions'
export const FirestoreCollectionProviders: string[] = [
  UserDocument.collectionName,
  RoomDocument.collectionName,
]
