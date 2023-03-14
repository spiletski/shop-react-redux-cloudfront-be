import Schema from 'validate';

const productSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  price: {
    type: Number,
    required: true,
  },
  count: {
    type: Number,
    required: true,
  },
});

export const validateData = (product) => {
  const errors = productSchema.validate(product);
  return errors.length ? errors : null;
};
