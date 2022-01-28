import { ExpressRequest, ExpressResponse } from "@/types/express";

export const getAircrafts = (req: ExpressRequest, res: ExpressResponse) => {
  const { firestoreDb } = res.locals;
  firestoreDb
    .collection("pilots")
    .get()
    .then((snapshot) => {
      console.log(snapshot.docs.map((d) => d.data()));
      res.json({ success: true, route: "GET pilots/" });
    });
};
