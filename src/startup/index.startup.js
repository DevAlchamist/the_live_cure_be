const { PORT } = process.env;

module.exports = async (app) => {
  await require("./db.startup")(app); // initiate db connection
  require("./routes.startup")(app); // initiate routes
  require("./error.startup")(app); // initiate error handlers

  //Starting Server
  app.listen(PORT || 53321, () => {
    console.log("🚀 Server is Running on PORT =>", PORT || 53321);
  });
};
