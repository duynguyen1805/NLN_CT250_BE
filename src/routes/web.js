import express from "express";
import homeController from "../controller/homeController";
import userController from "../controller/userController";
import doctorController from "../controller/doctorController";
import specialtyController from "../controller/specialtyController";
import patientController from "../controller/patientController";

var appRoot = require("app-root-path");
let router = express.Router();

const initWebRoutes = (app) => {
  //method: post, get, put, delete
  router.get("/", homeController.getHomepage);
  router.get("/crud", homeController.getCrudpage);
  router.post("/post-crud", homeController.postCRUD);
  router.get("/get-crud", homeController.displayGetCRUD);
  router.get("/edit-crud", homeController.getEditCRUD);
  router.post("/put-crud", homeController.putCRUD);
  router.get("/delete-crud", homeController.deleteCRUD);

  //restAPI
  router.post("/api/login", userController.handleLogin);
  router.get("/api/get-all-users", userController.handleGetAllUsers);
  router.post("/api/create-new-user", userController.handleCreateNewUser);
  router.put("/api/edit-user", userController.handleEditUser);
  router.delete("/api/delete-user", userController.handleDeleteUser);
  router.delete("/api/delete-schedule", doctorController.handleDeleteSchedule);
  router.delete(
    "/api/delete-all-schedule",
    doctorController.handleDeleteAllSchedule
  );
  router.delete("/api/delete-patient", doctorController.handleDeletePatient);

  router.get("/api/allcode", userController.getAllCode);

  //homepage
  router.get("/api/top-doctor-homepage", doctorController.getTopDoctor);

  router.get("/api/get-all-doctors", doctorController.getAllDoctors);
  router.get(
    "/api/get-all-doctors-for-Homepage",
    doctorController.getAllDoctorsforHomePage
  );

  router.post("/api/save-infor-doctors", doctorController.postInforDoctors);
  router.get(
    "/api/get-detail-doctor-by-id",
    doctorController.getDetailDoctorById
  );

  router.post("/api/bulk-create-schedule", doctorController.bulkCreateSchedule);

  router.get(
    "/api/get-list-patient-for-doctor",
    doctorController.getListPatientForDoctor
  );

  router.get(
    "/api/get-schedule-doctor-by-date",
    doctorController.getScheduleByDate
  );
  router.get(
    "/api/get-more-infor-doctor-by-id",
    doctorController.getMoreInforDoctorById
  );
  router.get(
    "/api/get-profile-doctor-by-id",
    doctorController.getProfileDoctorById
  );

  router.post("/api/create-new-specialty", specialtyController.createSpecialty);
  router.get("/api/get-all-specialty", specialtyController.getAllSpecialty);
  router.get(
    "/api/get-detail-specialty-by-id",
    specialtyController.getDetailSpecialtyById
  );

  router.post(
    "/api/patient-book-appointment",
    patientController.postBookAppointment
  );
  router.post(
    "/api/verify-book-appointment",
    patientController.postVerifyBookAppointment
  );

  router.post("/api/confirm-arrived", doctorController.confirmArrived);

  router.get("/api/get-all-schedule", doctorController.getAllSchedule);

  return app.use("/", router);
};

module.exports = initWebRoutes;
