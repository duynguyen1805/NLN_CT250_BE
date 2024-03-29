import db from "../models/index";
require("dotenv").config();
import emailService from "./emailService";
import { v4 as uuidv4 } from "uuid";

let postBookAppointment = (data) => {
  return new Promise(async (resovle, reject) => {
    try {
      if (
        !data.email ||
        !data.doctorId ||
        !data.timeType ||
        !data.date ||
        !data.fullname ||
        !data.selectedGender ||
        !data.address
      ) {
        resovle({
          errCode: 1,
          errMessage: "Missing parameter",
        });
      } else {
        let token = uuidv4();
        await emailService.sendEmail({
          receiverEmail: data.email,
          patientname: data.fullname,
          time: data.timeString,
          doctorname: data.doctorname,
          language: data.language,
          redirectLink: buildUrlEmail(data.doctorId, token),
        });

        //upsert patient
        let user = await db.User.findOrCreate({
          where: { email: data.email },
          defaults: {
            email: data.email,
            roleId: "R3",
            gender: data.selectedGender,
            // address: data.address,
            // firstName: data.fullname,
          },
        });

        if (user && user[0]) {
          let exist = await db.Booking.findAll({
            where: { patientId: user[0].id },
          });
          if (exist) {
            await db.Booking.create({
              statusId: "S1",
              doctorId: data.doctorId,
              patientId: user[0].id,
              date: data.date,
              timeType: data.timeType,
              token: token,
              fullname: data.fullname,
              phonenumber: data.phonenumber,
              address: data.address,
              gender: data.selectedGender,
              reason: data.reason,
            });
          } else {
            await db.Booking.create({
              statusId: "S1",
              doctorId: data.doctorId,
              patientId: user[0].id,
              date: data.date,
              timeType: data.timeType,
              token: token,
              fullname: data.fullname,
              phonenumber: data.phonenumber,
              address: data.address,
              gender: data.selectedGender,
              reason: data.reason,
            });
          }
        }

        // savedata table booking ver-1.0
        // console.log("check user: ", user[0]);
        //create a booking record
        // if (user && user[0]) {
        //   await db.Booking.findOrCreate({
        //     where: { patientId: user[0].id },
        //     defaults: {
        //       statusId: "S1",
        //       doctorId: data.doctorId,
        //       patientId: user[0].id,
        //       date: data.date,
        //       timeType: data.timeType,
        //       token: token,
        //     },
        //   });
        // }
        let incCurrentNumber = await db.Schedule.findOne({
          where: {
            doctorId: data.doctorId,
            timeType: data.timeType,
            date: data.date,
          },
          raw: false,
        });
        if (incCurrentNumber) {
          incCurrentNumber.currentNumber++;
          await incCurrentNumber.save();
        }

        resovle({
          errCode: 0,
          errMessage: "Save infor patient succeed !",
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

let buildUrlEmail = (doctorId, token) => {
  let result = `${process.env.URL_REACT}/verify-booking?token=${token}&doctorId=${doctorId}`;
  return result;
};

let postVerifyBookAppointment = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.token || !data.doctorId) {
        resolve({
          errCode: 1,
          errMessage: "Missing parameter",
        });
      } else {
        let appointment = await db.Booking.findOne({
          where: {
            doctorId: data.doctorId,
            token: data.token,
            statusId: "S1",
          },
          raw: false,
        });

        if (appointment) {
          appointment.statusId = "S2";
          await appointment.save();

          resolve({
            errCode: 0,
            errMessage: "Update the appointment succeed !",
          });
        } else {
          resolve({
            errCode: 2,
            errMessage: "Appointment has been activated or does not exist",
          });
        }
      }
    } catch (e) {
      reject(e);
    }
  });
};

module.exports = {
  postBookAppointment: postBookAppointment,
  postVerifyBookAppointment: postVerifyBookAppointment,
};
