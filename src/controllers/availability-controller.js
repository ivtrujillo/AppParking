const availabilityModel = require("../models/availability-model");
const dateFormat = require("dateformat");


/**
 * @param {*} req
 * @param {*} res
 * @description registro de entradas de los automoviles
 */

const entry = async (req, res) => {
  try {
    const availability = new availabilityModel();
    const { placa } = req.body;
    availability.plate = placa;
    availability.state = "Entrada";
    await availability.save();
    const param = { status: "OK", message: "Saved" };
    res.render("parking", { param });
  } catch (error) {
    if (error.code && error.code === 11000) {
      res
        .status(400)
        .send({ status: "DUPLICATED_VALUES", message: error.keyValue });
      return;
    }
    res.status(500).send({ status: "ERROR", message: error.message });
  }
};

/**
 * @param {*} req 
 * @param {*} res 
 * @description buscar placa mandar a guardar o retornar los datos de salida
 */

const searchPlate = async (req, res) => {
  try {
    const existPlate = await availabilityModel.findOne({
      plate: req.body.placa,
    });
    if (existPlate != null) {
      const response = exit(existPlate);

      console.log(response);

      res.render("parking", { response });
      const inDate = existPlate.input_date;
      const outputDate = new Date();
      const mils = outputDate - inDate;
      const hours = Math.round(mils / 3600000);
      const payValue = hours * process.env.PRICE_HOUR
      res.send({
        status: "OK",
        message: "Exist",
        description: {
          fecha_entrada: inDate,
          fecha_salida: outputDate,
          total_horas: hours,
          valor: payValue,
        },
      });
    } else {
      entry(req, res);
    }
  } catch (error) {
    if (error.code && error.code === 11000) {
      res
        .status(400)
        .send({ status: "DUPLICATED_VALUES", message: error.keyValue });
      return;
    }
    res.status(500).send({ status: "ERROR", message: error.message });
  }
};

/**
 * @param {*} req
 * @param {*} res
 * @returns fechas y cobro al cliente
 */

const exit = (plate) => {
  const inDate = plate.input_date;
  const outputDate = new Date();
  const mils = outputDate - inDate;
  const hours = Math.round(mils / 3600000);
  var payValue;
  if (hours == 0) {
    payValue = 1 * process.env.PRICE_HOUR;
  } else if (hours > 0) {
    payValue = hours * process.env.PRICE_HOUR;
  }

  return (param = {
    fecha_entrada: dateFormat(inDate, "yyyy-mm-dd h:MM:ss"),
    fecha_salida: dateFormat(outputDate, "yyyy-mm-dd h:MM:ss"),
    total_horas: hours,
    valor: payValue,
  });
};

const list = async (req, res) => {
  const availability = new availabilityModel();
  const lista =  await availabilityModel.find();

  res.render('list', { lista });
};

module.exports = {
  searchPlate,
  list
};
