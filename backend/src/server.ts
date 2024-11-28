import express, { Request, Response } from "express";
import cors from "cors";

import driverRoutes from "./routes/driver.routes";
import mapRoutes from "./routes/map.routes";
import userRoutes from "./routes/user.routes";
import rideRoutes from "./routes/ride.routes";

const app = express();
const port = 8080;
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req: Request, res: Response) => {
  res.send("Hello, World!");
});

app.use("/drivers", driverRoutes);
app.use("/map-static", mapRoutes);
app.use("/users", userRoutes);
app.use("/ride", rideRoutes);

if (process.env.NODE_ENV !== "test") {
  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
}

export default app;
