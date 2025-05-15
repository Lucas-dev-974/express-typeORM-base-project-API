class DefaultController {
  // Define a sample GET route
  getDefault(req: any, res: any) {
    res.send("Hello, this is the default route!");
  }

  // Define a sample POST route
  postExample(req: any, res: any) {
    const data = req.body;
    res.status(201).send({ message: "Data received", data });
  }
}

export const defaultController = new DefaultController();
