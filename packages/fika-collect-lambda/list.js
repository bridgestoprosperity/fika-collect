import listSurveys from "./dist/handlers/listSurveys.js";

listSurveys({
  body: null,
})
  .then((response) => {
    console.log("Response:", response);
  })
  .catch((error) => {
    console.error("Error:", error);
  })
  .finally(() => {
    console.log("Finished processing list surveys");
  });
