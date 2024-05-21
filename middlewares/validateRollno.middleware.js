function validateReqParaRollnumber(req, res, next) {
  const paramRollno = req.params.rollNo;
  const rollNoInteger = parseInt(paramRollno, 10);
  if (isNaN(rollNoInteger)) {
    return res.status(400).json({ message: "Invalid roll number" });
  }
  next();
}

module.exports = { validateReqParaRollnumber };
