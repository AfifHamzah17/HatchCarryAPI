import Joi from 'joi';

export function validateReport(data) {
  const schema = Joi.object({
    kebun: Joi.string().required(),
    afdeling: Joi.string().required(),
    blok: Joi.string().required(),
    koordinatX: Joi.number().required(),
    koordinatY: Joi.number().required(),
    nomorPP: Joi.number().required(),
    estimasiSerangga: Joi.number().required(),
    tanggal: Joi.date().required(),
    waktu: Joi.string().required(),
    kondisiCuaca: Joi.string().required(),
    rbt: Joi.number().required(),
    imageUrl: Joi.string().uri().optional()
  });

  return schema.validate(data);
}
