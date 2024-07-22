import express from 'express';
const router = express.Router();

router.get('/', (req, res) => {
  res.json({ message: "Test Route is working!" });
});

export default router;
