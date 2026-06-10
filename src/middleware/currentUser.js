const { HttpError } = require('../utils/httpError');
const { parsePositiveInt } = require('../utils/validators');

function requireCurrentUser(req, res, next) {
  const userId = parsePositiveInt(req.get('X-User-Id'));

  if (!userId) {
    next(new HttpError(401, 'X-User-Id header is required'));
    return;
  }

  req.currentUserId = userId;
  next();
}

module.exports = { requireCurrentUser };
