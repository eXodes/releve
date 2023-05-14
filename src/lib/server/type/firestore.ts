import type { firestore } from "firebase-admin";

export type FirestoreCollectionRef<Entity> = firestore.CollectionReference<Entity>;

export type FirestoreRef<Entity> = firestore.DocumentReference<Entity>;

export type FirestoreData = firestore.DocumentData;

export type FirestoreValue<Entity> = firestore.WithFieldValue<Entity>;

export type FirestorePartialValue<Entity> = firestore.PartialWithFieldValue<Entity>;

export type FirestoreQuery<Entity> = firestore.Query<Entity>;

export type FirestoreConverter<Data> = firestore.FirestoreDataConverter<Data>;

export type FirestoreQueryDocSnapshot<Entity> = firestore.QueryDocumentSnapshot<Entity>;

export type FirestoreWriteResult = firestore.WriteResult;
