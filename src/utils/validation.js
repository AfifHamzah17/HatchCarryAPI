import Joi from 'joi';

export const validateReport = (report) => {
  const schema = Joi.object({
    kebun: Joi.string().required(),
    afdeling: Joi.string().required(),
    blok: Joi.string().required(),
    koordinatX: Joi.number().precision(3).required(),
    koordinatY: Joi.number().precision(3).required(),
    nomorPP: Joi.number().required(),
    estimasiSerangga: Joi.number().required(),
    tanggal: Joi.date().required(),
    waktu: Joi.date().required(),
    kondisiCuaca: Joi.string().required(),
    rbt: Joi.number().precision(2).required()
  });

  return schema.validate(report);
};

// Export existing validation functions if any
export const validateUser = (user) => {
  const schema = Joi.object({
    name: Joi.string().min(3).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required()
  });

  return schema.validate(user);
};

export const validateLogin = (credentials) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  });

  return schema.validate(credentials);
};

export function validateEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

export function validatePassword(password) {
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
  return regex.test(password);
}
